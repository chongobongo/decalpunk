// Fulfill Order
// features\orders\fulfill-order.ts

import { and, eq, isNull } from "drizzle-orm"
import { db } from "@/db"
import { OrderItemsTable } from "@/db/schemaDB"
import { insertCustomStickerOrdersTx } from "@/features/products/custom-stickers/db/custom-sticker-db"
import type { ImageMetadata } from "@/lib/getImageMetadata"

export async function fulfillOrder(order: { id: string; user_id: string }) {
  await db.transaction(async (tx) => {
    // Lock the items that have no job order yet, so a retried webhook can't create duplicates
    const items = await tx
      .select()
      .from(OrderItemsTable)
      .where(and(eq(OrderItemsTable.order_id, order.id), isNull(OrderItemsTable.job_order_id)))
      .for("update")

    if (items.length === 0) return // already fulfilled

    const { lineItems } = await insertCustomStickerOrdersTx(
      tx,
      items.map((i) => ({
        product: i.product_name,
        shape: i.shape,
        material: i.material_name,
        finish: i.finish,
        size: i.size,
        quantity: String(i.quantity),
        img: i.image_url,
        image_metadata: (i.image_metadata as ImageMetadata | null) ?? null,
        user_id: order.user_id,
      })),
      order.user_id,
    )

    // lineItems come back in the same order as items
    for (const [n, item] of items.entries()) {
      const lineItem = lineItems[n]
      if (!lineItem) throw new Error("Missing job order for order item")
      await tx
        .update(OrderItemsTable)
        .set({ job_order_id: lineItem.jobOrderId })
        .where(eq(OrderItemsTable.id, item.id))
    }
  })
}