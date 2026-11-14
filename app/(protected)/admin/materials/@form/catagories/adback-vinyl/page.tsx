// Media catagories - Adhesive Backed Vinyl - Page
// app\(protected)\admin\materials\@form\adback-vinyl\page.tsx

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Protest_Strike } from "next/font/google"

const protestFont = Protest_Strike({
  subsets: ["latin"],
  weight: "400",
})

export default function AdBackCatagories() {
  return (
      <main className="h-screen relative flex min-h-0 flex-1 flex-col bg-stone-100">
        <h3 id="header" className={`${protestFont.className} mt-60 text-4xl text-center hidden lg:block`}>
            Adhesive Backed Index / Admin</h3>
            <p className="text-center mt-5">All adehisive backed vinyl.</p>
                <ul className="text-center">
              <li>Total in stock for individual material</li>
              <li>Any costs associated to material sq. ft. / roll price, etc.</li>
                <Button asChild className="bg-slate-900 mt-5">
                  <Link href="/admin/materials/details/adback">
                    <h3 className="text-white text-xl font-bold">
                        Ad Backed Details
                    </h3></Link>
                </Button>
            </ul>
      </main>
  );
}