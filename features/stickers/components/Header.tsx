import Link from "next/link"


export const StickerHeader = ({
    headline,
}: {
    headline: string
}) => {

    return (

        <section>
            <Link href="/">
                <div id="stickerHeader" className={`w-screen bg-amber-300`}>
                    {headline}
                </div>
            </Link>
        </section>
    )
}