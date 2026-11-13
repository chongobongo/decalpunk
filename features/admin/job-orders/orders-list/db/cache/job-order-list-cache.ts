// Data Cache

import { getGlobalTag, getIdTag } from "@/lib/dataCache";
import { revalidateTag, updateTag } from "next/cache"

export function getJobOrderListTag() {
    return getGlobalTag("job-order-list")
}

export function getJobOrderListIdTag(id: string) {
    return getIdTag("job-order-list", id)
}

export function revalidateJobOrderListCache(id: string) {
    revalidateTag(getJobOrderListTag(), "max")
    revalidateTag(getJobOrderListIdTag(id), "max")
}

export function updateJobOrderListCache(id: string) {
    updateTag(getJobOrderListTag())
    updateTag(getJobOrderListIdTag(id))
}