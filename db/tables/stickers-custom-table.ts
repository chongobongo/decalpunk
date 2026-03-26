import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { id } from "../schemaHelpers";


export const StickersCustomTable = pgTable("stickers_custom", {
    id,
    job_order_id: uuid(),
    product: text(),
    shape: text(),
    material: text(),
    finish: text(),
    size: text(),
    quantity: text(),
    img: text()
})