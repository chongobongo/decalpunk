// Cart Provider

"use client"
import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { ImageMetadata } from "@/lib/getImageMetadata"

export type CartItem = {
    id: string
    product: string
    shape: string
    material: string
    finish: string
    size: string
    quantity: string
    unitPrice: number            // display only; recompute on the server at checkout
    img: string                  // UploadThing URL
    imageMetadata: ImageMetadata | null
}

type CartContextValue = {
    items: CartItem[]
    ready: boolean            // add this
    addItem: (item: Omit<CartItem, "id">) => void
    removeItem: (id: string) => void
    clear: () => void
}

const CartContext = createContext<CartContextValue | null>(null)
const KEY = "cart-v1"

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([])
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        try {
            const raw = localStorage.getItem(KEY)
            if (raw) setItems(JSON.parse(raw))
        } catch {}
        setLoaded(true)
    }, [])

    useEffect(() => {
        if (!loaded) return
        try { localStorage.setItem(KEY, JSON.stringify(items)) } catch {}
    }, [items, loaded])

    const value: CartContextValue = {
        items,
        ready: loaded,
        addItem: (item) =>
            setItems((prev) => [...prev, { ...item, id: crypto.randomUUID() }]),
        removeItem: (id) => setItems((prev) => prev.filter((i) => i.id !== id)),
        clear: () => setItems([]),
    }

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
    const ctx = useContext(CartContext)
    if (!ctx) throw new Error("useCart must be used inside <CartProvider>")
    return ctx
}