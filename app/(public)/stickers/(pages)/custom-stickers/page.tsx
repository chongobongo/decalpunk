import React from 'react'
import { CustomStickerForm } from '@/features/products/custom-stickers/components/CustomStickerForm'
import { productListData } from '@/features/data/customStickerData'
import { customStickerShape } from '@/features/data/customStickerData'
import { customStickerMaterialData } from '@/features/data/customStickerData'
import { customStickerSizeData } from '@/features/data/customStickerData'
import { customStickerQuantityData } from '@/features/data/customStickerData'

const page = () => {
  return (
<section>
      <CustomStickerForm
            product={productListData}
            shape={customStickerShape}
            material={customStickerMaterialData}
            size={customStickerSizeData}
            quantity={customStickerQuantityData} />
</section>
  )
}

export default page