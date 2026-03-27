"use client"

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod";

import { Form,
         FormField,
         FormControl,
         FormItem,
         FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

import { customStickerSchema } from "../schema/customStickerSchema";
import { createCustomStickerOrder } from "../actions/custom-sticker-actions";

export function CustomStickerForm({
    product,
    shape,
    material,
    size,
    quantity,
}: {
    product: { id: string; product: string }[]
    shape: { id: string; shape: string }[]
    material: { id: string; material: string; img: string }[]
    size: { id: string; size: string }[]
    quantity: { id: string; quantity: string }[]
}) {
    const router = useRouter()

    const form = useForm<z.infer<typeof customStickerSchema>>({
        resolver: zodResolver(customStickerSchema),
        defaultValues: {
            product: "",
            shape: "",
            material: "",
            size: "",
            quantity: "",
        },
    })

async function onSubmit(values: z.infer<typeof customStickerSchema>) {
    console.log("onSubmit called", values)
    try {
        const data = await createCustomStickerOrder(values)
        console.log("response:", data)
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
                    <FormField control={form.control} name="product" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Products</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {product.map((item) => (
                                        <SelectItem key={item.id} value={item.id}>{item.product}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="shape" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Shape</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {shape.map((item) => (
                                        <SelectItem key={item.id} value={item.id}>{item.shape}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="material" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Material</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {material.map((item) => (
                                        <SelectItem key={item.id} value={item.id}>{item.material}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="size" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Size</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {size.map((item) => (
                                        <SelectItem key={item.id} value={item.id}>{item.size}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="quantity" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Quantity</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {quantity.map((item) => (
                                        <SelectItem key={item.id} value={item.id}>{item.quantity}</SelectItem>
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