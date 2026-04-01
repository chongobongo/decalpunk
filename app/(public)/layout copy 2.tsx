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
import { getCurrentUser } from "@/services/clerk";
import { canAccessAdminNav, canAccessMemberNav, canAccessUserNav } from "../permissions/general";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section>
      
        <UserNav />
        <MemberNav />
        <AdminNav />

      {children}
    </section>
  );
}


async function AdminNav() {
  const user = await getCurrentUser({ allData: true })
  if (!user.userId || !canAccessAdminNav(user)) return null
  return (
        <section>
      <header className="h-12 shadow z-10 bg-emerald-900">
        <nav className="mx-10 flex flex-row items-center h-full">
          {/* Logo */}
          <Link className="mr-10 text-white font-bold tracking-wide" href="/">
            Decal Punk
          </Link>
          {/* Desktop nav links */}
          <ul className={`hidden lg:flex flex-row gap-4 text-amber-300 ${protestFont.className}`}>
            <li><Link href="/stickers">Stickers</Link></li>
            <li><Link href="/labels">Labels</Link></li>
            <li><Link href="/materials">Materials</Link></li>
          </ul>
          {/* Hamburger */}
          <div className="ml-auto lg:hidden">
            ...
          </div>
          {/* Auth area */}
          <div className="flex justify-end items-center p-4 gap-4 h-16">
              <UserButton />
          </div>
        </nav>
      </header>
    </section>
  )
}

async function MemberNav() {
  const user = await getCurrentUser({ allData: true })
  if (!user.userId || !canAccessMemberNav(user)) return null
  return (
        <section>
      <header className="h-12 shadow z-10 bg-amber-800">
        <nav className="mx-10 flex flex-row items-center h-full">
          {/* Logo */}
          <Link className="mr-10 text-white font-bold tracking-wide" href="/">
            Decal Punk
          </Link>
          {/* Desktop nav links */}
          <ul className={`hidden lg:flex flex-row gap-4 text-amber-300 ${protestFont.className}`}>
            <li><Link href="/stickers">Stickers</Link></li>
            <li><Link href="/labels">Labels</Link></li>
            <li><Link href="/materials">Materials</Link></li>
          </ul>
          {/* Hamburger */}
          <div className="ml-auto lg:hidden">
            ...
          </div>
          {/* Auth area */}
          <div className="flex justify-end items-center p-4 gap-4 h-16">
              <UserButton />
          </div>
        </nav>
      </header>
    </section>
  )
}

async function UserNav() {
  const user = await getCurrentUser({ allData: true })
  if (!user.userId || !canAccessUserNav(user)) return null
  return (
        <section>
      <header className="h-12 shadow z-10 bg-black">
        <nav className="mx-10 flex flex-row items-center h-full">
          {/* Logo */}
          <Link className="mr-10 text-white font-bold tracking-wide" href="/">
            Decal Punk
          </Link>
          {/* Desktop nav links */}
          <ul className={`hidden lg:flex flex-row gap-4 text-amber-300 ${protestFont.className}`}>
            <li><Link href="/stickers">Stickers</Link></li>
            <li><Link href="/labels">Labels</Link></li>
            <li><Link href="/materials">Materials</Link></li>
          </ul>
          {/* Hamburger */}
          <div className="ml-auto lg:hidden">
            ...
          </div>
          {/* Auth area */}
          <div className="flex justify-end items-center p-4 gap-4 h-16">
              <UserButton />
          </div>
        </nav>
      </header>
    </section>
  )
}