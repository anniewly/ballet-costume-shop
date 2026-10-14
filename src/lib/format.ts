import { site } from "@/lib/site";

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: site.currency.toUpperCase(),
});

/** Formats a price in cents, e.g. 38900 -> "$389.00". */
export function formatPrice(cents: number): string {
  return formatter.format(cents / 100);
}
