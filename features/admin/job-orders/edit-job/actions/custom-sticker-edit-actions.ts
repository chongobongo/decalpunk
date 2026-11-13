// custom-sticker-edit-actions.ts
// features\admin\job-orders\new-order\custom-sticker\actions\custom-sticker-edit-actions.ts

"use server"
import { z } from "zod"
import { UTApi } from "uploadthing/server"

import { getCurrentUser } from "@/services/clerk"
import type { ImageMetadata } from "@/lib/getImageMetadata"
import { customStickerEditSchema } from "@/features/admin/job-orders/edit-job/schema/customStickerSchemaEdit"
import { updateCustomStickerItem } from "@/features/admin/job-orders/edit-job/db/custom-sticker-item-update-db"
import { updateJobOrderListCache } from "@/features/admin/job-orders/orders-list/db/cache/job-order-list-cache"

const utapi = new UTApi()

export type UpdateItemResult = {
    error: boolean
    message: string
    fieldErrors?: Record<string, string[] | undefined>
    redirectUrl?: string
}

// UploadThing file keys are the last path segment of the file URL
function uploadThingKey(value: string) {
    try {
        const url = new URL(value)
        if (!(url.hostname.endsWith(".ufs.sh") || url.hostname === "utfs.io")) return null
        return url.pathname.split("/").filter(Boolean).pop() ?? null
    } catch {
        return null
    }
}

export async function updateCustomStickerItemAction(
    stickerId: string,
    formData: FormData
): Promise<UpdateItemResult> {
    const user = await getCurrentUser()

    if (user.userId == null) {
        return { error: true, message: "You must be logged in to edit an item." }
    }
    // Server actions are public endpoints, so check the role here, not just in the UI.
    if (user.role !== "admin") {
        return { error: true, message: "You do not have permission to edit items." }
    }
    if (!z.string().uuid().safeParse(stickerId).success) {
        return { error: true, message: "Invalid item." }
    }

    // Rebuild a plain object and re-validate server-side. Never trust client validation alone.
    const parsed = customStickerEditSchema.safeParse({
        image: formData.get("image"),
        shape: formData.get("shape"),
        material: formData.get("material"),
        finish: formData.get("finish"),
        size: formData.get("size"),
        quantity: formData.get("quantity"),
    })
    if (!parsed.success) {
        console.error("edit validation error:", parsed.error.flatten())
        return {
            error: true,
            message: "Please fix the highlighted fields.",
            fieldErrors: parsed.error.flatten().fieldErrors,
        }
    }
    const { image, ...fields } = parsed.data

    // 1. Upload the replacement artwork first (if there is one)
    let newImg: string | undefined
    let newKey: string | undefined
    let imageMetadata: ImageMetadata | null = null

    if (image) {
        const rawMeta = formData.get("imageMetadata")
        if (typeof rawMeta === "string") {
            try {
                imageMetadata = JSON.parse(rawMeta) as ImageMetadata
            } catch {
                console.error("invalid imageMetadata JSON")
            }
        }

        const upload = await utapi.uploadFiles(image)
        if (upload.error) {
            console.error("upload error:", upload.error)
            return { error: true, message: "There was an error uploading the new artwork." }
        }
        newImg = upload.data.ufsUrl
        newKey = upload.data.key
    }

    // 2. Save to the database. If this fails, remove the file we just uploaded.
    let result
    try {
        result = await updateCustomStickerItem(stickerId, {
            ...fields,
            img: newImg,
            image_metadata: newImg ? imageMetadata : undefined,
        })
    } catch (e: any) {
        console.error("edit item error:", e?.message, e?.cause?.code, e?.cause?.detail)
        if (newKey) await utapi.deleteFiles(newKey).catch(() => {})
        return { error: true, message: "There was an error saving your changes." }
    }

    if (!result) {
        if (newKey) await utapi.deleteFiles(newKey).catch(() => {})
        return { error: true, message: "That item no longer exists." }
    }

    // 3. Only after the database is updated, delete the old artwork (if nothing else uses it)
    if (result.previousImgUnused) {
        const oldKey = uploadThingKey(result.previousImgUnused)
        if (oldKey) {
            await utapi
                .deleteFiles(oldKey)
                .catch((e) => console.error("could not delete old artwork:", e?.message))
        }
    }

    if (result.listId) updateJobOrderListCache(result.listId)

    return {
        error: false,
        message: "Item updated.",
        redirectUrl: result.listId ? `/admin/job-orders/job-edit/${result.listId}` : "/admin/job-orders",
    }
}