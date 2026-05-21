"use client";

import { useEffect } from "react";
import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { Display, BodyText } from "@/components/typography/display";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Unhandled error:", error);
  }, [error]);

  return (
    <PageShell className="pt-16 pb-section-gap text-center">
      <Display className="mb-6 text-display-lg">Error</Display>
      <BodyText className="mb-4">
        Something went wrong. The olfactory notes have been disturbed.
      </BodyText>
      {error.message && (
        <BodyText className="mb-8 font-mono text-xs text-outline opacity-80 max-w-md mx-auto">
          {error.message}
        </BodyText>
      )}
      <div className="flex justify-center gap-4">
        <Button onClick={() => reset()} variant="primary">
          Try Again
        </Button>
        <Button asChild variant="secondary">
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </PageShell>
  );
}
