// db/seeds/seed-adback-media.ts

import { db } from "@/db/index"                                   // adjust to your db client path
import { VendorsTable } from "@/db/schemaDB"
import { AdhesiveBackedMediaTable } from "@/db/tables/materials/adback-materials-table"

type MediaInsert = typeof AdhesiveBackedMediaTable.$inferInsert
type SeedRow = Omit<MediaInsert, "vendor_id" | "id"> & { vendor_slug: string }

const media: SeedRow[] = [
  {
    vendor_slug: "avery-dennison",
    product_id: "AD-MPI1105-GL",
    shipping_id: "SHIP-AD-001",
    brand_name: "Avery Dennison",
    manufacturer_logo: "/images/vendors/avery-dennison.png",
    product_image: "/images/media/avery-gloss-white.png",
    material_type: "Gloss White Vinyl",
    material_composition: "Calendered PVC with permanent adhesive",
    material_weight: "13 oz",
    roll_length_yd: 50,
    roll_width_in: 54,
    opacity: "Opaque",
    sheen: "Glossy",
    quality: "Standard",
    lifespan: "5 years",
    availability: "Available",
    description: "General purpose gloss white adhesive vinyl for stickers and decals.",
    product_advantages: "Reliable adhesion, clean die-cutting, good ink hold.",
    best_uses: "Indoor and outdoor stickers, labels, short-term signage.",
    recommended_inks: "Solvent, eco-solvent, latex",
    cost_per_sq_ft: 0.62,
    price_per_sq_ft: 1.85,
  },
  {
    vendor_slug: "avery-dennison",
    product_id: "AD-MPI2105-MT",
    shipping_id: "SHIP-AD-002",
    brand_name: "Avery Dennison",
    manufacturer_logo: "/images/vendors/avery-dennison.png",
    product_image: "/images/media/avery-matte-white.png",
    material_type: "Matte White Vinyl",
    material_composition: "Calendered PVC with permanent adhesive",
    material_weight: "13 oz",
    roll_length_yd: 50,
    roll_width_in: 54,
    opacity: "Opaque",
    sheen: "Matte",
    quality: "Standard",
    lifespan: "5 years",
    availability: "Available",
    description: "Matte white adhesive vinyl with a low-glare surface.",
    product_advantages: "Reduces glare, photographs well, easy to apply.",
    best_uses: "Product labels, branded stickers, window-adjacent graphics.",
    recommended_inks: "Solvent, eco-solvent, latex",
    cost_per_sq_ft: 0.65,
    price_per_sq_ft: 1.95,
  },
  {
    vendor_slug: "3m-graphics",
    product_id: "3M-IJ180-10",
    shipping_id: "SHIP-3M-001",
    brand_name: "3M",
    manufacturer_logo: "/images/vendors/3m.png",
    product_image: "/images/media/3m-cast-vinyl.png",
    material_type: "Cast Vinyl",
    material_composition: "Cast PVC with pressure-sensitive adhesive",
    material_weight: "10 oz",
    roll_length_yd: 50,
    roll_width_in: 54,
    opacity: "Opaque",
    sheen: "Glossy",
    quality: "Premium",
    lifespan: "10 years",
    availability: "Available",
    description: "Premium cast vinyl that conforms to curves and rivets.",
    product_advantages: "Excellent conformability, long outdoor durability.",
    best_uses: "Vehicle graphics, long-term outdoor stickers.",
    recommended_inks: "Solvent, eco-solvent, latex, UV",
    cost_per_sq_ft: 1.4,
    price_per_sq_ft: 3.9,
  },
  {
    vendor_slug: "oracal-usa",
    product_id: "OR-651-GL",
    shipping_id: "SHIP-OR-001",
    brand_name: "ORACAL",
    manufacturer_logo: "/images/vendors/oracal.png",
    product_image: "/images/media/oracal-651.png",
    material_type: "Intermediate Vinyl",
    material_composition: "Calendered PVC with permanent adhesive",
    material_weight: "13 oz",
    roll_length_yd: 50,
    roll_width_in: 30,
    opacity: "Opaque",
    sheen: "Glossy",
    quality: "Standard",
    lifespan: "5 years",
    availability: "Available",
    description: "Popular intermediate vinyl for plotter cutting.",
    product_advantages: "Wide color range, easy weeding, good value.",
    best_uses: "Cut vinyl decals, lettering, simple stickers.",
    recommended_inks: "Solvent, eco-solvent",
    cost_per_sq_ft: 0.48,
    price_per_sq_ft: 1.5,
  },
  {
    vendor_slug: "local-print-supply",
    product_id: "LPS-CLR-GL",
    shipping_id: null,
    brand_name: "Local Print Supply",
    manufacturer_logo: null,
    product_image: null,
    material_type: "Clear Vinyl",
    material_composition: "Clear PVC with permanent adhesive",
    material_weight: "10 oz",
    roll_length_yd: 25,
    roll_width_in: 24,
    opacity: "Clear",
    sheen: "Glossy",
    quality: "Economy",
    lifespan: "2 years",
    availability: "On order",
    description: "Clear adhesive film for transparent sticker looks.",
    product_advantages: "Fast local availability, low minimums.",
    best_uses: "Window stickers, no-background labels.",
    recommended_inks: "Solvent, eco-solvent",
    cost_per_sq_ft: 0.55,
    price_per_sq_ft: 1.75,
  },
]

async function main() {
  const vendors = await db.query.VendorsTable.findMany()
  const vendorIdBySlug = new Map(vendors.map((v) => [v.slug, v.id]))

  const rows: MediaInsert[] = media.map(({ vendor_slug, ...row }) => {
    const vendor_id = vendorIdBySlug.get(vendor_slug)
    if (!vendor_id) {
      throw new Error(`Vendor "${vendor_slug}" not found. Run seed:vendors first.`)
    }
    return { ...row, vendor_id }
  })

  await db
    .insert(AdhesiveBackedMediaTable)
    .values(rows)
    .onConflictDoNothing({ target: AdhesiveBackedMediaTable.product_id })

  console.log(`Seeded ${rows.length} adhesive media rows`)
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})