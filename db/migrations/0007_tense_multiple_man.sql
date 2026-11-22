CREATE TYPE "public"."availability" AS ENUM('Available', 'On order', 'Discontinued');--> statement-breakpoint
CREATE TYPE "public"."glow_color" AS ENUM('Green', 'Aqua', 'Blue', 'Yellow', 'Orange', 'Red', 'Purple');--> statement-breakpoint
CREATE TYPE "public"."lifespan" AS ENUM('6 months', '1 year', '2 years', '5 years', '10 years');--> statement-breakpoint
CREATE TYPE "public"."material_weight" AS ENUM('10 oz', '13 oz', '15 oz', '18 oz');--> statement-breakpoint
CREATE TYPE "public"."opacity" AS ENUM('Clear', 'Transparent', 'Medium', 'Heavy', 'Opaque');--> statement-breakpoint
CREATE TYPE "public"."quality" AS ENUM('Premium', 'Standard', 'Economy');--> statement-breakpoint
CREATE TYPE "public"."sheen" AS ENUM('Matte', 'Glossy', 'Satin', 'Luster', 'Texture');--> statement-breakpoint
CREATE TABLE "materials-adback" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" varchar NOT NULL,
	"shipping_id" varchar,
	"vendor_id" uuid,
	"brand_name" varchar NOT NULL,
	"manufacturer_logo" varchar,
	"product_image" varchar,
	"material_type" varchar NOT NULL,
	"material_composition" varchar,
	"material_weight" "material_weight",
	"roll_length_yd" integer NOT NULL,
	"roll_width_in" integer NOT NULL,
	"opacity" "opacity",
	"sheen" "sheen",
	"quality" "quality",
	"lifespan" "lifespan",
	"availability" "availability" NOT NULL,
	"description" text,
	"product_advantages" text,
	"best_uses" text,
	"recommended_inks" text,
	"cost_per_sq_ft" numeric(10, 4) NOT NULL,
	"price_per_sq_ft" numeric(10, 4) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "materials-adback_product_id_unique" UNIQUE("product_id")
);
--> statement-breakpoint
CREATE TABLE "materials-glow" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" varchar NOT NULL,
	"shipping_id" varchar,
	"brand_name" varchar NOT NULL,
	"manufacturer_logo" varchar,
	"product_image" varchar,
	"material_type" varchar NOT NULL,
	"material_composition" varchar,
	"material_weight" "material_weight",
	"roll_length_yd" integer NOT NULL,
	"roll_width_in" integer NOT NULL,
	"opacity" "opacity",
	"sheen" "sheen",
	"quality" "quality",
	"lifespan" "lifespan",
	"availability" "availability" NOT NULL,
	"adhesive_backed" boolean DEFAULT true NOT NULL,
	"glow_color" "glow_color" NOT NULL,
	"daylight_color" varchar,
	"glow_duration_hours" integer,
	"charge_time_minutes" integer,
	"initial_brightness_mcd" numeric(10, 2),
	"description" text,
	"product_advantages" text,
	"best_uses" text,
	"recommended_inks" text,
	"cost_per_sq_ft" numeric(10, 4) NOT NULL,
	"price_per_sq_ft" numeric(10, 4) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "materials-glow_product_id_unique" UNIQUE("product_id")
);
--> statement-breakpoint
CREATE TABLE "finishes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"description" text,
	"price_adjustment_per_sq_ft" numeric(10, 4) DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "finishes_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "material_finishes" (
	"material_id" uuid NOT NULL,
	"finish_id" uuid NOT NULL,
	CONSTRAINT "material_finishes_material_id_finish_id_pk" PRIMARY KEY("material_id","finish_id")
);
--> statement-breakpoint
CREATE TABLE "materials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar NOT NULL,
	"name" varchar NOT NULL,
	"image_url" varchar,
	"category" varchar DEFAULT 'sticker' NOT NULL,
	"adhesive_media_id" uuid,
	"price_per_sq_ft" numeric(10, 4) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "materials_slug_unique" UNIQUE("slug"),
	CONSTRAINT "materials_price_nonnegative" CHECK ("materials"."price_per_sq_ft" >= 0)
);
--> statement-breakpoint
CREATE TABLE "vendors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar NOT NULL,
	"name" varchar NOT NULL,
	"logo_url" varchar,
	"website" varchar,
	"contact_name" varchar,
	"contact_email" varchar,
	"contact_phone" varchar,
	"account_number" varchar,
	"address_line1" varchar,
	"address_line2" varchar,
	"city" varchar,
	"state" varchar,
	"postal_code" varchar,
	"country" varchar DEFAULT 'US',
	"payment_terms" varchar,
	"lead_time_days" integer,
	"min_order_amount" numeric(10, 2),
	"free_shipping_threshold" numeric(10, 2),
	"notes" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "vendors_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "materials-adback" ADD CONSTRAINT "materials-adback_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "material_finishes" ADD CONSTRAINT "material_finishes_material_id_materials_id_fk" FOREIGN KEY ("material_id") REFERENCES "public"."materials"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "material_finishes" ADD CONSTRAINT "material_finishes_finish_id_finishes_id_fk" FOREIGN KEY ("finish_id") REFERENCES "public"."finishes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "materials" ADD CONSTRAINT "materials_adhesive_media_id_materials-adback_id_fk" FOREIGN KEY ("adhesive_media_id") REFERENCES "public"."materials-adback"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "adhesive_media_brand_idx" ON "materials-adback" USING btree ("brand_name");--> statement-breakpoint
CREATE INDEX "adhesive_media_vendor_idx" ON "materials-adback" USING btree ("vendor_id");--> statement-breakpoint
CREATE INDEX "glow_media_brand_idx" ON "materials-glow" USING btree ("brand_name");--> statement-breakpoint
CREATE INDEX "glow_media_color_idx" ON "materials-glow" USING btree ("glow_color");--> statement-breakpoint
CREATE INDEX "materials_active_sort_idx" ON "materials" USING btree ("is_active","sort_order");--> statement-breakpoint
CREATE INDEX "vendors_active_name_idx" ON "vendors" USING btree ("is_active","name");