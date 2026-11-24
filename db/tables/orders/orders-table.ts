// Orders Table
// db\tables\orders\orders-table.ts

import { id, created_at, updated_at } from "@/db/schemaHelpers"
import { check, index, integer, jsonb, pgEnum, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core"
import { relations, sql } from "drizzle-orm"
import { UsersTable } from "../user-table"
import { ProductsTable } from "../products/products-table"
import { MaterialsTable } from "../materials/materials-ai"
import { JobOrdersTable } from "../job-orders/job-orders-table"

export const orderStatusEnum = pgEnum("order_status", [
  "pending", "paid", "in_production", "shipped", "completed", "cancelled", "refunded",
])

export const OrdersTable = pgTable(
  "orders",
  {
    id,
    order_number: integer().generatedAlwaysAsIdentity({ startWith: 1001 }),
    user_id: uuid().notNull().references(() => UsersTable.id, { onDelete: "restrict" }),
    status: orderStatusEnum().notNull().default("pending"),
    total_cents: integer().notNull(),
    currency: varchar().notNull().default("usd"),
    stripe_checkout_session_id: varchar().unique(),
    stripe_payment_intent_id: varchar(),
    paid_at: timestamp(),
    notes: text(),
    created_at,
    updated_at,
  },
  t => [
    index("orders_user_idx").on(t.user_id, t.created_at),
    index("orders_status_idx").on(t.status),
    check("orders_total_nonnegative", sql`${t.total_cents} >= 0`),
  ]
)

export const OrderItemsTable = pgTable(
  "order_items",
  {
    id,
    order_id: uuid().notNull().references(() => OrdersTable.id, { onDelete: "cascade" }),
    product_id: uuid().references(() => ProductsTable.id, { onDelete: "set null" }),
    material_id: uuid().references(() => MaterialsTable.id, { onDelete: "set null" }),
    job_order_id: uuid().references(() => JobOrdersTable.id, { onDelete: "set null" }),
    product_name: varchar().notNull(),
    material_name: varchar().notNull(),
    shape: varchar().notNull(),
    finish: varchar().notNull(),
    size: varchar().notNull(),
    quantity: integer().notNull(),
    unit_cents: integer().notNull(),
    total_cents: integer().notNull(),
    image_url: varchar().notNull(),
    image_metadata: jsonb(),
    created_at,
  },
  t => [
    index("order_items_order_idx").on(t.order_id),
    check("order_items_valid", sql`${t.quantity} > 0 AND ${t.total_cents} >= 0`),
  ]
)

export const ordersRelations = relations(OrdersTable, ({ many }) => ({ items: many(OrderItemsTable) }))
export const orderItemsRelations = relations(OrderItemsTable, ({ one }) => ({
  order: one(OrdersTable, { fields: [OrderItemsTable.order_id], references: [OrdersTable.id] }),
}))