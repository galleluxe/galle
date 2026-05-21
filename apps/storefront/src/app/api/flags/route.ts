import { giftingEnabled, scentQuizEnabled, announcementBarEnabled } from "@/flags";
import { unstable_evaluate as evaluate } from "@vercel/flags/next";
import { NextResponse } from "next/server";

export async function GET() {
  const flags = await evaluate([giftingEnabled, scentQuizEnabled, announcementBarEnabled]);
  return NextResponse.json(flags);
}
