// Dividing Box - Home Page
// features\home\componenets\DividingBox.tsx

import Image from "next/image"
import DecalIconBuzzBass from "@/app/images/icons/decal-icon-buzz-bass.png"
import DecalLogoRecord from "@/app/images/icons/decal-logo-record.png"
import { Protest_Strike } from "next/font/google"

const protestFont = Protest_Strike({
  subsets: ["latin"],
  weight: "400",
})

export const DividingBox = () => {
  return (
<section
  id="container"
  className="mt-10 flex h-20 w-full items-center justify-between gap-2 bg-slate-900 px-3 sm:mt-14 sm:h-28 sm:gap-4 sm:px-8 lg:mt-16 lg:h-40 lg:px-20"
>
  {/* Fixed-size slot: the image is centered inside it and can extend past the box */}
  <div id="image-left" className="relative h-full w-24 shrink-0 sm:w-36 lg:w-[200px]">
    <Image
      src={DecalIconBuzzBass}
      width={200}
      height={200}
      sizes="(min-width: 1024px) 200px, (min-width: 640px) 144px, 96px"
      className="absolute left-0 top-1/2 h-auto w-full -translate-y-1/2 drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]"
      alt="Decal Punk Icon"
    />
  </div>

  <h3
    id="header"
    className={`${protestFont.className} min-w-0 flex-1 text-center text-4xl leading-tight text-slate-200 sm:text-4xl lg:text-8xl`}
  >
    Stay True!
  </h3>

<div id="image-right" className="shrink-0">
  <Image
    src={DecalLogoRecord}
    width={150}
    height={150}
    sizes="(min-width: 1024px) 150px, (min-width: 640px) 84px, 80px"
    className="h-auto w-20 sm:w-[84px] lg:w-[150px]"
    alt="Decal Punk Logo"
  />
</div>
</section>
  )
}