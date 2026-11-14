// Custom Sticker Schema for Editing
// features\admin\job-orders\edit-job\schema\customStickerSchemaEdit.ts
//
// Used twice: by the form in the browser (zodResolver) and again by the server action.
// The server run is the one that counts.

import { z } from "zod"

const MAX_IMAGE_BYTES = 10 * 1024 * 1024 // 10 MB, adjust as needed

export const customStickerEditSchema = z.object({
    // Optional on edit: leave it empty to keep the current artwork.
    image: z
        .instanceof(File, { message: "Please upload an image file" })
        .nullable()
        .optional()
        .refine((file) => file == null || file.type.startsWith("image/"), {
            message: "File must be an image",
        })
        .refine((file) => file == null || file.size <= MAX_IMAGE_BYTES, {
            message: "Image must be 10 MB or smaller",
        }),

    shape: z.string().min(1, "Please select a shape"),
    material: z.string().min(1, "Please select a material"),
    finish: z.string().min(1, "Please select a finish"),
    size: z.string().min(1, "Please select a size"),
    quantity: z.string().min(1, "Please select a quantity"),
})

export type CustomStickerEditInput = z.input<typeof customStickerEditSchema>
export type CustomStickerEditValues = z.output<typeof customStickerEditSchema>