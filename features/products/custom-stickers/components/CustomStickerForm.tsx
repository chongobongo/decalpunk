"use client"

import { useEffect, useState } from "react";
import { getImageMetadata, type ImageMetadata } from "@/lib/getImageMetadata";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { Protest_Strike } from "next/font/google"

import { Form, FormField, FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { customStickerSchema } from "../schema/customStickerSchema";
import { MaterialCardSlider } from "./MaterialCardSlider";
import { Dropzone } from "./Dropzone"
import { PiArrowBendRightDownFill } from "react-icons/pi";

import { createCustomStickerOrder } from "../actions/custom-sticker-actions";

import { uploadCartImage } from "../actions/custom-sticker-actions"
import { useCart } from "@/features/cart/cartProvider"

type Product = {
    id: string;
    product: string;
    shapes: { id: string; shape: string }[];
    materials: {
        id: string;
        material: string;
        img: string;
        price: number;
        finishes: { id: string; finish: string }[];
    }[];
    sizes: { id: string; size: string }[];
    quantities: { id: string; quantity: string }[];
};

const protestFont = Protest_Strike({
    subsets: ["latin"],
    weight: "400",
})

export function CustomStickerForm({
    products,
}: {
    products: Product[]
}) {

    const { addItem } = useCart()
    const router = useRouter()

    const form = useForm<z.input<typeof customStickerSchema>, any, z.output<typeof customStickerSchema>>({
        resolver: zodResolver(customStickerSchema),
        defaultValues: {
            product: "",
            shape: "",
            material: "",
            finish: "",
            size: "",
            quantity: "",
            image: null,
        },
    })

    const selectedProductId = form.watch("product")
    const selectedMaterialId = form.watch("material")

    const selectedProduct = products.find((p) => p.id === selectedProductId) ?? null
    const selectedMaterial = selectedProduct?.materials.find((m) => m.id === selectedMaterialId) ?? null

    const image = form.watch("image")
    const [imageMeta, setImageMeta] = useState<ImageMetadata | null>(null)
    const [submitError, setSubmitError] = useState<string | null>(null)
    const [step, setStep] = useState("idle (Save not clicked yet)")

    useEffect(() => {
        if (!image) {
            setImageMeta(null)
            return
        }
        let cancelled = false
        getImageMetadata(image).then((meta) => {
            if (!cancelled) setImageMeta(meta)
        })
        return () => { cancelled = true }
    }, [image])

    useEffect(() => {
        form.resetField("shape")
        form.resetField("material")
        form.resetField("finish")
        form.resetField("size")
        form.resetField("quantity")
    }, [form, selectedProductId])

    useEffect(() => {
        form.resetField("finish")
    }, [form, selectedMaterialId])

    async function onSubmit(values: z.output<typeof customStickerSchema>) {
        setStep("1. onSubmit started")
        setSubmitError(null)
        try {
            const fd = new FormData()
            fd.append("image", values.image)

            setStep("2. uploading image")
            const upload = await uploadCartImage(fd)
            if (upload.error) {
                setStep("3. upload returned an error")
                setSubmitError(upload.message)
                return
            }

            addItem({
                product: selectedProduct?.product ?? values.product,
                shape: values.shape,
                material: selectedMaterial?.material ?? values.material,
                finish: values.finish,
                size: values.size,
                quantity: values.quantity,
                unitPrice: selectedMaterial?.price ?? 0,
                img: upload.url,
                imageMetadata: imageMeta,
            })

            setStep("3. added to cart, redirecting")
            router.push("/cart")
        } catch (e) {
            setStep("X. threw an error: " + String(e))
            setSubmitError(e instanceof Error ? e.message : "Something went wrong.")
        }
    }

    type SelectName = "product" | "shape" | "finish" | "size" | "quantity"

    const selectField = (
        name: SelectName,
        label: string,
        options: { value: string; label: string }[],
        disabled = false,
    ) => (
        <FormField control={form.control} name={name} render={({ field }) => (
            <FormItem className="space-y-1">
                <FormLabel className="text-xs">{label}</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} disabled={disabled}>
                    <FormControl>
                        <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white">
                        {options.map((o) => (
                            <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <FormMessage />
            </FormItem>
        )} />
    )

    return (
        <main className="min-h-0 flex-1">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit, (errors) => {
                        console.log("validation errors:", errors)
                        setStep("0. validation failed on: " + Object.keys(errors).join(", "))
                    })}
                    className="h-full"
                >
                    <div className="grid h-full min-h-0 grid-cols-[minmax(0,1fr)_minmax(22rem,36%)] gap-4 px-4">
                        {/* Dropzone */}
                        <div id="dropzone-container" className="flex min-h-0 flex-col py-4">
                            <div id="form-header" className="flex h-12 shrink-0 items-center justify-center rounded-xl bg-gray-900">
                                <h3 className={`text-2xl text-amber-300 ${protestFont.className}`}>Custom Sticker Form</h3>
                            </div>
                            <div className="mt-4 flex items-center justify-center gap-2">
                                <p className="text-black font-bold text-xl text-center">
                                    Let's begin by choosing your image!
                                </p>
                                <PiArrowBendRightDownFill className="text-xl" />
                            </div>
                            <FormField control={form.control} name="image" render={({ field }) => (
                                <FormItem className="flex flex-1 flex-col">
                                    <Dropzone value={field.value} onChange={field.onChange} meta={imageMeta} />
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>

                        {/* Form column */}
                        <div id="sticker-form" className="my-4 flex min-h-0 flex-col gap-3 overflow-y-auto rounded-xl bg-white p-3">
                            <div className="flex flex-col gap-y-2">
                                {/* Product and Shape on one line */}
                                <div className="grid grid-cols-2 gap-x-3">
                                    {selectField("product", "Product",
                                        products.map((p) => ({ value: p.id, label: p.product })))}

                                    {selectField("shape", "Shape",
                                        (selectedProduct?.shapes ?? []).map((s) => ({ value: s.shape, label: s.shape })),
                                        !selectedProduct)}
                                </div>

                                {/* Material slider, always shown */}
                                <FormField control={form.control} name="material" render={({ field }) => (
                                    <FormItem className="space-y-1">
                                        <FormLabel className="text-xs">Material</FormLabel>
                                        <MaterialCardSlider
                                            materials={selectedProduct?.materials ?? []}
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                {/* Finish and Size on one line */}
                                <div className="grid grid-cols-2 gap-x-3">
                                    {selectField("finish", "Finish",
                                        (selectedMaterial?.finishes ?? []).map((f) => ({ value: f.finish, label: f.finish })),
                                        !selectedMaterial)}

                                    {selectField("size", "Size",
                                        (selectedProduct?.sizes ?? []).map((s) => ({ value: s.size, label: s.size })),
                                        !selectedProduct)}
                                </div>

                                {/* Quantity and Price on one line */}
                                <div className="grid grid-cols-2 gap-x-3">
                                    {selectField("quantity", "Quantity",
                                        (selectedProduct?.quantities ?? []).map((q) => ({ value: q.quantity, label: q.quantity })),
                                        !selectedProduct)}

                                    {/* Price */}
                                    <div className="flex flex-col justify-end space-y-1">
                                        <span className="text-xs font-medium text-gray-600">Price</span>
                                        <div className="flex h-9 items-center">
                                            {selectedMaterial ? (
                                                <span className="text-xl font-bold text-amber-500">
                                                    ${selectedMaterial.price.toFixed(2)}
                                                </span>
                                            ) : (
                                                <span className="text-sm text-gray-400">Select a material</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Submit */}
                            <div className="mt-auto flex justify-end border-t border-gray-200 pt-3">
                                <Button disabled={form.formState.isSubmitting} type="submit">
                                    Save
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </Form>
        </main>
    )
}