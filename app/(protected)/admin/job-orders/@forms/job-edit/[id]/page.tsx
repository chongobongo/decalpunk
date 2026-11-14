// Job List Edit Page
// app\(protected)\admin\job-orders\@forms\job-edit\[id]\page.tsx

import Link from "next/link"
import { notFound } from "next/navigation"
import { eq } from "drizzle-orm"
import { cacheTag } from "next/cache"

import { db } from "@/db"
import { getJobOrderListTag } from "@/features/admin/job-orders/orders-list/db/cache/job-order-list-cache"
import { JobOrderListTable } from "@/db/schemaDB"
import { JobOrderIndex } from "@/features/admin/job-orders/edit-job/components/JobOrderIndex"


export default async function editJobOrdersPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {

    const { id } = await params
    const job = await getJobOrder(id)

    if (job == null) notFound()

    const jobForIndex = {
        ...job,
        jobOrders: job.jobOrders.map((j) => ({
            ...j,
            job_title: j.job_title ?? "Untitled job",
        })),
    }

    return (
        <main>
            <JobOrderIndex job={jobForIndex} />
        </main>
    )
}

// One list (checkout) with all of its job_orders rows, and every sticker item in each job order
async function getJobOrder(id: string) {
    "use cache"
    cacheTag(
        getJobOrderListTag()
    )

    return db.query.JobOrderListTable.findFirst({
        columns: { id: true, job_title: true },
        where: eq(JobOrderListTable.id, id),
        with: {
            jobOrders: {
                columns: {
                    id: true,
                    list_id: true,
                    product_type: true,
                    job_title: true,
                    item_count: true,
                    status: true,
                    thumbnail_img: true,
                    created_at: true,
                },
                orderBy: (jobOrders, { asc }) => [asc(jobOrders.created_at)],
                with: {
                    customStickers: {
                        columns: {
                            id: true,
                            product: true,
                            shape: true,
                            material: true,
                            finish: true,
                            size: true,
                            quantity: true,
                            img: true,
                        },
                        orderBy: (stickers, { asc }) => [asc(stickers.created_at)],
                    },
                },
            },
        },
    })
}