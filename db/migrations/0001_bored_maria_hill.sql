ALTER TABLE "users" DROP CONSTRAINT "users_clerkUserId_unique";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "clerkUserId" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "stickers_custom" DROP COLUMN "user_id";