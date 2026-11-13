// job-orders-table.ts - Job Orders Table

import { index, integer, pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core"
import { id, created_at, updated_at } from "@/db/schemaHelpers"
import { relations } from "drizzle-orm"
import { UsersTable } from "../user-table"
import { CustomStickersTable } from "./product-orders/custom-stickers"
import { JobOrderListTable } from "./job-order-list-table"

export const jobOrderProductTypeEnum = pgEnum("job_order_product_type", [
    "custom_sticker",
    "label",
    "decal",
])

// Placeholder statuses: rename to match your workflow.
export const jobOrderStatusEnum = pgEnum("job_order_status", [
    "new",
    "in_production",
    "ready",
    "completed",
    "cancelled",
])

export type JobOrderProductType = (typeof jobOrderProductTypeEnum.enumValues)[number]
export type JobOrderStatus = (typeof jobOrderStatusEnum.enumValues)[number]

export const JobOrdersTable = pgTable("job_orders", {
    id,
    list_id: uuid("list_id").references(() => JobOrderListTable.id),
    user_id: uuid("user_id"),
    product_type: jobOrderProductTypeEnum("product_type").notNull(),
    job_title: text("job_title"),
    item_count: integer("item_count").notNull().default(1),
    status: jobOrderStatusEnum("status").notNull().default("new"),
    thumbnail_img: text("thumbnail_img"),
    created_at,
    updated_at,
}, (t) => [
    index("job_orders_list_id_idx").on(t.list_id),
    index("job_orders_status_idx").on(t.status),
    index("job_orders_product_type_idx").on(t.product_type),
])

export const JobOrdersRelations = relations(JobOrdersTable, ({ one, many }) => ({
    jobList: one(JobOrderListTable, {
        fields: [JobOrdersTable.list_id],
        references: [JobOrderListTable.id],
    }),
    user: one(UsersTable, {
        fields: [JobOrdersTable.user_id],
        references: [UsersTable.id],
    }),
    customStickers: many(CustomStickersTable),
}))