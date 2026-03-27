"use server"
import z from "zod"
import { customStickerSchema } from "../schema/customStickerSchema"

export async function createCustomStickerOrder(unsafeData: z.infer<typeof customStickerSchema>) {
    console.log("server action called")
    return { error: false, message: "test", redirectUrl: "/" }
}