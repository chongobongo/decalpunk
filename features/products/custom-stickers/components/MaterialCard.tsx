import Image from "next/image"
import { Protest_Strike } from "next/font/google"

const protestFont = Protest_Strike({
    subsets: ["latin"],
    weight: "400",
})

export function MaterialCardCustomSticker({
    material,
    onClick,
    selected,
}: {
    material: {
        id: string
        header: string
        image: string
        price: number
    }
    onClick?: () => void
    selected?: boolean
}) {
    return (
        <div
            id="card-container"
            onClick={onClick}
className={`h-[140px] w-40 p-1 flex flex-col items-center justify-center text-center rounded-lg shadow-lg bg-white cursor-pointer border-2 transition-colors
    ${selected ? "border-amber-500" : "border-transparent"}`}        >
            <div id="image" className="flex items-center justify-center">
                <Image
                    src={material.image}
                    width={120}
                    height={120}
                    alt="material_image"
                />
            </div>
            <div id="headline" className={`text-xl ${protestFont.className}`}>
                {material.header}
            </div>
            <div id="price" className="text-sm font-semibold text-amber-500">
                ${material.price.toFixed(2)}
            </div>
        </div>
    )
}