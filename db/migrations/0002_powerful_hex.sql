ALTER TABLE "stickers_custom" ADD COLUMN IF NOT EXISTS "user_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "stickers_custom" ADD COLUMN IF NOT EXISTS "created_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "stickers_custom" ADD COLUMN IF NOT EXISTS "updated_at" timestamp with time zone DEFAULT now() NOT NULL;