import Link from "next/link"
import { Protest_Strike } from "next/font/google"

const protestFont = Protest_Strike({
     subsets: ["latin"],
     weight: "400",
})



export const LabelCard = ({
    label,
}: {
    label: {
        id: string
        link: string
        header: string
        description: string
    },

}) => {

    return (
        <section>
            <Link href="/">
                    <div id="card-container" className="mt-8 h-44 w-44 p-2 grid grid-cols-1 text-center rounded-lg shadow-lg border-4 border-black bg-white">
                        <div id="headline" className={`text-xl ${protestFont.className}`}>
                            {label.header}
                        </div>
                        <div id="paragraph">
                            {label.description}
                        </div>
                    </div>
            </Link>
        </section>
    )
}