// Sticker Order Button List / Component
// features\stickers\components\StickerOrderButtonList.tsx

import { Button } from "@/components/ui/button"
import Link from "next/link"


export const StickerOrderButtonList = () => {

    return (
        <section className="flex h-full min-h-0 flex-row bg-slate-200">
            <ul className=" flex h-full shrink-0 flex-col gap-4 overflow-y-auto border-l-2 border-slate-900 p-5 [&>*]:shrink-0">
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