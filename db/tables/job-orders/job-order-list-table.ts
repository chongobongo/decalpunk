// Job Orders List Table

import { created_at, id, updated_at } from "@/db/schemaHelpers";
import { relations } from "drizzle-orm";
import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { JobOrdersTable } from "./job-orders-table";


export const JobOrderListTable = pgTable("job_order_list", {
  id,
  user_id: uuid("user_id"),
  job_title: text("job_title"),
  created_at,
  updated_at  
})

export const JobOrderListRelations = relations(JobOrderListTable, ({ many })=> ({
  jobOrders: many(JobOrdersTable),
}))

