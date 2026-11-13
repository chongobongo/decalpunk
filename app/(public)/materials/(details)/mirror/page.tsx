// Materials Detail Page

import { Protest_Strike } from "next/font/google"

const protestFont = Protest_Strike({
  subsets: ["latin"],
  weight: "400",
})

export default function MaterialsDetalPage() {
  return (
      <main className="h-screen relative flex min-h-0 flex-1 flex-col bg-stone-100">
        <h3 id="header" className={`${protestFont.className} mt-60 text-4xl text-center hidden lg:block`}>
            Mirror</h3>
        <h2 className={`text-center pt-4`}>Materials Detail Page</h2>
      </main>
  );
}