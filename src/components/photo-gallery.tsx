"use client";

import Image from "next/image";
import { useState } from "react";
import { CostumeImage } from "@/components/costume-image";
import type { Photo } from "@/lib/costumes";

/** A large costume photo with a row of thumbnails that switch it. */
export function PhotoGallery({ photos }: { photos: Photo[] }) {
  const [active, setActive] = useState(0);
  const photo = photos[active] ?? photos[0];

  return (
    <div>
      <CostumeImage
        photo={photo}
        sizes="(min-width: 768px) 50vw, 100vw"
        priority
      />
      {photos.length > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-3">
          {photos.map((p, i) => (
            <button
              key={p.src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show photo ${i + 1}: ${p.alt}`}
              aria-current={i === active}
              className={`relative aspect-[4/5] overflow-hidden bg-blush/40 outline-offset-2 transition ${
                i === active
                  ? "ring-2 ring-ink"
                  : "opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={p.src}
                alt=""
                fill
                sizes="120px"
                className="object-cover"
                unoptimized={p.src.endsWith(".svg")}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
