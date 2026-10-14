"use client";

import { useEffect } from "react";
import { clearCart } from "@/lib/cart";

/** Empties the browser-saved cart once an order is paid. Renders nothing. */
export function ClearCart() {
  useEffect(() => {
    clearCart();
  }, []);
  return null;
}
