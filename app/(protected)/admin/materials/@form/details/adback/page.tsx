// Adhesive Backed Media Details - Page
// app/(protected)/admin/materials/@form/details/adback/page.tsx

import { Protest_Strike } from "next/font/google"

const protestFont = Protest_Strike({
  subsets: ["latin"],
  weight: "400",
})

export default function AdhesiveBackedMaterialDetails() {
  return (
      <main className="h-screen relative flex min-h-0 flex-1 flex-col bg-stone-100">
        <h3 id="header" className={`${protestFont.className} mt-60 text-4xl text-center hidden lg:block`}>
            Adhesive Backed Media Details / Admin</h3>
            <p className="text-center mt-5">Details for selected media.</p>
            <ul className="text-center">
              <li>Add or change adback media.</li>
            </ul>
      </main>
  );
}