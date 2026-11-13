

import { getGlobalTag, getIdTag } from "@/lib/dataCache";
import { revalidateTag } from "next/cache"

export function getJobOrderListTag() {
    return getGlobalTag("job-order-list")
}

export function getJobOrderListIdTag(id: string) {
    return getIdTag("job-order-list", id)
}

export function revalidateJobOrderListCache(id: string) {
    revalidateTag(getJobOrderListTag())
    revalidateTag(getJobOrderListIdTag(id))
}