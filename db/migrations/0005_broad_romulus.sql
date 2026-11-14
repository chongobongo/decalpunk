ALTER TABLE "job_orders_custom_sticker" ALTER COLUMN "user_id" SET DATA TYPE uuid USING "user_id"::uuid;--> statement-breakpoint
ALTER TABLE "job_orders_custom_sticker" ALTER COLUMN "user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "job_orders_custom_sticker" ALTER COLUMN "job_title" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "job_orders" ALTER COLUMN "job_title" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "job_order_list" ALTER COLUMN "job_title" DROP NOT NULL;