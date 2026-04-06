import Link from "next/link"


export const StickerHeader = ({
    headline,
}: {
    headline: string
}) => {

    return (

        <section className="w-screen h-60 bg-amber-200 flex items-center justify-center">
                <div>
                    {headline}
                </div>
        </section>
    )
}