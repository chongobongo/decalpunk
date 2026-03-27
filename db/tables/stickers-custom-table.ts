import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { id } from "../schemaHelpers";

export const StickersCustomTable = pgTable("stickers_custom", {
    id,
    job_order_id: uuid("job_order_id"),
    product: text("product"),
    shape: text("shape"),
    material: text("material"),
    finish: text("finish"),
    size: text("size"),
    quantity: text("quantity"),
    img: text("img")
})