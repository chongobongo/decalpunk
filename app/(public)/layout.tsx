// Public Layout - Decal Punk
// app\(public)\layout.tsx

import { Navbar_one } from "@/components/Navbar-1"

export default function NavLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <section className="flex min-h-0 flex-1 flex-col">
      <Navbar_one />
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    </section>
  )
}