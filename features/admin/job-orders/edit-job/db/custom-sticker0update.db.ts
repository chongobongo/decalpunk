import { CustomStickersTable } from "@/db/schemaDB"

// The sticker's own fields. user_id is still accepted so existing callers compile,
// but it is not stored on the sticker row: it lives on job_orders / job_order_list.
type CustomStickerSpec = Omit<
    typeof CustomStickersTable.$inferInsert,
    "id" | "job_order_id" | "created_at" | "updated_at"
>
type CustomStickerInsert = CustomStickerSpec & { user_id?: string | null }

export function buildJobTitle(item: CustomStickerSpec) {
    return [item.product, item.shape, item.size, item.quantity ? `x${item.quantity}` : null]
        .filter(Boolean)
        .join(" - ")
}