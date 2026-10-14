import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
      <h1 className="font-serif text-4xl">Page not found</h1>
      <Link href="/shop" className="mt-6 inline-block underline hover:text-rose">
        Browse the shop
      </Link>
    </section>
  );
}
