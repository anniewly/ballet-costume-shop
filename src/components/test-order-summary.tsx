"use client";

import { OrderReceipt } from "@/components/order-receipt";
import { getTestOrder } from "@/lib/test-orders";
import { useHydrated } from "@/lib/use-hydrated";

/** Shows a test order saved in this browser by the built-in checkout. */
export function TestOrderSummary({ id }: { id: string }) {
  const hydrated = useHydrated();
  if (!hydrated) return <p className="text-center text-ink/70">Loading your order…</p>;

  const order = getTestOrder(id);
  if (!order) {
    return (
      <div className="text-center">
        <h1 className="font-serif text-4xl">We couldn&apos;t find that order</h1>
        <p className="mt-6 text-ink/70">
          Test orders are only kept in the browser they were placed in.
        </p>
      </div>
    );
  }
  return <OrderReceipt {...order} orderId={order.id} />;
}
