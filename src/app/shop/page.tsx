import type { Metadata } from "next";
import { CostumeCard } from "@/components/costume-card";
import { getCostumes } from "@/lib/costumes";

export const metadata: Metadata = { title: "Shop" };

export default function ShopPage() {
  const costumes = getCostumes();

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-serif text-4xl">Shop</h1>
      <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {costumes.map((costume) => (
          <CostumeCard key={costume.slug} costume={costume} />
        ))}
      </div>
    </section>
  );
}
