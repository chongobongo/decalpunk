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
import { MaterialCardSlider } from "./MaterialCardSlider";
import { Dropzone } from "./Dropzone"

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

export function CustomStickerForm({
    products,
}: {
    products: Product[]
}) {
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

    useEffect(() => {
        form.resetField("shape")
        form.resetField("material")
        form.resetField("finish")
        form.resetField("size")
        form.resetField("quantity")
    }, [selectedProductId])

    useEffect(() => {
        form.resetField("finish")
    }, [selectedMaterialId])

    async function onSubmit(values: z.output<typeof customStickerSchema>) {
        try {
            const formData = new FormData();
            formData.append("product", values.product);
            formData.append("shape", values.shape);
            formData.append("material", values.material);
            formData.append("finish", values.finish);
            formData.append("size", values.size);
            formData.append("quantity", values.quantity);
            formData.append("image", values.image);

            const data = await createCustomStickerOrder(formData);
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
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-2">
                {/* Dropzone */}
                        <div id="dropzone">
                            <FormField control={form.control} name="image" render={({ field }) => (
                                <FormItem>
                                    <Dropzone
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                </FormItem>
                            )} />
                        </div>
                        <div id="form">
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
                                </FormItem>
                            )} />

                            {/* Price */}
                            <div className="flex items-center justify-between py-3 border-t border-gray-200 mt-2">
                                <span className="text-sm font-medium text-gray-600">Price</span>
                                {selectedMaterial ? (
                                    <span className="text-xl font-bold text-amber-500">
                                        ${selectedMaterial.price.toFixed(2)}
                                    </span>
                                ) : (
                                    <span className="text-sm text-gray-400">Select a material</span>
                                )}
                            </div>

                            <div className="self-end">
                                <Button disabled={form.formState.isSubmitting} type="submit">
                                    Save
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </Form>
        </section>
    )
}