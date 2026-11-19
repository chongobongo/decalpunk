// Public Layout - Decal Punk
// app\(public)\layout.tsx

import { Navbar_one } from "@/components/Navbar-1"

export default function NavLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <section>
      <Navbar_one />
      <div className="min-h-0 flex-1">{children}</div>
    </section>
  )
}