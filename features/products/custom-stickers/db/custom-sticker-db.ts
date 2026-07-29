// custom-sticker-db.ts
// features\products\custom-stickers\db\custom-sticker-db.ts

import { db } from "@/db";
import { StickersCustomTable } from "@/db/schemaDB";

export async function insertCustomStickerOrder(data: typeof StickersCustomTable.$inferInsert) {
    console.log("insertCustomStickerOrder called with:", JSON.stringify(data))
    try {
        console.log("attempting db insert...")
        const result = await db.insert(StickersCustomTable).values(data).returning()
        console.log("insert success:", JSON.stringify(result))
        return result[0]
    } catch (e: any) {
        console.error("Full DB error:", e?.message, e?.cause, JSON.stringify(e))
        throw e
    }
}