import Image from "next/image"
import Link from "next/link"

export const BrandTestimonials = ({
    testimonial,
}: {
    testimonial: {
        id: string
        image: string
        stars: string
        description: string
        label: string
        url: string
    }
}) => {

    return (
<section className="flex justify-center items-center px-4 w-full">
    <Link href="/">
        <div id="card-container" className="w-full max-w-xs sm:w-60 grid grid-cols-1 text-center bg-white p-3">
            <div id="image" className="flex justify-center items-center p-2">
                <Image
                    src={testimonial.image}
                    width={80}
                    height={80}
                    alt="Splash-Image"
                    className="rounded-full object-cover"
                />
            </div>
            <div id="stars" className="text-base sm:text-xl px-2 py-1">
                {testimonial.description}
            </div>
            <div id="paragraph" className="text-sm sm:text-base px-2 py-1 text-gray-700">
                {testimonial.label}
            </div>
            <div id="url" className="text-xs sm:text-sm px-2 py-1 text-blue-500 truncate">
                {testimonial.url}
            </div>
        </div>
    </Link>
</section>
    )
}