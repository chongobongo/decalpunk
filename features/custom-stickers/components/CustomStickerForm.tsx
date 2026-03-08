"use client"

import { useForm } from "react-hook-form";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod";

import { customStickerSchema } from "../schema/customStickerSchema";

import { Form,
         FormField,
         FormControl,
         FormItem,
         FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function CustomStickerForm({
    product,
}: {
    product: {
        id: string
        product: string
    }[]
}) {

    const form = useForm<z.infer<typeof customStickerSchema>>({
        resolver: zodResolver(customStickerSchema),
        defaultValues: {
        }
    })

    return (
        <section className="border-2 border-amber-500">
            Custom Sticker Form Component
            <Form {...form}>
                <FormField
                    control={form.control}
                    name="id"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Products
                            </FormLabel>
                            <Select>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                </FormControl>
                                        <SelectContent>
                                            {product.map((item) => (
                                                <SelectItem key={item.id} value={item.id}>
                                                    {item.product}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    
                                
                            </Select>
                        </FormItem>
                    )} />
            </Form>
        </section>
    )
}