// Home Page - Decal Punk
// app\(public)\page.tsx

import Image from "next/image";
import Link from "next/link";
import { Protest_Strike } from "next/font/google"

import { materialHomePageData } from "@/app/data"
import { testimonialData } from "@/app/data"

import { getCurrentUser } from "@/services/clerk"

import { Splash } from "@/features/home/componenets/Splash";
import { MaterialCard } from "@/features/home/componenets/MaterialCard";
import { DividingBox } from "@/features/home/componenets/DividingBox";
import { BrandTestimonials } from "@/features/home/componenets/BrandTestimonials";
import { Footer } from "@/features/home/componenets/Footer";
import DecalLogoRecord from "@/app/images/icons/decal-logo-record.png"

const protestFont = Protest_Strike({
     subsets: ["latin"],
     weight: "400",
})

export default async function Home() {
  const { clerkUserId } = await getCurrentUser()

  return (

      <main className="grid grid-cols-1 bg-slate-200">
        {clerkUserId ? (
          <>
            <Splash
                headlineCustom="Print Your Own Stickers and Labels!"
                headlineGallery="Select From Our Gallery of Junk!"
                buttonTextCustom="Custom sticker"
                buttonTextGallery="Gallery"/>

    {/* Materials Section */}
            <div id="materialSelection" className="mt-6 mr-auto ml-auto">
                <div id="materialDescription">
                  <p className={`text-center text-4xl ${protestFont.className}`}>
                      Select Sticker Material 
                  </p>
                  <p className="text-center">
                    Our materials have been hand chosen by our team to ensure the highest quality, here are some favorites.
                  </p>
                </div>
                <div id="materialCard" className="p-6 gap-6 grid grid-cols-2 md:grid-cols-4">
                  {materialHomePageData.map((item) => {
                    return <div key={item.id}>
                              <MaterialCard material={item} />
                            </div>
                          })}
                </div>
                <div id="customLink" className="w-60 h-10 mr-auto ml-auto mt-6 grid items-center justify-items-center rounded-lg bg-black">
                    <Link href="./materials" className={`text-2xl text-white ${protestFont.className}`}>
                        See all materials
                    </Link>
                </div>
            </div>

            <DividingBox />
{/* Testimonials Section */}
<div id="testimonials" className="mx-auto mt-6 w-full max-w-7xl px-4 text-center">
  <label className={`text-4xl ${protestFont.className}`}>Brand Testimonials</label>
<div className="flex flex-wrap justify-center gap-6 py-6">
  {testimonialData.map((item) => (
    <BrandTestimonials key={item.id} testimonial={item} />
  ))}
</div>
</div>

            <div id="footer" className="mt-6">
              <Footer />
            </div>
          </>
        ) : (
          <div className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-black px-4 py-10 text-center">
            <Image
              src={DecalLogoRecord}
              alt="Decal Punk logo"
              sizes="(min-width: 1024px) 224px, (min-width: 640px) 176px, 128px"
              className="h-auto w-32 sm:w-44 lg:w-56"
              priority
            />

            <h1 className={`${protestFont.className} text-4xl text-white sm:text-5xl lg:text-6xl`}>
              We&apos;re under construction
            </h1>

            <p className={`${protestFont.className} max-w-2xl text-xl text-amber-300 sm:text-2xl lg:text-3xl`}>
              Excited to present to you the best decal and sticker site there is!
            </p>

            <div className="mt-2 flex w-full max-w-xs flex-col gap-3 sm:max-w-md sm:flex-row sm:justify-center">
              <Link
                href="/tour"
                className={`${protestFont.className} flex h-12 flex-1 items-center justify-center rounded-lg bg-pink-700 px-6 text-xl text-white transition-colors hover:bg-pink-600`}
              >
                Take a tour
              </Link>
              <Link
                href="/sign-in"
                className={`${protestFont.className} flex h-12 flex-1 items-center justify-center rounded-lg bg-amber-300 px-6 text-xl text-black transition-colors hover:bg-amber-200`}
              >
                Sign In
              </Link>
            </div>
          </div>
        )}
      </main>
  );
}