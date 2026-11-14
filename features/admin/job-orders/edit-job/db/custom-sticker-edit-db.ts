// custom-sticker-db.ts
// features\admin\job-orders\new-order\custom-sticker\db\custom-sticker-db.ts

import { db } from "@/db"
import { asc, eq } from "drizzle-orm"
import { CustomStickersTable, JobOrdersTable, JobOrderListTable } from "@/db/schemaDB"

// The sticker's own fields. user_id is still accepted so existing callers compile,
// but it is not stored on the sticker row: it lives on job_orders / job_order_list.
type CustomStickerSpec = Omit<
    typeof CustomStickersTable.$inferInsert,
    "id" | "job_order_id" | "created_at" | "updated_at"
>
type CustomStickerInsert = CustomStickerSpec & { user_id?: string | null }

function buildJobTitle(item: CustomStickerSpec) {
    return [item.product, item.shape, item.size, item.quantity ? `x${item.quantity}` : null]
        .filter(Boolean)
        .join(" - ")
}

// Whole cart, in ONE transaction:
//   1 job_order_list row             (the checkout)
//   1 job_orders row                 (one job holding every sticker in the cart)
//   N job_orders_custom_sticker rows (the items, all sharing that job_order_id)
export async function insertCustomStickerOrders(items: CustomStickerInsert[], userId: string) {
    const [first] = items
    if (!first) throw new Error("No items to insert")

    return await db.transaction(async (tx) => {
        const jobTitle =
            items.length === 1 ? buildJobTitle(first) : `Sticker order (${items.length} items)`

        const [list] = await tx
            .insert(JobOrderListTable)
            .values({ user_id: userId, job_title: jobTitle })
            .returning({ id: JobOrderListTable.id })
        if (!list) throw new Error("Failed to create job order list")

        const [jobOrder] = await tx
            .insert(JobOrdersTable)
            .values({
                list_id: list.id,
                user_id: userId,
                product_type: "custom_sticker",
                job_title: jobTitle,
                item_count: items.length,
                thumbnail_img: first.img ?? null, // dashboard preview = first item's artwork
            })
            .returning({ id: JobOrdersTable.id })
        if (!jobOrder) throw new Error("Failed to create job order")

        const stickers = await tx
            .insert(CustomStickersTable)
            .values(
                items.map(({ user_id: _userId, ...spec }) => ({
                    ...spec,
                    job_order_id: jobOrder.id,
                }))
            )
            .returning({ id: CustomStickersTable.id })

        return {
            listId: list.id,
            jobOrderId: jobOrder.id,
            stickerIds: stickers.map((s) => s.id),
        }
    })
}

// Single-item convenience wrapper (used by createCustomStickerOrder)
export async function insertCustomStickerOrder(data: CustomStickerInsert) {
    if (!data.user_id) throw new Error("user_id is required")
    return await insertCustomStickerOrders([data], data.user_id)
}

/**
 * Deletes one sticker item, in ONE transaction, and keeps its parents consistent:
 *   - items left in the job order  -> item_count and thumbnail are updated
 *   - no items left                -> the (now empty) job order is deleted too
 *   - no job orders left in list   -> the (now empty) list is deleted too
 * Returns null if the item doesn't exist.
 */
export async function removeCustomStickerItem(stickerId: string) {
    return await db.transaction(async (tx) => {
        const [deleted] = await tx
            .delete(CustomStickersTable)
            .where(eq(CustomStickersTable.id, stickerId))
            .returning({ jobOrderId: CustomStickersTable.job_order_id })
        if (!deleted) return null

        const remaining = await tx
            .select({ img: CustomStickersTable.img })
            .from(CustomStickersTable)
            .where(eq(CustomStickersTable.job_order_id, deleted.jobOrderId))
            .orderBy(asc(CustomStickersTable.created_at))

        if (remaining.length > 0) {
            const [jobOrder] = await tx
                .update(JobOrdersTable)
                .set({ item_count: remaining.length, thumbnail_img: remaining[0]?.img ?? null })
                .where(eq(JobOrdersTable.id, deleted.jobOrderId))
                .returning({ listId: JobOrdersTable.list_id })

            return { listId: jobOrder?.listId ?? null, jobOrderDeleted: false, listDeleted: false }
        }

        const [jobOrder] = await tx
            .delete(JobOrdersTable)
            .where(eq(JobOrdersTable.id, deleted.jobOrderId))
            .returning({ listId: JobOrdersTable.list_id })
        const listId = jobOrder?.listId ?? null
        if (!listId) return { listId, jobOrderDeleted: true, listDeleted: false }

        const jobsLeft = await tx
            .select({ id: JobOrdersTable.id })
            .from(JobOrdersTable)
            .where(eq(JobOrdersTable.list_id, listId))
        if (jobsLeft.length > 0) return { listId, jobOrderDeleted: true, listDeleted: false }

        await tx.delete(JobOrderListTable).where(eq(JobOrderListTable.id, listId))
        return { listId, jobOrderDeleted: true, listDeleted: true }
    })
}