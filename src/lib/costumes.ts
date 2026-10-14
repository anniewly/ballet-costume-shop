import data from "@/data/costumes.json";

export const SIZES = ["XS", "S", "M", "L"] as const;
export type Size = (typeof SIZES)[number];

export type Category = "tutus" | "leotards" | "character" | "kids";

export const CATEGORY_LABELS: Record<Category, string> = {
  tutus: "Tutus",
  leotards: "Leotards",
  character: "Character",
  kids: "Kids",
};

export type Photo = {
  src: string;
  alt: string;
};

export type Costume = {
  slug: string;
  name: string;
  category: Category;
  /** Price in cents, in the shop currency. */
  price: number;
  description: string;
  fabric: string;
  sizes: Size[];
  photos: Photo[];
  featured: boolean;
};

const costumes = data as Costume[];

export function getCostumes(): Costume[] {
  return costumes;
}

export function getFeaturedCostumes(): Costume[] {
  return costumes.filter((c) => c.featured);
}

export function getCostume(slug: string): Costume | undefined {
  return costumes.find((c) => c.slug === slug);
}
