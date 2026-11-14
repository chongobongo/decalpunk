// Custom Sticker Schema for Adding an item to an existing job
// features\admin\job-orders\add-order\schema\customStickerSchemaAdd.ts
//
// Used by the form in the browser (zodResolver) and again by the server action.
// There is no product field: the server copies it from the job's existing items.

import { z } from "zod"

const MAX_IMAGE_BYTES = 10 * 1024 * 1024 // 10 MB, adjust as needed

export const customStickerAddSchema = z.object({
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
    shape: z.string().min(1, "Please select a shape"),
    material: z.string().min(1, "Please select a material"),
    finish: z.string().min(1, "Please select a finish"),
    size: z.string().min(1, "Please select a size"),
    quantity: z.string().min(1, "Please select a quantity"),
})

export type CustomStickerAddInput = z.input<typeof customStickerAddSchema>
export type CustomStickerAddValues = z.output<typeof customStickerAddSchema>