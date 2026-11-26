// Crash Bio
// app\(public)\bios\crash\page.tsx

import Image from "next/image"
import DecalIconCrash from "@/app/images/icons/decal-icon-crash-drummer.png"

import { Protest_Strike } from "next/font/google"

const protestFont = Protest_Strike({
  subsets: ["latin"],
  weight: "400",
})

export default function CrashPage() {
  return (
<main className="flex min-h-[70dvh] flex-1 flex-col items-center justify-center gap-6 bg-stone-100 px-4 py-12 text-center">
    <h1
        id="header"
        className={`${protestFont.className} text-4xl sm:text-5xl lg:text-6xl`}
      >
        Meet Crash!
      </h1>

      <Image
        src={DecalIconCrash}
        width={200}
        height={200}
        sizes="(min-width: 1024px) 256px, (min-width: 640px) 208px, 160px"
        className="h-auto w-40 drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] sm:w-52 lg:w-64"
        alt="Buzz, the Decal Punk bass player"
        priority
      />

      <p className="max-w-md text-lg sm:text-xl">Cat Sings!</p>
      <p className="text-sm text-slate-500">More of the band is coming soon.</p>
    </main>
  )
}