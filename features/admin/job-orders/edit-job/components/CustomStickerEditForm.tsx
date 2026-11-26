"use client"

// CustomStickerEditForm.tsx
// features\admin\job-orders\edit-job\components\CustomStickerEditForm.tsx
//
// Needs: npm i react-hook-form @hookform/resolvers   (skip if already installed)
// Uses plain <select> / <input> so it doesn't depend on shadcn form components.

import { useEffect, useState, useTransition } from "react"
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
import { startProcessingAction } from "../../processing/actions/start-processing"

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

// Shared Tailwind classes, so every field looks the same and changes happen in one place
const fieldClass = "flex flex-col gap-1.5"
const labelClass = "text-sm font-medium text-slate-900"
const controlClass =
    "h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
const errorClass = "text-sm text-destructive"
const hintClass = "text-sm text-muted-foreground"

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
    finishesByMaterial = {},
}: {
    item: Item
    listId: string | null
    options: StickerEditOptions
    // Finishes each material offers, keyed by material name. Falls back to options.finish.
    finishesByMaterial?: Record<string, Option[]>
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

    // Finishes follow the selected material
    const materialValue = watch("material")
    const finishOptions = finishesByMaterial[materialValue] ?? options.finish

    // When the boss picks a different material, clear a finish that material doesn't offer
    useEffect(() => {
        if (materialValue === item.material) return
        const current = form.getValues("finish")
        if (current && !finishOptions.some((o) => o.value === current)) {
            setValue("finish", "", { shouldDirty: true })
        }
    }, [materialValue, item.material, finishOptions, form, setValue])

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

    const [pending, startTransition] = useTransition()

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex w-full max-w-xl flex-col gap-5 sm:gap-6">
            {/* Product: display only. The server never accepts a product change. */}
            <div className={fieldClass}>
                <span className={labelClass}>Product</span>
                <p className={`${controlClass} flex items-center bg-muted text-muted-foreground`}>
                    {item.product ?? "-"}
                </p>
            </div>

            {FIELDS.map(({ name, label }) => {
                // Only keep the saved finish selectable while the material is unchanged
                const current =
                    name === "finish" && materialValue !== item.material ? null : item[name]

                return (
                    <div key={name} className={fieldClass}>
                        <label htmlFor={name} className={labelClass}>
                            {label}
                        </label>
                        <select id={name} {...register(name)} className={controlClass}>
                            <option value="" disabled>
                                Select a {label.toLowerCase()}
                            </option>
                            {withCurrent(name === "finish" ? finishOptions : options[name], current).map(
                                (option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ),
                            )}
                        </select>
                        {errors[name] ? <p className={errorClass}>{errors[name]?.message}</p> : null}
                    </div>
                )
            })}

            <div className={fieldClass}>
                <label htmlFor="image" className={labelClass}>
                    Artwork
                </label>
                <div className="flex flex-wrap items-center gap-4">
                    {shownImg ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={shownImg}
                            alt=""
                            width={96}
                            height={96}
                            className="h-24 w-24 shrink-0 rounded border bg-white object-contain"
                        />
                    ) : null}
                    <input
                        id="image"
                        type="file"
                        accept="image/*"
                        className="min-w-0 max-w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-slate-900 file:px-3 file:py-1.5 file:text-sm file:text-white hover:file:bg-slate-700"
                        onChange={(e) =>
                            setValue("image", e.target.files?.[0] ?? null, {
                                shouldDirty: true,
                                shouldValidate: true,
                            })
                        }
                    />
                </div>
                {previewUrl ? (
                    <p className={hintClass}>
                        New artwork selected. It replaces the current file when you save.
                    </p>
                ) : null}
                {errors.image ? <p className={errorClass}>{errors.image.message}</p> : null}
            </div>

            <div className="flex flex-wrap gap-3 border-t pt-5">
                <Button type="submit" disabled={!isDirty || isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save changes"}
                </Button>
<Button
    type="button"
    variant="outline"
    disabled={isDirty || pending}
    onClick={() =>
        startTransition(async () => {
            const res = await startProcessingAction(item.id)
            if (res?.error) actionToast({ actionData: res })
        })
    }
>
    {pending ? "Starting..." : "Processing"}
</Button>
                <Button asChild variant="outline" type="button">
                    <Link href={backHref}>Cancel</Link>
                </Button>
            </div>
        </form>
    )
}