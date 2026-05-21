import Image from "next/image";
import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Display, BodyText } from "@/components/typography/display";
import { CartLineControls } from "@/features/cart/components/cart-line-controls";
import { getCart } from "@/features/cart/server/store";
import { formatINR } from "@/lib/money";

export const dynamic = "force-dynamic";

export default async function CartPage() {
  const cart = await getCart();

  if (cart.lines.length === 0) {
    return (
      <PageShell className="pt-8 pb-section-gap text-center">
        <Display className="mb-6">Your Bag</Display>
        <BodyText className="mb-8">Your bag is empty.</BodyText>
        <Button asChild variant="primary">
          <Link href="/shop">Continue Shopping</Link>
        </Button>
      </PageShell>
    );
  }

  return (
    <PageShell className="pt-8 pb-section-gap max-w-3xl mx-auto">
      <Display className="mb-12 text-center">Your Bag</Display>
      <ul className="space-y-8 mb-12">
        {cart.lines.map((line) => (
          <li
            key={line.id}
            className="flex gap-6 border-b border-outline-variant/30 pb-8"
          >
            <div className="relative w-24 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-surface-container-low">
              <Image
                src={line.thumbnail}
                alt={line.title}
                fill
                className="object-cover"
                sizes="96px"
              />
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <Link
                  href={`/shop/${line.productHandle}`}
                  className="font-headline-sm text-headline-sm text-primary hover:underline"
                >
                  {line.title}
                </Link>
                <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                  {formatINR(line.unitPricePaise)} each
                </p>
              </div>
              <CartLineControls
                variantId={line.variantId}
                productHandle={line.productHandle}
                quantity={line.quantity}
              />
            </div>
            <p className="font-headline-sm text-headline-sm text-on-surface">
              {formatINR(line.unitPricePaise * line.quantity)}
            </p>
          </li>
        ))}
      </ul>
      <div className="border-t border-outline-variant/30 pt-8 flex flex-col items-end gap-6">
        <p className="font-headline-md text-headline-md text-on-surface">
          Subtotal {formatINR(cart.subtotalPaise)}
        </p>
        <Button asChild variant="primary">
          <Link href="/checkout">Proceed to Checkout</Link>
        </Button>
      </div>
    </PageShell>
  );
}
