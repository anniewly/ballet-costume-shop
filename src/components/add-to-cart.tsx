"use client";

import Link from "next/link";
import { useState } from "react";
import { addToCart } from "@/lib/cart";
import { SIZES, type Size } from "@/lib/costumes";

type Props = {
  slug: string;
  /** Sizes this costume comes in; other sizes show as unavailable. */
  sizes: Size[];
};

/** The size picker and Add to cart button on a costume page. */
export function AddToCart({ slug, sizes }: Props) {
  const [size, setSize] = useState<Size | null>(null);
  const [status, setStatus] = useState<"idle" | "needs-size" | "added">("idle");

  function handleAdd() {
    if (!size) {
      setStatus("needs-size");
      return;
    }
    addToCart(slug, size);
    setStatus("added");
  }

  return (
    <div className="mt-8">
      <fieldset>
        <legend className="text-sm tracking-wide uppercase">Size</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {SIZES.map((s) => {
            const available = sizes.includes(s);
            const selected = s === size;
            return (
              <button
                key={s}
                type="button"
                disabled={!available}
                aria-pressed={selected}
                onClick={() => {
                  setSize(s);
                  setStatus("idle");
                }}
                className={`h-11 min-w-14 border px-4 text-sm transition ${
                  selected
                    ? "border-ink bg-ink text-ivory"
                    : "border-ink/30 hover:border-ink"
                } disabled:cursor-not-allowed disabled:border-ink/10 disabled:text-ink/30 disabled:line-through`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </fieldset>

      <button
        type="button"
        onClick={handleAdd}
        className="mt-6 h-12 w-full bg-rose px-8 text-sm tracking-wide text-ivory uppercase transition hover:bg-ink sm:w-auto"
      >
        Add to cart
      </button>

      <p className="mt-3 min-h-6 text-sm" role="status">
        {status === "needs-size" && (
          <span className="text-rose">Please choose a size first.</span>
        )}
        {status === "added" && (
          <>
            Added size {size} to your cart.{" "}
            <Link href="/cart" className="underline hover:text-rose">
              View cart
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
