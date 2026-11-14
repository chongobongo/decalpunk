import { pgEnum } from "drizzle-orm/pg-core"

// User roles
export const userRoles = ["user", "member", "admin"] as const
export type UserRole = (typeof userRoles)[number]
export const userRoleEnum = pgEnum("user_role", userRoles)

// Quality
export const quality = ["Premium", "Standard", "Economy"] as const
export type Quality = (typeof quality)[number]
export const qualityEnum = pgEnum("quality", quality)

// Sheen
export const sheen = ["Matte", "Glossy", "Satin", "Luster", "Texture"] as const
export type Sheen = (typeof sheen)[number]
export const sheenEnum = pgEnum("sheen", sheen)

// Availability
export const availability = ["Available", "On order", "Discontinued"] as const
export type Availability = (typeof availability)[number]
export const availabilityEnum = pgEnum("availability", availability)

// Opacity (percentages belong in the UI labels, not the DB values)
export const opacity = ["Clear", "Transparent", "Medium", "Heavy", "Opaque"] as const
export type Opacity = (typeof opacity)[number]
export const opacityEnum = pgEnum("opacity", opacity)

// Material weight
export const materialWeight = ["10 oz", "13 oz", "15 oz", "18 oz"] as const
export type MaterialWeight = (typeof materialWeight)[number]
export const materialWeightEnum = pgEnum("material_weight", materialWeight)

// Lifespan
export const lifespan = ["6 months", "1 year", "2 years", "5 years", "10 years"] as const
export type Lifespan = (typeof lifespan)[number]
export const lifespanEnum = pgEnum("lifespan", lifespan)

// Glow color (the color it emits in the dark)
export const glowColor = ["Green", "Aqua", "Blue", "Yellow", "Orange", "Red", "Purple"] as const
export type GlowColor = (typeof glowColor)[number]
export const glowColorEnum = pgEnum("glow_color", glowColor)

// Roll sizes: NOT Postgres enums, so adding a size never needs a migration.
// Store these as integer columns (roll_length_yd, roll_width_in) and validate
// against these lists in your forms / Zod schemas.
export const rollLengthsYd = [25, 50, 100] as const
export type RollLengthYd = (typeof rollLengthsYd)[number]

export const rollWidthsIn = [12, 15, 24, 30, 48, 54, 60, 63] as const
export type RollWidthIn = (typeof rollWidthsIn)[number]

// Roll area in square feet
export const rollAreaSqFt = (lengthYd: number, widthIn: number) =>
  lengthYd * 3 * (widthIn / 12)