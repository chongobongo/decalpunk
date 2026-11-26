// Gallery Index
// app\(public)\gallery\(index)\page.tsx

import { Protest_Strike } from "next/font/google"

const protestFont = Protest_Strike({
  subsets: ["latin"],
  weight: "400",
})

export default function GalleryPage() {
  return (
    <main className="flex min-h-[70dvh] flex-1 flex-col items-center justify-center gap-4 bg-stone-100 px-4 py-12 text-center">
      <h1
        id="header"
        className={`${protestFont.className} text-4xl sm:text-5xl lg:text-6xl`}
      >
        Gallery Index
      </h1>
      <p className="max-w-md text-lg sm:text-xl">
        Displays the categories of art.
      </p>
      <p className="text-sm text-slate-500">Coming soon.</p>
    </main>
  )
}