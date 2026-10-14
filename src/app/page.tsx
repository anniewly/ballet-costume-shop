import Link from "next/link";
import { CostumeCard } from "@/components/costume-card";
import { CostumeImage } from "@/components/costume-image";
import { getFeaturedCostumes } from "@/lib/costumes";
import { site } from "@/lib/site";

export default function HomePage() {
  const featured = getFeaturedCostumes();
  const hero = featured[0];

  return (
    <>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 md:py-20">
        <div>
          <h1 className="font-serif text-5xl leading-tight md:text-6xl">
            {site.name}
          </h1>
          <p className="mt-4 text-lg text-ink/70">{site.tagline}</p>
          <Link
            href="/shop"
            className="mt-8 inline-block bg-ink px-8 py-3 text-sm tracking-widest text-ivory uppercase hover:bg-rose"
          >
            Shop
          </Link>
        </div>
        {hero && (
          <CostumeImage
            photo={hero.photos[0]}
            sizes="(min-width: 768px) 50vw, 100vw"
            priority
          />
        )}
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <h2 className="font-serif text-3xl">Featured costumes</h2>
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((costume) => (
            <CostumeCard key={costume.slug} costume={costume} />
          ))}
        </div>
      </section>
    </>
  );
}
