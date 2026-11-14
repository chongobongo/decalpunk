// Materials Detail Page / Admin

import { Protest_Strike } from "next/font/google"

const protestFont = Protest_Strike({
  subsets: ["latin"],
  weight: "400",
})

export default function MaterialsPageAdmin() {
  return (
      <main className="h-screen relative flex min-h-0 flex-1 flex-col bg-stone-100">
        <h3 id="header" className={`${protestFont.className} mt-60 text-4xl text-center hidden lg:block`}>
            Materials Metrics / Admin</h3>
            <p className="text-center mt-5">To keep track of media / metrics.</p>
            <ul className="text-center">
              <li>Total in stock for media, paper, etc</li>
            </ul>
      </main>
  );
}