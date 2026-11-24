"use client"

import { useEffect, useRef } from "react"
import { useCart } from "./cartProvider"

export function ClearCartOnPaid() {
    const { clear, ready } = useCart()
    const done = useRef(false)

    useEffect(() => {
        if (ready && !done.current) {
            done.current = true
            clear()
        }
    }, [ready, clear])

    return null
}