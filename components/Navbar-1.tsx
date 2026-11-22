// Navbar Public - 1
// components\Navbar-1.tsx

import { UserRole } from "@/db/schemaDB"

import Image from "next/image";
import Link from "next/link";
import { Protest_Strike } from "next/font/google"

import { navData } from "@/app/data"
import DecalLogoBurst from "@/app/images/icons/decal-logo-burst.png"
import { CartLink } from "@/features/cart/CartLink";
import { UserButton } from "@clerk/nextjs"
import { getCurrentUser } from "@/services/clerk"

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

export async function Navbar_one() {

      const user = await getCurrentUser({ allData: true })

      if (!user.clerkUserId) return null
    
    const config: NavConfig = navData[user.role as UserRole] ?? navData.user

    return (

<section
  id="header-box"
  className="sticky top-0 z-50 flex h-16 items-center bg-slate-900 shadow-[0_6px_12px_rgba(0,0,0,0.5)] sm:h-16 lg:h-20"
>
  <header
    id="amber-box"
    className="relative z-10 h-9 w-full shrink-0 self-center bg-amber-300 sm:h-9 lg:h-10"
  >
<nav className="mx-auto grid h-full w-full max-w-screen-2xl grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-1.5 px-2 sm:gap-4 sm:px-6 lg:grid-cols-[1fr_auto_1fr] lg:px-10">
      {/* Role badge */}
      <Link href="/admin" className="flex h-full min-w-0 items-center justify-self-start">
        <span
          className={`block max-w-14 truncate text-[10px] leading-none text-slate-900 sm:max-w-32 sm:text-base lg:max-w-none lg:text-xl ${protestFont.className}`}
        >
          {config.roleLabel}
        </span>
      </Link>

    {/* U.L. - Links */}
      <ul
        className={`flex h-full min-w-0 flex-row items-center justify-center gap-1.5 text-slate-900 sm:gap-6 lg:gap-10 ${protestFont.className}`}
      >
    {/* Stickers / Link */}
        <li className="flex items-center">
          <Link href="/stickers" className="text-xl leading-none sm:text-xl lg:text-3xl">
            Stickers
          </Link>
        </li>

      {/* Decal Logo - Burst */}
<li className="relative h-full w-24 shrink-0 sm:w-32 lg:w-[200px]">
  <Link
    href="/"
    className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 items-center justify-center"
  >
    <Image
      id="logo"
      src={DecalLogoBurst}
      alt="Decal Punk logo"
      width={200}
      height={200}
      sizes="(min-width: 1024px) 200px, 128px"
      className="h-auto w-full drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)] sm:drop-shadow-[0_4px_4px_rgba(0,0,0,0.55)] lg:drop-shadow-[0_8px_8px_rgba(0,0,0,0.6)]"
      priority
    />
  </Link>
</li>
    {/* Labels / Link */}
        <li className="flex items-center">
          <Link href="/labels" className="text-xl leading-none sm:text-xl lg:text-3xl">
            Labels
          </Link>
        </li>
      </ul>

{/* Cart + profile */}
<div id="cart-profile-container" className="flex h-full items-center justify-end gap-1.5 justify-self-end sm:gap-4">
<div id="cart-icon" className="hidden h-7 min-w-7 items-center justify-center sm:flex">
  <CartLink className="!text-black hover:!text-white" />
</div>
  <div id="profile" className="flex h-5 w-5 items-center justify-center sm:h-7 sm:w-7 lg:h-8 lg:w-8">
    <UserButton
      appearance={{
        elements: {
          userButtonAvatarBox: "!h-5 !w-5 sm:!h-7 sm:!w-7 lg:!h-8 lg:!w-8",
        },
      }}
    />
  </div>
</div>
    </nav>
  </header>
</section>
    )
}