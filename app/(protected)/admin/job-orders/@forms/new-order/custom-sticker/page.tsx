// Custom Stickers Order Form - Decal Punk
// app\(public)\stickers\(pages)\custom-stickers\page.tsx

import { CustomStickerForm } from '@/features/admin/job-orders/new-order/custom-sticker/components/CustomStickerForm'
import { productData } from '@/app/data'

const page = () => {
  return (
<section className='flex min-h-0 min-w-0 w-full flex-1 flex-col'>
      <CustomStickerForm
            products={productData} />
</section>
  )
}

export default page