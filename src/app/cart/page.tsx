import type { Metadata } from "next";
import { CartView } from "@/components/cart-view";

export const metadata: Metadata = { title: "Cart" };

// The cart is saved in the browser, so the page's content renders on the client.
export default function CartPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-serif text-4xl">Cart</h1>
      <CartView />
    </section>
  );
}
