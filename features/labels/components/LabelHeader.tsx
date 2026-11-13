// Label Header - Label Index
// features\labels\components\label-header.tsx

import Link from "next/link"
import DecalIconCrash from "@/app/images/icons/decal-icon-crash-drummer.png"
import Image from "next/image"
import { Protest_Strike } from "next/font/google"

const protestFont = Protest_Strike({
     subsets: ["latin"],
     weight: "400",
})


export const LabelHeader = ({
    headline,
}: {
    headline: string
}) => {

    return (             
<section id="container" className="relative flex h-40 w-full items-center justify-center bg-slate-900">
    <h3 id="header" className={`${protestFont.className} text-6xl text-slate-200 text-center`}>
       {headline}
    </h3>
    <div id="image" className="absolute right-20">
        <Image
            src={DecalIconCrash}
            width={200}
            height={200}
            alt="Decal Punk Icon"
        />
    </div>
</section>

    )
}