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
  if (event.type === "customer.subscription.created") {
    const sub = event.data.object as Stripe.Subscription;

    const uid = sub.metadata?.uid ?? null;
    if (!uid) return NextResponse.json({ received: true });

    const db = adminDb();

    // 🔎 DEBUG: force a known write so Firestore shows up
await db.collection("_debug").doc("lastWebhook").set(
  {
    hit: true,
    type: event.type,
    id: event.id,
    created: event.created,
    ts: new Date().toISOString(),
  },
  { merge: true }
);

    await db
      .collection("users")
      .doc(uid)
      .set(
        {
          isPremium: true,
          stripeCustomerId: sub.customer ?? null,
          stripeSubscriptionId: sub.id ?? null,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

    return NextResponse.json({ received: true });
  }
  // Always ack other Stripe events so Stripe doesn't retry forever
  return NextResponse.json({ received: true });
}
