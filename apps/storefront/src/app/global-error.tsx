"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Display, BodyText } from "@/components/typography/display";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error caught:", error);
  }, [error]);

  return (
    <html lang="en-IN">
      <head>
        <title>Something went wrong — Galle</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-surface text-on-surface antialiased min-h-screen flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full py-12 space-y-6">
          <Display className="text-display-lg text-primary">Error</Display>
          <BodyText size="lg">
            A critical error has occurred. Our atelier is temporarily unavailable.
          </BodyText>
          {error.message && (
            <pre className="p-4 bg-surface-container-low rounded-xl text-left font-mono text-xs text-outline overflow-auto max-h-48 border border-outline-variant/30">
              {error.message}
            </pre>
          )}
          <div className="flex justify-center gap-4 pt-4">
            <Button onClick={() => reset()} variant="primary">
              Refresh Atelier
            </Button>
            <Button asChild variant="secondary">
              <Link href="/">Return Home</Link>
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
