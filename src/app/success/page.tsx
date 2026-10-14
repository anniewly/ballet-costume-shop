import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ClearCart } from "@/components/clear-cart";
import { formatPrice } from "@/lib/format";
import { getStripe } from "@/lib/stripe";

export const metadata: Metadata = { title: "Order confirmed" };

// Stripe Checkout redirects here with ?session_id=cs_..., which the summary looks up.
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
  const { session_id } = await searchParams;
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
  const email = session.customer_details?.email;

  return (
    <>
      <ClearCart />
      <div className="text-center">
        <h1 className="font-serif text-4xl">Order confirmed</h1>
        <p className="mt-4 text-ink/70">
          Thank you{shipping?.name ? `, ${shipping.name}` : ""}! This is a demo store, so no
          money was taken.
        </p>
        {email && <p className="mt-2 text-sm text-ink/60">Confirmation for {email}</p>}
      </div>

      <ul className="mt-10 divide-y divide-ink/10 border-y border-ink/10">
        {session.line_items?.data.map((line) => (
          <li key={line.id} className="flex justify-between gap-4 py-4">
            <span>
              {line.description}
              {line.quantity && line.quantity > 1 && (
                <span className="text-ink/60"> × {line.quantity}</span>
              )}
            </span>
            <span>{formatPrice(line.amount_total)}</span>
          </li>
        ))}
      </ul>

      <dl className="mt-6 ml-auto max-w-xs space-y-2 text-sm">
        <div className="flex justify-between">
          <dt>Shipping</dt>
          <dd>{formatPrice(session.shipping_cost?.amount_total ?? 0)}</dd>
        </div>
        <div className="flex justify-between border-t border-ink/10 pt-2 text-base">
          <dt>Total paid</dt>
          <dd>{formatPrice(session.amount_total ?? 0)}</dd>
        </div>
      </dl>

      {shipping?.address && (
        <div className="mt-8 text-sm">
          <h2 className="tracking-wide uppercase">Shipping to</h2>
          <address className="mt-2 text-ink/80 not-italic">
            {shipping.name}
            <br />
            {shipping.address.line1}
            {shipping.address.line2 && (
              <>
                <br />
                {shipping.address.line2}
              </>
            )}
            <br />
            {shipping.address.city}, {shipping.address.state} {shipping.address.postal_code}
          </address>
        </div>
      )}
    </>
  );
}
