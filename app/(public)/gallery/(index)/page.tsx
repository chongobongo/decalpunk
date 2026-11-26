// Gallery Index
// app\(public)\gallery\(index)\page.tsx

import { Protest_Strike } from "next/font/google"

const protestFont = Protest_Strike({
  subsets: ["latin"],
  weight: "400",
})

export default function GalleryPage() {

    return (
      <main className="text-center h-screen relative flex min-h-0 flex-1 flex-col bg-stone-100">
        <h3 id="header" className={`${protestFont.className} mt-60 text-4xl  hidden lg:block`}>
            Gallery Index</h3>
            <p className="mt-5">Displays the catagories of art.</p>
      </main>
    )
}
