import React from 'react'
import { CustomStickerForm } from '@/features/custom-stickers/components/CustomStickerForm'

const productListData = [
    {
        id: "0",
        product: "Die-Cut"
    },
        {
        id: "1",
        product: "Sticker Sheet"
    },
            {
        id: "2",
        product: "Transfer Stickers"
    },
    {
        id: "3",
        product: "DTF Heat Transfer"
    }
]

const page = () => {
  return (
<section>
      <CustomStickerForm product={productListData} />
</section>
  )
}

export default page
