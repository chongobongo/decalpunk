// Public Layout - Decal Punk
// app\(public)\layout.tsx

import Link from "next/link"
import Image from "next/image"
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

import DecalLogoBurst from "@/app/images/icons/decal-logo-burst.png"

import { Protest_Strike } from "next/font/google"
import HamburgerIcon from "@/features/navbar/components/HamburgerMenu"
import { getCurrentUser } from "@/services/clerk"

import { UserRole } from "@/db/schemaDB"

import { CartLink } from "@/features/cart/CartLink"

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
<div id="header-box" className="sticky top-0 z-50 flex h-20 items-center shadow-[0_6px_12px_rgba(0,0,0,0.5)] bg-slate-900 inset_0_0_20px_rgba(251,191,36,0.4)]">
  <header className={`z-10 h-10 w-full shrink-0 bg-amber-300`}>
    <nav className="flex h-full items-center px-4 sm:px-10">
      {/* Role badge */}
      <Link href="./admin">
            <span className={`hidden lg:inline-block text-xl text-slate-900 mr-6 ${protestFont.className}`}>
        {config.roleLabel}
      </span></Link>

      {/* Desktop nav links */}
      <ul className={`hidden lg:flex flex-row mr-auto ml-auto items-center gap-4 text-slate-900 ${protestFont.className}`}>
        <Link href="./stickers">
          <li className="text-3xl">Stickers</li></Link>
        {/* Logo */}
<Link className="flex items-center tracking-wide" href="/">
  <Image
    src={DecalLogoBurst}
    alt="Decal Punk logo"
    width={200}
    height={200}
    className="drop-shadow-[0_8px_8px_rgba(0,0,0,0.6)]"
    priority
  />
</Link>
        <Link href="./labels">
          <li className="text-3xl">Labels</li>
        </Link>
      </ul>

      {/* Hamburger (mobile only) */}
      <div className="ml-auto flex items-center gap-4 lg:hidden">
        <div className="flex h-7 min-w-7 items-center justify-center">
          <CartLink />
        </div>
        <DropdownMenu>
          {/* ...unchanged... */}
        </DropdownMenu>
      </div>

      {/* Auth area: fixed-size slots so late-loading items don't shift the layout */}
      <div className="hidden lg:flex justify-end items-center gap-4 ml-auto h-full">
        <div className="flex h-7 min-w-7 items-center justify-center">
          <CartLink />
        </div>
        <div className="h-7 w-7">
          <UserButton />
        </div>
      </div>
    </nav>
  </header>
</div>
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
      <div className="min-h-0 flex-1">{children}</div>
    </section>
  )
}