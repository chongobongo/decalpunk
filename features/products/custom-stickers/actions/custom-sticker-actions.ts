"use server"
import z from "zod"
import { insertCustomStickerOrder } from "../db/custom-sticker-db"
import { customStickerSchema } from "../schema/customStickerSchema"
import { getCurrentUser } from "@/services/clerk"
import { canCreateOrder } from "@/app/permissions/general"

export async function createCustomStickerOrder(unsafeData: z.infer<typeof customStickerSchema>) {
    const user = await getCurrentUser()
        console.log("user:", JSON.stringify(user))
    if (user.userId == null) {
        return { error: true, message: "You do not have permission to create an order." }
    }

    const { success, data } = customStickerSchema.safeParse(unsafeData)
    if (!success) {
        return { error: true, message: "There was an error creating your order." }
    }
    
    try {
const order = await insertCustomStickerOrder({ ...data, user_id: user.userId })
        console.log("order created:", order)
        return { error: false, message: "Order created!", redirectUrl: "/" }
    } catch (e) {
        console.error("insertCustomStickerOrder failed:", e)
        return { error: true, message: String(e) }
    }
}