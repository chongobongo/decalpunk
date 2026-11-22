// Quot Job - Queries
// features\products\queries\quoteJob.ts

import { db } from "@/db/index"   // same db import as your other queries
import { dollarsToCents, priceJob } from "@/lib/pricing"

export async function quoteJob(input: {
  productId: string; materialId: string; finishName: string
  shapeName: string; sizeLabel: string; quantity: number
}) {
  const product = await db.query.ProductsTable.findFirst({
    where: (p, { eq, and }) => and(eq(p.id, input.productId), eq(p.is_active, true)),
    with: {
      shapes: true, sizes: true, quantities: true, priceBreaks: true,
      materials: { with: { material: { with: { finishes: { with: { finish: true } } } } } },
    },
  })
  if (!product) return null

  const material = product.materials.find((pm) => pm.material_id === input.materialId)?.material
  const finish = material?.finishes.find((mf) => mf.finish.name === input.finishName)?.finish
  const shape = product.shapes.find((s) => s.name === input.shapeName)
  const size = product.sizes.find((s) => s.label === input.sizeLabel)
  const quantityOffered = product.quantities.some((q) => q.quantity === input.quantity)
  if (!material?.is_active || !finish || !shape || !size || !quantityOffered) return null

  return priceJob({
    ratePerSqFtCents: dollarsToCents(material.price_per_sq_ft),
    finishAdjPerSqFtCents: dollarsToCents(finish.price_adjustment_per_sq_ft),
    widthIn: size.width_in,
    heightIn: size.height_in,
    wasteMultiplier: shape.waste_multiplier,
    shapeFeeCents: shape.fee_cents,
    quantity: input.quantity,
    breaks: product.priceBreaks.map((b) => ({
      aboveQuantity: b.above_quantity, discountPercent: b.discount_percent,
    })),
    setupFeeCents: product.setup_fee_cents,
    minOrderCents: product.min_order_cents,
  })
}