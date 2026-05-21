import { redirect } from "next/navigation";
import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { Display } from "@/components/typography/display";
import { getCart } from "@/features/cart/server/store";
import { CheckoutForm } from "@/features/checkout/components/checkout-form";

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const cart = await getCart();
  if (cart.lines.length === 0) redirect("/shop");

  return (
    <PageShell className="pt-8 pb-section-gap max-w-2xl mx-auto">
      <Display className="mb-8 text-center">Checkout</Display>
      
      <CheckoutForm cart={cart} />

      <p className="text-center mt-8">
        <Link href="/shop" className="font-label-caps text-label-caps text-outline hover:text-primary transition-colors">
          ← Continue Shopping
        </Link>
      </p>
    </PageShell>
  );
}
