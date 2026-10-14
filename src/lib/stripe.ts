import Stripe from "stripe";

let client: Stripe | null = null;

/**
 * The Stripe client, or null when STRIPE_SECRET_KEY isn't set (for example on a
 * fresh deploy), so pages can explain that checkout isn't set up yet.
 * Server-only: never import this from a client component.
 */
export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  client ??= new Stripe(key);
  return client;
}
