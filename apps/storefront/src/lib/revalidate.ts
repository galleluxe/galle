import { revalidateTag as nextRevalidateTag } from "next/cache";

/** Next.js 16 requires a cache profile as the second argument. */
export function revalidateTag(tag: string) {
  return nextRevalidateTag(tag, "max");
}
