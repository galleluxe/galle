import Image from "next/image";
import Link from "next/link";
import { Eyebrow, Headline } from "@/components/typography/display";
import { getProductNoteLine } from "@/lib/catalog/notes";
import { resolveProductImageUrl } from "@/lib/catalog/resolve-image";
import type { Product } from "@/lib/catalog/types";
import { cn } from "@/lib/utils";

interface BundleContentsProps {
  products: Product[];
  className?: string;
}

export function BundleContents({ products, className }: BundleContentsProps) {
  if (products.length === 0) return null;

  return (
    <section
      className={cn(
        "mb-12 md:mb-16 py-12 border-t border-outline-variant/30",
        className,
      )}
    >
      <Eyebrow className="mb-8 text-center">What&apos;s Inside</Eyebrow>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-gutter max-w-3xl mx-auto">
        {products.map((item) => {
          const noteLine = getProductNoteLine(item);
          return (
            <li key={item.id}>
              <Link
                href={`/shop/${item.handle}`}
                className="group flex gap-4 rounded-lg border border-outline-variant/40 bg-surface-container-lowest p-4 transition-colors hover:border-primary/40"
              >
                <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-md bg-surface-container-low">
                  {item.thumbnail ? (
                    <Image
                      src={resolveProductImageUrl(item.thumbnail)}
                      alt={item.title}
                      fill
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      sizes="96px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-on-surface-variant">
                      <span className="material-symbols-outlined text-3xl opacity-40">
                        fragrance
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex min-w-0 flex-col justify-center">
                  <Headline size="sm" className="text-on-surface mb-1">
                    {item.title}
                  </Headline>
                  <p className="font-body-sm text-body-sm text-text-muted line-clamp-2">
                    {noteLine}
                  </p>
                  <span className="mt-2 font-label-caps text-[10px] uppercase tracking-widest text-primary">
                    View perfume
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
