// Media catagories - All Materials - Page
// app\(protected)\admin\materials\@form\adback-vinyl\page.tsx

import { Protest_Strike } from "next/font/google"

const protestFont = Protest_Strike({
  subsets: ["latin"],
  weight: "400",
})

export default function AllMaterialsCatagories() {
  return (
      <main className="h-screen relative flex min-h-0 flex-1 flex-col bg-stone-100">
        <h3 id="header" className={`${protestFont.className} mt-60 text-4xl text-center hidden lg:block`}>
            All Materials Catagories / Admin</h3>
            <p className="text-center mt-5">Index for all materials.</p>
            <ul className="text-center">
              <li>Total in stock for individual material</li>
              <li>Any costs associated to material sq. ft. / roll price, etc.</li>
            </ul>
      </main>
  );
}