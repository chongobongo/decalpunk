// Material Data
// features\materials\data\material-data.ts

import material_aluminum from"@/app/images/material/material_aluminum.webp"
import material_glitter from "@/app/images/material/material_glitter.png"
import material_glow from "@/app/images/material/material_glow.webp"
import material_holographic from "@/app/images/material/material_holographic.webp"
import material_mirror from "@/app/images/material/material_mirror.webp"
import material_paper from "@/app/images/material/material_paper.webp"
import material_pixie from "@/app/images/material/material_pixie.webp"
import material_prismatic from "@/app/images/material/material_prismatic.png"
import material_reflective from "@/app/images/material/material_reflective.webp"
import material_transparent from "@/app/images/material/material_transparent.png"
import material_vinyl from "@/app/images/material/material_vinyl.png"


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
        image: material_vinyl.src,
    },
        {
        id: "1",
        url: "aluminum",
        header: "Aluminum",
        description: "So Shiny",
        image: material_aluminum.src,
    },
            {
        id: "2",
        url: "glitter",
        header: "Glitter",
        description: "Sparkley",
        image: material_glitter.src,
    },
                {
        id: "3",
        url: "glow",
        header: "Glow in the Dark",
        description: "Spooky",
        image: material_glow.src,
    },
                {
        id: "4",
        url: "holographic",
        header: "Holographic",
        description: "Trippy",
        image: material_holographic.src,
    },
                {
        id: "5",
        url: "mirror",
        header: "Mirror",
        description: "See yourself",
        image: material_mirror.src,
    },
                {
        id: "6",
        url: "paper",
        header: "Kraft Paper",
        description: "It's vegan",
        image: material_paper.src,
    },
                {
        id: "7",
        url: "pixie",
        header: "Pixie",
        description: "Wow",
        image: material_pixie.src,
    },
                {
        id: "8",
        url: "prismatic",
        header: "Prismatic",
        description: "Eye catching",
        image: material_prismatic.src,
    },
                {
        id: "9",
        url: "reflective",
        header: "Reflective",
        description: "Attention getter",
        image: material_reflective.src,
    },
                    {
        id: "10",
        url: "transparent",
        header: "Transparent",
        description: "See through",
        image: material_transparent.src,
    },
                        {
        id: "11",
        url: "high-tack",
        header: "High Tack",
        description: "Super sticky",
        image: material_vinyl.src,
    },
                        {
        id: "12",
        url: "low-tack",
        header: "Low-Tack Vinyl",
        description: "Peelable",
        image: material_vinyl.src,
    }
  ]