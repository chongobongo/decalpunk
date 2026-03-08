
import { StickerHeader } from "@/features/stickers/components/Header"
import { StickerCard } from "@/features/stickers/components/StickerCard"

const stickerCardData = [
    {
      id: "0",
      link: "custom-stickers",
      header: "Custom Stickers",
      description: "Best Seller"
    }
]

export default function StickersPage() {

    return (
        <main className="min-h-screen bg-gray-100">
            <StickerHeader headline="Custom Stickers Made Here!" />
            {stickerCardData.map((item) => {
                return (
                    <div key={item.id}>
                        <StickerCard sticker={item} />
                    </div>
                )
            })}
        </main>
    )
}