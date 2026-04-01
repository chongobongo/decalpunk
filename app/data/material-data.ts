// Material Data
// features\materials\data\material-data.ts

import materialVinyl from "@/features/home/images/material-vinyl.webp"
import materialMirror from "@/features/home/images/material-mirror.webp"
import materialHologram from "@/features/home/images/material-holographic.webp"
import materialGlitter from "@/features/home/images/material-glitter.webp"

export const vinylSelectorData = [
  {
    id: "0",
    selector: "Die Cut Sticker"
  },
  {
    id: "1",
    selector: "Sticker Sheet"
  },
  {
    id: "2",
    selector: "Kiss Cut Sheet"
  },
  {
    id: "3",
    selector: "Hang Tag Sticker"
  },
  {
    id: "4",
    selector: "Singles on Sheet"
  },
]
    
export const materialData = [
    {
        id: "0",
        url: "vinyl",
        header: "Vinyl",
        description: "Best seller",
        image: materialVinyl.src,
    },
    {
        id: "1",
        url: "holographic",
        header: "Holographic",
        description: "Trippy",
        image: materialHologram.src
    },
      {
        id: "2",
        url: "mirror",
        header: "Mirror",
        description: "So shiny",
        image: materialMirror.src
    },
      {
        id: "3",
        url: "glitter",
        header: "Glitter",
        description: "Sparkle",
        image: materialGlitter.src,
    }
  ]