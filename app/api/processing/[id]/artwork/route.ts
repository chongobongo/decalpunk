// Artwork Download Route
// Save as route.ts in app/api/processing/[id]/artwork/
// The [id] param is the STICKER ITEM id, the same id the processing page uses.
//
// A plain <a download> link is ignored for files on another domain (UploadThing),
// so this route fetches the file and sends it back as an attachment with a useful name.

import { eq } from "drizzle-orm"
import { z } from "zod"

import { db } from "@/db"
import { JobOrderProcessingTable } from "@/db/schemaDB"
import { getCurrentUser } from "@/services/clerk"
import { isUploadThingUrl } from "@/lib/isUploadThingUrl"

// Only admins for now. Add "member" here when workers get access.
const ALLOWED_ROLES: readonly string[] = ["admin"]

const EXTENSIONS: Record<string, string> = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/svg+xml": "svg",
    "application/pdf": "pdf",
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    if (!z.string().uuid().safeParse(id).success) {
        return new Response("Not found", { status: 404 })
    }

    const user = await getCurrentUser({ allData: true })
    if (user.userId == null || !ALLOWED_ROLES.includes(user.role)) {
        return new Response("Forbidden", { status: 403 })
    }

    const row = await db.query.JobOrderProcessingTable.findFirst({
        where: eq(JobOrderProcessingTable.custom_sticker_id, id),
    })
    if (row == null) return new Response("Not found", { status: 404 })

    // A prepared print file wins over the customer's artwork
    const url = row.print_file_url ?? row.artwork_url

    // Only fetch files we stored ourselves, so this route can't be pointed at other sites
    if (!isUploadThingUrl(url)) return new Response("Bad file location", { status: 400 })

    const upstream = await fetch(url)
    if (!upstream.ok || upstream.body == null) {
        return new Response("Could not fetch the file", { status: 502 })
    }

  const contentType =
    upstream.headers.get("content-type")?.split(";")[0]?.trim() || "application/octet-stream"
    const extension = EXTENSIONS[contentType] ?? "png"

    const size = (row.size_label ?? "size").replace(/[^a-z0-9.]+/gi, "").toLowerCase()
    const filename = `sticker-${id.slice(0, 8)}-${size}-x${row.quantity}.${extension}`

    return new Response(upstream.body, {
        headers: {
            "Content-Type": contentType,
            "Content-Disposition": `attachment; filename="${filename}"`,
            "Cache-Control": "private, no-store",
        },
    })
}