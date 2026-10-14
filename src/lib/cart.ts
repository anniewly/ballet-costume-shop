import { useSyncExternalStore } from "react";
import type { Size } from "@/lib/costumes";

/**
 * The cart lives in the browser's localStorage, so it needs no account or server.
 * Components read it with `useCart()` and change it with the functions below;
 * every change notifies all mounted components, including in other tabs.
 */
export type CartItem = {
  slug: string;
  size: Size;
  quantity: number;
};

const STORAGE_KEY = "pointe-and-tulle-cart";
const CHANGE_EVENT = "cart-change";
const EMPTY: CartItem[] = [];

function readRaw(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

// Parsing is cached by the raw string so useSyncExternalStore gets a stable snapshot.
let cachedRaw: string | null = null;
let cachedItems: CartItem[] = EMPTY;

function parse(raw: string | null): CartItem[] {
  if (raw === cachedRaw) return cachedItems;
  cachedRaw = raw;
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    cachedItems = Array.isArray(parsed) ? (parsed as CartItem[]) : EMPTY;
  } catch {
    cachedItems = EMPTY;
  }
  return cachedItems;
}

export function getCart(): CartItem[] {
  return parse(readRaw());
}

export function setCart(items: CartItem[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage can be unavailable (private mode, full quota); the cart just won't persist.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/** Adds a costume in a size, merging with an existing line for the same costume and size. */
export function addToCart(slug: string, size: Size, quantity = 1): void {
  const items = getCart();
  const existing = items.find((i) => i.slug === slug && i.size === size);
  setCart(
    existing
      ? items.map((i) => (i === existing ? { ...i, quantity: i.quantity + quantity } : i))
      : [...items, { slug, size, quantity }],
  );
}

function subscribe(onChange: () => void): () => void {
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) onChange();
  };
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onStorage);
  };
}

/** The current cart lines. Empty during server rendering. */
export function useCart(): CartItem[] {
  return useSyncExternalStore(subscribe, getCart, () => EMPTY);
}

/** Total number of costumes in the cart, counting quantities. */
export function useCartCount(): number {
  return useCart().reduce((sum, item) => sum + item.quantity, 0);
}
