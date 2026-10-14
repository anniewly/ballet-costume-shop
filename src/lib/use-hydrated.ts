import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** False while server rendering, so browser-saved data doesn't flash an empty state first. */
export function useHydrated(): boolean {
  return useSyncExternalStore(noop, () => true, () => false);
}
