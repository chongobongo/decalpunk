// custom-sticker-db.ts
import { db } from "@/db"
import { eq } from "drizzle-orm"
import { CustomStickersTable, JobOrdersTable, JobOrderListTable } from "@/db/schemaDB"

type CustomStickerInsert = typeof CustomStickersTable.$inferInsert
type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0]

function buildJobTitle(item: CustomStickerInsert) {
    return [item.product, item.shape, item.size, item.quantity ? `x${item.quantity}` : null]
        .filter(Boolean)
        .join(" - ")
}

// One sticker row + one job_orders row (the line item) under an existing list
async function insertLineItem(tx: Tx, listId: string, data: CustomStickerInsert) {
    const job_title = data.job_title ?? buildJobTitle(data)

    const [sticker] = await tx
        .insert(CustomStickersTable)
        .values({ ...data, job_title })
        .returning({ id: CustomStickersTable.id })
    if (!sticker) throw new Error("Failed to create sticker order")

    const [jobOrder] = await tx
        .insert(JobOrdersTable)
        .values({
            list_id: listId,
            user_id: data.user_id,
            job_order_id: sticker.id,
            job_title,
        })
        .returning({ id: JobOrdersTable.id })
    if (!jobOrder) throw new Error("Failed to create job order")

    const [updated] = await tx
        .update(CustomStickersTable)
        .set({ job_order_id: jobOrder.id })
        .where(eq(CustomStickersTable.id, sticker.id))
        .returning({ id: CustomStickersTable.id })
    if (!updated) throw new Error("Failed to link sticker to job order")

    return { stickerId: sticker.id, jobOrderId: jobOrder.id }
}

// Whole cart = one job_order_list, one job_orders row per item
export async function insertCustomStickerOrders(items: CustomStickerInsert[], userId: string) {
    const [first] = items
    if (!first) throw new Error("No items to insert")

    return await db.transaction(async (tx) => {
        const [list] = await tx
            .insert(JobOrderListTable)
            .values({
                user_id: userId,
                job_title: items.length === 1 ? buildJobTitle(first) : `Sticker order (${items.length} items)`,
            })
            .returning({ id: JobOrderListTable.id })
        if (!list) throw new Error("Failed to create job order list")

        const lineItems = []
        for (const item of items) {
            lineItems.push(await insertLineItem(tx, list.id, { ...item, user_id: userId }))
        }
        return { listId: list.id, lineItems }
    })
}

// Single-item convenience wrapper (used by createCustomStickerOrder)
export async function insertCustomStickerOrder(data: CustomStickerInsert) {
    if (!data.user_id) throw new Error("user_id is required")
    return await insertCustomStickerOrders([data], data.user_id)
}