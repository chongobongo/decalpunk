// Custom Sticker Form

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
import { MaterialCardSlider } from "@/features/admin/job-orders/new-order/custom-sticker/components/MaterialCardSlider";
import { Dropzone } from "../components/Dropzone"

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

    return (
        <main className="h-full bg-slate-400">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit, (errors) => {
                        console.log("validation errors:", errors)
                        setStep("0. validation failed on: " + Object.keys(errors).join(", "))
                    })}
                    className="h-full"
                >
                    <div className="mx-10 grid h-full grid-cols-[1fr_33.333vw] gap-4">

                        {/* Dropzone */}
                        <div id="dropzone-container" className="min-h-0 py-10">
                            <FormField control={form.control} name="image" render={({ field }) => (
                                <FormItem className="flex h-full flex-col">
                                    <Dropzone value={field.value} onChange={field.onChange} meta={imageMeta} />
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>

                        {/* Form column */}
                        <div id="sticker-form" className="flex h-full min-h-0 w-full flex-col gap-3 overflow-y-auto bg-slate-200 p-4">
                            <div
                                id="form-header"
                                className={`flex h-20 shrink-0 items-center justify-center rounded-xl bg-gray-500 text-center text-white ${protestFont.className}`}
                            >
                                <h3>Custom Sticker Form</h3>
                            </div>

                            {/* Product */}
                            <FormField control={form.control} name="product" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Product</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-white">
                                            {products.map((item) => (
                                                <SelectItem key={item.id} value={item.id}>{item.product}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            {/* Shape */}
                            <FormField control={form.control} name="shape" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Shape</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value} disabled={!selectedProduct}>
                                        <FormControl>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-white">
                                            {selectedProduct?.shapes.map((item) => (
                                                <SelectItem key={item.id} value={item.shape}>{item.shape}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            {/* Material */}
                            <FormField control={form.control} name="material" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Material</FormLabel>
                                    <MaterialCardSlider
                                        materials={selectedProduct?.materials ?? []}
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                    <FormMessage />
                                </FormItem>
                            )} />

                            {/* Finish */}
                            <FormField control={form.control} name="finish" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Finish</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value} disabled={!selectedMaterial}>
                                        <FormControl>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-white">
                                            {selectedMaterial?.finishes.map((item) => (
                                                <SelectItem key={item.id} value={item.finish}>{item.finish}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            {/* Size */}
                            <FormField control={form.control} name="size" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Size</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value} disabled={!selectedProduct}>
                                        <FormControl>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-white">
                                            {selectedProduct?.sizes.map((item) => (
                                                <SelectItem key={item.id} value={item.size}>{item.size}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            {/* Quantity */}
                            <FormField control={form.control} name="quantity" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Quantity</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value} disabled={!selectedProduct}>
                                        <FormControl>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-white">
                                            {selectedProduct?.quantities.map((item) => (
                                                <SelectItem key={item.id} value={item.quantity}>{item.quantity}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            {/* Price */}
                            <div className="mt-2 flex items-center justify-between border-t border-gray-200 py-3">
                                <span className="text-sm font-medium text-gray-600">Price</span>
                                {selectedMaterial ? (
                                    <span className="text-xl font-bold text-amber-500">
                                        ${selectedMaterial.price.toFixed(2)}
                                    </span>
                                ) : (
                                    <span className="text-sm text-gray-400">Select a material</span>
                                )}
                            </div>

                            {/* Submit */}
                            <div className="mt-auto flex justify-end pt-2">
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
