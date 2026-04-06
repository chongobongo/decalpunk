// Custom Stickers Order Form - Decal Punk
// app\(public)\stickers\(pages)\custom-stickers\page.tsx

import { CustomStickerForm } from '@/features/products/custom-stickers/components/CustomStickerForm'
import { productData } from '@/app/data'

const page = () => {
  return (
<section>
      <CustomStickerForm
            products={productData} />
</section>
  )
}

export default page