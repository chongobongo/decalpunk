// Splash - Home Page - Component

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

import splash from "@/app/images/icons/decal-icon-cat.png"

import { Protest_Strike } from "next/font/google"

const protestFont = Protest_Strike({
     subsets: ["latin"],
     weight: "400",
})

export const Splash = ({
    headline,
    paragraph,
    button_text,
}: {
    headline: string
    paragraph: string
    button_text: string
}) => {

    return (
        <section id="splash_container" className="h-screen grid grid-cols-1 md:grid-cols-2 bg-slate-900">
            <div id="contents" className="w-96 mr-auto ml-auto order-2 md:order-1">
                <header id="headline" className={`${protestFont.className} text-4xl text-amber-300 mt-20 text-center`}>
                        {headline}
                    </header> 
            <div id="paragraph" className="mt-4 text-white text-center">
                <p>
                    {paragraph}
                </p>
            </div>
            <div id="link_container" className="grid grid-cols-1">
                <div id="custom_link" className="w-60 h-10 mr-auto ml-auto mt-6 grid items-center justify-items-center rounded-lg bg-amber-300">
                    <Link href="/stickers/sticker-order">
                        <label className={`${protestFont.className} text-2xl text-black`}>{button_text}</label>
                    </Link>
                </div>
            </div>
            </div>
            <div id="image" className="mt-5 order-1 md:order-2">
                    <Image
                        src={splash}
                        width={500} height={200}
                        alt="Splash-Image"
                    />
            </div>
        </section>
    )
}