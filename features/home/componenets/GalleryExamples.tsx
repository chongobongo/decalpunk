import Image from "next/image"
import galleryGangUp from "@/features/home/images/gallery-gangup.webp"
import Link from "next/link"

export const GalleryExample = () => {

    return (
<section className="flex min-h-screen w-screen items-center justify-center bg-gray-800 px-6 py-12 md:min-h-96 md:py-0">
    <div className="flex flex-col items-center gap-8 md:flex-row md:gap-0 md:mr-20 md:ml-20">
        
        <div id="image" className="flex justify-center">
            <Image
                src={galleryGangUp}
                width={400}
                height={400}
                className="w-64 h-64 object-cover md:w-[400px] md:h-[400px]"
                alt='gallery_image'
            />
        </div>

        <div className="text-center md:ml-20">
            <header className="font-protest text-2xl text-green-400 md:text-4xl">
                No A.I. Gallery of Art
            </header>
            <p className="mt-2 text-white text-sm md:text-base">
                A showcase of art by some of our favorites.
            </p>
            <p className="text-white text-sm md:text-base">
                Profile your work so somebody can buy it!
            </p>
            <div id="link_text" className="mt-4 bg-green-400 px-4 py-2 rounded">
                <Link href="/">
                    <label className="font-protest block cursor-pointer text-black text-sm md:text-base">
                        Gallery Art
                    </label>
                </Link>
            </div>
        </div>

    </div>
</section>
    )
}