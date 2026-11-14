import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import type Stripe from "stripe";


export async function POST(req: Request) {
  const body = await req.text(); // raw body is required for signature verification
  const signature = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      // Mark order paid, grant access, send receipt, etc.
      // Make this idempotent: Stripe may deliver the same event more than once.
      break;
    }
    case "invoice.paid":              // subscriptions
    case "invoice.payment_failed":
    case "customer.subscription.deleted":
      break;
  }

  return NextResponse.json({ received: true });
}