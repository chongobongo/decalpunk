import React from 'react'
import { CustomStickerForm } from '@/features/custom-stickers/components/CustomStickerForm'
import { productListData } from '@/features/custom-stickers/data/customStickerData'
import { customStickerShape } from '@/features/custom-stickers/data/customStickerData'
import { customStickerMaterialData } from '@/features/custom-stickers/data/customStickerData'
import { customStickerSizeData } from '@/features/custom-stickers/data/customStickerData'
import { customStickerQuantityData } from '@/features/custom-stickers/data/customStickerData'

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
