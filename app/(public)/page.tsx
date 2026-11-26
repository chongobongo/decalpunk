// Home Page - Decal Punk
// app\(public)\page.tsx

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
          <div className="flex flex-col min-h-screen">

            {/* Tour section - don't use h-screen, let it be flexible */}
            <div id="construction-field" className='flex-1 flex flex-col items-center justify-center text-center bg-black'>
              <Link href="./tour">
                <div className={`text-4xl text-white ${protestFont.className}`}>We're under construction</div>
                <div className={`text-4xl text-white ${protestFont.className}`}>Excited to present to you the best decal and sticker site there is!</div>
                <div className={`text-4xl text-white ${protestFont.className}`}>Take a tour while we work?</div>
              </Link>
            </div>

            {/* Sign-in link - pinned at the bottom */}
            <div className="bg-black flex justify-center items-center py-6">
              <Link
                href="/sign-in"
                className="px-6 py-3 bg-white text-black rounded-lg text-xl hover:bg-gray-300 transition"
              >
                Sign In
              </Link>
            </div>

          </div>
        )}
      </main>
  );
}