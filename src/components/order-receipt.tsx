import { formatPrice } from "@/lib/format";
import type { Address, OrderLine } from "@/lib/test-orders";

type Props = {
  name?: string | null;
  email?: string | null;
  orderId?: string;
  lines: OrderLine[];
  shipping: number;
  total: number;
  address?: Address | null;
};

/** The Order confirmed summary, shared by Stripe and test orders. */
export function OrderReceipt({ name, email, orderId, lines, shipping, total, address }: Props) {
  return (
    <>
      <div className="text-center">
        <h1 className="font-serif text-4xl">Order confirmed</h1>
        <p className="mt-4 text-ink/70">
          Thank you{name ? `, ${name}` : ""}! This is a demo store, so no money was taken.
        </p>
        {orderId && <p className="mt-2 text-sm text-ink/60">Order {orderId}</p>}
        {email && <p className="mt-2 text-sm text-ink/60">Confirmation for {email}</p>}
      </div>

      <ul className="mt-10 divide-y divide-ink/10 border-y border-ink/10">
        {lines.map((line) => (
          <li key={line.label} className="flex justify-between gap-4 py-4">
            <span>
              {line.label}
              {line.quantity > 1 && <span className="text-ink/60"> × {line.quantity}</span>}
            </span>
            <span>{formatPrice(line.amount)}</span>
          </li>
        ))}
      </ul>

      <dl className="mt-6 ml-auto max-w-xs space-y-2 text-sm">
        <div className="flex justify-between">
          <dt>Shipping</dt>
          <dd>{formatPrice(shipping)}</dd>
        </div>
        <div className="flex justify-between border-t border-ink/10 pt-2 text-base">
          <dt>Total</dt>
          <dd>{formatPrice(total)}</dd>
        </div>
      </dl>

      {address && (
        <div className="mt-8 text-sm">
          <h2 className="tracking-wide uppercase">Shipping to</h2>
          <address className="mt-2 text-ink/80 not-italic">
            {name}
            <br />
            {address.line1}
            {address.line2 && (
              <>
                <br />
                {address.line2}
              </>
            )}
            <br />
            {address.city}, {address.state} {address.postal_code}
          </address>
        </div>
      )}
    </>
  );
}
