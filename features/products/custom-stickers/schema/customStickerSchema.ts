// features\products\custom-stickers\schema\customStickerSchema.ts

import { z } from "zod"

export const customStickerSchema = z.object({
    image: z
        .instanceof(File, { message: "Please upload an artwork file" })
        .nullable()
        .refine((file) => file !== null, {
            message: "Please upload an artwork file",
        }),
    product: z.string().min(1, "Please select a product"),
    shape: z.string().min(1, "Please select a shape"),
    material: z.string().min(1, "Please select a material"),
    finish: z.string().min(1, "Please select a finish"),
    size: z.string().min(1, "Please select a size"),
    quantity: z.string().min(1, "Please select a quantity"),
})