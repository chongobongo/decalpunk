import { Button } from "@/components/ui/button"
import Link from "next/link"

export const MaterialSelectButton = ({
    params,
}: {
    params: {
        id: string
    }
}) => {

    const id = params

    return (
        <Link href={`/`}>
            <Button>
                 <h3>Select</h3>
                 {params.id}
            </Button>
        </Link>
    )
}