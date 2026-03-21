"use server"

import z from "zod"
import { insertCustomStickerOrder } from "../db/custom-sticker-db"
import { customStickerSchema } from "../schema/customStickerSchema"
import { canCreateCustomSticker } from "../permissions/custom-sticker-permissions"
import { redirect } from "next/navigation"


export async function createCustomStickerOrder(unsafeData: z.infer<typeof customStickerSchema>) {
    const { success, data } = customStickerSchema.safeParse(unsafeData)
        if (!success) {
            return { error: true, message: "There was an error creating your order."}
        }
      const order = await insertCustomStickerOrder(data)
        console.log(order)
      redirect(`/test`)
}
