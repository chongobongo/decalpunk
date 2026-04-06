// Tour Layout - Decal Punk
// app\(public)\tour\layout.tsx

import Link from "next/link"
import { SignInButton, UserButton, Show, SignUpButton } from "@clerk/nextjs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdownMenu";
import { Protest_Strike } from "next/font/google"
const protestFont = Protest_Strike({
     subsets: ["latin"],
     weight: "400",
})
import HamburgerIcon from "@/features/navbar/components/HamburgerMenu";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section>
      <PublicNavbar />
      {children}
    </section>
  );
}

function PublicNavbar() {
  return (
    <section>
      <header className="h-12 shadow z-10 bg-black">
        <nav className="mx-10 flex flex-row items-center h-full">

          {/* Logo - always visible */}
          <Link className="mr-10 text-white font-bold tracking-wide" href="/">
            Decal Punk
          </Link>

          {/* Desktop nav links - hidden on mobile */}
          <ul className={`hidden lg:flex flex-row gap-4 text-amber-300 ${protestFont.className}`}>
            <li><Link href="/stickers">Stickers</Link></li>
            <li><Link href="/labels">Labels</Link></li>
            <li><Link href="/materials">Materials</Link></li>
          </ul>

          {/* Hamburger - pushed to far right on mobile, hidden on desktop */}
          <div className="ml-auto lg:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-white focus:outline-none">
                  <HamburgerIcon />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>Menu</DropdownMenuLabel>
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
              </DropdownMenuContent>
            </DropdownMenu>
          </div>


          <header className="flex justify-end items-center p-4 gap-4 h-16">
            <Show when="signed-out">
              <SignInButton />
            </Show>
          </header>
        </nav>
      </header>
    </section>
  )
}