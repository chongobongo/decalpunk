// Stickers Index - Decal Punk
// app\(public)\stickers\page.tsx

import { stickerProductIndex } from "@/app/data"
import { StickerHeader } from "@/features/stickers/components/Header"
import { StickerCard } from "@/features/stickers/components/StickerCard"

export default function StickersPage() {

    return (
<main className="min-h-screen bg-slate-400">
  <div id="seperator-bar" className="h-6 w-full bg-slate-400 sm:h-10"></div>
  <StickerHeader headline="Custom Stickers" />
  <div className="mx-auto grid w-full max-w-7xl grid-cols-2 place-items-center gap-3 bg-slate-400 p-3 sm:gap-6 sm:p-6 lg:grid-cols-3">
    {stickerProductIndex.map((item) => (
      <StickerCard key={item.id} sticker={item} />
    ))}
  </div>
</main>
    )
}