import Image from "next/image";
import Link from "next/link";
import { Headline } from "@/components/typography/display";
import { getProductNoteLine } from "@/lib/catalog/notes";
import { resolveProductImageUrl } from "@/lib/catalog/resolve-image";
import { formatINR } from "@/lib/money";
import type { Cart, Product } from "@/lib/catalog/types";
import { cn } from "@/lib/utils";
import { AddToCartButton } from "@/features/cart/components/add-to-cart-button";
import { WishlistButton } from "@/features/wishlist/components/wishlist-button";

interface ProductCardProps {
  product: Product;
  cart?: Cart;
  className?: string;
}

export function ProductCard({ product, cart, className }: ProductCardProps) {
  const variant = product.variants[0];
  const price = variant ? formatINR(variant.pricePaise) : "";
  const noteLine = getProductNoteLine(product);

  return (
    <article
      className={cn(
        "flex flex-col overflow-hidden rounded-lg border border-primary bg-surface-container-lowest shadow-[0_4px_24px_rgba(124,44,46,0.06)]",
        className,
      )}
    >
      <div className="relative aspect-[5/6] overflow-hidden bg-surface-container-low">
        <Link
          href={`/shop/${product.handle}`}
          className="absolute inset-0 block"
        >
          {product.thumbnail ? (
            <Image
              src={resolveProductImageUrl(product.thumbnail)}
              alt={product.title}
              fill
              className="object-cover object-center transition-transform duration-500 hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 33vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-surface-container text-on-surface-variant">
              <span className="material-symbols-outlined text-4xl opacity-40">
                fragrance
              </span>
            </div>
          )}
        </Link>
        <WishlistButton
          productHandle={product.handle}
          className="absolute top-4 right-4"
        />
      </div>

      <div className="flex flex-col gap-4 p-5 md:p-6">
        <Link href={`/shop/${product.handle}`} className="hover:text-secondary transition-colors">
          <Headline size="sm" className="text-on-surface">
            {product.title}
          </Headline>
        </Link>

        <div className="flex items-baseline justify-between gap-3">
          <p className="font-body-md text-body-md text-text-muted font-medium line-clamp-2 min-w-0">
            {noteLine}
          </p>
          <p className="font-headline-sm text-headline-sm text-on-surface shrink-0 tabular-nums">
            {price}
          </p>
        </div>

        {variant && (
          <AddToCartButton
            variantId={variant.id}
            productHandle={product.handle}
            cart={cart}
            label="ADD TO CART"
            variant="card"
            className="mt-1"
          />
        )}
      </div>
    </article>
  );
}
