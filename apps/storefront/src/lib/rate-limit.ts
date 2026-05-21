/**
 * In-memory rate limiter for server actions and API routes.
 * For production at scale, replace with Redis/Upstash.
 */

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

const stores = new Map<string, Map<string, { count: number; resetAt: number }>>();

function getStore(namespace: string) {
  if (!stores.has(namespace)) {
    stores.set(namespace, new Map());
  }
  return stores.get(namespace)!;
}

export function checkRateLimit(
  key: string,
  config: RateLimitConfig,
  namespace = "default"
): RateLimitResult {
  const store = getStore(namespace);
  const now = Date.now();
  const record = store.get(key);

  if (!record || now > record.resetAt) {
    const resetAt = now + config.windowMs;
    store.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: config.maxRequests - 1, resetAt };
  }

  record.count += 1;
  const allowed = record.count <= config.maxRequests;
  return {
    allowed,
    remaining: Math.max(0, config.maxRequests - record.count),
    resetAt: record.resetAt,
  };
}

export const RATE_LIMITS = {
  auth: { windowMs: 15 * 60_000, maxRequests: 5 },
  newsletter: { windowMs: 60_000, maxRequests: 3 },
  contact: { windowMs: 60_000, maxRequests: 5 },
  quiz: { windowMs: 60_000, maxRequests: 3 },
  api: { windowMs: 60_000, maxRequests: 60 },
} as const;
