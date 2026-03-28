import { db } from "@/db";
import { StickersCustomTable } from "@/db/schemaDB";

export async function GET() {
    try {
        const result = await db.insert(StickersCustomTable).values({
            user_id: "test-user",
            product: "Die-Cut",
            shape: "Contour Cut",
            material: "Vinyl",
            size: '2"x2"',
            quantity: "8 Pieces",
        }).returning()
        return Response.json({ success: true, result })
    } catch (e: any) {
        return Response.json({ error: true, message: e?.message, detail: e?.detail, code: e?.code })
    }
}