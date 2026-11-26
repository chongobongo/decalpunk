CREATE TYPE "public"."job_order_processing_status" AS ENUM('queued', 'printing', 'printed', 'finishing', 'qc', 'done', 'on_hold', 'reprint');--> statement-breakpoint
CREATE TABLE "job_order_processing" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_order_id" uuid NOT NULL,
	"custom_sticker_id" uuid NOT NULL,
	"status" "job_order_processing_status" DEFAULT 'queued' NOT NULL,
	"priority" integer DEFAULT 0 NOT NULL,
	"due_at" timestamp with time zone,
	"assigned_to" uuid,
	"product" text,
	"shape" text,
	"material" text,
	"finish" text,
	"size_label" text,
	"print_width_in" numeric(6, 2),
	"print_height_in" numeric(6, 2),
	"quantity" integer NOT NULL,
	"spare_count" integer DEFAULT 0 NOT NULL,
	"artwork_url" text NOT NULL,
	"artwork_width_px" integer,
	"artwork_height_px" integer,
	"artwork_type" varchar,
	"artwork_bytes" integer,
	"effective_dpi" integer,
	"print_file_url" text,
	"print_file_name" varchar,
	"print_file_uploaded_at" timestamp with time zone,
	"print_file_uploaded_by" uuid,
	"printer" varchar,
	"print_profile" varchar,
	"queued_at" timestamp with time zone DEFAULT now() NOT NULL,
	"started_at" timestamp with time zone,
	"printed_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"worker_notes" text,
	"hold_reason" text,
	"reprint_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "job_order_processing_custom_sticker_id_unique" UNIQUE("custom_sticker_id"),
	CONSTRAINT "job_order_processing_quantity_positive" CHECK ("job_order_processing"."quantity" > 0 AND "job_order_processing"."spare_count" >= 0)
);
--> statement-breakpoint
ALTER TABLE "job_order_processing" ADD CONSTRAINT "job_order_processing_job_order_id_job_orders_id_fk" FOREIGN KEY ("job_order_id") REFERENCES "public"."job_orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_order_processing" ADD CONSTRAINT "job_order_processing_custom_sticker_id_job_orders_custom_sticker_id_fk" FOREIGN KEY ("custom_sticker_id") REFERENCES "public"."job_orders_custom_sticker"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_order_processing" ADD CONSTRAINT "job_order_processing_assigned_to_users_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_order_processing" ADD CONSTRAINT "job_order_processing_print_file_uploaded_by_users_id_fk" FOREIGN KEY ("print_file_uploaded_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "job_order_processing_status_idx" ON "job_order_processing" USING btree ("status","priority");--> statement-breakpoint
CREATE INDEX "job_order_processing_assigned_idx" ON "job_order_processing" USING btree ("assigned_to");--> statement-breakpoint
CREATE INDEX "job_order_processing_job_order_idx" ON "job_order_processing" USING btree ("job_order_id");