import { id, created_at, updated_at } from "@/db/schemaHelpers"
import { boolean, index, integer, numeric, pgTable, text, varchar } from "drizzle-orm/pg-core"

import {
  availabilityEnum,
  glowColorEnum,
  lifespanEnum,
  materialWeightEnum,
  opacityEnum,
  qualityEnum,
  sheenEnum,
} from "../enums/enums"

export const GlowInTheDarkMediaTable = pgTable(
  "materials-glow",
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
    adhesive_backed: boolean().notNull().default(true),

    // Glow-specific
    glow_color: glowColorEnum().notNull(),
    daylight_color: varchar(), // what it looks like when not glowing, e.g. "Pale yellow"
    glow_duration_hours: integer(), // how long the afterglow is usable
    charge_time_minutes: integer(), // light exposure needed for a full charge
    initial_brightness_mcd: numeric({ precision: 10, scale: 2 }), // mcd/m², from the spec sheet

    description: text(),
    product_advantages: text(),
    best_uses: text(),
    recommended_inks: text(),

    cost_per_sq_ft: numeric({ precision: 10, scale: 4 }).notNull(),
    price_per_sq_ft: numeric({ precision: 10, scale: 4 }).notNull(),

    created_at,
    updated_at,
  },
  table => [
    index("glow_media_brand_idx").on(table.brand_name),
    index("glow_media_color_idx").on(table.glow_color),
  ]
)