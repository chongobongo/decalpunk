// Job Orders Main Page (Open)
// Save as page.tsx in app/(protected)/admin/job-orders/@orders/(index)/

import { desc, eq, inArray } from "drizzle-orm"
import { cacheTag } from "next/cache"

import { db } from "@/db"
import {
    JobOrderListTable,
    JobOrdersTable,
    OrderItemsTable,
    OrdersTable,
    UsersTable,
} from "@/db/schemaDB"
import { getJobOrderListTag } from "@/features/admin/job-orders/orders-list/db/cache/job-order-list-cache"
import {
    JobOrdersListTable,
    type JobOrderListItem,
} from "@/features/admin/job-orders/orders-list/components/JobOrdersListTable"

export default async function JobOrdersPage() {
    const jobOrders = await getOpenJobOrders()

    return (
        <main className="w-full min-w-0 flex-1 p-4 sm:p-6">
            <JobOrdersListTable jobOrdersList={jobOrders} />
        </main>
    )
}

// One overall status per list, from the statuses of its job orders
function summarizeStatus(statuses: string[]) {
    if (statuses.length === 0) return "new"
    if (statuses.includes("in_production")) return "in_production"
    if (statuses.every((s) => s === "ready")) return "ready"
    return "new"
}

// A list is open while at least one of its job orders is not completed or cancelled
async function getOpenJobOrders(): Promise<JobOrderListItem[]> {
    "use cache"
    cacheTag(getJobOrderListTag())

    const lists = await db
        .select({
            id: JobOrderListTable.id,
            job_title: JobOrderListTable.job_title,
            customer: UsersTable.name,
            created_at: JobOrderListTable.created_at,
        })
        .from(JobOrderListTable)
        .leftJoin(UsersTable, eq(JobOrderListTable.user_id, UsersTable.id))
        .orderBy(desc(JobOrderListTable.created_at))

    if (lists.length === 0) return []

    const jobs = await db
        .select({
            id: JobOrdersTable.id,
            list_id: JobOrdersTable.list_id,
            status: JobOrdersTable.status,
            thumbnail_img: JobOrdersTable.thumbnail_img,
        })
        .from(JobOrdersTable)
        .where(
            inArray(
                JobOrdersTable.list_id,
                lists.map((l) => l.id),
            ),
        )

    // Customer order number for each job order (set when the order was paid and fulfilled)
    const jobIds = jobs.map((j) => j.id)
    const orderLinks =
        jobIds.length === 0
            ? []
            : await db
                  .select({
                      job_order_id: OrderItemsTable.job_order_id,
                      order_number: OrdersTable.order_number,
                  })
                  .from(OrderItemsTable)
                  .innerJoin(OrdersTable, eq(OrderItemsTable.order_id, OrdersTable.id))
                  .where(inArray(OrderItemsTable.job_order_id, jobIds))

    const orderNumberByJob = new Map<string, number>()
    for (const link of orderLinks) {
        if (link.job_order_id != null) orderNumberByJob.set(link.job_order_id, link.order_number)
    }

    const jobsByList = new Map<string, typeof jobs>()
    for (const job of jobs) {
        if (job.list_id == null) continue
        const group = jobsByList.get(job.list_id) ?? []
        group.push(job)
        jobsByList.set(job.list_id, group)
    }

    return lists
        .map((list) => {
            const listJobs = jobsByList.get(list.id) ?? []
            const orderNumber =
                listJobs.map((j) => orderNumberByJob.get(j.id)).find((n) => n != null) ?? null

            return {
                id: list.id,
                job_title: list.job_title,
                customer: list.customer,
                created_at: list.created_at,
                item_count: listJobs.length,
                thumbnail: listJobs.find((j) => j.thumbnail_img)?.thumbnail_img ?? null,
                status: summarizeStatus(listJobs.map((j) => j.status)),
                order_number: orderNumber,
                isOpen:
                    listJobs.length === 0 ||
                    listJobs.some((j) => j.status !== "completed" && j.status !== "cancelled"),
            }
        })
        .filter((item) => item.isOpen)
        .map(({ isOpen: _isOpen, ...item }) => item)
}