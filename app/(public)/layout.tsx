// Public Layout - Decal Punk
// app\(public)\layout.tsx

import Link from "next/link"
import { navData } from "../data"

import { UserButton } from "@clerk/nextjs"
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

import { UserRole } from "@/db/schemaDB"

const protestFont = Protest_Strike({
  subsets: ["latin"],
  weight: "400",
})

type NavLink = { href: string; label: string }

type NavConfig = {
  bg: string
  roleLabel: string
  links: NavLink[]
}



async function Navbar() {
  const user = await getCurrentUser({ allData: true })
  console.log("Navbar user →", user)
  if (!user.clerkUserId) return null

const config: NavConfig = navData[user.role as UserRole] ?? navData.user

  return (
    <header className={`h-12 shadow z-10 ${config.bg}`}>
      <nav className="mx-10 flex flex-row items-center h-full">

        {/* Logo */}
        <Link className="mr-6 text-white font-bold tracking-wide" href="/">
          Decal Punk
        </Link>

        {/* Role badge */}
        <span className={`hidden lg:inline-block text-xs text-white/40 mr-6 ${protestFont.className}`}>
          {config.roleLabel}
        </span>

        {/* Desktop nav links */}
        <ul className={`hidden lg:flex flex-row gap-4 text-amber-300 ${protestFont.className}`}>
          {config.links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="hover:text-white transition-colors">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Hamburger — mobile only */}
        <div className="ml-auto lg:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-white focus:outline-none">
                <HamburgerIcon />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                {config.roleLabel}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {config.links.map((link) => (
                <DropdownMenuItem key={link.href} asChild>
                  <Link href={link.href} className="w-full cursor-pointer">
                    {link.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Auth area */}
        <div className="hidden lg:flex justify-end items-center gap-4 ml-auto h-full">
          <UserButton />
        </div>

      </nav>
    </header>
  )
}

export default function NavLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <section>
      <Navbar />
      {children}
    </section>
  )
}