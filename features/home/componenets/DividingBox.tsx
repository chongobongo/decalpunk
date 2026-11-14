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
<section id="container" className="mt-10 flex h-40 w-full items-center justify-between bg-slate-900 px-20">
    <div id="image-left" className="shrink-0">
        <Image
            src={DecalIconBuzzBass}
            width={200}
            height={200}
            alt="Decal Punk Icon"
        />
    </div>

    <h3 id="header" className={`${protestFont.className} flex-1 text-center text-6xl text-slate-200`}>
        Stay True!
    </h3>

    <div id="image-right" className="shrink-0">
        <Image
            src={DecalLogoRecord}
            width={150}
            height={150}
            alt="Decal Punk Logo"
        />
    </div>
</section>
    )
}



