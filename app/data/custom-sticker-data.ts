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

// Material base prices
const PRICE_VINYL = 9.99
const PRICE_HOLOGRAPHIC = 14.99
const PRICE_TRANSPARENCY = 12.99
const PRICE_GLITTER = 13.99
const PRICE_MIRROR = 15.99
const PRICE_PIXIE_DUST = 16.99
const PRICE_PRISMATIC = 15.99
const PRICE_BRUSHED_ALUMINUM = 17.99
const PRICE_KRAFT_PAPER = 8.99
const PRICE_HIGH_TACK_VINYL = 11.99
const PRICE_LOW_TACK_VINYL = 11.99
const PRICE_REFLECTIVE = 16.99
const PRICE_GLOW_IN_THE_DARK = 14.99

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
        price: PRICE_VINYL,
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
        price: PRICE_HOLOGRAPHIC,
        finishes: [
          { id: "fin_2", finish: "Glossy" },
        ],
      },
      {
        id: "mat_2",
        material: "Transparency",
        img: material_transparent.src,
        price: PRICE_TRANSPARENCY,
        finishes: [
          { id: "fin_3", finish: "Glossy" },
          { id: "fin_4", finish: "Matte" },
        ],
      },
      {
        id: "mat_3",
        material: "Glitter",
        img: material_glitter.src,
        price: PRICE_GLITTER,
        finishes: [
          { id: "fin_3", finish: "Glossy" },
        ],
      },
      {
        id: "mat_4",
        material: "Mirror",
        img: material_mirror.src,
        price: PRICE_MIRROR,
        finishes: [
          { id: "fin_3", finish: "Glossy" },
        ],
      },
      {
        id: "mat_5",
        material: "Pixie Dust",
        img: material_pixie.src,
        price: PRICE_PIXIE_DUST,
        finishes: [
          { id: "fin_3", finish: "Glossy" },
        ],
      },
      {
        id: "mat_6",
        material: "Prismatic",
        img: material_prismatic.src,
        price: PRICE_PRISMATIC,
        finishes: [
          { id: "fin_3", finish: "Glossy" },
        ],
      },
      {
        id: "mat_7",
        material: "Brushed Aluminum",
        img: material_aluminum.src,
        price: PRICE_BRUSHED_ALUMINUM,
        finishes: [
          { id: "fin_3", finish: "Glossy" },
        ],
      },
      {
        id: "mat_8",
        material: "Kraft Paper",
        img: material_paper.src,
        price: PRICE_KRAFT_PAPER,
        finishes: [
          { id: "fin_3", finish: "Uncoated" },
        ],
      },
      {
        id: "mat_9",
        material: "High-Tack Vinyl",
        img: material_vinyl.src,
        price: PRICE_HIGH_TACK_VINYL,
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
        price: PRICE_LOW_TACK_VINYL,
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
        price: PRICE_REFLECTIVE,
        finishes: [
          { id: "fin_0", finish: "Glossy" },
        ],
      },
      {
        id: "mat_12",
        material: "Glow in the Dark",
        img: material_glow.src,
        price: PRICE_GLOW_IN_THE_DARK,
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

]