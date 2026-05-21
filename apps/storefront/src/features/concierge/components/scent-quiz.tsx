"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BodyText, Headline } from "@/components/typography/display";
import { submitScentQuizAction } from "../server/actions";
import { toast } from "@/components/ui/use-toast";

const MOODS = [
  { id: "calm" as const, label: "Calm & Grounded", icon: "spa" },
  { id: "bold" as const, label: "Bold & Opulent", icon: "diamond" },
  { id: "romantic" as const, label: "Romantic & Soft", icon: "favorite" },
  { id: "fresh" as const, label: "Fresh & Airy", icon: "air" },
];

export function ScentQuiz() {
  const [mood, setMood] = useState<(typeof MOODS)[number]["id"] | null>(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    family: string;
    product: { handle: string; title: string; thumbnail: string } | null;
  } | null>(null);

  const handleSubmit = async () => {
    if (!mood) return;
    setLoading(true);
    try {
      const res = await submitScentQuizAction({ mood, email: email || undefined });
      if (res.success) {
        setResult(res.data);
        toast({ title: "Your scent profile is ready", description: res.data.family });
      } else {
        toast({ title: "Could not complete quiz", description: res.error });
      }
    } finally {
      setLoading(false);
    }
  };

  if (result?.product) {
    return (
      <div className="text-center space-y-6 p-8 bg-surface-container-low rounded-2xl ambient-shadow">
        <Headline size="sm">Your Essence</Headline>
        <BodyText>
          Based on your mood, we recommend our <strong>{result.family}</strong> family.
        </BodyText>
        <div className="relative w-32 aspect-[3/4] mx-auto rounded-xl overflow-hidden">
          <Image src={result.product.thumbnail} alt={result.product.title} fill className="object-cover" />
        </div>
        <p className="font-headline-sm text-primary">{result.product.title}</p>
        <Button asChild variant="primary">
          <Link href={`/shop/${result.product.handle}`}>Discover</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-lg mx-auto">
      <div className="grid grid-cols-2 gap-3">
        {MOODS.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setMood(m.id)}
            className={`p-6 rounded-xl border text-left transition-all ${
              mood === m.id
                ? "border-primary bg-primary-container/20"
                : "border-outline-variant/30 hover:bg-surface-container-low"
            }`}
          >
            <span className="material-symbols-outlined text-2xl text-secondary mb-2 block">
              {m.icon}
            </span>
            <span className="font-label-caps text-[10px] uppercase tracking-widest text-primary">
              {m.label}
            </span>
          </button>
        ))}
      </div>
      <Input
        type="email"
        placeholder="Email (optional — save your result)"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button
        variant="primary"
        className="w-full"
        disabled={!mood || loading}
        onClick={handleSubmit}
      >
        {loading ? "Discovering..." : "Reveal My Scent"}
      </Button>
    </div>
  );
}
