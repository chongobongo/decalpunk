import { z } from "zod"

export const customStickerSchema = z.object({
    product: z.string(),
    shape: z.string(),
    material: z.string(),
    finish: z.string(),
    size: z.string(),
    quantity: z.string(),
})