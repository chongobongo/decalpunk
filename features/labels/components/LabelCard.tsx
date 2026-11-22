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
    <section className="w-full">
      <Link
        href={`/`}
        className="block"
      >
        <div
          id="card-container"
          className="mx-auto mt-2 grid h-full w-full max-w-44 grid-cols-1 content-start rounded-lg border-4 border-black bg-white p-2 text-center shadow-lg sm:mt-8 sm:min-h-44"
        >
          <div id="headline" className={`text-lg sm:text-xl ${protestFont.className}`}>
            {label.header}
          </div>
          <div id="paragraph" className="text-sm sm:text-base">
            {label.description}
          </div>
        </div>
      </Link>
    </section>
    )
}