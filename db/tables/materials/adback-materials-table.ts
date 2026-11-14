import { id, created_at, updated_at } from "@/db/schemaHelpers"
import { index, integer, numeric, pgTable, text, varchar } from "drizzle-orm/pg-core"

import {
  availabilityEnum,
  lifespanEnum,
  materialWeightEnum,
  opacityEnum,
  qualityEnum,
  sheenEnum,
} from "../enums/enums"

export const AdhesiveBackedMediaTable = pgTable(
  "materials-adback",
  {
    id,
    product_id: varchar().notNull().unique(),
    shipping_id: varchar(),

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

    cost_per_sq_ft: numeric({ precision: 10, scale: 4 }).notNull(),
    price_per_sq_ft: numeric({ precision: 10, scale: 4 }).notNull(),

    created_at,
    updated_at,
  },
  table => [index("adhesive_media_brand_idx").on(table.brand_name)]
)