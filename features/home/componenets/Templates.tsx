
import templateGangUp from "@/features/home/images/template-gangup.webp"
import Image from "next/image"
import Link from "next/link"

export const TemplateBanner = () => {

    return (
<section className="flex min-h-screen w-screen items-center justify-center bg-gray-800 px-6 py-12 md:h-96 md:min-h-0 md:py-0">
  <div className="flex flex-col items-center gap-8 md:flex-row md:gap-0 md:mr-20 md:ml-20">
    
    <div className="text-center md:mr-20">
      <header className="font-protest text-2xl text-orange-400 sm:text-3xl md:text-4xl">
        Templates / Clip Art
      </header>
      <p className="mt-2 text-sm text-white sm:text-base">
        Easily build your image with a tool-box full of head starts.
      </p>
      <div id="link_text" className="mt-4 inline-block bg-green-400 px-4 py-2">
        <Link href="/">
          <label className="font-protest cursor-pointer text-black text-sm sm:text-base">
            Templates /
          </label>
        </Link>
      </div>
    </div>

    <div id="image" className="flex justify-center">
      <Image
        src={templateGangUp}
        width={300}
        height={300}
        alt="template_image"
        className="w-48 h-48 object-contain sm:w-56 sm:h-56 md:w-72 md:h-72 lg:w-[300px] lg:h-[300px]"
      />
    </div>

  </div>
</section>
    )
}