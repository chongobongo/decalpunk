"use server"
import z from "zod"
import { insertCustomStickerOrder } from "../db/custom-sticker-db"
import { customStickerSchema } from "../schema/customStickerSchema"

export async function createCustomStickerOrder(unsafeData: z.infer<typeof customStickerSchema>) {
    const { success, data } = customStickerSchema.safeParse(unsafeData)
    if (!success) {
        return { error: true, message: "There was an error creating your order." }
    }
    
    try {
        const order = await insertCustomStickerOrder(data)
        console.log("order created:", order)
        return { error: false, message: "Order created!", redirectUrl: "/" }
    } catch (e) {
        console.error("insertCustomStickerOrder failed:", e)
        return { error: true, message: String(e) }
    }
}