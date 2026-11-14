// Schema Helpers

import { uuid, timestamp } from "drizzle-orm/pg-core"

export const id = uuid("id").primaryKey().defaultRandom()

export const created_at = timestamp("created_at", { withTimezone: true })
  .notNull()
  .defaultNow()

export const updated_at = timestamp("updated_at", { withTimezone: true })
  .notNull()
  .defaultNow()
  .$onUpdate(() => new Date())