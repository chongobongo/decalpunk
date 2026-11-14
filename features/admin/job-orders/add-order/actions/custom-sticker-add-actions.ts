// custom-sticker-add-actions.ts
// features\admin\job-orders\edit-job\actions\custom-sticker-add-actions.ts

"use server"
import { z } from "zod"
import { UTApi } from "uploadthing/server"

import { getCurrentUser } from "@/services/clerk"
import type { ImageMetadata } from "@/lib/getImageMetadata"
import { customStickerAddSchema } from "@/features/admin/job-orders/add-order/schema/customStickerSchemaAdd"
import {
    STICKER_OPTIONS,
    type StickerOptionField,
} from "@/features/admin/job-orders/add-order/options/customStickerOptions"
import { addCustomStickerItem } from "@/features/admin/job-orders/add-order/db/custom-sticker-item-add-db"
import { updateJobOrderListCache } from "@/features/admin/job-orders/orders-list/db/cache/job-order-list-cache"

const utapi = new UTApi()

const OPTION_FIELDS: StickerOptionField[] = ["shape", "material", "finish", "size", "quantity"]

export type AddItemResult = {
    error: boolean
    message: string
    fieldErrors?: Record<string, string[] | undefined>
    redirectUrl?: string
}

export async function addCustomStickerItemAction(
    jobOrderId: string,
    formData: FormData
): Promise<AddItemResult> {
    const user = await getCurrentUser()

    if (user.userId == null) {
        return { error: true, message: "You must be logged in to add an item." }
    }
    // Server actions are public endpoints, so check the role here, not just in the UI.
    if (user.role !== "admin") {
        return { error: true, message: "You do not have permission to add items." }
    }
    if (!z.string().uuid().safeParse(jobOrderId).success) {
        return { error: true, message: "Invalid job." }
    }

    // Rebuild a plain object and re-validate server-side. Never trust client validation alone.
    const parsed = customStickerAddSchema.safeParse({
        image: formData.get("image"),
        shape: formData.get("shape"),
        material: formData.get("material"),
        finish: formData.get("finish"),
        size: formData.get("size"),
        quantity: formData.get("quantity"),
    })
    if (!parsed.success) {
        console.error("add validation error:", parsed.error.flatten())
        return {
            error: true,
            message: "Please fix the highlighted fields.",
            fieldErrors: parsed.error.flatten().fieldErrors,
        }
    }
    const { image, ...fields } = parsed.data

    // Values must be one of the configured options. A list that is still empty is skipped.
    const fieldErrors: Record<string, string[]> = {}
    for (const field of OPTION_FIELDS) {
        const list = STICKER_OPTIONS[field]
        if (list.length > 0 && !list.some((option) => option.value === fields[field])) {
            fieldErrors[field] = ["Please choose one of the listed options"]
        }
    }
    if (Object.keys(fieldErrors).length > 0) {
        return { error: true, message: "Please fix the highlighted fields.", fieldErrors }
    }

    // 1. Upload the artwork
    let imageMetadata: ImageMetadata | null = null
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
        return { error: true, message: "There was an error uploading the artwork." }
    }

    // 2. Save. If this fails, remove the file we just uploaded.
    let result
    try {
        result = await addCustomStickerItem(jobOrderId, {
            ...fields,
            img: upload.data.ufsUrl,
            image_metadata: imageMetadata,
        })
    } catch (e: any) {
        console.error("add item error:", e?.message, e?.cause?.code, e?.cause?.detail)
        await utapi.deleteFiles(upload.data.key).catch(() => {})
        return { error: true, message: "There was an error adding the item." }
    }

    if (!result) {
        await utapi.deleteFiles(upload.data.key).catch(() => {})
        return { error: true, message: "That job no longer exists." }
    }

    if (result.listId) updateJobOrderListCache(result.listId)

    return {
        error: false,
        message: "Item added.",
        redirectUrl: result.listId ? `/admin/job-orders/job-edit/${result.listId}` : "/admin/job-orders",
    }
}