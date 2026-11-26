// Processing Page - Admin
// Save as page.tsx in app/(protected)/admin/job-orders/processing/[id]/
// The [id] param is the STICKER ITEM id, the same id startProcessingAction redirects with.

import Link from "next/link"
import { notFound } from "next/navigation"
import { eq } from "drizzle-orm"
import { z } from "zod"

import { db } from "@/db"
import { JobOrderProcessingTable } from "@/db/schemaDB"
import { getCurrentUser } from "@/services/clerk"
import { Button } from "@/components/ui/button"

export const dynamic = "force-dynamic"

// Only admins for now. Add "member" here when workers get access.
const ALLOWED_ROLES: readonly string[] = ["admin"]

const STATUS_LABEL: Record<string, string> = {
    queued: "Queued",
    printing: "Printing",
    printed: "Printed",
    finishing: "Finishing",
    qc: "Quality check",
    done: "Done",
    on_hold: "On hold",
    reprint: "Reprint",
}

const STATUS_STYLE: Record<string, string> = {
    queued: "bg-slate-200 text-slate-800",
    printing: "bg-blue-100 text-blue-800",
    printed: "bg-indigo-100 text-indigo-800",
    finishing: "bg-purple-100 text-purple-800",
    qc: "bg-amber-100 text-amber-800",
    done: "bg-green-100 text-green-800",
    on_hold: "bg-red-100 text-red-800",
    reprint: "bg-orange-100 text-orange-800",
}

function dpiBadge(dpi: number | null) {
    if (dpi == null) return { label: "Resolution unknown", style: "bg-slate-200 text-slate-800" }
    if (dpi >= 300) return { label: `${dpi} DPI, good`, style: "bg-green-100 text-green-800" }
    if (dpi >= 150) return { label: `${dpi} DPI, check quality`, style: "bg-amber-100 text-amber-800" }
    return { label: `${dpi} DPI, too low`, style: "bg-red-100 text-red-800" }
}

function formatDate(date: Date | null) {
    if (!date) return "-"
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "America/Los_Angeles",
    })
}

export default async function ProcessingPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    if (!z.string().uuid().safeParse(id).success) notFound()

    const user = await getCurrentUser({ allData: true })
    if (user.userId == null || !ALLOWED_ROLES.includes(user.role)) notFound()

    const row = await db.query.JobOrderProcessingTable.findFirst({
        where: eq(JobOrderProcessingTable.custom_sticker_id, id),
    })
    if (row == null) notFound()

    // A prepared print file wins over the customer's artwork
    const imageUrl = row.print_file_url ?? row.artwork_url
    const usingPrintFile = row.print_file_url != null
    const dpi = dpiBadge(row.effective_dpi)
    const printSize =
        row.print_width_in != null && row.print_height_in != null
            ? `${row.print_width_in} x ${row.print_height_in} in`
            : (row.size_label ?? "-")
    const totalToPrint = row.quantity + row.spare_count

    return (
        <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 sm:p-6">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                    <h1 className="truncate text-2xl font-bold">{row.product ?? "Sticker"}</h1>
                    <p className="text-sm text-muted-foreground">
                        {row.shape} · {row.material} · {row.finish}
                    </p>
                </div>
                <span
                    className={`rounded-full px-3 py-1 text-sm font-medium ${
                        STATUS_STYLE[row.status] ?? "bg-slate-200 text-slate-800"
                    }`}
                >
                    {STATUS_LABEL[row.status] ?? row.status}
                </span>
            </div>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
                {/* Artwork viewer */}
                <section className="flex min-w-0 flex-col gap-3">
                    <div
                        className="flex items-center justify-center overflow-hidden rounded-lg border p-4"
                        style={{
                            backgroundColor: "#ffffff",
                            backgroundImage:
                                "conic-gradient(#e2e8f0 25%, #ffffff 0 50%, #e2e8f0 0 75%, #ffffff 0)",
                            backgroundSize: "24px 24px",
                        }}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={imageUrl}
                            alt="Artwork to print"
                            className="max-h-[70vh] w-auto max-w-full object-contain"
                        />
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <Button asChild>
                            <a href={`/api/processing/${row.custom_sticker_id}/artwork`}>Download file</a>
                        </Button>
                        <Button asChild variant="outline">
                            <a href={imageUrl} target="_blank" rel="noopener noreferrer">
                                Open full size
                            </a>
                        </Button>
                        <span className={`rounded-full px-3 py-1 text-sm font-medium ${dpi.style}`}>
                            {dpi.label}
                        </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {usingPrintFile
                            ? `Showing the prepared print file${row.print_file_name ? ` (${row.print_file_name})` : ""}.`
                            : "Showing the customer's original artwork."}
                    </p>
                </section>

                {/* Print spec */}
                <aside className="flex flex-col gap-4 rounded-lg border bg-white p-4">
                    <h2 className="text-lg font-semibold">How to print</h2>
                    <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-2 text-sm">
                        <dt className="text-muted-foreground">Material</dt>
                        <dd className="font-medium">{row.material ?? "-"}</dd>

                        <dt className="text-muted-foreground">Finish</dt>
                        <dd className="font-medium">{row.finish ?? "-"}</dd>

                        <dt className="text-muted-foreground">Shape</dt>
                        <dd className="font-medium">{row.shape ?? "-"}</dd>

                        <dt className="text-muted-foreground">Print size</dt>
                        <dd className="font-medium">{printSize}</dd>

                        <dt className="text-muted-foreground">Quantity</dt>
                        <dd className="font-medium">{row.quantity}</dd>

                        <dt className="text-muted-foreground">Spares</dt>
                        <dd className="font-medium">{row.spare_count}</dd>

                        <dt className="text-muted-foreground">Print total</dt>
                        <dd className="font-semibold">{totalToPrint}</dd>

                        <dt className="text-muted-foreground">Printer</dt>
                        <dd className="font-medium">{row.printer ?? "-"}</dd>

                        <dt className="text-muted-foreground">Profile</dt>
                        <dd className="font-medium">{row.print_profile ?? "-"}</dd>
                    </dl>

                    <hr />

                    <h3 className="text-sm font-semibold">Artwork file</h3>
                    <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-2 text-sm">
                        <dt className="text-muted-foreground">Pixels</dt>
                        <dd className="font-medium">
                            {row.artwork_width_px && row.artwork_height_px
                                ? `${row.artwork_width_px} x ${row.artwork_height_px}`
                                : "-"}
                        </dd>

                        <dt className="text-muted-foreground">Type</dt>
                        <dd className="font-medium">{row.artwork_type ?? "-"}</dd>

                        <dt className="text-muted-foreground">File size</dt>
                        <dd className="font-medium">
                            {row.artwork_bytes ? `${(row.artwork_bytes / 1024).toFixed(0)} KB` : "-"}
                        </dd>

                        <dt className="text-muted-foreground">Queued</dt>
                        <dd className="font-medium">{formatDate(row.queued_at)}</dd>

                        <dt className="text-muted-foreground">Due</dt>
                        <dd className="font-medium">{formatDate(row.due_at)}</dd>
                    </dl>

                    {row.worker_notes ? (
                        <>
                            <hr />
                            <h3 className="text-sm font-semibold">Notes</h3>
                            <p className="whitespace-pre-wrap text-sm">{row.worker_notes}</p>
                        </>
                    ) : null}

                    {row.status === "on_hold" && row.hold_reason ? (
                        <p className="rounded-md bg-red-50 p-3 text-sm text-red-800">
                            On hold: {row.hold_reason}
                        </p>
                    ) : null}
                </aside>
            </div>

            <div>
                <Button asChild variant="outline">
                    <Link href="/admin/job-orders">Back to job orders</Link>
                </Button>
            </div>
        </main>
    )
}