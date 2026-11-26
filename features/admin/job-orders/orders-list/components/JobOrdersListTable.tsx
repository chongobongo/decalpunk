// Job Orders List Table
// features\admin\job-orders\orders-list\components\JobOrdersListTable.tsx

import Link from "next/link"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export type JobOrderListItem = {
    id: string
    job_title: string | null
    customer: string | null
    created_at: Date
    item_count: number
    thumbnail: string | null
    status: string
    order_number: number | null
}

const STATUS_LABEL: Record<string, string> = {
    new: "New",
    in_production: "In production",
    ready: "Ready",
    completed: "Completed",
    cancelled: "Cancelled",
}

const STATUS_STYLE: Record<string, string> = {
    new: "bg-slate-200 text-slate-800",
    in_production: "bg-blue-100 text-blue-800",
    ready: "bg-green-100 text-green-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
}

function formatDate(date: Date) {
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "America/Los_Angeles",
    })
}

export function JobOrdersListTable({ jobOrdersList }: { jobOrdersList: JobOrderListItem[] }) {
    if (jobOrdersList.length === 0) {
        return (
            <p className="rounded-lg border bg-white p-6 text-center text-muted-foreground">
                No open job orders.
            </p>
        )
    }

    return (
        <div className="overflow-hidden rounded-lg border bg-white">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Job</TableHead>
                        <TableHead className="hidden md:table-cell">Customer</TableHead>
                        <TableHead className="hidden sm:table-cell">Items</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="hidden lg:table-cell">Created</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {jobOrdersList.map((item) => (
                        <TableRow key={item.id} className="hover:bg-slate-50">
                            <TableCell>
                                <Link
                                    href={`/admin/job-orders/job-edit/${item.id}`}
                                    className="flex min-w-0 items-center gap-3"
                                >
                                    {item.thumbnail ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={item.thumbnail}
                                            alt=""
                                            className="h-12 w-12 shrink-0 rounded border bg-white object-contain"
                                        />
                                    ) : (
                                        <div className="h-12 w-12 shrink-0 rounded border bg-slate-100" />
                                    )}
                                    <div className="min-w-0">
<p className="truncate font-medium">
    {item.order_number != null
        ? `#${item.order_number}`
        : (item.job_title ?? "Untitled job")}
</p>
                                        {/* Shown here on small screens, where the columns are hidden */}
                                        <p className="truncate text-sm text-muted-foreground md:hidden">
                                            {item.customer ?? "Unknown customer"} · {item.item_count}{" "}
                                            {item.item_count === 1 ? "item" : "items"}
                                        </p>
                                    </div>
                                </Link>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                                {item.customer ?? "Unknown customer"}
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">{item.item_count}</TableCell>
                            <TableCell>
                                <span
                                    className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${
                                        STATUS_STYLE[item.status] ?? "bg-slate-200 text-slate-800"
                                    }`}
                                >
                                    {STATUS_LABEL[item.status] ?? item.status}
                                </span>
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">
                                {formatDate(item.created_at)}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}