import z from "zod"
import { customStickerSchema } from "../schema/customStickerSchema"

export async function createCustomStickerOrder(unsafeData: z.infer<typeof customStickerSchema>) {
    "use server"
    console.log("server action called")
    return { error: false, message: "test", redirectUrl: "/" }
}