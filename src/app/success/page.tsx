import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Order confirmed" };

// Stripe Checkout redirects here; the checkout step adds the order summary.
export default function SuccessPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12 text-center sm:px-6">
      <h1 className="font-serif text-4xl">Order confirmed</h1>
      <p className="mt-6 text-ink/70">
        Thank you for your order. This is a demo store, so no money was taken.
      </p>
      <Link href="/shop" className="mt-6 inline-block underline hover:text-rose">
        Back to the shop
      </Link>
    </section>
  );
}
