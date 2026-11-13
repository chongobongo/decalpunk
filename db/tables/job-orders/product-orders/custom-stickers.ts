// Custom Stickers Table

import { index, jsonb, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { id, created_at, updated_at } from "@/db/schemaHelpers";
import { JobOrdersTable } from "../job-orders-table";
import type { ImageMetadata } from "@/lib/getImageMetadata";

export const CustomStickersTable = pgTable("job_orders_custom_sticker", {
    id,
    job_order_id: uuid("job_order_id").notNull()
        .references(() => JobOrdersTable.id, { onDelete: "cascade" }),
    product: text("product"),
    shape: text("shape"),
    material: text("material"),
    finish: text("finish"),
    size: text("size"),
    quantity: text("quantity"),
    img: text("img"),
    image_metadata: jsonb("image_metadata").$type<ImageMetadata>(),
    created_at,
    updated_at,
}, (t) => [
    index("custom_sticker_job_order_id_idx").on(t.job_order_id),
])

export const CustomStickerOrderRelations = relations(CustomStickersTable, ({ one }) => ({
    jobOrder: one(JobOrdersTable, {
        fields: [CustomStickersTable.job_order_id],
        references: [JobOrdersTable.id],
    }),
}))