CREATE TABLE "product_price_breaks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"above_quantity" integer NOT NULL,
	"discount_percent" numeric(5, 2) NOT NULL,
	CONSTRAINT "product_price_breaks_valid" CHECK ("product_price_breaks"."above_quantity" > 0 AND "product_price_breaks"."discount_percent" >= 0 AND "product_price_breaks"."discount_percent" <= 100)
);
--> statement-breakpoint
ALTER TABLE "product_shapes" ADD COLUMN "waste_multiplier" numeric(4, 2) DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "product_shapes" ADD COLUMN "fee_cents" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "setup_fee_cents" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "min_order_cents" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "product_price_breaks" ADD CONSTRAINT "product_price_breaks_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "product_price_breaks_unique" ON "product_price_breaks" USING btree ("product_id","above_quantity");--> statement-breakpoint
ALTER TABLE "product_quantities" DROP COLUMN "discount_percent";--> statement-breakpoint
ALTER TABLE "product_shapes" ADD CONSTRAINT "product_shapes_pricing_valid" CHECK ("product_shapes"."waste_multiplier" >= 1 AND "product_shapes"."fee_cents" >= 0);--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_pricing_nonnegative" CHECK ("products"."setup_fee_cents" >= 0 AND "products"."min_order_cents" >= 0);