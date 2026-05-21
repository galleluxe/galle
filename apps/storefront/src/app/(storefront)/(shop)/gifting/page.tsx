import Image from "next/image";
import { PageShell } from "@/components/layout/page-shell";
import { Input } from "@/components/ui/input";
import { Display, BodyText } from "@/components/typography/display";
import { GiftingForm } from "@/features/gifting/components/gifting-form";
import { listProducts } from "@/lib/catalog";
import { formatINR } from "@/lib/money";

export default async function GiftingPage() {
  const products = await listProducts();

  return (
    <PageShell className="pt-8 pb-section-gap max-w-3xl mx-auto">
      <section className="text-center mb-12">
        <Display className="mb-6">Gifting</Display>
        <BodyText size="lg">
          Send an ethereal essence to someone special with a personal message.
        </BodyText>
      </section>

      <GiftingForm products={products} />
    </PageShell>
  );
}
