import type { Metadata } from "next";
import { TestCheckout } from "@/components/test-checkout";

export const metadata: Metadata = { title: "Checkout" };

// The built-in test checkout, used while Stripe isn't set up. No payment is taken.
export default function CheckoutPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-serif text-4xl">Checkout</h1>
      <TestCheckout />
    </section>
  );
}
