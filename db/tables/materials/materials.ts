// db/schemaDB.ts (add to your existing file)

import { sql } from "drizzle-orm"
import {
  pgTable,
  uuid,
  text,
  integer,
  numeric,
  boolean,
  timestamp,
  index,
  check,
} from "drizzle-orm/pg-core"

export const MaterialTable = pgTable(
  "materials",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // Identity
    slug: text("slug").notNull().unique(),       // "adhesive-vinyl", used in URLs/lookups
    name: text("name").notNull(),                // "Adhesive Vinyl"
    description: text("description"),
    imageUrl: text("image_url"),
    category: text("category").notNull().default("sticker"), // sticker | label | dtf ...

    // Pricing (all money in integer cents)
    unitPriceCents: integer("unit_price_cents").notNull(),   // price shown on the material card
    pricePerSqInch: numeric("price_per_sq_inch", { precision: 10, scale: 4, mode: "number" })
      .notNull()
      .default(0),                                           // for size-based calculations, in dollars
    setupFeeCents: integer("setup_fee_cents").notNull().default(0),
    minOrderCents: integer("min_order_cents").notNull().default(0),

    // Display / availability
    isActive: boolean("is_active").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    index("materials_active_sort_idx").on(t.isActive, t.sortOrder),
    check("materials_prices_nonnegative",
      sql`${t.unitPriceCents} >= 0 AND ${t.setupFeeCents} >= 0 AND ${t.minOrderCents} >= 0 AND ${t.pricePerSqInch} >= 0`),
  ],
)