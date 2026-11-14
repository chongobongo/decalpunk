"use client"

// CustomStickerEditForm.tsx
// features\admin\job-orders\edit-job\components\CustomStickerEditForm.tsx
//
// Needs: npm i react-hook-form @hookform/resolvers   (skip if already installed)
// Uses plain <select> / <input> so it doesn't depend on shadcn form components.

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { actionToast } from "@/hooks/use-toast"
import { getImageMetadata } from "@/lib/getImageMetadata" // ASSUMPTION: same helper your create form uses
import {
    customStickerEditSchema,
    type CustomStickerEditInput,
    type CustomStickerEditValues,
} from "@/features/admin/job-orders/edit-job/schema/customStickerSchemaEdit"
import { updateCustomStickerItemAction } from "@/features/admin/job-orders/edit-job/actions/custom-sticker-edit-actions"

// Product is NOT editable, so it is not in this list (it's shown read-only below).
const FIELDS = [
    { name: "shape", label: "Shape" },
    { name: "material", label: "Material" },
    { name: "finish", label: "Finish" },
    { name: "size", label: "Size" },
    { name: "quantity", label: "Quantity" },
] as const

type FieldName = (typeof FIELDS)[number]["name"]
type Option = { value: string; label: string }
export type StickerEditOptions = Record<FieldName, Option[]>

type Item = {
    id: string
    product: string | null
    shape: string | null
    material: string | null
    finish: string | null
    size: string | null
    quantity: string | null
    img: string | null
}

// If the saved value isn't in the option list (old data, renamed option), keep it selectable
// so the form doesn't silently blank it out.
function withCurrent(options: Option[], current: string | null): Option[] {
    if (!current || options.some((o) => o.value === current)) return options
    return [{ value: current, label: `${current} (current)` }, ...options]
}

export function CustomStickerEditForm({
    item,
    listId,
    options,
}: {
    item: Item
    listId: string | null
    options: StickerEditOptions
}) {
    const router = useRouter()
    const backHref = listId ? `/admin/job-orders/job-edit/${listId}` : "/admin/job-orders"

    const form = useForm<CustomStickerEditInput, unknown, CustomStickerEditValues>({
        resolver: zodResolver(customStickerEditSchema),
        defaultValues: {
            image: null,
            shape: item.shape ?? "",
            material: item.material ?? "",
            finish: item.finish ?? "",
            size: item.size ?? "",
            quantity: item.quantity ?? "",
        },
    })
    const {
        register,
        handleSubmit,
        setValue,
        setError,
        watch,
        formState: { errors, isDirty, isSubmitting },
    } = form

    // Preview of a newly chosen file
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
    const shownImg = previewUrl ?? item.img

    async function onSubmit(values: CustomStickerEditValues) {
        const fd = new FormData()
        for (const { name } of FIELDS) fd.append(name, values[name])

        if (values.image) {
            fd.append("image", values.image)
            const meta = await getImageMetadata(values.image)
            fd.append("imageMetadata", JSON.stringify(meta ?? null))
        }

        const res = await updateCustomStickerItemAction(item.id, fd)

        if (res.error) {
            for (const [field, messages] of Object.entries(res.fieldErrors ?? {})) {
                const message = messages?.[0]
                if (message) setError(field as keyof CustomStickerEditInput, { message })
            }
            actionToast({ actionData: res })
            return
        }

        actionToast({ actionData: res })
        router.push(res.redirectUrl ?? backHref)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex max-w-xl flex-col gap-6">
            {/* Product: display only. The server never accepts a product change. */}
            <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium">Product</span>
                <p className="flex h-9 items-center rounded-md border border-input bg-muted px-3 text-sm text-muted-foreground">
                    {item.product ?? "-"}
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
                        {withCurrent(options[name], item[name]).map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
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
                    {shownImg ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={shownImg}
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
                {previewUrl ? (
                    <p className="text-sm text-muted-foreground">
                        New artwork selected. It replaces the current file when you save.
                    </p>
                ) : null}
                {errors.image ? (
                    <p className="text-sm text-destructive">{errors.image.message}</p>
                ) : null}
            </div>

            <div className="flex gap-3">
                <Button type="submit" disabled={!isDirty || isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save changes"}
                </Button>
                <Button asChild variant="outline" type="button">
                    <Link href={`../processing`}>Processing</Link>
                </Button>
                <Button asChild variant="outline" type="button">
                    <Link href={backHref}>Cancel</Link>
                </Button>
            </div>
        </form>
    )
}