// JobOrderIndex.tsx
// features\admin\job-orders\edit-job\components\JobOrderIndex.tsx
// Shows every job_orders row in one job_order_list. Each job order has its table headers
// and row, with the items inside it listed underneath. Each item has its own Edit and Delete.

import { Fragment } from "react"
import Link from "next/link"
import { Trash2Icon } from "lucide-react"

import { ActionButton } from "@/components/ActionButton"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { JobOrderProductType, JobOrderStatus } from "@/db/schemaDB"
import { deleteCustomStickerItem } from "../actions/custom-sticker-delete-actions"

const PRODUCT_LABELS: Record<JobOrderProductType, string> = {
    custom_sticker: "Custom Sticker",
    label: "Label",
    decal: "Decal",
}

const STATUS_LABELS: Record<JobOrderStatus, string> = {
    new: "New",
    in_production: "In production",
    ready: "Ready",
    completed: "Completed",
    cancelled: "Cancelled",
}

// Dates are formatted on the server, so pin the time zone (otherwise it uses the server's).
const dateFormat = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Los_Angeles",
})

type StickerItem = {
    id: string
    product: string | null
    shape: string | null
    material: string | null
    finish: string | null
    size: string | null
    quantity: string | null
    img: string | null
}

type JobOrderRow = {
    id: string
    job_title: string
    product_type: JobOrderProductType
    item_count: number
    status: JobOrderStatus
    created_at: Date
    customStickers: StickerItem[]
}

function itemSummary(item: StickerItem) {
    return [item.shape, item.material, item.finish, item.size].filter(Boolean).join(" · ")
}

export function JobOrderIndex({
    job,
}: {
    job: {
        id: string
        job_title?: string | null
        jobOrders: JobOrderRow[]
    }
}) {
    return (
        <section className="flex flex-col gap-4 p-5">
            <div>
                <h2 className="text-lg font-semibold">{job.job_title ?? "Untitled order"}</h2>
                <p className="text-sm text-muted-foreground">
                    Order ID: {job.id} · {job.jobOrders.length}{" "}
                    {job.jobOrders.length === 1 ? "job" : "jobs"}
                </p>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Job</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {job.jobOrders.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center text-muted-foreground">
                                No jobs in this order yet.
                            </TableCell>
                        </TableRow>
                    ) : (
                        job.jobOrders.map((jobOrder) => (
                            <Fragment key={jobOrder.id}>
                                <TableRow>
                                    <TableCell>
                                        <div className="font-medium">{jobOrder.job_title}</div>
                                        <div className="text-xs text-muted-foreground">{jobOrder.id}</div>
                                    </TableCell>
                                    <TableCell>{PRODUCT_LABELS[jobOrder.product_type]}</TableCell>
                                    <TableCell>{jobOrder.item_count}</TableCell>
                                    <TableCell>{STATUS_LABELS[jobOrder.status]}</TableCell>
                                    <TableCell>{dateFormat.format(jobOrder.created_at)}</TableCell>
                                    <TableCell><Button asChild className="bg-slate-900"><Link href={`/admin/job-orders/add-job/${jobOrder.id}`}><h3 className="text-slate-100 text-center text-md">Add Job</h3></Link></Button></TableCell>
                                </TableRow>

                                {/* The items inside this job order, each with its own Edit and Delete */}
                                <TableRow>
                                    <TableCell colSpan={5} className="bg-muted/30">
                                        {jobOrder.customStickers.length === 0 ? (
                                            <p className="text-sm text-muted-foreground">No items.</p>
                                        ) : (
                                            <ul className="flex flex-col gap-2">
                                                {jobOrder.customStickers.map((item, index) => (
                                                    <li key={item.id} className="flex items-center gap-4 text-sm">
                                                        <span className="w-6 text-muted-foreground">{index + 1}.</span>
                                                        {item.img ? (
                                                            // eslint-disable-next-line @next/next/no-img-element
                                                            <img
                                                                src={item.img}
                                                                alt=""
                                                                width={40}
                                                                height={40}
                                                                className="h-10 w-10 rounded object-contain"
                                                            />
                                                        ) : (
                                                            <span className="h-10 w-10" />
                                                        )}
                                                        <div className="flex flex-col">
                                                            <span className="font-medium">{item.product ?? "Sticker"}</span>
                                                            <span className="text-muted-foreground">{itemSummary(item)}</span>
                                                        </div>
                                                        <span className="ml-auto">Qty {item.quantity ?? "-"}</span>
                                                        <Button asChild size="sm" className="bg-slate-900">
                                                            <Link href={`/admin/job-orders/attributes/${item.id}`}>
                                                                <h3 className="text-slate-100 text-center text-md">Review</h3>
                                                            </Link>
                                                        </Button>
                                                        <ActionButton
                                                            variant="outline"
                                                            size="sm"
                                                            requireAreYouSure
                                                            aria-label="Delete item"
                                                            action={deleteCustomStickerItem.bind(null, item.id)}
                                                        >
                                                            <Trash2Icon className="text-red-600" />
                                                        </ActionButton>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </TableCell>
                                </TableRow>
                            </Fragment>
                        ))
                    )}
                </TableBody>
            </Table>
        </section>
    )
}