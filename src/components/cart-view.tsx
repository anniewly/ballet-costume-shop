"use client";

import Link from "next/link";
import { useState, useSyncExternalStore, useTransition } from "react";
import { startCheckout } from "@/app/cart/actions";
import { CostumeImage } from "@/components/costume-image";
import { removeFromCart, updateQuantity, useCart } from "@/lib/cart";
import { getCostume } from "@/lib/costumes";
import { formatPrice } from "@/lib/format";
import { site } from "@/lib/site";

const noop = () => () => {};

/** False while server rendering, so the empty-cart message doesn't flash before the saved cart loads. */
function useHydrated(): boolean {
  return useSyncExternalStore(noop, () => true, () => false);
}

/** The cart's lines, totals and Checkout button. */
export function CartView() {
  const hydrated = useHydrated();
  const items = useCart();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  // Skip lines whose costume has since left the catalog.
  const lines = items.flatMap((item) => {
    const costume = getCostume(item.slug);
    return costume ? [{ ...item, costume }] : [];
  });
  const subtotal = lines.reduce((sum, l) => sum + l.costume.price * l.quantity, 0);

  function handleCheckout() {
    setError(null);
    startTransition(async () => {
      const result = await startCheckout(
        lines.map(({ slug, size, quantity }) => ({ slug, size, quantity })),
      );
      if ("url" in result) {
        window.location.assign(result.url);
      } else {
        setError(result.error);
      }
    });
  }

  if (!hydrated) {
    return <p className="mt-6 text-ink/70">Loading your cart…</p>;
  }

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

  return (
    <>
      <ul className="mt-8 divide-y divide-ink/10 border-y border-ink/10">
        {lines.map(({ costume, size, quantity }) => (
          <li key={`${costume.slug}-${size}`} className="flex gap-4 py-6">
            <Link href={`/costume/${costume.slug}`} className="w-24 shrink-0 sm:w-28">
              <CostumeImage photo={costume.photos[0]} sizes="112px" />
            </Link>
            <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:justify-between">
              <div>
                <Link
                  href={`/costume/${costume.slug}`}
                  className="font-serif text-xl hover:text-rose"
                >
                  {costume.name}
                </Link>
                <p className="mt-1 text-sm text-ink/70">Size {size}</p>
                <p className="mt-1 text-sm text-ink/70">{formatPrice(costume.price)} each</p>
              </div>
              <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                <div className="flex items-center border border-ink/30">
                  <button
                    type="button"
                    aria-label={`One fewer ${costume.name}, size ${size}`}
                    onClick={() => updateQuantity(costume.slug, size, quantity - 1)}
                    className="h-9 w-9 hover:bg-blush/60"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm" aria-label="Quantity">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    aria-label={`One more ${costume.name}, size ${size}`}
                    disabled={quantity >= site.maxQuantity}
                    onClick={() => updateQuantity(costume.slug, size, quantity + 1)}
                    className="h-9 w-9 hover:bg-blush/60 disabled:cursor-not-allowed disabled:text-ink/30"
                  >
                    +
                  </button>
                </div>
                <p className="min-w-20 text-right">{formatPrice(costume.price * quantity)}</p>
                <button
                  type="button"
                  onClick={() => removeFromCart(costume.slug, size)}
                  className="text-sm underline hover:text-rose"
                >
                  Remove
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <dl className="mt-6 ml-auto max-w-xs space-y-2 text-sm">
        <div className="flex justify-between">
          <dt>Subtotal</dt>
          <dd>{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Shipping</dt>
          <dd>{formatPrice(site.flatShipping)}</dd>
        </div>
        <div className="flex justify-between border-t border-ink/10 pt-2 text-base">
          <dt>Total</dt>
          <dd>{formatPrice(subtotal + site.flatShipping)}</dd>
        </div>
      </dl>

      <div className="mt-8 flex flex-col items-end gap-3">
        <button
          type="button"
          onClick={handleCheckout}
          disabled={pending}
          className="h-12 w-full bg-rose px-10 text-sm tracking-wide text-ivory uppercase transition hover:bg-ink disabled:cursor-wait disabled:opacity-70 sm:w-auto"
        >
          {pending ? "Opening checkout…" : "Checkout"}
        </button>
        <p className="text-xs text-ink/60">
          Demo checkout: pay with the test card 4242 4242 4242 4242, any future date and any CVC.
        </p>
        <p className="min-h-5 text-sm text-rose" role="alert">
          {error}
        </p>
        <Link href="/shop" className="text-sm underline hover:text-rose">
          Continue shopping
        </Link>
      </div>
    </>
  );
}
