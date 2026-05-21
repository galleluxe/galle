import { revalidateTag as nextRevalidateTag } from "next/cache";

/** Next.js 16 requires a cache profile as the second argument. */
export function revalidateTag(tag: string) {
  try {
    return nextRevalidateTag(tag, "max");
  } catch {
    // No-op outside Next request context (e.g. `pnpm seed:catalog`, Payload CLI).
  }
}
