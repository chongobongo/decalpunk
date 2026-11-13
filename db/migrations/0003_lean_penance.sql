CREATE TABLE "job_orders_custom_sticker" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"job_order_id" uuid,
	"product" text,
	"shape" text,
	"material" text,
	"finish" text,
	"size" text,
	"quantity" text,
	"img" text,
	"image_metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "job_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"list_id" uuid,
	"user_id" uuid,
	"job_order_id" uuid,
	"job_title" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "job_order_list" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"job_title" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "stickers_custom" ADD COLUMN "image_metadata" jsonb;--> statement-breakpoint
ALTER TABLE "job_orders" ADD CONSTRAINT "job_orders_list_id_job_order_list_id_fk" FOREIGN KEY ("list_id") REFERENCES "public"."job_order_list"("id") ON DELETE no action ON UPDATE no action;