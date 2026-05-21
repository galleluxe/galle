const WISHLIST_KEY = "galle_wishlist";

export const WISHLIST_CHANGE_EVENT = "galle:wishlist-change";

export function readWishlistHandles(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((h): h is string => typeof h === "string")
      : [];
  } catch {
    return [];
  }
}

export function writeWishlistHandles(handles: string[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(handles));
  window.dispatchEvent(new CustomEvent(WISHLIST_CHANGE_EVENT));
}

export function toggleWishlistHandle(handle: string): boolean {
  const current = readWishlistHandles();
  const exists = current.includes(handle);
  const next = exists
    ? current.filter((h) => h !== handle)
    : [...current, handle];
  writeWishlistHandles(next);
  return !exists;
}

export function isWishlisted(handle: string): boolean {
  return readWishlistHandles().includes(handle);
}
