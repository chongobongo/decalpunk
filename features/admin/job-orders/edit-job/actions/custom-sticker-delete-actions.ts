// custom-sticker-delete-actions.ts
// features\admin\job-orders\new-order\custom-sticker\actions\custom-sticker-delete-actions.ts

"use server"
import { z } from "zod"
import { redirect } from "next/navigation"

import { getCurrentUser } from "@/services/clerk"
import { removeCustomStickerItem } from "../db/custom-sticker-edit-db"
import { updateJobOrderListCache } from "@/features/admin/job-orders/orders-list/db/cache/job-order-list-cache"

// Returns { error, message } so it can be passed straight to <ActionButton action={...} />
export async function deleteCustomStickerItem(stickerId: string) {
    const user = await getCurrentUser()

    if (user.userId == null) {
        return { error: true, message: "You must be logged in to delete an item." }
    }
    // Server actions are public endpoints, so check the role here, not just in the UI.
    // Swap in a canDeleteOrder(user) helper from "@/app/permissions/general" if you prefer.
    if (user.role !== "admin") {
        return { error: true, message: "You do not have permission to delete items." }
    }
    if (!z.string().uuid().safeParse(stickerId).success) {
        return { error: true, message: "Invalid item." }
    }

    let result
    try {
        result = await removeCustomStickerItem(stickerId)
    } catch (e: any) {
        console.error("delete item error:", e?.message, e?.cause?.code, e?.cause?.detail)
        return { error: true, message: "There was an error deleting the item." }
    }

    if (!result) {
        return { error: true, message: "That item no longer exists." }
    }

    if (result.listId) updateJobOrderListCache(result.listId)

    // The last item was removed, so the whole order is gone and this page would 404.
    // redirect() must stay outside the try/catch above (it works by throwing).
    if (result.listDeleted) redirect("/admin/job-orders")

    return {
        error: false,
        message: result.jobOrderDeleted
            ? "Item deleted. The job had no items left, so it was removed too."
            : "Item deleted.",
    }
}