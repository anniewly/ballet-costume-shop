import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Cart" };

// The cart step replaces this with the browser-saved cart and Checkout button.
export default function CartPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-serif text-4xl">Cart</h1>
      <p className="mt-6 text-ink/70">Your cart is empty.</p>
      <Link href="/shop" className="mt-6 inline-block underline hover:text-rose">
        Continue shopping
      </Link>
    </section>
  );
}
