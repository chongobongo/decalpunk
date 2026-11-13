// Job Orders Main Page
// src\app\(protected)\admin\job-orders-2\@orders\(index)\page.tsx

import { db } from "@/db"
import { notFound } from "next/navigation"

import { JobOrderListTable, UsersTable } from "@/db/schemaDB"

import { cacheTag } from "next/cache"
import { getJobOrderListTag } from "@/features/admin/job-orders/orders-list/db/cache/job-order-list-cache"

import { JobOrdersListTable } from "@/features/admin/job-orders/orders-list/components/JobOrdersListTable"
import { eq } from "drizzle-orm"

export default async function jobOrdersPage() {

    const jobOrdersList: any = await getJobOrdersList()

    if (jobOrdersList == null) return notFound

    console.log(jobOrdersList)

    return (
        <main>
           <JobOrdersListTable jobOrdersList={jobOrdersList} />
        </main>
    )
}

async function getJobOrdersList() {
    "use cache"
    cacheTag(
        getJobOrderListTag()
    )

return db
    .select({
        id: JobOrderListTable.id,
        job_title: JobOrderListTable.job_title,
        name: UsersTable.name,
    })
    .from(JobOrderListTable)
    .leftJoin(UsersTable, eq(JobOrderListTable.user_id, UsersTable.id))
}
