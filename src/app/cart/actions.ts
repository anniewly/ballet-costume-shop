"use server";

import { headers } from "next/headers";
import type { CartItem } from "@/lib/cart";
import { getCostume } from "@/lib/costumes";
import { site } from "@/lib/site";
import { getStripe } from "@/lib/stripe";

export type CheckoutResult = { url: string } | { error: string };

/**
 * Creates a Stripe Checkout session for the cart and returns its URL.
 * The cart comes from the browser, so names and prices are looked up again
 * here from the catalog; only the slug, size and quantity are trusted.
 */
export async function startCheckout(items: CartItem[]): Promise<CheckoutResult> {
  const stripe = getStripe();
  if (!stripe) {
    return { error: "Checkout isn't set up yet: the Stripe key is missing." };
  }

  const lineItems = [];
  for (const item of Array.isArray(items) ? items : []) {
    const costume = getCostume(item?.slug);
    const quantity = Number(item?.quantity);
    if (
      !costume ||
      !costume.sizes.includes(item.size) ||
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > site.maxQuantity
    ) {
      return { error: "Something in your cart is no longer available. Please check it and try again." };
    }
    lineItems.push({
      quantity,
      price_data: {
        currency: site.currency,
        unit_amount: costume.price,
        product_data: {
          name: `${costume.name} (size ${item.size})`,
          metadata: { slug: costume.slug, size: item.size },
        },
      },
    });
  }
  if (lineItems.length === 0) return { error: "Your cart is empty." };

  // Return to the address the shopper is on, so preview deployments work too.
  const origin =
    (await headers()).get("origin") ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000";

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      shipping_address_collection: { allowed_countries: ["US"] },
      shipping_options: [
        {
          shipping_rate_data: {
            display_name: "Standard shipping",
            type: "fixed_amount",
            fixed_amount: { amount: site.flatShipping, currency: site.currency },
          },
        },
      ],
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
    });
    if (!session.url) throw new Error("Stripe returned no checkout URL");
    return { url: session.url };
  } catch (err) {
    console.error("Stripe checkout failed", err);
    return { error: "We couldn't start checkout. Please try again in a moment." };
  }
}
