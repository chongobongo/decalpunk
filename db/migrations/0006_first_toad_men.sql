CREATE TYPE "public"."job_order_product_type" AS ENUM('custom_sticker', 'label', 'decal');--> statement-breakpoint
CREATE TYPE "public"."job_order_status" AS ENUM('new', 'in_production', 'ready', 'completed', 'cancelled');--> statement-breakpoint
ALTER TABLE "job_orders_custom_sticker" ALTER COLUMN "job_order_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "job_orders" ADD COLUMN "product_type" "job_order_product_type" NOT NULL;--> statement-breakpoint
ALTER TABLE "job_orders" ADD COLUMN "item_count" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "job_orders" ADD COLUMN "status" "job_order_status" DEFAULT 'new' NOT NULL;--> statement-breakpoint
ALTER TABLE "job_orders" ADD COLUMN "thumbnail_img" text;--> statement-breakpoint
ALTER TABLE "job_orders_custom_sticker" ADD CONSTRAINT "job_orders_custom_sticker_job_order_id_job_orders_id_fk" FOREIGN KEY ("job_order_id") REFERENCES "public"."job_orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "custom_sticker_job_order_id_idx" ON "job_orders_custom_sticker" USING btree ("job_order_id");--> statement-breakpoint
CREATE INDEX "job_orders_list_id_idx" ON "job_orders" USING btree ("list_id");--> statement-breakpoint
CREATE INDEX "job_orders_status_idx" ON "job_orders" USING btree ("status");--> statement-breakpoint
CREATE INDEX "job_orders_product_type_idx" ON "job_orders" USING btree ("product_type");--> statement-breakpoint
ALTER TABLE "job_orders_custom_sticker" DROP COLUMN "user_id";--> statement-breakpoint
ALTER TABLE "job_orders_custom_sticker" DROP COLUMN "job_title";--> statement-breakpoint
ALTER TABLE "job_orders" DROP COLUMN "job_order_id";