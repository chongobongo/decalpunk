// Sticker Header - Component
// features\stickers\components\Header.tsx

import DecalIconRazor from "@/app/images/icons/decal-icon-razor-guitar.png"
import Image from "next/image"
import { Protest_Strike } from "next/font/google"

const protestFont = Protest_Strike({
     subsets: ["latin"],
     weight: "400",
})

export const StickerHeader = ({
  headline,
}: {
  headline: string
}) => {
  return (
<section
  id="container"
  className="relative flex h-24 w-full items-center justify-center bg-slate-900 px-3 sm:h-32 lg:h-40"
>
  <h3
    id="header"
    className={`${protestFont.className} min-w-0 pr-16 text-center text-3xl leading-tight text-slate-200 sm:pr-0 sm:text-3xl lg:text-6xl`}
  >
    {headline}
  </h3>

  <div
    id="image"
    className="absolute right-2 top-1/2 -translate-y-1/2 sm:right-8 lg:right-20"
  >
    <Image
      src={DecalIconRazor}
      width={200}
      height={200}
      sizes="(min-width: 1024px) 200px, (min-width: 640px) 112px, 112px"
      className="h-auto w-28 drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] sm:w-28 lg:w-[200px]"
      alt="Decal Punk Icon"
    />
  </div>
</section>
  )
}