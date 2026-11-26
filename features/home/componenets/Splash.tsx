// Splash - Home Page - Component

import Image from "next/image"
import Link from "next/link"

import splash from "@/app/images/icons/decal-icon-cat.png"

import { Protest_Strike } from "next/font/google"

const protestFont = Protest_Strike({
     subsets: ["latin"],
     weight: "400",
})

export const Splash = ({
    headlineCustom,
    headlineGallery,
    buttonTextCustom,
    buttonTextGallery
}: {
    headlineCustom: string
    headlineGallery: string
    buttonTextCustom: string
    buttonTextGallery: string
}) => {

    return (
        <section
            id="splash_container"
            className="grid min-h-dvh grid-cols-1 gap-6 bg-slate-900 py-6 md:grid-cols-2 md:gap-0 md:py-0"
        >
            <div
                id="contents"
                className="order-2 mx-auto w-full max-w-sm px-4 md:order-1 md:w-96 md:max-w-none md:px-0"
            >
                <header
                    id="headline-1"
                    className={`${protestFont.className} mt-4 text-center text-3xl text-pink-700 sm:text-4xl md:mt-20`}
                >
                    {headlineCustom}
                </header>

                <div id="link_container-1" className="grid grid-cols-1">
                    <div
                        id="custom_link-1"
                        className="mx-auto mt-6 h-10 w-60 max-w-full rounded-lg bg-pink-700 transition-colors hover:bg-pink-600"
                    >
                        <Link
                            href="/stickers/sticker-order"
                            className="flex h-full w-full items-center justify-center"
                        >
                            <span className={`${protestFont.className} text-2xl text-white`}>
                                {buttonTextCustom}
                            </span>
                        </Link>
                    </div>
                </div>

                <div id="or-divider" className="mx-auto mt-8 flex w-60 max-w-full items-center gap-3">
                    <span className="h-px flex-1 bg-amber-500" />
                    <span className={`${protestFont.className} text-3xl text-amber-500 sm:text-4xl`}>or</span>
                    <span className="h-px flex-1 bg-amber-500" />
                </div>

                <div id="link_container-2" className="grid grid-cols-1">
                    <header
                        id="headline-2"
                        className={`${protestFont.className} mt-6 text-center text-3xl text-amber-300 sm:text-4xl`}
                    >
                        {headlineGallery}
                    </header>
                    <div
                        id="custom_link-2"
                        className="mx-auto mt-6 h-10 w-60 max-w-full rounded-lg bg-amber-300 transition-colors hover:bg-amber-200"
                    >
                        <Link
                            href="/gallery"
                            className="flex h-full w-full items-center justify-center"
                        >
                            <span className={`${protestFont.className} text-2xl text-black`}>
                                {buttonTextGallery}
                            </span>
                        </Link>
                    </div>
                </div>
            </div>

<div id="image" className="order-1 mt-5 flex items-center justify-center px-4 md:order-2 md:items-start md:px-0 md:pt-10">
<Link href="/bios/cat">
    <Image
        src={splash}
        width={500}
        height={200}
        sizes="(min-width: 768px) 500px, 320px"
        className="h-auto w-full max-w-xs md:w-[500px] md:max-w-full"
        alt="Splash-Image"
        priority
    />
</Link>
</div>
        </section>
    )
}