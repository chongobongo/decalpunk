// Edit Item Page
// Save this as page.tsx in the route folder your item "Edit" button links to
// (the one behind /admin/job-orders/job-edit/attributes/<item id>/...).
// The [id] param here is the STICKER ITEM id, not the job order id.

import { notFound } from "next/navigation"
import { cacheTag } from "next/cache"
import { eq } from "drizzle-orm"
import { z } from "zod"

import { db } from "@/db"
import { CustomStickersTable } from "@/db/schemaDB"
import { getJobOrderListTag } from "@/features/admin/job-orders/orders-list/db/cache/job-order-list-cache"
import { CustomStickerEditForm } from "@/features/admin/job-orders/edit-job/components/CustomStickerEditForm"
import { getStickerEditOptions } from "@/features/products/queries/getStickerEditOptions"

export default async function EditCustomStickerItemPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    if (!z.string().uuid().safeParse(id).success) notFound()

    const found = await getItem(id)
    if (found == null) notFound()

    const { jobOrder, ...item } = found

    // Dropdown choices come from the product catalog, the same source as the order form
    const { options, finishesByMaterial } = await getStickerEditOptions(item.product)

    return (
        <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-4 sm:p-6">
            <CustomStickerEditForm
                item={item}
                listId={jobOrder?.list_id ?? null}
                options={options}
                finishesByMaterial={finishesByMaterial}
            />
        </main>
    )
}

// Same cache tag as the job-edit page: create, edit and delete all revalidate it.
async function getItem(id: string) {
    "use cache"
    cacheTag(getJobOrderListTag())

    return db.query.CustomStickersTable.findFirst({
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
        where: eq(CustomStickersTable.id, id),
        with: { jobOrder: { columns: { list_id: true } } },
    })
}