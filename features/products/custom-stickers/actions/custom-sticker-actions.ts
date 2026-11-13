// custom-sticker-actions.ts
// features\products\custom-stickers\actions\custom-sticker-actions.ts

"use server"
import { z } from "zod"
import { UTApi } from "uploadthing/server"
import { customStickerSchema } from "../schema/customStickerSchema"
import { getCurrentUser } from "@/services/clerk"
import { canCreateOrder } from "@/app/permissions/general"

import type { ImageMetadata } from "@/lib/getImageMetadata"
import { insertCustomStickerOrder } from "../db/custom-sticker-db"

const cartItemSchema = z.object({
    product: z.string().min(1),
    shape: z.string().min(1),
    material: z.string().min(1),
    finish: z.string().min(1),
    size: z.string().min(1),
    quantity: z.string().min(1),
    img: z.string().url(),
    imageMetadata: z.custom<ImageMetadata>().nullable(),
})

const utapi = new UTApi()

export async function createCustomStickerOrder(formData: FormData) {
    try {
        const user = await getCurrentUser()

        if (user.userId == null) {
            return { error: true, message: "You must be logged in to create an order." }
        }

        if (!canCreateOrder(user)) {
            return { error: true, message: "You do not have permission to create an order." }
        }

        // FormData values come back as FormDataEntryValue | null (string | File | null).
        // Rebuild a plain object and re-validate server-side — never trust client validation alone.
        const raw = {
            image: formData.get("image"),
            product: formData.get("product"),
            shape: formData.get("shape"),
            material: formData.get("material"),
            finish: formData.get("finish"),
            size: formData.get("size"),
            quantity: formData.get("quantity"),
        }

        const { success, data, error } = customStickerSchema.safeParse(raw)
        if (!success) {
            console.error("validation error:", error.flatten())
            return { error: true, message: "There was an error creating your order." }
        }
        // after the safeParse success check, before the upload
let imageMetadata: ImageMetadata | null = null
const rawMeta = formData.get("imageMetadata")
if (typeof rawMeta === "string") {
    try {
        imageMetadata = JSON.parse(rawMeta) as ImageMetadata
    } catch {
        console.error("invalid imageMetadata JSON")
    }
}

        const uploadResult = await utapi.uploadFiles(data.image!)

        if (uploadResult.error) {
            console.error("upload error:", uploadResult.error)
            return { error: true, message: "There was an error uploading your artwork." }
        }

            const order = await insertCustomStickerOrder({
                product: data.product,
                shape: data.shape,
                material: data.material,
                finish: data.finish,
                size: data.size,
                quantity: data.quantity,
                img: uploadResult.data.ufsUrl,
                image_metadata: imageMetadata,
                user_id: user.userId,
            })

        console.log("order created:", order)
        return { error: false, message: "Order created!", redirectUrl: "/" }
    } catch (e: any) {
        console.error("action error:", e?.message)
        console.error("action error cause:", e?.cause?.message)
        console.error("action error code:", e?.cause?.code)
        console.error("action error detail:", e?.cause?.detail)
        return { error: true, message: String(e) }
    }
}

export async function uploadCartImage(formData: FormData) {
    const user = await getCurrentUser()
    if (user.userId == null) {
        return { error: true as const, message: "You must be logged in." }
    }
    if (!canCreateOrder(user)) {
        return { error: true as const, message: "You do not have permission." }
    }

    const file = formData.get("image")
    if (!(file instanceof File)) {
        return { error: true as const, message: "No image provided." }
    }

    const result = await utapi.uploadFiles(file)
    if (result.error) {
        console.error("upload error:", result.error)
        return { error: true as const, message: "There was an error uploading your artwork." }
    }
    return { error: false as const, url: result.data.ufsUrl }
}

function isUploadThingUrl(value: string) {
    try {
        const host = new URL(value).hostname
        return host.endsWith(".ufs.sh") || host === "utfs.io"
    } catch {
        return false
    }
}

export async function createOrdersFromCart(items: unknown) {
    try {
        const user = await getCurrentUser()

        if (user.userId == null) {
            return { error: true as const, message: "You must be logged in to place an order." }
        }
        if (!canCreateOrder(user)) {
            return { error: true as const, message: "You do not have permission to create an order." }
        }

        const parsed = z.array(cartItemSchema).min(1).max(50).safeParse(items)
        if (!parsed.success) {
            console.error("cart validation error:", parsed.error.flatten())
            return { error: true as const, message: "Your cart contains invalid items." }
        }

        if (!parsed.data.every((i) => isUploadThingUrl(i.img))) {
            return { error: true as const, message: "One of your images is invalid. Please re-add it." }
        }

        for (const item of parsed.data) {
            await insertCustomStickerOrder({
                product: item.product,
                shape: item.shape,
                material: item.material,
                finish: item.finish,
                size: item.size,
                quantity: item.quantity,
                img: item.img,
                image_metadata: item.imageMetadata,
                user_id: user.userId,
            })
        }

        return { error: false as const, message: "Order placed!", redirectUrl: "/" }
    } catch (e: any) {
        console.error("checkout error:", e?.message, e?.cause?.code, e?.cause?.detail)
        return { error: true as const, message: "There was an error placing your order." }
    }
}