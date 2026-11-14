// Admin Front Page - Deal Punk
// app/(protected)/admin/page.tsx

import { Protest_Strike } from "next/font/google"

const protestFont = Protest_Strike({
  subsets: ["latin"],
  weight: "400",
})

export default function AdminPage() {

    return (
      <main className="text-center h-screen relative flex min-h-0 flex-1 flex-col bg-stone-100">
        <h3 id="header" className={`${protestFont.className} mt-60 text-4xl  hidden lg:block`}>
            Admin Index</h3>
            <p className="mt-5">Metrics for media, cost, sales, etc.</p>
      </main>
    )
}
