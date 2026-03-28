import postgres from "postgres";

export async function GET() {
    const client = postgres(process.env.DATABASE_URL!, { prepare: false })
    try {
        const result = await client`
            insert into stickers_custom (user_id, product, shape, material, size, quantity)
            values ('test-user', 'Die-Cut', 'Contour Cut', 'Vinyl', '2"x2"', '8 Pieces')
            returning *
        `
        return Response.json({ success: true, result })
    } catch (e: any) {
        return Response.json({ 
            error: true, 
            message: e?.message,
            detail: e?.detail,
            code: e?.code,
            full: JSON.stringify(e)
        })
    }
}