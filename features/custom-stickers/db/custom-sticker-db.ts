import { db } from "@/db";
import { StickersCustomTable } from "@/db/schemaDB";

export async function insertCustomStickerOrder(data: typeof StickersCustomTable.$inferInsert) {
    return await db.transaction(async (tx) => {
        const [newCustomStickerOrder] = await tx
            .insert(StickersCustomTable)
            .values(data)

            console.log(newCustomStickerOrder)
    })
}