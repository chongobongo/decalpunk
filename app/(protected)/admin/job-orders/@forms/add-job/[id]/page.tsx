// Add Item Page
// app\(protected)\admin\job-orders\@forms\add-job\[id]\page.tsx

import { notFound } from "next/navigation"
import { cacheTag } from "next/cache"
import { eq } from "drizzle-orm"
import { z } from "zod"

import { db } from "@/db"
import { JobOrdersTable } from "@/db/schemaDB"
import { getJobOrderListTag } from "@/features/admin/job-orders/orders-list/db/cache/job-order-list-cache"
import { PageHeader } from "@/components/PageHeader"
import { CustomStickerAddForm } from "@/features/admin/job-orders/add-order/components/CustomStickerAddForm"
import { STICKER_OPTIONS } from "@/features/admin/job-orders/add-order/options/customStickerOptions"

export default async function AddCustomStickerItemPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    if (!z.string().uuid().safeParse(id).success) notFound()

    const jobOrder = await getJobOrder(id)
    if (jobOrder == null || jobOrder.product_type !== "custom_sticker") notFound()

    // The new item uses the same product as the job's existing items
    const product = jobOrder.customStickers[0]?.product
    if (!product) notFound()

    return (
        <main className="flex flex-col gap-6">
            <div>
                <PageHeader title="Add Item" />
                <p className="text-sm text-muted-foreground">
                    Adding to: {jobOrder.job_title ?? "Untitled job"}
                </p>
            </div>
            <CustomStickerAddForm
                jobOrderId={jobOrder.id}
                listId={jobOrder.list_id}
                product={product}
                options={STICKER_OPTIONS}
            />
        </main>
    )
}

// Same cache tag as the other job pages: create, edit, add and delete all revalidate it.
async function getJobOrder(id: string) {
    "use cache"
    cacheTag(getJobOrderListTag())

    return db.query.JobOrdersTable.findFirst({
        columns: { id: true, list_id: true, job_title: true, product_type: true },
        where: eq(JobOrdersTable.id, id),
        with: { customStickers: { columns: { product: true }, limit: 1 } },
    })
}