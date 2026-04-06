// Admin Layout - Decal Punk
// app\(protected)\layout.tsx

import Link from "next/link"
import { SignInButton, UserButton, SignUpButton } from "@clerk/nextjs"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdownMenu"
import { Protest_Strike } from "next/font/google"
import HamburgerIcon from "@/features/navbar/components/HamburgerMenu"
import { getCurrentUser } from "@/services/clerk"
import { canAccessAdminPages } from "../permissions/general"
import { auth } from "@clerk/nextjs/server"

const protestFont = Protest_Strike({
    subsets: ["latin"],
    weight: "400",
})

async function ProtectedNavbar() {
    const user = await getCurrentUser({ allData: true })
    const isAdmin = canAccessAdminPages(user)
    const { userId } = await auth()

    return (
        <header className="h-12 shadow z-10 bg-black">
            <nav className="mx-10 flex flex-row items-center h-full">

                {/* Logo */}
                <Link className="mr-10 text-white font-bold tracking-wide" href="/">
                    Decal Punk
                </Link>

                {/* Desktop nav links */}
                <ul className={`hidden lg:flex flex-row gap-4 text-amber-300 ${protestFont.className}`}>
                    <li><Link href="/stickers" className="hover:text-white transition-colors">Stickers</Link></li>
                    <li><Link href="/labels" className="hover:text-white transition-colors">Labels</Link></li>
                    <li><Link href="/materials" className="hover:text-white transition-colors">Materials</Link></li>
                    {isAdmin && (
                        <li>
                            <Link href="/admin" className="hover:text-white transition-colors">
                                Admin Panel
                            </Link>
                        </li>
                    )}
                </ul>

                {/* Hamburger - mobile only */}
                <div className="ml-auto lg:hidden">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="text-white focus:outline-none">
                                <HamburgerIcon />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end">
                            <DropdownMenuLabel>Menu</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <Link href="/stickers" className="w-full cursor-pointer">Stickers</Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <Link href="/labels" className="w-full cursor-pointer">Labels</Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <Link href="/materials" className="w-full cursor-pointer">Materials</Link>
                            </DropdownMenuItem>
                            {isAdmin && (
                                <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <Link href="/admin" className="w-full cursor-pointer">Admin Panel</Link>
                                    </DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Auth area */}
                <div className="hidden lg:flex justify-end items-center gap-4 ml-auto h-full">
                    {!userId ? (
                        <div className="flex gap-4">
                            <SignInButton />
                            <SignUpButton>
                                <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                                    Sign Up
                                </button>
                            </SignUpButton>
                        </div>
                    ) : (
                        <UserButton />
                    )}
                </div>

            </nav>
        </header>
    )
}

export default function ProtectedLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <section>
            <ProtectedNavbar />
            {children}
        </section>
    )
}