import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Display, BodyText } from "@/components/typography/display";

export default function CheckoutSuccessPage() {
  return (
    <PageShell className="pt-8 pb-section-gap text-center max-w-lg mx-auto">
      <span className="material-symbols-outlined text-5xl text-secondary mb-6 block">
        check_circle
      </span>
      <Display className="mb-6">Thank You</Display>
      <BodyText className="mb-8">
        Your order has been received. A confirmation email will be sent shortly.
      </BodyText>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild variant="primary" className="min-w-[200px]">
          <Link href="/shop">Continue Shopping</Link>
        </Button>
        <Button asChild variant="ghost">
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </PageShell>
  );
}
