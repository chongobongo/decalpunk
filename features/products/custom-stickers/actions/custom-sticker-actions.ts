"use server"
import z from "zod"
import { insertCustomStickerOrder } from "../db/custom-sticker-db"
import { customStickerSchema } from "../schema/customStickerSchema"
import { getCurrentUser } from "@/services/clerk"
import { canCreateOrder } from "@/app/permissions/general"

export async function createCustomStickerOrder(unsafeData: z.infer<typeof customStickerSchema>) {
    try {
        const user = await getCurrentUser()
        console.log("user:", JSON.stringify(user))
        
        if (user.userId == null) {
            return { error: true, message: "You must be logged in to create an order." }
        }

        if (!canCreateOrder(user)) {
            return { error: true, message: "You do not have permission to create an order." }
        }

        const { success, data } = customStickerSchema.safeParse(unsafeData)
        if (!success) {
            return { error: true, message: "There was an error creating your order." }
        }

        const order = await insertCustomStickerOrder({ ...data, user_id: user.userId })
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