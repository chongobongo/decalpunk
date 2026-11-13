// db/tables/stickers-custom-table.ts
import { jsonb, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { id, created_at, updated_at } from "../schemaHelpers";
import type { ImageMetadata } from "@/lib/getImageMetadata";

export const StickersCustomTable = pgTable("stickers_custom", {
    id,
    user_id: text("user_id").notNull(),
    job_order_id: uuid("job_order_id"),
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
})