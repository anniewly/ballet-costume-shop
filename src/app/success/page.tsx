import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ClearCart } from "@/components/clear-cart";
import { OrderReceipt } from "@/components/order-receipt";
import { TestOrderSummary } from "@/components/test-order-summary";
import { getStripe } from "@/lib/stripe";

export const metadata: Metadata = { title: "Order confirmed" };

// Stripe Checkout redirects here with ?session_id=cs_...; the built-in test
// checkout comes here with ?order=TEST-....
export default function SuccessPage({ searchParams }: PageProps<"/success">) {
  return (
    <section className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <Suspense fallback={<p className="text-center text-ink/70">Loading your order…</p>}>
        <OrderSummary searchParams={searchParams} />
      </Suspense>
      <p className="mt-10 text-center">
        <Link href="/shop" className="underline hover:text-rose">
          Back to the shop
        </Link>
      </p>
    </section>
  );
}

async function OrderSummary({ searchParams }: Pick<PageProps<"/success">, "searchParams">) {
  const { session_id, order } = await searchParams;
  if (typeof order === "string") return <TestOrderSummary id={order} />;

  const stripe = getStripe();
  const session =
    stripe && typeof session_id === "string" && session_id.startsWith("cs_")
      ? await stripe.checkout.sessions
          .retrieve(session_id, { expand: ["line_items"] })
          .catch(() => null)
      : null;

  if (!session || session.payment_status !== "paid") {
    return (
      <div className="text-center">
        <h1 className="font-serif text-4xl">We couldn&apos;t find that order</h1>
        <p className="mt-6 text-ink/70">
          If you just paid, check your email for a receipt, or contact us and we&apos;ll help.
        </p>
      </div>
    );
  }

  const shipping = session.collected_information?.shipping_details;
  const address = shipping?.address;
  return (
    <>
      <ClearCart />
      <OrderReceipt
        name={shipping?.name}
        email={session.customer_details?.email}
        lines={(session.line_items?.data ?? []).map((line) => ({
          label: line.description ?? "",
          quantity: line.quantity ?? 1,
          amount: line.amount_total,
        }))}
        shipping={session.shipping_cost?.amount_total ?? 0}
        total={session.amount_total ?? 0}
        address={
          address?.line1
            ? {
                line1: address.line1,
                line2: address.line2 ?? undefined,
                city: address.city ?? "",
                state: address.state ?? "",
                postal_code: address.postal_code ?? "",
              }
            : null
        }
      />
    </>
  );
}
