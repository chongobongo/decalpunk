// custom-sticker-item-update-db.ts
// features\admin\job-orders\new-order\custom-sticker\db\custom-sticker-item-update-db.ts

import { db } from "@/db"
import { eq } from "drizzle-orm"
import { CustomStickersTable, JobOrdersTable, JobOrderListTable } from "@/db/schemaDB"
import type { ImageMetadata } from "@/lib/getImageMetadata"
import { buildJobTitle } from "@/features/admin/job-orders/edit-job/db/custom-sticker0update.db" // CHECK: path must match the real file name, and buildJobTitle must be exported there

export type CustomStickerItemUpdate = {
    shape: string
    material: string
    finish: string
    size: string
    quantity: string
    // Only pass these when the artwork was replaced
    img?: string
    image_metadata?: ImageMetadata | null
}

/**
 * Updates one sticker item, in ONE transaction, and keeps the parent rows in step:
 *   - the job order's title is regenerated ONLY if this is the only item in the job
 *   - the list's title is regenerated ONLY if it is a single-job, single-item order
 *   - the job order's thumbnail is replaced ONLY if this item's old artwork was the thumbnail
 * Multi-item titles ("Sticker order (3 items)") are left alone.
 * The product is never changed: it is read from the database, not from the caller.
 *
 * Returns null if the item doesn't exist. Otherwise returns the list id (for cache
 * revalidation) and, if the old artwork file is no longer used by any item, its URL
 * so the caller can delete it from UploadThing.
 */
export async function updateCustomStickerItem(stickerId: string, data: CustomStickerItemUpdate) {
    return await db.transaction(async (tx) => {
        const [existing] = await tx
            .select({
                jobOrderId: CustomStickersTable.job_order_id,
                img: CustomStickersTable.img,
                product: CustomStickersTable.product,
            })
            .from(CustomStickersTable)
            .where(eq(CustomStickersTable.id, stickerId))
        if (!existing) return null

        const artworkReplaced = data.img !== undefined && data.img !== existing.img

        // Whitelisted columns only: never spread the incoming object into .set()
        // (product is deliberately not in this list)
        await tx
            .update(CustomStickersTable)
            .set({
                shape: data.shape,
                material: data.material,
                finish: data.finish,
                size: data.size,
                quantity: data.quantity,
                ...(artworkReplaced
                    ? { img: data.img, image_metadata: data.image_metadata ?? null }
                    : {}),
            })
            .where(eq(CustomStickersTable.id, stickerId))

        const [jobOrder] = await tx
            .select({ listId: JobOrdersTable.list_id, thumbnail: JobOrdersTable.thumbnail_img })
            .from(JobOrdersTable)
            .where(eq(JobOrdersTable.id, existing.jobOrderId))
        if (!jobOrder) throw new Error("Job order not found for this item")

        const itemsInJob = await tx
            .select({ id: CustomStickersTable.id })
            .from(CustomStickersTable)
            .where(eq(CustomStickersTable.job_order_id, existing.jobOrderId))
        const isSingleItemJob = itemsInJob.length === 1
        const newTitle = buildJobTitle({ ...data, product: existing.product })

        const jobOrderSet: Partial<typeof JobOrdersTable.$inferInsert> = {}
        if (isSingleItemJob) jobOrderSet.job_title = newTitle
        if (artworkReplaced && jobOrder.thumbnail === existing.img) {
            jobOrderSet.thumbnail_img = data.img
        }
        if (Object.keys(jobOrderSet).length > 0) {
            await tx
                .update(JobOrdersTable)
                .set(jobOrderSet)
                .where(eq(JobOrdersTable.id, existing.jobOrderId))
        }

        if (isSingleItemJob && jobOrder.listId) {
            const jobsInList = await tx
                .select({ id: JobOrdersTable.id })
                .from(JobOrdersTable)
                .where(eq(JobOrdersTable.list_id, jobOrder.listId))
            if (jobsInList.length === 1) {
                await tx
                    .update(JobOrderListTable)
                    .set({ job_title: newTitle })
                    .where(eq(JobOrderListTable.id, jobOrder.listId))
            }
        }

        // Is the old artwork file still used by any item? If not, the caller can delete it.
        let previousImgUnused: string | null = null
        if (artworkReplaced && existing.img) {
            const stillUsed = await tx
                .select({ id: CustomStickersTable.id })
                .from(CustomStickersTable)
                .where(eq(CustomStickersTable.img, existing.img))
                .limit(1)
            if (stillUsed.length === 0) previousImgUnused = existing.img
        }

        return { listId: jobOrder.listId, previousImgUnused }
    })
}