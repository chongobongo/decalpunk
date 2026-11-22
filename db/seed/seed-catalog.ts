// db/seed/seed-catalog.ts

import { db } from "@/db"                                   // adjust to your db client path
import { eq, inArray } from "drizzle-orm"
import {
  FinishesTable, MaterialsTable, MaterialFinishesTable,
} from "@/db/tables/materials/materials-ai"
import { AdhesiveBackedMediaTable } from "@/db/tables/materials/adback-materials-table"
import {
  ProductsTable, ProductMaterialsTable, ProductShapesTable,
  ProductSizesTable, ProductQuantitiesTable,
} from "@/db/tables/products/products-table"

// ---------- Finishes ----------
const finishes = [
  { name: "Glossy",      description: "High-shine surface",      price_adjustment_per_sq_ft: 0,    sort_order: 0 },
  { name: "Matte",       description: "Low-glare surface",       price_adjustment_per_sq_ft: 0,    sort_order: 1 },
  { name: "Cracked Ice", description: "Textured shattered look", price_adjustment_per_sq_ft: 0.15, sort_order: 2 },
  { name: "Uncoated",    description: "Raw, no coating",         price_adjustment_per_sq_ft: 0,    sort_order: 3 },
]

// ---------- Materials ----------
// price_per_sq_ft values are PLACEHOLDERS in dollars. If media_sku is set, the
// database trigger overwrites the price from that media row on insert.
const img = (f: string) => `/images/custom-sticker/${f}.png`

const materials = [
  { slug: "vinyl",       name: "Vinyl",            image_url: img("material_vinyl"),        price: 1.85, media_sku: "AD-MPI1105-GL", finishes: ["Glossy", "Matte", "Cracked Ice"] },
  { slug: "aluminum",    name: "Brushed Aluminum", image_url: img("material_aluminum"),     price: 3.8,  media_sku: null,            finishes: ["Glossy"] },
  { slug: "glitter",     name: "Glitter",          image_url: img("material_glitter"),      price: 3.0,  media_sku: null,            finishes: ["Glossy"] },
  { slug: "glow",        name: "Glow in the Dark", image_url: img("material_glow"),         price: 3.2,  media_sku: null,            finishes: ["Uncoated"] },
  { slug: "holographic", name: "Holographic",      image_url: img("material_holographic"),  price: 3.2,  media_sku: null,            finishes: ["Glossy"] },
  { slug: "mirror",      name: "Mirror",           image_url: img("material_mirror"),       price: 3.4,  media_sku: null,            finishes: ["Glossy"] },
  { slug: "paper",       name: "Kraft Paper",      image_url: img("material_paper"),        price: 1.4,  media_sku: null,            finishes: ["Uncoated"] },
  { slug: "pixie",       name: "Pixie Dust",       image_url: img("material_pixie"),        price: 3.6,  media_sku: null,            finishes: ["Glossy"] },
  { slug: "prismatic",   name: "Prismatic",        image_url: img("material_prismatic"),    price: 3.4,  media_sku: null,            finishes: ["Glossy"] },
  { slug: "reflective",  name: "Reflective",       image_url: img("material_reflective"),   price: 3.6,  media_sku: null,            finishes: ["Glossy"] },
  { slug: "transparent", name: "Transparent",      image_url: img("material_transparent"),  price: 2.1,  media_sku: "LPS-CLR-GL",    finishes: ["Glossy", "Matte"] },
  { slug: "high-tack",   name: "High-Tack Vinyl",  image_url: img("material_vinyl"),        price: 2.0,  media_sku: null,            finishes: ["Glossy", "Matte", "Cracked Ice"] },
  { slug: "low-tack",    name: "Low-Tack Vinyl",   image_url: img("material_vinyl"),        price: 2.0,  media_sku: null,            finishes: ["Glossy", "Matte", "Cracked Ice"] },
]

// ---------- Products ----------
const sizes = [
  { label: "2x2 in", width_in: 2, height_in: 2 },
  { label: "3x3 in", width_in: 3, height_in: 3 },
  { label: "4x4 in", width_in: 4, height_in: 4 },
]
const quantities = [25, 50, 100]

const products = [
  {
    slug: "die-cut-sticker",
    name: "Die Cut Sticker",
    shapes: ["Circle", "Square", "Rounded Corners", "Contour Cut"],
    materialSlugs: ["vinyl", "transparent", "high-tack", "low-tack"],
  },
  {
    slug: "sheet",
    name: "Sheet",
    shapes: ["Square"],
    materialSlugs: materials.map((m) => m.slug),
  },
]

async function main() {
  // 1. Finishes
  await db.insert(FinishesTable).values(finishes).onConflictDoNothing({ target: FinishesTable.name })
  const finishRows = await db.select().from(FinishesTable)
  const finishId = new Map(finishRows.map((f) => [f.name, f.id]))

  // 2. Media rows to link (looked up by SKU)
  const skus = materials.map((m) => m.media_sku).filter((s): s is string => !!s)
  const mediaRows = await db
    .select({ id: AdhesiveBackedMediaTable.id, sku: AdhesiveBackedMediaTable.product_id })
    .from(AdhesiveBackedMediaTable)
    .where(inArray(AdhesiveBackedMediaTable.product_id, skus))
  const mediaId = new Map(mediaRows.map((m) => [m.sku, m.id]))

  // 3. Materials (trigger overwrites price when linked to a media row)
  await db
    .insert(MaterialsTable)
    .values(
      materials.map((m, i) => ({
        slug: m.slug,
        name: m.name,
        image_url: m.image_url,
        category: "sticker",
        adhesive_media_id: m.media_sku ? mediaId.get(m.media_sku) ?? null : null,
        price_per_sq_ft: m.price,
        sort_order: i,
      })),
    )
    .onConflictDoNothing({ target: MaterialsTable.slug })
  const materialRows = await db.select().from(MaterialsTable)
  const materialId = new Map(materialRows.map((m) => [m.slug, m.id]))

  // 4. Material <-> finish links
  await db
    .insert(MaterialFinishesTable)
    .values(
      materials.flatMap((m) =>
        m.finishes.map((f) => ({
          material_id: materialId.get(m.slug)!,
          finish_id: finishId.get(f)!,
        })),
      ),
    )
    .onConflictDoNothing()

  // 5. Products
  await db
    .insert(ProductsTable)
    .values(products.map((p, i) => ({ slug: p.slug, name: p.name, sort_order: i })))
    .onConflictDoNothing({ target: ProductsTable.slug })
  const productRows = await db.select().from(ProductsTable)
  const productId = new Map(productRows.map((p) => [p.slug, p.id]))

  // 6. Shapes, sizes, quantities (no unique key, so clear and re-insert for safe reruns)
  for (const p of products) {
    const pid = productId.get(p.slug)!

    await db.delete(ProductShapesTable).where(eq(ProductShapesTable.product_id, pid))
    await db.insert(ProductShapesTable).values(
      p.shapes.map((name, i) => ({ product_id: pid, name, sort_order: i })),
    )

    await db.delete(ProductSizesTable).where(eq(ProductSizesTable.product_id, pid))
    await db.insert(ProductSizesTable).values(
      sizes.map((s, i) => ({ product_id: pid, ...s, sort_order: i })),
    )

    await db.delete(ProductQuantitiesTable).where(eq(ProductQuantitiesTable.product_id, pid))
    await db.insert(ProductQuantitiesTable).values(
      quantities.map((quantity, i) => ({ product_id: pid, quantity, sort_order: i })),
    )

    // 7. Product <-> material links
    await db
      .insert(ProductMaterialsTable)
      .values(
        p.materialSlugs.map((slug, i) => ({
          product_id: pid,
          material_id: materialId.get(slug)!,
          sort_order: i,
        })),
      )
      .onConflictDoNothing()
  }

  console.log("Seeded finishes, materials, products and their links")
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})