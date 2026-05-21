"use server";

import { z } from "zod";
import { getDb } from "@/lib/db/client";
import { quizResponses, conciergeEnquiries } from "@/lib/db/schema";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { headers } from "next/headers";
import { listProducts } from "@/lib/catalog";
import type { ScentFamily } from "@/lib/catalog/types";

const QuizSchema = z.object({
  email: z.string().email().optional().or(z.literal("")),
  mood: z.enum(["calm", "bold", "romantic", "fresh"]),
  occasion: z.enum(["day", "evening", "gifting"]).optional(),
  intensity: z.enum(["intimate", "moderate", "strong"]).optional(),
});

const MOOD_TO_FAMILY: Record<string, ScentFamily> = {
  calm: "Woody",
  bold: "Oriental",
  romantic: "Floral",
  fresh: "Fresh",
};

export async function submitScentQuizAction(input: unknown) {
  const data = QuizSchema.parse(input);
  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  const limit = checkRateLimit(ip, RATE_LIMITS.quiz, "quiz");
  if (!limit.allowed) {
    return { success: false as const, error: "Too many attempts. Please try again later." };
  }

  const family = MOOD_TO_FAMILY[data.mood] ?? "Floral";
  const products = await listProducts();
  const match =
    products.find((p) => p.fragrance?.family === family) ??
    products[0];

  const db = getDb();
  if (db) {
    await db.insert(quizResponses).values({
      email: data.email || null,
      mood: data.mood,
      preferredFamily: family,
      occasion: data.occasion ?? null,
      intensity: data.intensity ?? null,
      recommendedHandle: match?.handle ?? null,
    });
  }

  const { trackServerEvent } = await import("@/lib/analytics");
  await trackServerEvent({
    name: "quiz_complete",
    properties: { mood: data.mood, family },
  });

  return {
    success: true as const,
    data: {
      family,
      product: match
        ? { handle: match.handle, title: match.title, thumbnail: match.thumbnail }
        : null,
    },
  };
}

const ConciergeSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  enquiryType: z.enum(["bespoke", "corporate", "sample", "other"]),
  message: z.string().min(10),
});

export async function submitConciergeAction(input: unknown) {
  const data = ConciergeSchema.parse(input);
  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  const limit = checkRateLimit(ip, RATE_LIMITS.contact, "concierge");
  if (!limit.allowed) {
    return { success: false as const, error: "Too many requests." };
  }

  const db = getDb();
  if (db) {
    await db.insert(conciergeEnquiries).values(data);
  }

  return { success: true as const };
}
