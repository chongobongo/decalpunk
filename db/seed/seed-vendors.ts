// db/seeds/seed-vendors.ts

import { db } from "@/db/index"                       // adjust to your db client path
import { VendorsTable } from "@/db/schemaDB"

const vendors = [
  {
    slug: "avery-dennison",
    name: "Avery Dennison",
    logo_url: "/images/vendors/avery-dennison.png",
    website: "https://graphics.averydennison.com",
    contact_name: "Jordan Reyes",
    contact_email: "orders@example-avery.test",
    contact_phone: "555-0101",
    account_number: "AD-100245",
    address_line1: "100 Example Way",
    address_line2: null,
    city: "Pasadena",
    state: "CA",
    postal_code: "91101",
    country: "US",
    payment_terms: "Net 30",
    lead_time_days: 5,
    min_order_amount: 250,
    free_shipping_threshold: 750,
    notes: "Primary supplier for adhesive vinyl rolls.",
    is_active: true,
  },
  {
    slug: "3m-graphics",
    name: "3M Commercial Graphics",
    logo_url: "/images/vendors/3m.png",
    website: "https://www.3m.com",
    contact_name: "Priya Shah",
    contact_email: "sales@example-3m.test",
    contact_phone: "555-0102",
    account_number: "3M-558210",
    address_line1: "200 Sample Blvd",
    address_line2: "Suite 400",
    city: "St. Paul",
    state: "MN",
    postal_code: "55144",
    country: "US",
    payment_terms: "Net 45",
    lead_time_days: 7,
    min_order_amount: 500,
    free_shipping_threshold: 1000,
    notes: "Premium cast vinyl and reflective films.",
    is_active: true,
  },
  {
    slug: "oracal-usa",
    name: "ORAFOL / Oracal USA",
    logo_url: "/images/vendors/oracal.png",
    website: "https://www.orafol.com",
    contact_name: "Marcus Lee",
    contact_email: "support@example-oracal.test",
    contact_phone: "555-0103",
    account_number: "OR-772901",
    address_line1: "300 Placeholder Rd",
    address_line2: null,
    city: "Avon",
    state: "CT",
    postal_code: "06001",
    country: "US",
    payment_terms: "Net 30",
    lead_time_days: 4,
    min_order_amount: 150,
    free_shipping_threshold: 500,
    notes: "Good value on calendered and intermediate vinyl.",
    is_active: true,
  },
  {
    slug: "local-print-supply",
    name: "Local Print Supply Co.",
    logo_url: null,
    website: null,
    contact_name: "Dana Whitfield",
    contact_email: "dana@example-localsupply.test",
    contact_phone: "555-0104",
    account_number: null,
    address_line1: "400 Demo Street",
    address_line2: null,
    city: "Los Angeles",
    state: "CA",
    postal_code: "90001",
    country: "US",
    payment_terms: "Due on receipt",
    lead_time_days: 2,
    min_order_amount: 0,
    free_shipping_threshold: null,
    notes: "Backup supplier for rush orders. Pickup available.",
    is_active: true,
  },
]

async function main() {
  await db
    .insert(VendorsTable)
    .values(vendors)
    .onConflictDoNothing({ target: VendorsTable.slug })

  console.log(`Seeded ${vendors.length} vendors`)
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})