import Link from "next/link"
import { notFound } from "next/navigation"
import { db } from "@/db"
import { getCurrentUser } from "@/services/clerk"
import { ClearCartOnPaid } from "@/features/cart/ClearCartOnPaid"

export const dynamic = "force-dynamic"

export default async function OrderPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>
    searchParams: Promise<{ paid?: string }>
}) {
    const { id } = await params
    const { paid } = await searchParams
    const { userId } = await getCurrentUser()
    if (!userId) notFound()

    const order = await db.query.OrdersTable.findFirst({
        where: (o, { and, eq }) => and(eq(o.id, id), eq(o.user_id, userId)),
        with: { items: true },
    })
    if (!order) notFound()

    return (
        <main className="mx-auto max-w-3xl p-6">
            {paid === "1" && <ClearCartOnPaid />}
            <h1 className="mb-2 text-2xl font-bold">Order #{order.order_number}</h1>
            <p className="mb-6 text-gray-600">
                {order.status === "pending"
                    ? "Payment received. We're confirming your order. Refresh in a moment."
                    : `Status: ${order.status.replace("_", " ")}`}
            </p>

            <ul className="divide-y divide-gray-200 border-y border-gray-200">
                {order.items.map((i) => (
                    <li key={i.id} className="flex justify-between gap-4 py-3">
                        <div>
                            <p className="font-semibold">{i.product_name}</p>
                            <p className="text-sm text-gray-600">
                                {i.shape} · {i.material_name} · {i.finish} · {i.size} · Qty {i.quantity}
                            </p>
                        </div>
                        <span className="font-bold">${(i.total_cents / 100).toFixed(2)}</span>
                    </li>
                ))}
            </ul>

            <p className="py-4 text-right text-xl font-bold">
                ${(order.total_cents / 100).toFixed(2)}
            </p>
            <Link href="/stickers" className="underline">Keep shopping</Link>
        </main>
    )
}