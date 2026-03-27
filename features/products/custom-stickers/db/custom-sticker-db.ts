import { db } from "@/db";
import { StickersCustomTable } from "@/db/schemaDB";

export async function insertCustomStickerOrder(data: typeof StickersCustomTable.$inferInsert) {
    console.log("Starting insert with data:", JSON.stringify(data))
    try {
        const result = await db.insert(StickersCustomTable).values(data).returning()
        console.log("Insert result:", JSON.stringify(result))
        return result[0]
    } catch (e) {
        console.error("DB insert error:", e)
        throw e
    }
}