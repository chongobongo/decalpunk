// db/tables/materials/adback-materials-table.ts

import { id, created_at, updated_at } from "@/db/schemaHelpers"
import { relations } from "drizzle-orm"
import { index, integer, numeric, pgTable, text, uuid, varchar } from "drizzle-orm/pg-core"
import { VendorsTable } from "@/db/schemaDB"

import {
  availabilityEnum, lifespanEnum, materialWeightEnum,
  opacityEnum, qualityEnum, sheenEnum,
} from "../enums/enums"

export const AdhesiveBackedMediaTable = pgTable(
  "materials-adback",
  {
    id,
    product_id: varchar().notNull().unique(),     // vendor's SKU
    shipping_id: varchar(),

    // NEW: who supplies this roll
    vendor_id: uuid().references(() => VendorsTable.id, { onDelete: "restrict" }),

    brand_name: varchar().notNull(),
    manufacturer_logo: varchar(),
    product_image: varchar(),

    material_type: varchar().notNull(),
    material_composition: varchar(),
    material_weight: materialWeightEnum(),
    roll_length_yd: integer().notNull(),
    roll_width_in: integer().notNull(),
    opacity: opacityEnum(),
    sheen: sheenEnum(),
    quality: qualityEnum(),
    lifespan: lifespanEnum(),
    availability: availabilityEnum().notNull(),

    description: text(),
    product_advantages: text(),
    best_uses: text(),
    recommended_inks: text(),

    cost_per_sq_ft: numeric({ precision: 10, scale: 4, mode: "number" }).notNull(),
    price_per_sq_ft: numeric({ precision: 10, scale: 4, mode: "number" }).notNull(),

    created_at,
    updated_at,
  },
  table => [
    index("adhesive_media_brand_idx").on(table.brand_name),
    index("adhesive_media_vendor_idx").on(table.vendor_id),
  ]
)

export const adhesiveMediaRelations = relations(AdhesiveBackedMediaTable, ({ one }) => ({
  vendor: one(VendorsTable, {
    fields: [AdhesiveBackedMediaTable.vendor_id],
    references: [VendorsTable.id],
  }),
}))