import { Protest_Strike } from "next/font/google"
import { MaterialButtonList } from "@/features/admin/materials/components/MaterialButtonList"

const protestFont = Protest_Strike({
  subsets: ["latin"],
  weight: "400",
})


export default function MarterialsListAdmin () {

    return (
      <main className="h-screen relative flex min-h-0 flex-1 flex-col bg-stone-100">
        <MaterialButtonList />
      </main>
    )
}
