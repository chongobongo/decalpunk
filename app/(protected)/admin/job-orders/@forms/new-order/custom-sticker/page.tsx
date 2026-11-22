// Custom Stickers Order Form - Decal Punk
// app\(public)\stickers\(pages)\custom-stickers\page.tsx

import { CustomStickerForm } from '@/features/admin/job-orders/new-order/custom-sticker/components/CustomStickerForm'
import { getProducts } from "@/features/products/queries/getProducts"

export const dynamic = "force-dynamic"   // always read fresh prices

export default async function Page() {
  const products = await getProducts()
  
console.log(JSON.stringify(products[0], null, 2))

  return (
    <section className="flex min-h-0 w-full min-w-0 flex-1 flex-col">
      <CustomStickerForm products={products} />
    </section>
  )
}