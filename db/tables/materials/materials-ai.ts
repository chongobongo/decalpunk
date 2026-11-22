// Materials Table
// db\tables\materials\materials-ai.ts

import { id, created_at, updated_at } from "@/db/schemaHelpers"
import {
  boolean, check, index, integer, numeric, pgTable, primaryKey, text, uuid, varchar,
} from "drizzle-orm/pg-core"
import { relations, sql } from "drizzle-orm"
import { AdhesiveBackedMediaTable } from "./adback-materials-table"

// Catalog of finishes (Gloss, Matte, Laminate...)
export const FinishesTable = pgTable("finishes", {
  id,
  name: varchar().notNull().unique(),
  description: text(),
  // Added to the material's price, in dollars per sq ft
  price_adjustment_per_sq_ft: numeric({ precision: 10, scale: 4, mode: "number" })
    .notNull()
    .default(0),
  is_active: boolean().notNull().default(true),
  sort_order: integer().notNull().default(0),
  created_at,
  updated_at,
})

// What the app shows on the material card
export const MaterialsTable = pgTable(
  "materials",
  {
    id,
    slug: varchar().notNull().unique(),
    name: varchar().notNull(),
    image_url: varchar(),
    category: varchar().notNull().default("sticker"),

    // Source of truth for price. Add one nullable FK per media table as you create them.
    adhesive_media_id: uuid().references(() => AdhesiveBackedMediaTable.id, {
      onDelete: "restrict",
    }),

    // Kept in sync from the media table by a trigger (see below). Never edit directly.
    price_per_sq_ft: numeric({ precision: 10, scale: 4, mode: "number" }).notNull(),

    is_active: boolean().notNull().default(true),
    sort_order: integer().notNull().default(0),
    created_at,
    updated_at,
  },
  t => [
    index("materials_active_sort_idx").on(t.is_active, t.sort_order),
    check("materials_price_nonnegative", sql`${t.price_per_sq_ft} >= 0`),
  ]
)

// Which finishes each material offers (many-to-many)
export const MaterialFinishesTable = pgTable(
  "material_finishes",
  {
    material_id: uuid().notNull().references(() => MaterialsTable.id, { onDelete: "cascade" }),
    finish_id: uuid().notNull().references(() => FinishesTable.id, { onDelete: "cascade" }),
  },
  t => [primaryKey({ columns: [t.material_id, t.finish_id] })]
)

export const materialsRelations = relations(MaterialsTable, ({ one, many }) => ({
  adhesiveMedia: one(AdhesiveBackedMediaTable, {
    fields: [MaterialsTable.adhesive_media_id],
    references: [AdhesiveBackedMediaTable.id],
  }),
  finishes: many(MaterialFinishesTable),
}))

export const finishesRelations = relations(FinishesTable, ({ many }) => ({
  materials: many(MaterialFinishesTable),
}))

export const materialFinishesRelations = relations(MaterialFinishesTable, ({ one }) => ({
  material: one(MaterialsTable, { fields: [MaterialFinishesTable.material_id], references: [MaterialsTable.id] }),
  finish: one(FinishesTable, { fields: [MaterialFinishesTable.finish_id], references: [FinishesTable.id] }),
}))