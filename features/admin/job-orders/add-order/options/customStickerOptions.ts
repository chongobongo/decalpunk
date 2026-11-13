// customStickerOptions.ts
// features\admin\job-orders\add-order\optins\customStickerOptions.ts
//
// ONE shared list of dropdown options, used by the edit page, the add page, and the
// server actions. "value" is what is saved to the database, so it must match what
// your create form saves.

export type StickerOption = { value: string; label: string }
export type StickerOptionField = "shape" | "material" | "finish" | "size" | "quantity"

// TODO: move your material, finish, size and quantity lists here from the edit page.
// While a list is empty: the Add form has nothing to choose from for that field, and the
// server does not check that field's value.
export const STICKER_OPTIONS: Record<StickerOptionField, StickerOption[]> = {
    shape: [
        { value: "Circle", label: "Circle" },
        { value: "Square", label: "Square" },
        { value: "Rounded Corners", label: "Rounded Corners" },
        { value: "Contoured Cut", label: "Contoured Cut" },
    ],
    material: [],
    finish: [],
    size: [],
    quantity: [],
}