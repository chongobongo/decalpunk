// Custom Sticker Data
// app\data\custom-sticker-data.ts

import material_aluminum from "@/app/images/custom-sticker/material_aluminum.png"
import material_glitter from "@/app/images/custom-sticker/material_glitter.png"
import material_glow from "@/app/images/custom-sticker/material_glow.png"
import material_holographic from "@/app/images/custom-sticker/material_holographic.png"
import material_mirror from "@/app/images/custom-sticker/material_mirror.png"
import material_paper from "@/app/images/custom-sticker/material_paper.png"
import material_pixie from "@/app/images/custom-sticker/material_pixie.png"
import material_prismatic from "@/app/images/custom-sticker/material_prismatic.png"
import material_reflective from "@/app/images/custom-sticker/material_reflective.png"
import material_transparent from "@/app/images/custom-sticker/material_transparent.png"
import material_vinyl from "@/app/images/custom-sticker/material_vinyl.png"


export const productData = [

// Die Cut Sticker
  {
    id: "prod_0",
    product: "Die Cut Sticker",
    shapes: [
      { id: "shape_0", shape: "Circle" },
      { id: "shape_1", shape: "Square" },
      { id: "shape_2", shape: "Rounded Corners" },
      { id: "shape_3", shape: "Contour Cut" },
    ],
    materials: [
      {
        id: "mat_0",
        material: "Vinyl",
        img: material_vinyl.src,
        finishes: [
          { id: "fin_0", finish: "Glossy" },
          { id: "fin_1", finish: "Matte" },
          { id: "fin_2", finish: "Cracked Ice" },
        ],
      },
      {
        id: "mat_1",
        material: "Holographic",
        img: material_holographic.src,
        finishes: [
          { id: "fin_2", finish: "Glossy" },
        ],
      },
      {
        id: "mat_2",
        material: "Transparency",
        img: material_transparent.src,
        finishes: [
          { id: "fin_3", finish: "Glossy" },
          { id: "fin_4", finish: "Matte" },
        ],
      },
        {
        id: "mat_3",
        material: "Glitter",
        img: material_glitter.src,
        finishes: [
          { id: "fin_3", finish: "Glossy" },
        ],
      },
              {
        id: "mat_4",
        material: "Mirror",
        img: material_mirror.src,
        finishes: [
          { id: "fin_3", finish: "Glossy" },
        ],
      },
              {
        id: "mat_5",
        material: "Pixie Dust",
        img: material_pixie.src,
        finishes: [
          { id: "fin_3", finish: "Glossy" },
        ],
      },
              {
        id: "mat_6",
        material: "Prismatic",
        img: material_prismatic.src,
        finishes: [
          { id: "fin_3", finish: "Glossy" },
        ],
      },
              {
        id: "mat_7",
        material: "Brushed Aluminum",
        img: material_aluminum.src,
        finishes: [
          { id: "fin_3", finish: "Glossy" },
        ],
      },
              {
        id: "mat_8",
        material: "Kraft Paper",
        img: material_paper.src,
        finishes: [
          { id: "fin_3", finish: "Uncoated" },
        ],
      },
              {
        id: "mat_9",
        material: "High-Tack Vinyl",
        img: material_vinyl.src,
        finishes: [
            { id: "fin_0", finish: "Glossy" },
          { id: "fin_1", finish: "Matte" },
          { id: "fin_2", finish: "Cracked Ice" },
        ],
      },
                    {
        id: "mat_10",
        material: "Low-Tack Vinyl",
        img: material_vinyl.src,
        finishes: [
            { id: "fin_0", finish: "Glossy" },
          { id: "fin_1", finish: "Matte" },
          { id: "fin_2", finish: "Cracked Ice" },
        ],
      },
                    {
        id: "mat_11",
        material: "Reflective",
        img: material_reflective.src,
        finishes: [
            { id: "fin_0", finish: "Glossy" },
        ],
      },
                          {
        id: "mat_12",
        material: "Glow in the Dark",
        img: material_glow.src,
        finishes: [
            { id: "fin_0", finish: "Uncoated" },
        ],
      },
    ],
    sizes: [
      { id: "size_0", size: "2x2 in" },
      { id: "size_1", size: "3x3 in" },
      { id: "size_2", size: "4x4 in" },
    ],
    quantities: [
      { id: "qty_0", quantity: "25" },
      { id: "qty_1", quantity: "50" },
      { id: "qty_2", quantity: "100" },
    ],
  },

// Sticker Sheet
    {
    id: "prod_1",
    product: "Sticker Sheet",
    shapes: [
      { id: "shape_0", shape: "Circle" },
      { id: "shape_1", shape: "Square" },
      { id: "shape_2", shape: "Rounded Corners" },
    ],
    materials: [
      {
        id: "mat_0",
        material: "Vinyl",
        img: material_vinyl.src,
        finishes: [
          { id: "fin_0", finish: "Glossy" },
          { id: "fin_1", finish: "Matte" },
          { id: "fin_2", finish: "Cracked Ice" },
        ],
      },
      {
        id: "mat_1",
        material: "Holographic",
        img: material_holographic.src,
        finishes: [
          { id: "fin_2", finish: "Glossy" },
        ],
      },
      {
        id: "mat_2",
        material: "Transparency",
        img: material_transparent.src,
        finishes: [
          { id: "fin_3", finish: "Glossy" },
          { id: "fin_4", finish: "Matte" },
        ],
      },
        {
        id: "mat_3",
        material: "Glitter",
        img: material_glitter.src,
        finishes: [
          { id: "fin_3", finish: "Glossy" },
        ],
      },
              {
        id: "mat_4",
        material: "Mirror",
        img: material_mirror.src,
        finishes: [
          { id: "fin_3", finish: "Glossy" },
        ],
      },
              {
        id: "mat_5",
        material: "Pixie Dust",
        img: material_pixie.src,
        finishes: [
          { id: "fin_3", finish: "Glossy" },
        ],
      },
              {
        id: "mat_6",
        material: "Prismatic",
        img: material_prismatic.src,
        finishes: [
          { id: "fin_3", finish: "Glossy" },
        ],
      },
              {
        id: "mat_7",
        material: "Brushed Aluminum",
        img: material_aluminum.src,
        finishes: [
          { id: "fin_3", finish: "Glossy" },
        ],
      },
              {
        id: "mat_8",
        material: "Kraft Paper",
        img: material_paper.src,
        finishes: [
          { id: "fin_3", finish: "Uncoated" },
        ],
      },
              {
        id: "mat_9",
        material: "High-Tack Vinyl",
        img: material_vinyl.src,
        finishes: [
            { id: "fin_0", finish: "Glossy" },
          { id: "fin_1", finish: "Matte" },
          { id: "fin_2", finish: "Cracked Ice" },
        ],
      },
                    {
        id: "mat_10",
        material: "Low-Tack Vinyl",
        img: material_vinyl.src,
        finishes: [
            { id: "fin_0", finish: "Glossy" },
          { id: "fin_1", finish: "Matte" },
          { id: "fin_2", finish: "Cracked Ice" },
        ],
      },
                    {
        id: "mat_11",
        material: "Reflective",
        img: material_reflective.src,
        finishes: [
            { id: "fin_0", finish: "Glossy" },
        ],
      },
                          {
        id: "mat_12",
        material: "Glow in the Dark",
        img: material_glow.src,
        finishes: [
            { id: "fin_0", finish: "Uncoated" },
        ],
      },
    ],
    sizes: [
      { id: "size_3", size: "2x2 in" },
      { id: "size_4", size: "3x3 in" },
    ],
    quantities: [
      { id: "qty_3", quantity: "50" },
      { id: "qty_4", quantity: "100" },
    ],
  },

// Transfer Stickers
  {
    id: "prod_2",
    product: "Transfer Stickers",
    shapes: [
      { id: "shape_0", shape: "Circle" },
      { id: "shape_1", shape: "Square" },
      { id: "shape_2", shape: "Rounded Corners" },
      { id: "shape_3", shape: "Contour Cut" },
    ],
    materials: [
      {
        id: "mat_0",
        material: "Vinyl",
        img: material_vinyl.src,
        finishes: [
          { id: "fin_0", finish: "Glossy" },
          { id: "fin_1", finish: "Matte" },
          { id: "fin_2", finish: "Cracked Ice" },
        ],
      },
      {
        id: "mat_1",
        material: "Holographic",
        img: material_holographic.src,
        finishes: [
          { id: "fin_2", finish: "Glossy" },
        ],
      },
    ],
    sizes: [
      { id: "size_0", size: "2x2 in" },
      { id: "size_1", size: "3x3 in" },
      { id: "size_2", size: "4x4 in" },
    ],
    quantities: [
      { id: "qty_0", quantity: "25" },
      { id: "qty_1", quantity: "50" },
      { id: "qty_2", quantity: "100" },
    ],
  },

// D.T.F. Heat Transfer
  {
    id: "prod_3",
    product: "DTF Heat Transfer",
    shapes: [
      { id: "shape_0", shape: "Circle" },
      { id: "shape_1", shape: "Square" },
      { id: "shape_2", shape: "Rounded Corners" },
      { id: "shape_3", shape: "Contour Cut" },
    ],
    materials: [
              {
        id: "mat_8",
        material: "Kraft Paper",
        img: material_paper.src,
        finishes: [
          { id: "fin_3", finish: "Uncoated" },
        ],
      },
    ],
    sizes: [
      { id: "size_0", size: "2x2 in" },
      { id: "size_1", size: "3x3 in" },
      { id: "size_2", size: "4x4 in" },
    ],
    quantities: [
      { id: "qty_0", quantity: "25" },
      { id: "qty_1", quantity: "50" },
      { id: "qty_2", quantity: "100" },
    ],
  },
]






























export const productListData = [
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

export const customStickerShape = [
    {
        id: "0",
        shape: "Contour Cut"
    },
    {
        id: "1",
        shape: "Square"
    },
    {
        id: "2",
        shape: "Circle"
    },
    {
        id: "3",
        shape: "Rounded Corners"
    }
]

export const customStickerMaterialData = [
    {
        id: "0",
        material: "Vinyl",
        img:"img"
    },
    {
        id: "1",
        material: "Holographic",
        img: "img"
    },
    {
        id: "2",
        material: "Transparent",
        img: "img"
    },
    {
        id: "3",
        material: "Glitter",
        img: "img"
    },
    {
        id: "4",
        material: "Mirror",
        img: "img"
    },
    {
        id: "5",
        material: "Pixie Dust",
        img: "img"
   },
   {
    id: "6",
    material: "Prismatic",
    img: "img"
   },
   {
    id: "7",
    material: "Brushed Aluminum",
    img: "img"
   },
   {
    id: "8",
    material: "Kraft Paper",
    img: "img"
   },
   {
    id: "9",
    material: "High-Tack Vinyl",
    img: "img"
   },
   {
    id: "10",
    material: "Low-Tack Vinyl",
    img: "img"
   },
   {
    id: "11",
    material: "Reflective",
    img: "img"
   },
   {
    id: "12",
    material: "Glow in the Dark",
    img: "img"
   }
]

export const customStickerSizeData = [
    {
        id: "0",
        size: "2\"x2\""
    },
    {
        id: "1",
        size: "3\"x3\""
    },
        {
        id: "2",
        size: "3\"x3\""
    },
        {
        id: "3",
        size: "4\"x4\""
    },
        {
        id: "4",
        size: "5\"x5\""
    },
        {
        id: "5",
        size: "6\"x6\""
    },
        {
        id: "6",
        size: "7\"x7\""
    },
        {
        id: "7",
        size: "8\"x8\""
    },
        {
        id: "8",
        size: "9\"x9\""
    },
        {
        id: "9",
        size: "10\"x10\""
    }
]

export const customStickerFinishData = [
    {
        id: "0",
        finish: "Matt"
    },
    {
        id: "1",
        finish: "Glossy"
    },
    {
        id: "2",
        finish: "Cracked Ice"
    }
]

export const customStickerQuantityData = [
    {
        id: "0",
        quantity: "8 Pieces"
    },
    {
        id: "1",
        quantity: "25 Pieces"
    },
    {
        id: "2",
        quantity: "25 Pieces"
    }
]

// Die Cut Sticker
export const dieCutStickerData = [
    {
        shape : {
            contoure: "Contoure Cut",
            square: "Square",
            circle: "Circle",
            rounded: "Rounded Corners"
        }
    }
]