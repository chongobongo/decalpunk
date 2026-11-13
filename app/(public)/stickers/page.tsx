// Stickers Index - Decal Punk
// app\(public)\stickers\page.tsx

import { stickerProductIndex } from "@/app/data"
import { StickerHeader } from "@/features/stickers/components/Header"
import { StickerCard } from "@/features/stickers/components/StickerCard"

export default function StickersPage() {

    return (
<main className="min-h-screen bg-slate-400">
    <div id="seperator-bar" className="w-full h-10 bg-slate-400"></div>
    <StickerHeader headline="Custom Stickers" />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6 place-items-center bg-slate-400">
        {stickerProductIndex.map((item) => (
            <StickerCard key={item.id} sticker={item} />
        ))}
    </div>
</main>
    )
}