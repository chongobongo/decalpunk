import { z } from "zod"

export const customStickerSchema = z.object({
    id: z.string(),
    user_id: z.string(),
    product: z.string(),
    shape: z.string(),
    material: z.string(),
    size: z.string(),
    quantity: z.string(),
    img: z.string()
})