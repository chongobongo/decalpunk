// features\products\custom-stickers\schema\customStickerSchema.ts

import { z } from "zod"

const MAX_IMAGE_BYTES = 10 * 1024 * 1024 // 10 MB, adjust as needed

export const customStickerSchema = z.object({
    image: z
        .instanceof(File, { message: "Please upload an artwork file" })
        .nullable()
        .refine((file): file is File => file !== null, {
            message: "Please upload an artwork file",
            abort: true,
        })
        .refine((file) => file.type.startsWith("image/"), {
            message: "File must be an image",
        })
        .refine((file) => file.size <= MAX_IMAGE_BYTES, {
            message: "Image must be 10 MB or smaller",
        }),
    product: z.string().min(1, "Please select a product"),
    shape: z.string().min(1, "Please select a shape"),
    material: z.string().min(1, "Please select a material"),
    finish: z.string().min(1, "Please select a finish"),
    size: z.string().min(1, "Please select a size"),
    quantity: z.string().min(1, "Please select a quantity"),
})