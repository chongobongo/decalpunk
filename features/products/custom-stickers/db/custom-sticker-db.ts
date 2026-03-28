import { db } from "@/db";
import { StickersCustomTable } from "@/db/schemaDB";

export async function insertCustomStickerOrder(data: typeof StickersCustomTable.$inferInsert) {
    try {
        const result = await db.insert(StickersCustomTable).values(data).returning()
        return result[0]
    } catch (e: any) {
        console.error("Full DB error:", e?.message, e?.cause, JSON.stringify(e))
        throw e
    }
}