// custom-sticker-db.ts
import { db } from "@/db"
import { CustomStickersTable, JobOrdersTable, JobOrderListTable } from "@/db/schemaDB"

// Sticker columns the caller provides. job_order_id is set here, once the job order exists.
type StickerFields = Omit<
    typeof CustomStickersTable.$inferInsert,
    "id" | "job_order_id" | "created_at" | "updated_at"
>

export type CustomStickerInput = StickerFields & {
    user_id: string
    job_title?: string | null
}

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0]

function buildJobTitle(item: StickerFields) {
    return [item.product, item.shape, item.size, item.quantity ? `x${item.quantity}` : null]
        .filter(Boolean)
        .join(" - ")
}

// One job_orders row (the line item) + one sticker row under it, inside an existing list
async function insertLineItem(tx: Tx, listId: string, userId: string, item: CustomStickerInput) {
    const { job_title: titleOverride, user_id: _ignored, ...fields } = item
    const job_title = titleOverride ?? buildJobTitle(fields)

    // 1. job order first: the sticker row now points at it
    const [jobOrder] = await tx
        .insert(JobOrdersTable)
        .values({
            list_id: listId,
            user_id: userId,
            product_type: "custom_sticker",
            job_title,
            thumbnail_img: fields.img ?? null,
        })
        .returning({ id: JobOrdersTable.id })
    if (!jobOrder) throw new Error("Failed to create job order")

    // 2. sticker row, linked to the job order
    const [sticker] = await tx
        .insert(CustomStickersTable)
        .values({ ...fields, job_order_id: jobOrder.id })
        .returning({ id: CustomStickersTable.id })
    if (!sticker) throw new Error("Failed to create sticker order")

    return { stickerId: sticker.id, jobOrderId: jobOrder.id }
}

// Whole cart = one job_order_list, one job_orders row per item
export async function insertCustomStickerOrders(items: CustomStickerInput[], userId: string) {
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
            lineItems.push(await insertLineItem(tx, list.id, userId, item))
        }
        return { listId: list.id, lineItems }
    })
}

// Single-item convenience wrapper (used by createCustomStickerOrder)
export async function insertCustomStickerOrder(data: CustomStickerInput) {
    if (!data.user_id) throw new Error("user_id is required")
    return await insertCustomStickerOrders([data], data.user_id)
}