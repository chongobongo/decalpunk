// Custom Sticker Actions - Public
// features\products\custom-stickers\actions\custom-sticker-actions.ts

"use server"
import { UTApi } from "uploadthing/server"
import { getCurrentUser } from "@/services/clerk"
import { canCreateOrder } from "@/app/permissions/general"

const utapi = new UTApi()

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