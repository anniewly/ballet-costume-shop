import Link from "next/link";
import { CostumeImage } from "@/components/costume-image";
import type { Costume } from "@/lib/costumes";
import { formatPrice } from "@/lib/format";

export function CostumeCard({ costume }: { costume: Costume }) {
  return (
    <Link href={`/costume/${costume.slug}`} className="group block">
      <CostumeImage
        photo={costume.photos[0]}
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className="transition-opacity group-hover:opacity-90"
      />
      <div className="mt-3 flex items-baseline justify-between gap-4">
        <h3 className="font-serif text-lg">{costume.name}</h3>
        <p className="text-sm text-ink/70">{formatPrice(costume.price)}</p>
      </div>
    </Link>
  );
}
