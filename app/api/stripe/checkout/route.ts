import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: Request) {
  const body = await req.json();
  const { priceId, uid } = body;

  if (!priceId) {
    return NextResponse.json({ error: "Missing priceId" }, { status: 400 });
  }

  if (!uid) {
    return NextResponse.json({ error: "Missing uid (not logged in)" }, { status: 401 });
  }

  const origin = req.headers.get("origin");
  if (!origin) {
    return NextResponse.json({ error: "Missing origin header" }, { status: 400 });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],

    // ✅ This is what makes `client_reference_id` NOT null
    client_reference_id: uid,

    // (extra nice for debugging in the Stripe dashboard)
    metadata: { uid },
    subscription_data: { metadata: { uid } },

    success_url: `${origin}/choose-plan?success=1`,
    cancel_url: `${origin}/choose-plan?canceled=1`,
  });

  return NextResponse.json({ url: session.url });
}
