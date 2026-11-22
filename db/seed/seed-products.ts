// db/seed/seed-products.ts

import { db } from "@/db/index"                                   // adjust to your db client path
import { eq, sql } from "drizzle-orm"
import { ProductsTable } from "@/db/tables/products/products-table"

const stickerProductIndex = [
  { link: "custom-stickers",      header: "Custom Stickers",      description: "Best seller" },
  { link: "die-cut",              header: "Die Cut",              description: "Any shape" },
  { link: "sticker-sheets",       header: "Sticker Sheets",       description: "Multiple designs" },
  { link: "custom-sticker-packs", header: "Custom Sticker Packs", description: "Best seller" },
  { link: "heavy-duty",           header: "Heavy Duty",           description: "Industrial strength" },
  { link: "single-sheets",        header: "Singles on Sheet",     description: "Multiple copys" },
  { link: "front-adhesive",       header: "Front Adhesive",       description: "Front side sticky" },
  { link: "epoxy-dome",           header: "Epoxy Dome",           description: "Stickers that pop" },
  { link: "transfer-stickers",    header: "Transfer Stickers",    description: "No background, just art" },
  { link: "dtf-heat-transfer",    header: "DTF Heat Transfers",   description: "Vibrant textile prints" },
  { link: "removable",            header: "Removable",           description: "Easy peel off" },
  { link: "hang-tag",             header: "Hang Tag",             description: "Punctured hole" },
  { link: "kiss-cut",             header: "Kiss Cut",             description: "Easy Peel" },
  { link: "wall",                 header: "Wall",                 description: "Easy on the wall" },
  { link: "vinyl-transfer",       header: "Vinyl Tranfers",       description: "The branding booster" },
]

// Products from the earlier catalog seed, renamed to match the new slugs
const renames = [
  { from: "die-cut-sticker", to: "die-cut" },
  { from: "sheet",           to: "sticker-sheets" },
]

async function main() {
  // 1. Merge old catalog rows into the new slugs (no-op on a fresh database)
  for (const { from, to } of renames) {
    const [existing] = await db.select().from(ProductsTable).where(eq(ProductsTable.slug, from))
    const [target] = await db.select().from(ProductsTable).where(eq(ProductsTable.slug, to))
    if (existing && !target) {
      await db.update(ProductsTable).set({ slug: to }).where(eq(ProductsTable.id, existing.id))
    }
  }

  // 2. Upsert all products by slug
  await db
    .insert(ProductsTable)
    .values(
      stickerProductIndex.map((p, i) => ({
        slug: p.link,
        name: p.header,
        description: p.description,
        is_active: true,
        sort_order: i,
      })),
    )
    .onConflictDoUpdate({
      target: ProductsTable.slug,
      set: {
        name: sql`excluded.name`,
        description: sql`excluded.description`,
        sort_order: sql`excluded.sort_order`,
      },
    })

  console.log(`Seeded ${stickerProductIndex.length} products`)
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})