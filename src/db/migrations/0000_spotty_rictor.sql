CREATE TABLE "stickers_custom" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"job_order_id" uuid,
	"product" text,
	"shape" text,
	"material" text,
	"finish" text,
	"size" text,
	"quantity" text,
	"img" text
);
