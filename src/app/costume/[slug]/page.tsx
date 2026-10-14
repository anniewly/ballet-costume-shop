import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CostumeImage } from "@/components/costume-image";
import { getCostume, getCostumes } from "@/lib/costumes";
import { formatPrice } from "@/lib/format";

export function generateStaticParams() {
  return getCostumes().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/costume/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return { title: getCostume(slug)?.name };
}

export default async function CostumePage({
  params,
}: PageProps<"/costume/[slug]">) {
  const { slug } = await params;
  const costume = getCostume(slug);
  if (!costume) notFound();

  // The catalog step adds the photo gallery, size picker and Add to cart here.
  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2">
      <CostumeImage
        photo={costume.photos[0]}
        sizes="(min-width: 768px) 50vw, 100vw"
        priority
      />
      <div>
        <h1 className="font-serif text-4xl">{costume.name}</h1>
        <p className="mt-2 text-xl">{formatPrice(costume.price)}</p>
        <p className="mt-6 text-ink/80">{costume.description}</p>
        <p className="mt-4 text-sm text-ink/60">{costume.fabric}</p>
        <p className="mt-6 text-sm tracking-wide uppercase">
          Sizes: {costume.sizes.join(", ")}
        </p>
      </div>
    </section>
  );
}
