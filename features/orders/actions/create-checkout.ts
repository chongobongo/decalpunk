// Create Checkout - Action
// features\orders\actions\create-checkout.ts

"use server"

import { getStripe } from "@/lib/stripe"
import { z } from "zod"
import { eq } from "drizzle-orm"
import { db } from "@/db"
import { OrdersTable, OrderItemsTable } from "@/db/schemaDB"
import { getCurrentUser } from "@/services/clerk"
import { canCreateOrder } from "@/app/permissions/general"
import { isUploadThingUrl } from "@/lib/isUploadThingUrl"
import type { ImageMetadata } from "@/lib/getImageMetadata"
import { quoteJob } from "@/features/products/queries/quoteJob"

const lineSchema = z.object({
  productId: z.string().uuid(),
  materialId: z.string().uuid(),
  shape: z.string().min(1),
  finish: z.string().min(1),
  size: z.string().min(1),
  quantity: z.number().int().positive().max(100000),
  img: z.string().url(),
  imageMetadata: z.custom<ImageMetadata>().nullable(),
})

type Line = z.infer<typeof lineSchema>
type Quote = NonNullable<Awaited<ReturnType<typeof quoteJob>>>

export async function createCheckout(input: unknown) {
  const stripe = getStripe()
  const user = await getCurrentUser()
  if (user.userId == null) return { error: true as const, message: "Please sign in to check out." }
  if (!canCreateOrder(user)) return { error: true as const, message: "You do not have permission to place an order." }

  const parsed = z.array(lineSchema).min(1).max(50).safeParse(input)
  if (!parsed.success) return { error: true as const, message: "Your cart contains invalid items." }
  if (!parsed.data.every((l) => isUploadThingUrl(l.img))) {
    return { error: true as const, message: "One of your images is invalid. Please re-add it." }
  }
  const lines = parsed.data
  const userId = user.userId

  // Re-price every line on the server. Nothing from the browser's price is trusted.
  const priced: { line: Line; q: Quote }[] = []
  for (const l of lines) {
    const q = await quoteJob({
      productId: l.productId, materialId: l.materialId, finishName: l.finish,
      shapeName: l.shape, sizeLabel: l.size, quantity: l.quantity,
    })
    if (!q) return { error: true as const, message: "An item in your cart is no longer available." }
    priced.push({ line: l, q })
  }
  const totalCents = priced.reduce((sum, p) => sum + p.q.totalCents, 0)

const order = await db.transaction(async (tx) => {
  const [o] = await tx
    .insert(OrdersTable)
    .values({ user_id: userId, total_cents: totalCents })
    .returning()
  if (!o) throw new Error("Failed to create order")

  await tx.insert(OrderItemsTable).values(
    priced.map(({ line, q }) => ({
      order_id: o.id,
      product_id: line.productId,
      material_id: line.materialId,
      product_name: q.productName,
      material_name: q.materialName,
      shape: line.shape,
      finish: line.finish,
      size: line.size,
      quantity: line.quantity,
      unit_cents: Math.round(q.eachCents),
      total_cents: q.totalCents,
      image_url: line.img,
      image_metadata: line.imageMetadata ?? null,
    })),
  )

  return o
})

  const origin = process.env.NEXT_PUBLIC_APP_URL!
  try {
    const session = await stripe.checkout.sessions.create(
      {
        mode: "payment",
        client_reference_id: order.id,
        metadata: { orderId: order.id },
        line_items: priced.map(({ line, q }) => ({
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: q.totalCents,
            product_data: {
              name: `${q.productName}: ${q.materialName}`,
              description: `${line.shape}, ${line.finish}, ${line.size}, qty ${line.quantity}`,
            },
          },
        })),
        success_url: `${origin}/orders/${order.id}?paid=1`,
        cancel_url: `${origin}/cart`,
      },
      { idempotencyKey: `order-${order.id}` },
    )
    await db.update(OrdersTable).set({ stripe_checkout_session_id: session.id }).where(eq(OrdersTable.id, order.id))
    return { error: false as const, url: session.url! }
  } catch (e: any) {
    console.error("STRIPE SESSION FAILED:", e?.type, "|", e?.code, "|", e?.message)
    await db.update(OrdersTable).set({ status: "cancelled" }).where(eq(OrdersTable.id, order.id))
    return { error: true as const, message: "Could not start checkout. Please try again." }
  }
}