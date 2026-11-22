// Sticker Order Button List / Puclic - Component
// features\stickers\components\StickerOrderButtonList.tsx

import { Button } from "@/components/ui/button"
import Link from "next/link"


export const StickerOrderButtonList = () => {

    return (
<section className="flex h-full min-h-0 bg-slate-200">
  <ul className="flex w-full flex-row gap-2 overflow-x-auto border-b-2 border-slate-900 p-3 lg:h-full lg:w-auto lg:shrink-0 lg:flex-col lg:gap-4 lg:overflow-y-auto lg:overflow-x-visible lg:border-b-0 lg:border-l-2 lg:p-5 [&>*]:shrink-0">
                    <Button asChild className="bg-slate-900">
                  <Link href="/admin/materials/catagories/all">
                    <h3 className="text-white text-xl font-bold">
                        Sticker Packs
                    </h3></Link>
                </Button>
                <Button asChild className="bg-slate-900">
                  <Link href="/admin/materials/catagories/adback-vinyl">
                    <h3 className="text-white text-xl font-bold">
                        Custom Stickers
                    </h3></Link>
                </Button>
                <Button asChild className="bg-slate-900">
                  <Link href="/">
                    <h3 className="text-white text-xl font-bold">
                        Die-Cut
                    </h3></Link>
                </Button>
                <Button asChild className="bg-slate-900">
                  <Link href="/">
                    <h3 className="text-white text-xl font-bold">
                        D.T.F.
                    </h3></Link>
                </Button>
                <Button asChild className="bg-slate-900">
                  <Link href="/">
                    <h3 className="text-white text-xl font-bold">
                        Epoxy Dome
                    </h3></Link>
                </Button>
  </ul>
</section>
    )
}