// Item Processing Form

import { Protest_Strike } from "next/font/google"
import { Button } from "@/components/ui/button";
import Link from "next/link"

const protestFont = Protest_Strike({
  subsets: ["latin"],
  weight: "400",
})

export default function ItemProcessingForm() {
  return (
      <main className="h-screen relative flex min-h-0 flex-1 flex-col bg-stone-100">
        <h3 id="header" className={`${protestFont.className} mt-60 text-4xl text-center hidden lg:block`}>
            Item Processing Form</h3>
        <h2 className={`text-center pt-4`}>To create an open job item and send to R.I.P</h2>
                <Button asChild variant="outline" type="button">
                    <Link href={`./close`}>Send to close</Link>
                </Button>
      </main>
  );
}