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
import { PageHeader } from "@/components/PageHeader"
import {
    CustomStickerEditForm,
    type StickerEditOptions,
} from "@/features/admin/job-orders/edit-job/components/CustomStickerEditForm"

// "value" is what gets saved to the database, so it must match what your create form saves.
// While a list is empty, that dropdown only contains the item's current value.
// TODO: fill in material, finish, size and quantity the same way as shape.
const OPTIONS: StickerEditOptions = {
    shape: [
        { value: "Circle", label: "Circle" },
        { value: "Square", label: "Square" },
        { value: "Rounded Corners", label: "Rounded Corners" },
        { value: "Contoured Cut", label: "Contoured Cut" },
    ],
    material: [],
    finish: [
        { value: "Glossy", label: "Glossy"},
        { value: "Matte", label: "Matte" },
        { value: "Cracked Ice", label: "Cracked Ice"}
    ],
    size: [
        { value: "2x2", label: "2x2" },
        { value: "3x3", label: "3x3" },
        { value: "4x4", label: "4x4" }
    ],
    quantity: [
        { value: "25", label: "25" },
        { value: "50", label: "50" },
        { value: "100", label: "100" }
    ],
}

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

    return (
        <main className="flex flex-col gap-6">
            <CustomStickerEditForm
                item={item}
                listId={jobOrder?.list_id ?? null}
                options={OPTIONS}
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