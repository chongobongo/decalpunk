// Labels Index - Decal Punk
// app\(public)\labels\page.tsx

import { labelProductIndex } from "@/app/data/label-data"
import { LabelHeader } from "@/features/labels/components/LabelHeader"
import { LabelCard } from "@/features/labels/components/LabelCard"

export default function StickersPage() {

    return (
<main className="min-h-screen bg-slate-400">
    <div id="seperator-bar" className="w-full h-10 bg-slate-400"></div>
    <LabelHeader headline="Custom Labels!" />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6 place-items-center bg-slate-400">
        {labelProductIndex.map((item) => (
            <LabelCard key={item.id} label={item} />
        ))}
    </div>
</main>
    )
}