import Link from "next/link"
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
<section id="container" className="relative flex h-40 w-full items-center justify-center bg-slate-900">
    <h3 id="header" className={`${protestFont.className} text-6xl text-slate-200 text-center`}>
       {headline}
    </h3>
    <div id="image" className="absolute right-20">
        <Image
            src={DecalIconRazor}
            width={200}
            height={200}
            alt="Decal Punk Icon"
        />
    </div>
</section>

    )
}