// Custom Sticker Form - Component
// features\admin\job-orders\new-order\custom-sticker\components\CustomStickerForm.tsx

"use client"

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { priceJob, type PriceBreak } from "@/lib/pricing"

import { Form, FormField, FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MaterialCardSlider } from "@/features/admin/job-orders/new-order/custom-sticker/components/MaterialCardSlider";
import { Dropzone } from "../components/Dropzone"

import { getImageMetadata, type ImageMetadata } from "@/lib/getImageMetadata";
import { customStickerSchema } from "../schema/customStickerSchema";

import { uploadCartImage } from "../actions/custom-sticker-actions"
import { useCart } from "@/features/cart/cartProvider"

import { Protest_Strike } from "next/font/google"
const protestFont = Protest_Strike({
    subsets: ["latin"],
    weight: "400",
})

type Product = {
    id: string;
    product: string;
    setupFeeCents: number;
    minOrderCents: number;
    breaks: PriceBreak[];
    shapes: { id: string; shape: string; wasteMultiplier: number; feeCents: number }[];
    materials: {
        id: string;
        material: string;
        img: string;
        price: number;
        ratePerSqFtCents: number;
        finishes: { id: string; finish: string; adjPerSqFtCents: number }[];
    }[];
    sizes: { id: string; size: string; widthIn: number; heightIn: number }[];
    quantities: { id: string; quantity: string }[];
};

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
    const shapeValue = form.watch("shape")
    const finishValue = form.watch("finish")
    const sizeValue = form.watch("size")
    const quantityValue = form.watch("quantity")

    const selectedProduct = products.find((p) => p.id === selectedProductId) ?? null
    const selectedMaterial = selectedProduct?.materials.find((m) => m.id === selectedMaterialId) ?? null

    // Live price preview. The server recomputes this at checkout; this number is display only.
const quote = useMemo(() => {
    if (!selectedProduct || !selectedMaterial) return null
    const shape = selectedProduct.shapes.find((s) => s.shape === shapeValue)
    const finish = selectedMaterial.finishes.find((f) => f.finish === finishValue)
    const size = selectedProduct.sizes.find((s) => s.size === sizeValue)
    const quantity = Number(quantityValue)

    console.log("QUOTE DEBUG", {
        shapeValue, shapeFound: shape,
        finishValue, finishFound: finish,
        sizeValue, sizeFound: size,
        quantityValue, quantity,
    })

    if (!shape || !finish || !size || !quantity) return null
    // ...the rest of the block stays the same

        return priceJob({
            ratePerSqFtCents: selectedMaterial.ratePerSqFtCents,
            finishAdjPerSqFtCents: finish.adjPerSqFtCents,
            widthIn: size.widthIn,
            heightIn: size.heightIn,
            wasteMultiplier: shape.wasteMultiplier,
            shapeFeeCents: shape.feeCents,
            quantity,
            breaks: selectedProduct.breaks,
            setupFeeCents: selectedProduct.setupFeeCents,
            minOrderCents: selectedProduct.minOrderCents,
        })
    }, [selectedProduct, selectedMaterial, shapeValue, finishValue, sizeValue, quantityValue])

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

        if (!quote) {
            setSubmitError("Choose a shape, material, finish, size and quantity to get a price.")
            return
        }

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
                unitPrice: quote.eachCents / 100,
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
                    {/* Grid */}
                    <div id="grid" className="mx-10 grid h-full grid-cols-[1fr_33.333vw] gap-4">

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
                                <h3>Working</h3>
                            </div>

                            {/* Product Select */}
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
                                {quote ? (
                                    <div className="text-right">
                                        <span className="text-xl font-bold text-amber-500">
                                            ${(quote.totalCents / 100).toFixed(2)}
                                        </span>
                                        <p className="text-xs text-gray-500">
                                            ${(quote.eachCents / 100).toFixed(2)} each
                                            {quote.minApplied ? " · minimum order applied" : ""}
                                        </p>
                                    </div>
                                ) : selectedMaterial ? (
                                    <span className="text-sm text-gray-500">
                                        from ${selectedMaterial.price.toFixed(2)} / sq ft
                                    </span>
                                ) : (
                                    <span className="text-sm text-gray-400">Select a material</span>
                                )}
                            </div>

                            {submitError && (
                                <p className="text-sm text-red-600">{submitError}</p>
                            )}

<pre className="text-xs text-gray-500">
  {JSON.stringify(
    {
      product: !!selectedProduct,
      material: !!selectedMaterial,
      shape: shapeValue,
      finish: finishValue,
      size: sizeValue,
      quantity: quantityValue,
      hasQuote: !!quote,
    },
    null,
    2,
  )}
</pre>

<pre className="whitespace-pre-wrap rounded bg-white p-2 text-[10px] text-gray-600">
  {JSON.stringify(
    {
      selected: { shapeValue, finishValue, sizeValue, quantityValue },
      offered: {
        shapes: selectedProduct?.shapes.map((s) => s.shape),
        finishes: selectedMaterial?.finishes.map((f) => f.finish),
        sizes: selectedProduct?.sizes.map((s) => s.size),
        quantities: selectedProduct?.quantities.map((q) => q.quantity),
      },
      firstSize: selectedProduct?.sizes[0],
      firstFinish: selectedMaterial?.finishes[0],
      firstShape: selectedProduct?.shapes[0],
      rate: selectedMaterial?.ratePerSqFtCents,
      hasQuote: !!quote,
    },
    null,
    2,
  )}
</pre>

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