// features/products/queries/getProducts.ts

import { db } from "@/db/index"   // keep the exact db import line you already have in this file
import { dollarsToCents } from "@/lib/pricing"

export async function getProducts() {
  const rows = await db.query.ProductsTable.findMany({
    where: (p, { eq }) => eq(p.is_active, true),
    orderBy: (p, { asc }) => asc(p.sort_order),
    with: {
      shapes: { orderBy: (s, { asc }) => asc(s.sort_order) },
      sizes: { orderBy: (s, { asc }) => asc(s.sort_order) },
      quantities: { orderBy: (q, { asc }) => asc(q.sort_order) },
      priceBreaks: true,
      materials: {
        orderBy: (pm, { asc }) => asc(pm.sort_order),
        with: {
          material: {
            with: { finishes: { with: { finish: true } } },
          },
        },
      },
    },
  })

  return rows.map((p) => ({
    id: p.id,
    product: p.name,
    setupFeeCents: p.setup_fee_cents,
    minOrderCents: p.min_order_cents,
    breaks: p.priceBreaks.map((b) => ({
      aboveQuantity: b.above_quantity,
      discountPercent: b.discount_percent,
    })),
    shapes: p.shapes.map((s) => ({
      id: s.id,
      shape: s.name,
      wasteMultiplier: s.waste_multiplier,
      feeCents: s.fee_cents,
    })),
    sizes: p.sizes.map((s) => ({
      id: s.id,
      size: s.label,
      widthIn: s.width_in,
      heightIn: s.height_in,
    })),
    quantities: p.quantities.map((q) => ({
      id: q.id,
      quantity: String(q.quantity),
    })),
    materials: p.materials
      .filter(({ material: m }) => m.is_active)
      .map(({ material: m }) => ({
        id: m.id,
        material: m.name,
        img: m.image_url ?? "",
        price: m.price_per_sq_ft,                              // dollars, for the card label
        ratePerSqFtCents: dollarsToCents(m.price_per_sq_ft),
        finishes: m.finishes.map((mf) => ({
          id: mf.finish.id,
          finish: mf.finish.name,
          adjPerSqFtCents: dollarsToCents(mf.finish.price_adjustment_per_sq_ft),
        })),
      })),
  }))
}