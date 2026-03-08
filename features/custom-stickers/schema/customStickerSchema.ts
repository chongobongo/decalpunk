import { z } from "zod"

export const customStickerSchema = z.object({
    id: z.string,
    product: z.string,
})