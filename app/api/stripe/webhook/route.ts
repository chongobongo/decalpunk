import Stripe from "stripe"
import { and, eq } from "drizzle-orm"
import { db } from "@/db"
import { OrdersTable } from "@/db/schemaDB"
import { fulfillOrder } from "@/features/orders/fulfill-order"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get("stripe-signature")
  if (!sig) return new Response("Missing signature", { status: 400 })

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (e) {
    console.error("WEBHOOK signature failed:", e instanceof Error ? e.message : e)
    return new Response("Invalid signature", { status: 400 })
  }

  console.log("WEBHOOK received:", event.type, event.id)

  try {
    if (
      event.type === "checkout.session.completed" ||
      event.type === "checkout.session.async_payment_succeeded"
    ) {
      const s = event.data.object as Stripe.Checkout.Session
      const orderId = s.metadata?.orderId
      console.log("WEBHOOK session:", { orderId, payment_status: s.payment_status, amount_total: s.amount_total })

      if (!orderId) {
        console.error("WEBHOOK: no orderId in session metadata")
      } else if (s.payment_status !== "paid") {
        console.log("WEBHOOK: session not paid yet, skipping")
      } else {
        const [order] = await db.select().from(OrdersTable).where(eq(OrdersTable.id, orderId))
        console.log("WEBHOOK order lookup:", order?.id, order?.status, order?.total_cents)

        if (!order) {
          console.error("WEBHOOK: order not found in this database")
        } else {
          if (order.status === "pending") {
            if (s.amount_total === order.total_cents) {
              await db
                .update(OrdersTable)
                .set({
                  status: "paid",
                  paid_at: new Date(),
                  stripe_payment_intent_id: typeof s.payment_intent === "string" ? s.payment_intent : null,
                })
                .where(and(eq(OrdersTable.id, orderId), eq(OrdersTable.status, "pending")))
              console.log("WEBHOOK: order marked paid")
            } else {
              console.error("WEBHOOK amount mismatch:", { stripe: s.amount_total, expected: order.total_cents })
            }
          }

          const [current] = await db.select().from(OrdersTable).where(eq(OrdersTable.id, orderId))
          if (current?.status === "paid") {
            await fulfillOrder(current)
            console.log("WEBHOOK: fulfillOrder finished")
          }
        }
      }
    }

    if (event.type === "checkout.session.expired") {
      const s = event.data.object as Stripe.Checkout.Session
      if (s.metadata?.orderId) {
        await db
          .update(OrdersTable)
          .set({ status: "cancelled" })
          .where(and(eq(OrdersTable.id, s.metadata.orderId), eq(OrdersTable.status, "pending")))
      }
    }
  } catch (e) {
    console.error("WEBHOOK handler failed:", e)
    return new Response("Handler error", { status: 500 })
  }

  return new Response("ok")
}