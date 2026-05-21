"use client";

import { useState } from "react";
import { GalleImage } from "./galle-image";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  alt: string;
}

export function ProductGallery({ images, alt }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const main = images[active] ?? images[0];

  if (!main) return null;

  return (
    <div className="space-y-4">
      <div className="relative aspect-[3/4] rounded-xl overflow-hidden ambient-shadow bg-surface-container-low">
        <GalleImage src={main} alt={alt} fill priority sizes="(max-width: 768px) 100vw, 50vw" />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "relative shrink-0 w-16 aspect-[3/4] rounded-lg overflow-hidden border-2 transition-colors",
                i === active ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"
              )}
            >
              <GalleImage src={src} alt={`${alt} ${i + 1}`} fill sizes="64px" rounded={false} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
