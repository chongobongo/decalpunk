// Pricing Seed - Seed File
// db\seed\seed-pricing.ts

import { db } from "@/db/index"   // copy the exact db import line from seed-vendors.ts
import { and, eq, inArray } from "drizzle-orm"
import { FinishesTable } from "@/db/tables/materials/materials-ai"
import {
  ProductsTable, ProductShapesTable, ProductPriceBreaksTable,
} from "@/db/tables/products/products-table"

const shapePricing = [
  { name: "Square",          waste: 1.0,  fee_cents: 0 },
  { name: "Rounded Corners", waste: 1.05, fee_cents: 0 },
  { name: "Circle",          waste: 1.15, fee_cents: 0 },
  { name: "Contour Cut",     waste: 1.25, fee_cents: 3 },
]

// Assumes Glossy / Matte / Cracked Ice are laminates and Uncoated means none. Dollars per sq ft.
const finishPricing = [
  { name: "Uncoated",    adj: 0 },
  { name: "Glossy",      adj: 0.45 },
  { name: "Matte",       adj: 0.45 },
  { name: "Cracked Ice", adj: 0.6 },
]

const jobTerms = [
  { slug: "die-cut",        setup: 0, min: 1500 },   // $15.00 minimum
  { slug: "sticker-sheets", setup: 0, min: 1500 },
]

const breaks = [
  { above: 50,  pct: 10 },
  { above: 100, pct: 20 },
]

async function main() {
  for (const f of finishPricing) {
    await db.update(FinishesTable)
      .set({ price_adjustment_per_sq_ft: f.adj })
      .where(eq(FinishesTable.name, f.name))
  }

  const products = await db.select().from(ProductsTable)
    .where(inArray(ProductsTable.slug, jobTerms.map((j) => j.slug)))

  for (const p of products) {
    const t = jobTerms.find((j) => j.slug === p.slug)!
    await db.update(ProductsTable)
      .set({ setup_fee_cents: t.setup, min_order_cents: t.min })
      .where(eq(ProductsTable.id, p.id))

    for (const s of shapePricing) {
      await db.update(ProductShapesTable)
        .set({ waste_multiplier: s.waste, fee_cents: s.fee_cents })
        .where(and(eq(ProductShapesTable.product_id, p.id), eq(ProductShapesTable.name, s.name)))
    }

    await db.insert(ProductPriceBreaksTable)
      .values(breaks.map((b) => ({ product_id: p.id, above_quantity: b.above, discount_percent: b.pct })))
      .onConflictDoNothing()
  }

  console.log("Seeded pricing")
  process.exit(0)
}

main().catch((err) => { console.error(err); process.exit(1) })