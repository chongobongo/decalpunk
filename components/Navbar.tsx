import Link from "next/link"
import { Protest_Strike } from "next/font/google"


const protestFont = Protest_Strike({
     subsets: ["latin"],
     weight: "400",
})

import HamburgerIcon from "@/features/navbar/components/HamburgerMenu";

export default function Navbar() {
  return (
    <header className="h-12 shadow z-10 bg-black">
      <nav className="mr-10 ml-10 flex flex-row">
        <Link
          className="mr-10 mt-2 text-white"
          href="/"
        >
          Decal Punk
        </Link>
        <ul className={`flex flex-row mt-2 gap-2 text-amber-300 ${protestFont.className}`}>
          <li><Link href="/stickers">Stickers</Link></li>
          <li><Link href="/labels">Labels</Link></li>
          <li><Link href="/materials">Materials</Link></li>
      <div>
    <div id="hamburgerMenu" className="block lg:hidden">
        <HamburgerIcon />
    </div>

      </div>
        </ul>
      </nav>
    </header>
  )
}