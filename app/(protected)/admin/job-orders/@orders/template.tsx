// Job-Order - Orders - Template
// Save as template.tsx in app/(protected)/admin/job-orders/@orders/

"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { usePathname } from "next/navigation"

// Absolute paths, so the links and the active underline work from any page
const tabLinks = [
    { href: "/admin/job-orders", label: "Open" },
    { href: "/admin/job-orders/processing", label: "Production" },
    { href: "/admin/job-orders/close", label: "Close" },
]

// "Open" is only active on its own page, the others also on their sub-pages
function isActive(path: string, href: string) {
    if (href === "/admin/job-orders") return path === href
    return path === href || path.startsWith(`${href}/`)
}

export default function Template({ children }: { children: React.ReactNode }) {
    const path = usePathname()

    return (
        <div className="h-full bg-amber-100">
            <h3 className="mt-4 text-center text-2xl font-bold">Job Orders</h3>
            <ul id="materialsLinks" className="flex flex-row flex-wrap gap-4 px-4 pt-2">
                {tabLinks.map((link) => (
                    <li key={link.label}>
                        <Link className="relative block pb-1" href={link.href}>
                            {isActive(path, link.href) && (
                                <motion.span
                                    className="absolute inset-x-0 bottom-0 block h-px bg-black"
                                    layoutId="underline"
                                />
                            )}
                            <div className="mt-1.5 w-20 text-center">
                                <h3>{link.label}</h3>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
            <div id="container" className="flex flex-row">
                {children}
            </div>
        </div>
    )
}