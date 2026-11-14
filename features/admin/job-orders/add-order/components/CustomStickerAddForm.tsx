"use client"

// CustomStickerAddForm.tsx
// features\admin\job-orders\edit-job\components\CustomStickerAddForm.tsx
//
// Adds one more sticker item to an existing job. Same style as the edit form:
// React Hook Form + zod, plain <select> / <input>.

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { actionToast } from "@/hooks/use-toast"
import { getImageMetadata } from "@/lib/getImageMetadata" // ASSUMPTION: same helper your create form uses
import {
    customStickerAddSchema,
    type CustomStickerAddInput,
    type CustomStickerAddValues,
} from "@/features/admin/job-orders/add-order/schema/customStickerSchemaAdd"
import { addCustomStickerItemAction } from "@/features/admin/job-orders/add-order/actions/custom-sticker-add-actions"
import type { StickerOption, StickerOptionField } from "@/features/admin/job-orders/add-order/options/customStickerOptions"

const FIELDS: { name: StickerOptionField; label: string }[] = [
    { name: "shape", label: "Shape" },
    { name: "material", label: "Material" },
    { name: "finish", label: "Finish" },
    { name: "size", label: "Size" },
    { name: "quantity", label: "Quantity" },
]

export function CustomStickerAddForm({
    jobOrderId,
    listId,
    product,
    options,
}: {
    jobOrderId: string
    listId: string | null
    product: string
    options: Record<StickerOptionField, StickerOption[]>
}) {
    const router = useRouter()
    const backHref = listId ? `/admin/job-orders/job-edit/${listId}` : "/admin/job-orders"

    const form = useForm<CustomStickerAddInput, unknown, CustomStickerAddValues>({
        resolver: zodResolver(customStickerAddSchema),
        defaultValues: {
            image: null,
            shape: "",
            material: "",
            finish: "",
            size: "",
            quantity: "",
        },
    })
    const {
        register,
        handleSubmit,
        setValue,
        setError,
        watch,
        formState: { errors, isSubmitting },
    } = form

    // Preview of the chosen file
    const newImage = watch("image")
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    useEffect(() => {
        if (!(newImage instanceof File)) {
            setPreviewUrl(null)
            return
        }
        const url = URL.createObjectURL(newImage)
        setPreviewUrl(url)
        return () => URL.revokeObjectURL(url)
    }, [newImage])

    async function onSubmit(values: CustomStickerAddValues) {
        const fd = new FormData()
        for (const { name } of FIELDS) fd.append(name, values[name])

        fd.append("image", values.image)
        const meta = await getImageMetadata(values.image)
        fd.append("imageMetadata", JSON.stringify(meta ?? null))

        const res = await addCustomStickerItemAction(jobOrderId, fd)

        if (res.error) {
            for (const [field, messages] of Object.entries(res.fieldErrors ?? {})) {
                const message = messages?.[0]
                if (message) setError(field as keyof CustomStickerAddInput, { message })
            }
            actionToast({ actionData: res })
            return
        }

        actionToast({ actionData: res })
        router.push(res.redirectUrl ?? backHref)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex max-w-xl flex-col gap-6">
            {/* Product: display only. The server copies it from the job's existing items. */}
            <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium">Product</span>
                <p className="flex h-9 items-center rounded-md border border-input bg-muted px-3 text-sm text-muted-foreground">
                    {product}
                </p>
            </div>

            {FIELDS.map(({ name, label }) => (
                <div key={name} className="flex flex-col gap-1.5">
                    <label htmlFor={name} className="text-sm font-medium">
                        {label}
                    </label>
                    <select
                        id={name}
                        {...register(name)}
                        className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                    >
                        <option value="" disabled>
                            Select a {label.toLowerCase()}
                        </option>
                        {options[name].map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    {options[name].length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                            No {label.toLowerCase()} options are configured yet.
                        </p>
                    ) : null}
                    {errors[name] ? (
                        <p className="text-sm text-destructive">{errors[name]?.message}</p>
                    ) : null}
                </div>
            ))}

            <div className="flex flex-col gap-1.5">
                <label htmlFor="image" className="text-sm font-medium">
                    Artwork
                </label>
                <div className="flex items-center gap-4">
                    {previewUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={previewUrl}
                            alt=""
                            width={96}
                            height={96}
                            className="h-24 w-24 rounded border object-contain"
                        />
                    ) : null}
                    <input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                            setValue("image", e.target.files?.[0] ?? null, {
                                shouldDirty: true,
                                shouldValidate: true,
                            })
                        }
                    />
                </div>
                {errors.image ? (
                    <p className="text-sm text-destructive">{errors.image.message}</p>
                ) : null}
            </div>

            <div className="flex gap-3">
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Adding..." : "Add item"}
                </Button>
                <Button asChild variant="outline" type="button">
                    <Link href={backHref}>Cancel</Link>
                </Button>
            </div>
        </form>
    )
}