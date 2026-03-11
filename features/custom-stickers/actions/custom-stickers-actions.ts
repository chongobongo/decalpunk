"use server"

import { redirect } from "next/navigation"

import { z } from "zod"
import { customStickerSchema } from "../schema/customStickerSchema"

import { canCreateBanner, canUpdateBanner } from "../permissions/banner-permissions"

import {
    insertBannerOrder,
    updateBannerOrder as updateBannerOrderDB
 } from "@/features/admin/job-orders/new/banner/db/banners-db"


export async function createBannerOrder(unsafeData: z.infer<typeof customStickerSchema>) {
    const { success, data } = customStickerSchema.safeParse(unsafeData)
    if (!success || !canCreateBanner()) {
        return { error: true, message: "There was an error creating banner order"}
    }


    const order = await insertBannerOrder(data)
    
      redirect(`/admin/job-orders`)
}