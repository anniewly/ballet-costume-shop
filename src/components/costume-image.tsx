import Image from "next/image";
import type { Photo } from "@/lib/costumes";

type Props = {
  photo: Photo;
  sizes: string;
  priority?: boolean;
  className?: string;
};

/** A costume photo in the shop's 4:5 portrait frame. */
export function CostumeImage({ photo, sizes, priority, className }: Props) {
  return (
    <div className={`relative aspect-[4/5] overflow-hidden bg-blush/40 ${className ?? ""}`}>
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
        // Placeholder photos are SVGs, which the image optimizer doesn't process.
        unoptimized={photo.src.endsWith(".svg")}
      />
    </div>
  );
}
