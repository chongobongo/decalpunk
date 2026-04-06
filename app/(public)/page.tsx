// Home Page - Decal Punk
// app\(public)\page.tsx

'use client'

import Link from "next/link";
import { Protest_Strike } from "next/font/google"
import { Show, SignInButton } from "@clerk/nextjs";

import { materialHomePageData } from "@/app/data"
import { testimonialData } from "@/app/data"

import { Splash } from "@/features/home/componenets/Splash";
import { GalleryExample } from "@/features/home/componenets/GalleryExamples";
import { TemplateBanner } from "@/features/home/componenets/Templates";
import { MaterialCard } from "@/features/home/componenets/MaterialCard";
import { BrandTestimonials } from "@/features/home/componenets/BrandTestimonials";
import { Footer } from "@/features/home/componenets/Footer";

const protestFont = Protest_Strike({
     subsets: ["latin"],
     weight: "400",
})

export default function Home() {

  return (

      <main className="grid grid-cols-1 bg-slate-200">
        <Show when="signed-in">
                   <Splash headline="Print Custom Stickers and Labels!"
              paragraph="Make your own custom stickers and labels. Express delivery as fast as 2-4 business days. Get an instant proof and free shipping!"
              button_text="Make a custom sticker"
              link_text="All sticker products."/>

          <div>
            <GalleryExample />
          </div>

          <div className="mt-2">
            <TemplateBanner />
          </div>

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
                    <Link href="/" className={`text-2xl text-white ${protestFont.className}`}>
                        See all materials
                    </Link>
                </div>
      </div>

      <div id="testimonials" className="mt-6 mr-auto ml-auto text-center">
        <label className={`text-4xl ${protestFont.className}`}>Brand Testimonials</label>
        <div className="p-6 gap-6 grid grid-cols-2 md:grid-cols-4">
            {testimonialData.map((item) => {
              return <div key={item.id}>
                        <BrandTestimonials testimonial={item} />
                      </div>
                  })}
        </div>
      </div>

      <div id="footer" className="mt-6">
        <Footer />
      </div>
        </Show>
<Show when="signed-out">
  <div className="flex flex-col min-h-screen">
    
    {/* Tour section - don't use h-screen, let it be flexible */}
    <div id="construction-field" className='flex-1 flex flex-col items-center justify-center text-center bg-black'>
      <Link href="./tour">
        <div className={`text-4xl text-white ${protestFont.className}`}>We're under construction</div>
        <div className={`text-4xl text-white ${protestFont.className}`}>Excited to present to you the best decal and sticker site there is!</div>
        <div className={`text-4xl text-white ${protestFont.className}`}>Take a tour while we work?</div>
      </Link>
    </div>

    {/* Sign-in button - pinned at the bottom */}
    <div className="bg-black flex justify-center items-center py-6">
      <SignInButton mode="modal">
        <button className="px-6 py-3 bg-white text-black rounded-lg text-xl hover:bg-gray-800 transition">
          Sign In
        </button>
      </SignInButton>
    </div>

  </div>
</Show>
</main> 


  );
}
