import {NextResponse} from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: Request) {
  const body = await req.json();
  const { priceId } = body;
  

  if (!priceId) {
    return new Response(
      JSON.stringify({ error: "Missing priceId" }),
      { status: 400 }
    );
  }

  const origin = req.headers.get("origin");
  if (!origin) {
    return NextResponse.json({ error: "Missing origin header" }, { status: 400 });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${origin}/choose-plan?success=1`,
    cancel_url: `${origin}/choose-plan?canceled=1`,
  });

  return NextResponse.json({ url: session.url });
}
