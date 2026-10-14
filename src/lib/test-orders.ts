/**
 * Test orders placed through the built-in checkout (used when Stripe isn't set
 * up). Nothing is charged or sent anywhere: the last order is kept in the
 * browser so the Order confirmed page can show it.
 */
export type Address = {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
};

export type OrderLine = {
  label: string;
  quantity: number;
  /** Line total in cents. */
  amount: number;
};

export type TestOrder = {
  id: string;
  name: string;
  email: string;
  address: Address;
  lines: OrderLine[];
  shipping: number;
  total: number;
};

const STORAGE_KEY = "pointe-and-tulle-last-order";

export function saveTestOrder(order: TestOrder): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(order));
  } catch {
    // Without storage the confirmation page just can't show the details.
  }
}

/** The last test order placed in this browser, if its id matches. */
export function getTestOrder(id: string): TestOrder | null {
  try {
    const order = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null") as TestOrder | null;
    return order?.id === id ? order : null;
  } catch {
    return null;
  }
}

export function newOrderId(): string {
  return `TEST-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}
