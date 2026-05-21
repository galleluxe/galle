import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { Display, BodyText } from "@/components/typography/display";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <PageShell className="pt-8 pb-section-gap text-center">
      <Display className="mb-6">404</Display>
      <BodyText className="mb-8">This page has faded into the ether.</BodyText>
      <Button asChild variant="primary">
        <Link href="/">Return Home</Link>
      </Button>
    </PageShell>
  );
}
