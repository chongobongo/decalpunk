// Cart Check-Out - Page
// app\cart\page.tsx

"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useCart } from "@/features/cart/cartProvider"
import { createCheckout } from "@/features/orders/actions/create-checkout"

export default function CartPage() {
    const { items, ready, removeItem, clear } = useCart()
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const totalCents = items.reduce((sum, i) => sum + i.totalCents, 0)

    async function handleCheckout() {
        setSubmitting(true)
        setError(null)
        try {
            const result = await createCheckout(
                items.map((i) => ({
                    productId: i.productId,
                    materialId: i.materialId,
                    shape: i.shape,
                    finish: i.finish,
                    size: i.size,
                    quantity: Number(i.quantity),
                    img: i.img,
                    imageMetadata: i.imageMetadata,
                })),
            )
            if (result.error) {
                setError(result.message)
                setSubmitting(false)
                return
            }
            // Don't clear the cart here. It is cleared on the order page after payment.
            window.location.href = result.url
        } catch (e) {
            console.error("checkout error:", e)
            setError("Something went wrong. Please try again.")
            setSubmitting(false)
        }
    }

    if (!ready) {
        return <main className="mx-auto max-w-3xl p-6 text-gray-500">Loading cart…</main>
    }

    if (items.length === 0) {
        return (
            <main className="mx-auto max-w-3xl p-6">
                <h1 className="mb-4 text-2xl font-bold">Your cart</h1>
                <p className="mb-4 text-gray-600">Your cart is empty.</p>
                <Button asChild>
                    <Link href="/stickers/sticker-order/custom-stickers">Design a sticker</Link>
                </Button>
            </main>
        )
    }

    return (
        <main className="mx-auto max-w-3xl p-6">
            <h1 className="mb-6 text-2xl font-bold">Your cart</h1>

            <ul className="divide-y divide-gray-200 border-y border-gray-200">
                {items.map((item) => (
                    <li key={item.id} className="flex gap-4 py-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={item.img}
                            alt={`${item.product} artwork`}
                            className="h-24 w-24 rounded border border-gray-200 bg-white object-contain"
                        />

                        <div className="flex-1">
                            <p className="font-semibold">{item.product}</p>
                            <p className="text-sm text-gray-600">
                                {item.shape} · {item.material} · {item.finish}
                            </p>
                            <p className="text-sm text-gray-600">
                                Size: {item.size} · Qty: {item.quantity}
                            </p>
                        </div>

                        <div className="flex flex-col items-end justify-between">
                            <div className="text-right">
                                <span className="font-bold text-amber-500">
                                    ${(item.totalCents / 100).toFixed(2)}
                                </span>
                                <p className="text-xs text-gray-500">
                                    ${item.unitPrice.toFixed(2)} each
                                </p>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeItem(item.id)}
                                disabled={submitting}
                            >
                                Remove
                            </Button>
                        </div>
                    </li>
                ))}
            </ul>

            <div className="flex items-center justify-between py-4">
                <span className="text-sm font-medium text-gray-600">
                    Estimated total ({items.length} {items.length === 1 ? "item" : "items"})
                </span>
                <span className="text-xl font-bold text-amber-500">
                    ${(totalCents / 100).toFixed(2)}
                </span>
            </div>

            {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

            <div className="flex gap-3">
                <Button type="button" onClick={handleCheckout} disabled={submitting}>
                    {submitting ? "Starting checkout…" : "Checkout"}
                </Button>
                <Button type="button" variant="outline" onClick={clear} disabled={submitting}>
                    Clear cart
                </Button>
                <Button asChild variant="ghost">
                    <Link href="/stickers/sticker-order/custom-stickers">Add another</Link>
                </Button>
            </div>
        </main>
    )
}