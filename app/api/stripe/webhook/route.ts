import Stripe from "stripe";
import { NextResponse } from "next/server";
import { adminDb } from "@/app/lib/firebaseAdmin";

export const runtime = "nodejs"; // Stripe SDK needs Node runtime

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-12-15.clover",
});

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json(
      { error: "Missing stripe-signature" },
      { status: 400 }
    );
  }

  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  // Checkpoint: confirm we can receive + verify events
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const uid =
      (session.client_reference_id as string | null) ??
      session.metadata?.uid ??
      null;

    if (!uid) return NextResponse.json({ received: true }); // nothing to update

    const db = adminDb();

    await db
      .collection("users")
      .doc(uid)
      .set(
        {
          isPremium: true,
          stripeCustomerId: session.customer ?? null,
          stripeSubscriptionId: session.subscription ?? null,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

    return NextResponse.json({ received: true });
  }
  // Always ack other Stripe events so Stripe doesn't retry forever
return NextResponse.json({ received: true });

}
