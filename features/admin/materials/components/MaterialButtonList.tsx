// Material Button List / Component
// features\admin\materials\components\MaterialButtonList.tsx

import { Button } from "@/components/ui/button"
import Link from "next/link"


export const MaterialButtonList = () => {

    return (
        <section className="flex h-full min-h-0 flex-row bg-slate-200">
            <ul className=" flex h-full shrink-0 flex-col gap-4 overflow-y-auto border-r-2 border-slate-900 p-5 [&>*]:shrink-0">
                <Button asChild className="bg-slate-900">
                  <Link href="/admin/materials/catagories/all">
                    <h3 className="text-white text-xl font-bold">
                        All Materials
                    </h3></Link>
                </Button>
                <Button asChild className="bg-slate-900">
                  <Link href="/admin/materials/catagories/adback-vinyl">
                    <h3 className="text-white text-xl font-bold">
                        AdBack Vinyl
                    </h3></Link>
                </Button>
                <Button asChild className="bg-slate-900">
                  <Link href="/">
                    <h3 className="text-white text-xl font-bold">
                        Aluminum
                    </h3></Link>
                </Button>
                <Button asChild className="bg-slate-900">
                  <Link href="/">
                    <h3 className="text-white text-xl font-bold">
                        Glow in Dark
                    </h3></Link>
                </Button>
                <Button asChild className="bg-slate-900">
                  <Link href="/">
                    <h3 className="text-white text-xl font-bold">
                        Glitter
                    </h3></Link>
                </Button>
            </ul>
        </section>
    )
}