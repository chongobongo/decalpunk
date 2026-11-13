// custom-sticker-item-add-db.ts
// features\admin\job-orders\edit-job\db\custom-sticker-item-add-db.ts

import { db } from "@/db"
import { eq } from "drizzle-orm"
import { CustomStickersTable, JobOrdersTable, JobOrderListTable } from "@/db/schemaDB"
import type { ImageMetadata } from "@/lib/getImageMetadata"

export type NewCustomStickerItem = {
    shape: string
    material: string
    finish: string
    size: string
    quantity: string
    img: string
    image_metadata: ImageMetadata | null
}

/**
 * Adds one more sticker to an EXISTING job order, in ONE transaction:
 *   - inserts the sticker row (product is copied from the job's existing items,
 *     never taken from the caller)
 *   - updates the job's item_count
 *   - the job now has 2+ items, so its title becomes "Sticker order (N items)"
 *   - the list's title is updated the same way ONLY if the list has just this one job
 * The job's thumbnail is left alone (it stays the first item's artwork).
 *
 * Returns null if the job order doesn't exist.
 */
export async function addCustomStickerItem(jobOrderId: string, data: NewCustomStickerItem) {
    return await db.transaction(async (tx) => {
        const [jobOrder] = await tx
            .select({ listId: JobOrdersTable.list_id, productType: JobOrdersTable.product_type })
            .from(JobOrdersTable)
            .where(eq(JobOrdersTable.id, jobOrderId))
        if (!jobOrder) return null
        if (jobOrder.productType !== "custom_sticker") {
            throw new Error("This job is not a custom sticker job")
        }

        const existingItems = await tx
            .select({ product: CustomStickersTable.product })
            .from(CustomStickersTable)
            .where(eq(CustomStickersTable.job_order_id, jobOrderId))

        const product = existingItems.find((item) => item.product)?.product
        if (!product) throw new Error("Could not work out the product for this job")

        const [sticker] = await tx
            .insert(CustomStickersTable)
            .values({
                job_order_id: jobOrderId,
                product,
                shape: data.shape,
                material: data.material,
                finish: data.finish,
                size: data.size,
                quantity: data.quantity,
                img: data.img,
                image_metadata: data.image_metadata,
            })
            .returning({ id: CustomStickersTable.id })
        if (!sticker) throw new Error("Failed to add the item")

        const itemCount = existingItems.length + 1
        const title = `Sticker order (${itemCount} items)`

        await tx
            .update(JobOrdersTable)
            .set({ item_count: itemCount, job_title: title })
            .where(eq(JobOrdersTable.id, jobOrderId))

        if (jobOrder.listId) {
            const jobsInList = await tx
                .select({ id: JobOrdersTable.id })
                .from(JobOrdersTable)
                .where(eq(JobOrdersTable.list_id, jobOrder.listId))
            if (jobsInList.length === 1) {
                await tx
                    .update(JobOrderListTable)
                    .set({ job_title: title })
                    .where(eq(JobOrderListTable.id, jobOrder.listId))
            }
        }

        return { listId: jobOrder.listId, stickerId: sticker.id }
    })
}