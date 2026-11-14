import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";


export async function POST(req: Request) {
  try {
    const { priceId } = await req.json();

    const session = await getStripe().checkout.sessions.create({
      mode: "payment", // use "subscription" for recurring prices
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
      // metadata: { userId: "..." }, // link the payment to your own user/order
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Unable to create session" }, { status: 500 });
  }
}