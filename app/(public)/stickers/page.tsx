// Stickers Index - Decal Punk
// app\(public)\stickers\page.tsx

import { stickerProductIndex } from "@/app/data"
import { StickerHeader } from "@/features/stickers/components/Header"
import { StickerCard } from "@/features/stickers/components/StickerCard"

export default function StickersPage() {

    return (
<main className="min-h-screen bg-gray-100">
    <StickerHeader headline="Custom Stickers Header" />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6 place-items-center">
        {stickerProductIndex.map((item) => (
            <StickerCard key={item.id} sticker={item} />
        ))}
    </div>
</main>
    )
}