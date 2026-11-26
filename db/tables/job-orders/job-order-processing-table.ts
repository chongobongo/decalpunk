// db/tables/job-orders/job-order-processing-table.ts

import { check, index, integer, numeric, pgEnum, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core"
import { relations, sql } from "drizzle-orm"
import { id, created_at, updated_at } from "@/db/schemaHelpers"
import { UsersTable } from "../user-table"
import { JobOrdersTable } from "./job-orders-table"
import { CustomStickersTable } from "./product-orders/custom-stickers"

export const processingStatusEnum = pgEnum("job_order_processing_status", [
    "queued", "printing", "printed", "finishing", "qc", "done", "on_hold", "reprint",
])

export const JobOrderProcessingTable = pgTable(
    "job_order_processing",
    {
        id,
        job_order_id: uuid().notNull().references(() => JobOrdersTable.id, { onDelete: "cascade" }),
        custom_sticker_id: uuid().notNull().unique().references(() => CustomStickersTable.id, { onDelete: "cascade" }),

        status: processingStatusEnum().notNull().default("queued"),
        priority: integer().notNull().default(0),
        due_at: timestamp({ withTimezone: true }),
        assigned_to: uuid().references(() => UsersTable.id, { onDelete: "set null" }),

        // Spec snapshot, frozen when the boss clicks Processing
        product: text(),
        shape: text(),
        material: text(),
        finish: text(),
        size_label: text(),
        print_width_in: numeric({ precision: 6, scale: 2, mode: "number" }),
        print_height_in: numeric({ precision: 6, scale: 2, mode: "number" }),
        quantity: integer().notNull(),
        spare_count: integer().notNull().default(0),

        // Artwork snapshot
        artwork_url: text().notNull(),
        artwork_width_px: integer(),
        artwork_height_px: integer(),
        artwork_type: varchar(),
        artwork_bytes: integer(),
        effective_dpi: integer(),

        // Optional prepared print file
        print_file_url: text(),
        print_file_name: varchar(),
        print_file_uploaded_at: timestamp({ withTimezone: true }),
        print_file_uploaded_by: uuid().references(() => UsersTable.id, { onDelete: "set null" }),

        printer: varchar(),
        print_profile: varchar(),

        queued_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
        started_at: timestamp({ withTimezone: true }),
        printed_at: timestamp({ withTimezone: true }),
        completed_at: timestamp({ withTimezone: true }),

        worker_notes: text(),
        hold_reason: text(),
        reprint_count: integer().notNull().default(0),

        created_at,
        updated_at,
    },
    t => [
        index("job_order_processing_status_idx").on(t.status, t.priority),
        index("job_order_processing_assigned_idx").on(t.assigned_to),
        index("job_order_processing_job_order_idx").on(t.job_order_id),
        check("job_order_processing_quantity_positive", sql`${t.quantity} > 0 AND ${t.spare_count} >= 0`),
    ],
)

export const JobOrderProcessingRelations = relations(JobOrderProcessingTable, ({ one }) => ({
    jobOrder: one(JobOrdersTable, { fields: [JobOrderProcessingTable.job_order_id], references: [JobOrdersTable.id] }),
    sticker: one(CustomStickersTable, { fields: [JobOrderProcessingTable.custom_sticker_id], references: [CustomStickersTable.id] }),
    assignee: one(UsersTable, { fields: [JobOrderProcessingTable.assigned_to], references: [UsersTable.id] }),
}))