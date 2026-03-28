ALTER TABLE "stickers_custom" ADD COLUMN "user_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "stickers_custom" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "stickers_custom" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;