// custom-sticker-actions.ts
// features\products\custom-stickers\actions\custom-sticker-actions.ts

"use server"
import { UTApi } from "uploadthing/server"
import { customStickerSchema } from "../schema/customStickerSchema"
import { insertCustomStickerOrder } from "../db/custom-sticker-db"
import { getCurrentUser } from "@/services/clerk"
import { canCreateOrder } from "@/app/permissions/general"

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