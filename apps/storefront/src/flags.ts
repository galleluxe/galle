import { unstable_flag as flag } from "@vercel/flags/next";

/**
 * Feature flags via @vercel/flags — integrates with Vercel Toolbar overrides.
 * Set FLAGS_SECRET in production for signed precomputation.
 */
export const giftingEnabled = flag<boolean>({
  key: "gifting-enabled",
  description: "Show gifting flow and navigation",
  defaultValue: true,
  options: [false, true],
  decide: () => process.env.NEXT_PUBLIC_FLAG_GIFTING !== "false",
});

export const scentQuizEnabled = flag<boolean>({
  key: "scent-quiz-enabled",
  description: "Show Scent Discovery quiz",
  defaultValue: true,
  options: [false, true],
  decide: () => process.env.NEXT_PUBLIC_FLAG_SCENT_QUIZ !== "false",
});

export const announcementBarEnabled = flag<boolean>({
  key: "announcement-bar",
  description: "Show top announcement bar",
  defaultValue: true,
  options: [false, true],
  decide: () => process.env.NEXT_PUBLIC_FLAG_ANNOUNCEMENT !== "false",
});
