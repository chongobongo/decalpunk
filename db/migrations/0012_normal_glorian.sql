ALTER TABLE "users" ALTER COLUMN "clerkUserId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_clerkUserId_unique" UNIQUE("clerkUserId");