"use client"

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod";

import { Form, FormField, FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

import { customStickerSchema } from "../schema/customStickerSchema";
import { createCustomStickerOrder } from "../actions/custom-sticker-actions";

type Product = {
    id: string;
    product: string;
    shapes: { id: string; shape: string }[];
    materials: { id: string; material: string; img: string }[];
    finishes: { id: string; finish: string }[];
    sizes: { id: string; size: string }[];
    quantities: { id: string; quantity: string }[];
};

export function CustomStickerForm({
    products,
}: {
    products: Product[]
}) {
    const router = useRouter()

    const form = useForm<z.infer<typeof customStickerSchema>>({
        resolver: zodResolver(customStickerSchema),
        defaultValues: {
            product: "",
            shape: "",
            material: "",
            finish: "",
            size: "",
            quantity: "",
        },
    })

    const selectedProductId = form.watch("product")
    const selectedProduct = products.find((p) => p.id === selectedProductId) ?? null

    // Reset dependent fields when product changes
    useEffect(() => {
        form.resetField("shape")
        form.resetField("material")
        form.resetField("finish")
        form.resetField("size")
        form.resetField("quantity")
    }, [selectedProductId])

    async function onSubmit(values: z.infer<typeof customStickerSchema>) {
        try {
            const data = await createCustomStickerOrder(values)
            if (data?.error) {
                console.error(data.message)
                return
            }
            if (data?.redirectUrl) {
                router.push(data.redirectUrl)
            }
        } catch (e) {
            console.error("caught error:", e)
        }
    }

    return (
        <section className="border-2 border-amber-500">
            Custom Sticker Form Component
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>

                    {/* Product */}
                    <FormField control={form.control} name="product" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Product</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {products.map((item) => (
                                        <SelectItem key={item.id} value={item.id}>{item.product}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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
                                <SelectContent>
                                    {selectedProduct?.shapes.map((item) => (
                                        <SelectItem key={item.id} value={item.shape}>{item.shape}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FormItem>
                    )} />

                    {/* Material */}
                    <FormField control={form.control} name="material" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Material</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value} disabled={!selectedProduct}>
                                <FormControl>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {selectedProduct?.materials.map((item) => (
                                        <SelectItem key={item.id} value={item.material}>{item.material}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FormItem>
                    )} />

                    {/* Finish */}
                    <FormField control={form.control} name="finish" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Finish</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value} disabled={!selectedProduct}>
                                <FormControl>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {selectedProduct?.finishes.map((item) => (
                                        <SelectItem key={item.id} value={item.finish}>{item.finish}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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
                                <SelectContent>
                                    {selectedProduct?.sizes.map((item) => (
                                        <SelectItem key={item.id} value={item.size}>{item.size}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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
                                <SelectContent>
                                    {selectedProduct?.quantities.map((item) => (
                                        <SelectItem key={item.id} value={item.quantity}>{item.quantity}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FormItem>
                    )} />

                    <div className="self-end">
                        <pre>{JSON.stringify(form.formState.errors, null, 2)}</pre>
                        <Button disabled={form.formState.isSubmitting} type="submit">
                            Save
                        </Button>
                    </div>
                </form>
            </Form>
        </section>
    )
}