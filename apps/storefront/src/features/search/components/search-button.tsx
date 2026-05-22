"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { BodyText } from "@/components/typography/display";
import { formatINR } from "@/lib/money";

interface SuggestedProduct {
  id: string;
  title: string;
  handle: string;
  thumbnail: string;
  pricePaise: number;
  family?: string;
}

export function SearchButton() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<SuggestedProduct[]>([]);
  const [loading, setLoading] = React.useState(false);

  // Debounced search logic
  React.useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    const delayDebounceFn = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.products || []);
        }
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setLoading(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label="Search"
          className="text-primary hover:text-primary/80 transition-colors flex items-center justify-center p-2 focus:outline-none"
        >
          <span className="material-symbols-outlined text-2xl">search</span>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-surface p-6 rounded-2xl border border-outline-variant/30">
        <DialogHeader>
          <DialogTitle className="text-center font-display tracking-widest text-primary uppercase text-lg">
            Search GALLE Atelier
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4 relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant">
            search
          </span>
          <Input
            type="search"
            placeholder="Type fragrance notes, scent families..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-6 bg-surface-container-low rounded-xl border border-outline-variant/30 text-primary font-body-md placeholder:text-outline-variant focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all focus:outline-none"
            autoFocus
          />
        </div>

        <div className="mt-6 max-h-96 overflow-y-auto divide-y divide-outline-variant/20">
          {loading ? (
            <div className="py-8 text-center text-outline-variant animate-pulse font-label-caps text-xs uppercase tracking-widest">
              Seeking essences...
            </div>
          ) : results.length > 0 ? (
            <div className="py-2 space-y-3">
              <p className="font-label-caps text-[10px] text-outline-variant uppercase tracking-widest mb-2">
                Suggested Fragrances
              </p>
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/shop/${product.handle}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-container-low transition-all group"
                >
                  <div className="relative w-14 aspect-[3/4] bg-surface-container-low rounded-lg overflow-hidden border border-outline-variant/10">
                    <Image
                      src={product.thumbnail}
                      alt={product.title}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                  <div className="flex-grow">
                    <p className="font-headline-sm text-sm text-primary group-hover:text-secondary transition-colors">
                      {product.title}
                    </p>
                    {product.family && (
                      <span className="inline-block mt-1 font-label-caps text-[9px] uppercase tracking-widest text-secondary px-2 py-0.5 bg-secondary-container/15 rounded-full">
                        {product.family}
                      </span>
                    )}
                  </div>
                  <div className="text-right font-headline-sm text-sm text-primary">
                    {formatINR(product.pricePaise)}
                  </div>
                </Link>
              ))}
            </div>
          ) : query.trim() ? (
            <div className="py-8 text-center text-on-surface-variant/70 font-body-md">
              No matched fragrances found in the atelier.
            </div>
          ) : (
            <div className="py-6 text-center">
              <p className="font-label-caps text-[10px] text-outline-variant uppercase tracking-widest mb-4">
                Popular Searches
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {["Sandalwood", "Cardamom", "Rose", "Oud", "Fresh"].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-4 py-2 rounded-none border border-outline-variant/30 text-xs font-label-caps uppercase tracking-widest text-primary hover:bg-surface-container-low transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
