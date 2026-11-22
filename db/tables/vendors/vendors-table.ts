// db/tables/vendors/vendors-table.ts
import { id, created_at, updated_at } from "@/db/schemaHelpers"
import { boolean, index, integer, numeric, pgTable, text, varchar } from "drizzle-orm/pg-core"

export const VendorsTable = pgTable(
  "vendors",
  {
    id,
    slug: varchar().notNull().unique(),
    name: varchar().notNull(),
    logo_url: varchar(),
    website: varchar(),
    contact_name: varchar(),
    contact_email: varchar(),
    contact_phone: varchar(),
    account_number: varchar(),
    address_line1: varchar(),
    address_line2: varchar(),
    city: varchar(),
    state: varchar(),
    postal_code: varchar(),
    country: varchar().default("US"),
    payment_terms: varchar(),
    lead_time_days: integer(),
    min_order_amount: numeric({ precision: 10, scale: 2, mode: "number" }),
    free_shipping_threshold: numeric({ precision: 10, scale: 2, mode: "number" }),
    notes: text(),
    is_active: boolean().notNull().default(true),
    created_at,
    updated_at,
  },
  t => [index("vendors_active_name_idx").on(t.is_active, t.name)]
)