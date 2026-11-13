// Crt Link

"use client"

import Link from "next/link"
import { useCart } from "@/features/cart/cartProvider"

export function CartLink({ className = "" }: { className?: string }) {
  const { items, ready } = useCart()
  const count = ready ? items.length : 0

  return (
    <Link
      href="/cart"
      aria-label={`Cart${count > 0 ? `, ${count} items` : ""}`}
      className={`relative inline-flex items-center text-amber-300 hover:text-white transition-colors ${className}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6"
      >
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
      </svg>
      {count > 0 && (
        <span className="absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1 text-xs font-bold text-black">
          {count}
        </span>
      )}
    </Link>
  )
}