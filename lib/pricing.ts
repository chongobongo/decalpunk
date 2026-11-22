// Pricing - Function
// lib\pricing.ts

export type PriceBreak = { aboveQuantity: number; discountPercent: number }

export type PriceInput = {
  ratePerSqFtCents: number        // material rate; may carry fractions of a cent
  finishAdjPerSqFtCents: number   // laminate/finish add-on, same for every material
  widthIn: number
  heightIn: number
  wasteMultiplier: number         // from the shape
  shapeFeeCents: number           // per unit, from the shape
  quantity: number
  breaks: PriceBreak[]
  setupFeeCents: number
  minOrderCents: number
}

export const dollarsToCents = (d: number) => Math.round(d * 10000) / 100

// Units counted at full price, with each segment above a break weighted by its discount
function weightedUnits(quantity: number, breaks: PriceBreak[]) {
  const sorted = [...breaks].sort((a, b) => a.aboveQuantity - b.aboveQuantity)
  let total = 0
  let start = 0
  let discount = 0
  for (const b of sorted) {
    const end = Math.min(quantity, b.aboveQuantity)
    if (end > start) total += (end - start) * (1 - discount / 100)
    start = Math.max(start, b.aboveQuantity)
    discount = b.discountPercent
    if (start >= quantity) return total
  }
  return total + Math.max(0, quantity - start) * (1 - discount / 100)
}

export function priceJob(i: PriceInput) {
  const areaSqFt = (i.widthIn * i.heightIn) / 144
  const unitCents =
    (i.ratePerSqFtCents + i.finishAdjPerSqFtCents) * areaSqFt * i.wasteMultiplier +
    i.shapeFeeCents

  // Round once, at the end, so tiny stickers don't lose precision
  const subtotalCents = Math.round(unitCents * weightedUnits(i.quantity, i.breaks))
  const withSetup = subtotalCents + i.setupFeeCents
  const totalCents = Math.max(withSetup, i.minOrderCents)

  return {
    areaSqFt,
    subtotalCents,
    totalCents,
    eachCents: totalCents / i.quantity,
    minApplied: totalCents > withSetup,
  }
}