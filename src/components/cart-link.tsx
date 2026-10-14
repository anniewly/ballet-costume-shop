"use client";

import Link from "next/link";
import { useCartCount } from "@/lib/cart";

/** The header's Cart link, with the number of costumes in the cart. */
export function CartLink() {
  const count = useCartCount();
  return (
    <Link href="/cart" className="hover:text-rose">
      Cart{count > 0 && ` (${count})`}
    </Link>
  );
}
