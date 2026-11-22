// Products Table
// db\tables\products\products-table.ts

import { id, created_at, updated_at } from "@/db/schemaHelpers"
import {
  boolean, check, index, integer, numeric, pgTable, primaryKey, text, uniqueIndex, uuid, varchar,
} from "drizzle-orm/pg-core"
import { relations, sql } from "drizzle-orm"
import { MaterialsTable } from "../materials/materials-ai"

// What shows in the Product select (Custom Stickers, Die-Cut, Labels...)
export const ProductsTable = pgTable(
  "products",
  {
    id,
    slug: varchar().notNull().unique(),          // "custom-stickers"
    name: varchar().notNull(),                   // "Custom Stickers"
    description: text(),
    image_url: varchar(),

    // Job-level pricing, in integer cents
    setup_fee_cents: integer().notNull().default(0),
    min_order_cents: integer().notNull().default(0),

    is_active: boolean().notNull().default(true),
    sort_order: integer().notNull().default(0),
    created_at,
    updated_at,
  },
  t => [
    index("products_active_sort_idx").on(t.is_active, t.sort_order),
    check("products_pricing_nonnegative", sql`${t.setup_fee_cents} >= 0 AND ${t.min_order_cents} >= 0`),
  ]
)

// Which materials each product can be printed on (many-to-many)
export const ProductMaterialsTable = pgTable(
  "product_materials",
  {
    product_id: uuid().notNull().references(() => ProductsTable.id, { onDelete: "cascade" }),
    material_id: uuid().notNull().references(() => MaterialsTable.id, { onDelete: "cascade" }),
    sort_order: integer().notNull().default(0),
  },
  t => [primaryKey({ columns: [t.product_id, t.material_id] })]
)

// Shapes offered per product (Circle, Square, Die-cut...)
export const ProductShapesTable = pgTable(
  "product_shapes",
  {
    id,
    product_id: uuid().notNull().references(() => ProductsTable.id, { onDelete: "cascade" }),
    name: varchar().notNull(),

    // Shape pricing: film wasted around the cut, plus a per-unit cutting fee
    waste_multiplier: numeric({ precision: 4, scale: 2, mode: "number" }).notNull().default(1),
    fee_cents: integer().notNull().default(0),

    sort_order: integer().notNull().default(0),
  },
  t => [
    index("product_shapes_product_idx").on(t.product_id),
    check("product_shapes_pricing_valid", sql`${t.waste_multiplier} >= 1 AND ${t.fee_cents} >= 0`),
  ]
)

// Sizes offered per product. Numeric width/height so the browser can calculate area.
export const ProductSizesTable = pgTable(
  "product_sizes",
  {
    id,
    product_id: uuid().notNull().references(() => ProductsTable.id, { onDelete: "cascade" }),
    label: varchar().notNull(),                                       // '3" x 3"'
    width_in: numeric({ precision: 6, scale: 2, mode: "number" }).notNull(),
    height_in: numeric({ precision: 6, scale: 2, mode: "number" }).notNull(),
    sort_order: integer().notNull().default(0),
  },
  t => [index("product_sizes_product_idx").on(t.product_id)]
)

// Quantities offered per product (what shows in the Quantity select)
export const ProductQuantitiesTable = pgTable(
  "product_quantities",
  {
    id,
    product_id: uuid().notNull().references(() => ProductsTable.id, { onDelete: "cascade" }),
    quantity: integer().notNull(),                                    // 50, 100, 250...
    sort_order: integer().notNull().default(0),
  },
  t => [index("product_quantities_product_idx").on(t.product_id)]
)

// Volume discounts. A break applies to the units ABOVE its quantity:
// above_quantity = 50, discount_percent = 10 means units 51 and up cost 10% less.
export const ProductPriceBreaksTable = pgTable(
  "product_price_breaks",
  {
    id,
    product_id: uuid().notNull().references(() => ProductsTable.id, { onDelete: "cascade" }),
    above_quantity: integer().notNull(),
    discount_percent: numeric({ precision: 5, scale: 2, mode: "number" }).notNull(),
  },
  t => [
    uniqueIndex("product_price_breaks_unique").on(t.product_id, t.above_quantity),
    check(
      "product_price_breaks_valid",
      sql`${t.above_quantity} > 0 AND ${t.discount_percent} >= 0 AND ${t.discount_percent} <= 100`,
    ),
  ]
)

export const productsRelations = relations(ProductsTable, ({ many }) => ({
  materials: many(ProductMaterialsTable),
  shapes: many(ProductShapesTable),
  sizes: many(ProductSizesTable),
  quantities: many(ProductQuantitiesTable),
  priceBreaks: many(ProductPriceBreaksTable),
}))

export const productMaterialsRelations = relations(ProductMaterialsTable, ({ one }) => ({
  product: one(ProductsTable, { fields: [ProductMaterialsTable.product_id], references: [ProductsTable.id] }),
  material: one(MaterialsTable, { fields: [ProductMaterialsTable.material_id], references: [MaterialsTable.id] }),
}))

export const productShapesRelations = relations(ProductShapesTable, ({ one }) => ({
  product: one(ProductsTable, { fields: [ProductShapesTable.product_id], references: [ProductsTable.id] }),
}))

export const productSizesRelations = relations(ProductSizesTable, ({ one }) => ({
  product: one(ProductsTable, { fields: [ProductSizesTable.product_id], references: [ProductsTable.id] }),
}))

export const productQuantitiesRelations = relations(ProductQuantitiesTable, ({ one }) => ({
  product: one(ProductsTable, { fields: [ProductQuantitiesTable.product_id], references: [ProductsTable.id] }),
}))

export const productPriceBreaksRelations = relations(ProductPriceBreaksTable, ({ one }) => ({
  product: one(ProductsTable, { fields: [ProductPriceBreaksTable.product_id], references: [ProductsTable.id] }),
}))