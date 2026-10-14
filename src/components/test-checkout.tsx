"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { clearCart, useCart } from "@/lib/cart";
import { getCostume } from "@/lib/costumes";
import { formatPrice } from "@/lib/format";
import { site } from "@/lib/site";
import { newOrderId, saveTestOrder } from "@/lib/test-orders";
import { useHydrated } from "@/lib/use-hydrated";

const FIELDS = [
  { name: "name", label: "Full name", autoComplete: "name", required: true },
  { name: "email", label: "Email", autoComplete: "email", required: true, type: "email" },
  { name: "line1", label: "Address", autoComplete: "address-line1", required: true },
  { name: "line2", label: "Apartment, suite (optional)", autoComplete: "address-line2" },
  { name: "city", label: "City", autoComplete: "address-level2", required: true },
  { name: "state", label: "State", autoComplete: "address-level1", required: true },
  { name: "postal_code", label: "ZIP code", autoComplete: "postal-code", required: true },
] as const;

/** A stand-in for a payment provider: collects contact and shipping details and places a test order. */
export function TestCheckout() {
  const hydrated = useHydrated();
  const items = useCart();
  const router = useRouter();

  const lines = items.flatMap((item) => {
    const costume = getCostume(item.slug);
    return costume ? [{ ...item, costume }] : [];
  });
  const subtotal = lines.reduce((sum, l) => sum + l.costume.price * l.quantity, 0);
  const total = subtotal + site.flatShipping;

  if (!hydrated) return <p className="mt-6 text-ink/70">Loading your cart…</p>;
  if (lines.length === 0) {
    return (
      <>
        <p className="mt-6 text-ink/70">Your cart is empty.</p>
        <Link href="/shop" className="mt-6 inline-block underline hover:text-rose">
          Continue shopping
        </Link>
      </>
    );
  }

  function placeOrder(form: FormData) {
    const get = (key: string) => String(form.get(key) ?? "").trim();
    const id = newOrderId();
    saveTestOrder({
      id,
      name: get("name"),
      email: get("email"),
      address: {
        line1: get("line1"),
        line2: get("line2") || undefined,
        city: get("city"),
        state: get("state"),
        postal_code: get("postal_code"),
      },
      lines: lines.map(({ costume, size, quantity }) => ({
        label: `${costume.name} (size ${size})`,
        quantity,
        amount: costume.price * quantity,
      })),
      shipping: site.flatShipping,
      total,
    });
    clearCart();
    router.push(`/success?order=${id}`);
  }

  return (
    <div className="mt-8 grid gap-10 md:grid-cols-[1fr_18rem]">
      <form action={placeOrder} className="space-y-4">
        <p className="bg-blush/50 px-4 py-3 text-sm">
          Test checkout: no card is needed and nothing is charged. Use any details you like.
        </p>
        {FIELDS.map((f) => (
          <label key={f.name} className="block text-sm">
            {f.label}
            <input
              name={f.name}
              type={"type" in f ? f.type : "text"}
              autoComplete={f.autoComplete}
              required={"required" in f && f.required}
              className="mt-1 block h-11 w-full border border-ink/30 bg-white px-3 focus:border-ink focus:outline-none"
            />
          </label>
        ))}
        <button
          type="submit"
          className="mt-2 h-12 w-full bg-rose px-10 text-sm tracking-wide text-ivory uppercase transition hover:bg-ink"
        >
          Place test order · {formatPrice(total)}
        </button>
        <Link href="/cart" className="block text-center text-sm underline hover:text-rose">
          Back to cart
        </Link>
      </form>

      <aside className="h-fit border border-ink/10 p-5 text-sm">
        <h2 className="tracking-wide uppercase">Your order</h2>
        <ul className="mt-4 space-y-3">
          {lines.map(({ costume, size, quantity }) => (
            <li key={`${costume.slug}-${size}`} className="flex justify-between gap-3">
              <span>
                {costume.name} <span className="text-ink/60">({size}) × {quantity}</span>
              </span>
              <span>{formatPrice(costume.price * quantity)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-2 border-t border-ink/10 pt-4">
          <div className="flex justify-between">
            <dt>Shipping</dt>
            <dd>{formatPrice(site.flatShipping)}</dd>
          </div>
          <div className="flex justify-between text-base">
            <dt>Total</dt>
            <dd>{formatPrice(total)}</dd>
          </div>
        </dl>
      </aside>
    </div>
  );
}
