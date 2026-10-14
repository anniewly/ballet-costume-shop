import Link from "next/link";
import { site } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="border-b border-blush">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <Link href="/" className="font-serif text-2xl tracking-wide">
          {site.name}
        </Link>
        <nav className="flex items-center gap-6 text-sm tracking-wide uppercase">
          <Link href="/shop" className="hover:text-rose">
            Shop
          </Link>
          {/* The cart step replaces this link with one that shows the item count. */}
          <Link href="/cart" className="hover:text-rose">
            Cart
          </Link>
        </nav>
      </div>
    </header>
  );
}
