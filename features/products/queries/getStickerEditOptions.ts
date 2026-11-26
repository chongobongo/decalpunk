import { db } from "@/db"

type Option = { value: string; label: string }

export async function getStickerEditOptions(productName: string | null) {
  const empty = {
    options: { shape: [], material: [], finish: [], size: [], quantity: [] } as Record<
      "shape" | "material" | "finish" | "size" | "quantity",
      Option[]
    >,
    finishesByMaterial: {} as Record<string, Option[]>,
  }
  if (!productName) return empty

  const product = await db.query.ProductsTable.findFirst({
    where: (p, { eq }) => eq(p.name, productName),
    with: {
      shapes: { orderBy: (s, { asc }) => asc(s.sort_order) },
      sizes: { orderBy: (s, { asc }) => asc(s.sort_order) },
      quantities: { orderBy: (q, { asc }) => asc(q.sort_order) },
      materials: {
        orderBy: (pm, { asc }) => asc(pm.sort_order),
        with: { material: { with: { finishes: { with: { finish: true } } } } },
      },
    },
  })
  if (!product) return empty

  const opt = (v: string): Option => ({ value: v, label: v })
  const materials = product.materials.map((pm) => pm.material).filter((m) => m.is_active)

  const finishesByMaterial: Record<string, Option[]> = {}
  for (const m of materials) {
    finishesByMaterial[m.name] = m.finishes.map((mf) => opt(mf.finish.name))
  }
  const allFinishes = [...new Set(materials.flatMap((m) => m.finishes.map((mf) => mf.finish.name)))]

  return {
    options: {
      shape: product.shapes.map((s) => opt(s.name)),
      material: materials.map((m) => opt(m.name)),
      finish: allFinishes.map(opt),
      size: product.sizes.map((s) => opt(s.label)),
      quantity: product.quantities.map((q) => opt(String(q.quantity))),
    },
    finishesByMaterial,
  }
}