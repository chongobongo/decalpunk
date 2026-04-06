"use client"
import { useRef, useState } from "react"
import * as Slider from "@radix-ui/react-slider"
import { MaterialCardCustomSticker } from "./MaterialCard"

type Material = {
    id: string
    material: string
    img: string
    finishes: { id: string; finish: string }[]
    price: number
}

export function MaterialCardSlider({
    materials,
    value,
    onChange,
}: {
    materials: Material[]
    value: string
    onChange: (id: string) => void
}) {
    const scrollRef = useRef<HTMLDivElement>(null)
    const [sliderValue, setSliderValue] = useState([0])

    function handleSliderChange(val: number[]) {
        setSliderValue(val)
        if (scrollRef.current && val[0] !== undefined) {
            const maxScroll = scrollRef.current.scrollWidth - scrollRef.current.clientWidth
            scrollRef.current.scrollLeft = (val[0] / 100) * maxScroll
        }
    }

    return (
        <div className="flex flex-col gap-3 w-[740px]">
            {/* Outer clip — exactly 4 cards wide */}
            <div className="overflow-x-hidden w-full">
                {/* Inner scrollable row */}
                <div
                    ref={scrollRef}
                    className="flex flex-row gap-3 overflow-x-hidden scroll-smooth"
                >
                    {materials.map((item) => (
                        <div key={item.id} className="min-w-[176px]">
                            <MaterialCardCustomSticker
                                material={{ id: item.id, header: item.material, image: item.img, price: item.price }}
                                onClick={() => onChange(item.id)}
                                selected={value === item.id}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Radix Slider */}
            {materials.length > 0 && (
                <Slider.Root
                    value={sliderValue}
                    onValueChange={handleSliderChange}
                    min={0}
                    max={100}
                    step={1}
                    className="relative flex items-center w-full h-5"
                >
                    <Slider.Track className="relative bg-gray-200 rounded-full h-1 w-full">
                        <Slider.Range className="absolute bg-amber-500 rounded-full h-full" />
                    </Slider.Track>
                    <Slider.Thumb
                        className="block w-4 h-4 bg-amber-500 rounded-full shadow hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-400"
                        aria-label="Material scroll"
                    />
                </Slider.Root>
            )}
        </div>
    )
}