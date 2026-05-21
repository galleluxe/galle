import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { Display, BodyText } from "@/components/typography/display";

const PAGES: Record<string, { title: string; sections: string[] }> = {
  privacy: {
    title: "Privacy Policy",
    sections: [
      "We collect only the information necessary to fulfil your orders and improve your experience.",
      "Your data is never sold to third parties. Payment processing is handled securely via Razorpay.",
      "You may request deletion of your account data by contacting concierge@galle.com.",
    ],
  },
  shipping: {
    title: "Shipping",
    sections: [
      "Orders ship within 2–4 business days across India.",
      "Express delivery is available in metro cities at checkout.",
      "International shipping is not available at launch.",
    ],
  },
  returns: {
    title: "Returns",
    sections: [
      "Unopened fragrances may be returned within 14 days of delivery.",
      "Discovery samples and gift sets are final sale.",
      "Contact us to initiate a return with your order number.",
    ],
  },
};

interface LegalPageProps {
  params: Promise<{ slug: string }>;
}

export default async function LegalPage({ params }: LegalPageProps) {
  const { slug } = await params;
  const page = PAGES[slug];
  if (!page) notFound();

  return (
    <PageShell narrow className="pt-8 pb-section-gap">
      <Display className="text-display-lg-mobile mb-12">{page.title}</Display>
      <div className="space-y-6">
        {page.sections.map((s) => (
          <BodyText key={s} size="lg">
            {s}
          </BodyText>
        ))}
      </div>
    </PageShell>
  );
}
