// features/admin/job-orders/processing/actions/start-processing.ts
"use server"

import { eq } from "drizzle-orm"
import { redirect } from "next/navigation"
import { db } from "@/db"
import { CustomStickersTable, JobOrdersTable, JobOrderProcessingTable } from "@/db/schemaDB"
import { getCurrentUser } from "@/services/clerk"
import { updateJobOrderListCache } from "@/features/admin/job-orders/orders-list/db/cache/job-order-list-cache"

function parseSize(label: string | null) {
    const m = label?.match(/(\d+(?:\.\d+)?)\s*x\s*(\d+(?:\.\d+)?)/i)
    return m ? { w: Number(m[1]), h: Number(m[2]) } : null
}

export async function startProcessingAction(itemId: string) {
const user = await getCurrentUser()
if (user.userId == null || user.role !== "admin") {
    return { error: true as const, message: "Only an admin can start processing." }
}

    const item = await db.query.CustomStickersTable.findFirst({
        where: eq(CustomStickersTable.id, itemId),
        with: { jobOrder: { columns: { id: true, list_id: true } } },
    })
    if (!item || !item.img || !item.jobOrder) {
        return { error: true as const, message: "Item or artwork not found." }
    }

    const size = parseSize(item.size)
    const meta = item.image_metadata
    const dpi =
        size && meta?.width && meta?.height
            ? Math.floor(Math.min(meta.width / size.w, meta.height / size.h))
            : null

    await db.transaction(async (tx) => {
        await tx
            .insert(JobOrderProcessingTable)
            .values({
                job_order_id: item.job_order_id,
                custom_sticker_id: item.id,
                product: item.product,
                shape: item.shape,
                material: item.material,
                finish: item.finish,
                size_label: item.size,
                print_width_in: size?.w ?? null,
                print_height_in: size?.h ?? null,
                quantity: Number(item.quantity) || 1,
                artwork_url: item.img!,
                artwork_width_px: meta?.width ?? null,
                artwork_height_px: meta?.height ?? null,
                artwork_type: meta?.type ?? null,
                artwork_bytes: meta?.size ?? null,
                effective_dpi: dpi,
            })
            .onConflictDoNothing({ target: JobOrderProcessingTable.custom_sticker_id })

        await tx
            .update(JobOrdersTable)
            .set({ status: "in_production" })
            .where(eq(JobOrdersTable.id, item.job_order_id))
    })

    const listId = item.jobOrder.list_id
if (listId != null) updateJobOrderListCache(listId)

redirect(`/admin/job-orders/processing/${item.id}`)

}