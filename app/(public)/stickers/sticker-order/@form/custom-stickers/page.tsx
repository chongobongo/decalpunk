// Custom Stickers Page - Decal Punk
// app\(public)\stickers\sticker-order\@form\custom-stickers\page.tsx

import { CustomStickerForm } from '@/features/products/custom-stickers/components/CustomStickerForm'
import { getProducts } from '@/features/products/queries/getProducts'

export const dynamic = "force-dynamic"   // always read fresh prices

const page = async () => {
  const products = await getProducts()

  return (
    <section className='flex min-h-0 min-w-0 w-full flex-1 flex-col'>
      <CustomStickerForm products={products} />
    </section>
  )
}

export default page