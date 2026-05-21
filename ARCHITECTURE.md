# GALLE — Final Architecture

> Premium perfume house storefront. India-first. Built like a top brand on the front, like a top engineering team on the back.

This document is the single source of truth for the rebuild. It supersedes every earlier discussion. Anything not in this document is "to be decided" and must be added here before it ships.

---

## 1. Product principles

1. **Customer-visible feel is bespoke.** No customer should ever see a generic admin URL, a vendor cookie, a vendor CSS class, or a vendor-shaped UI. Every pixel on `galle.com` is ours.
2. **Boring commerce internals.** Variants, inventory, orders, refunds, discounts, tax, shipping rules, RBAC admin — solved by a mature engine. We do not rebuild them.
3. **Server-first, edge-aware.** React Server Components by default. Client islands only at interaction leaves.
4. **One source of truth per concern.** The database for commerce data. The Medusa engine for commerce logic. Drizzle only for non-commerce data we own. No dual-writes, no merge logic, no localStorage carts.
5. **Indian luxury defaults.** INR (paise) money math, GST-aware tax, Razorpay primary, Shiprocket primary, Mumbai/Bangalore-region infra, English `en-IN` copy.
6. **Performance is a feature.** Hard budgets enforced in CI (see §13).
7. **Accessibility is non-negotiable.** Radix primitives, focus-visible, prefers-reduced-motion, Lighthouse a11y ≥ 95.

---

## 2. Stack summary

| Layer | Choice |
|---|---|
| Language | **TypeScript (strict)** end-to-end |
| Storefront framework | **Next.js 15 (App Router) + React 19** |
| Commerce engine | **Medusa.js v2** (self-hosted) |
| Styling | **Tailwind v4** + CSS-variable design tokens + `cva` |
| UI primitives | **Radix UI** + bespoke "Maison GALLE" components on top |
| Animation | **Framer Motion** + Lenis (smooth scroll, respects reduced-motion) |
| Forms | **React Hook Form** + Zod resolvers |
| Validation | **Zod** at every input boundary |
| Cart state | **Server-authoritative** (cookie + Medusa cart) + `useOptimistic` |
| Server cache | **TanStack Query** for client-side mutations only |
| URL state (filters) | **`nuqs`** |
| Auth | **Medusa customer auth** wrapped in our own UI; Auth.js optional later for social |
| Payments | **Razorpay** via Medusa payment provider |
| Shipping | **Shiprocket** via Medusa fulfilment provider |
| Email | **Resend** + **React Email** templates |
| Editorial / blog | **MDX + Content Collections** in repo (Sanity-ready slot) |
| Images | **ImageKit** via custom `next/image` loader, AVIF/WebP, blurhash LQIP |
| Search | **Postgres `tsvector` + `pg_trgm`** (Meilisearch optional later) |
| Drizzle ORM | **Only for non-commerce tables** (journal, quiz, concierge enquiries, newsletter, analytics) |
| Observability | **Sentry** (client + server) + **Axiom** logs + Vercel Analytics |
| Testing | **Vitest** (unit) + **Testing Library** + **Playwright** (e2e) + **Storybook 8** |
| Quality gates | ESLint flat, Prettier, TS strict, Knip, Lefthook pre-commit |
| CI/CD | **GitHub Actions** → Vercel (storefront) + GitHub Actions SSH deploy → DO (backend) |
| Feature flags | `@vercel/flags` (Edge Config) |
| i18n scaffold | `next-intl` with default `en-IN` |

---

## 3. Hosting & deployment

### 3.1 Production topology

```text
                   Customers in India
                          │
        ┌─────────────────┴─────────────────┐
        ▼                                   ▼
 galle.com                            api.galle.com
 ─────────────                        ─────────────────────
 Vercel Pro ($20/mo)                  Cloudflare (DNS + WAF, proxied)
 Next.js 15 storefront                         │
 RSC + ISR (Vercel edge)                       ▼
 Image opt (Vercel)                    DigitalOcean Bangalore VPS ($12/mo)
                                       Premium AMD · 2 vCPU · 2 GB · NVMe
                                       ├─ Caddy (auto-TLS, reverse proxy)
                                       ├─ Medusa server (pm2)
                                       ├─ Medusa worker (pm2)
                                       ├─ Postgres 16 (local, tuned)
                                       └─ Redis 7 (local, 192 MB cap)
                                              │
                                              ▼
                                       Daily pg_dump → GCS (5 GB free)
                                       Weekly DO snapshot ($2.40/mo)
```

### 3.2 Monthly cost

| Item | Cost |
|---|---|
| DigitalOcean Bangalore Premium AMD 2 GB | $12.00 |
| DigitalOcean weekly snapshots | $2.40 |
| Vercel Pro (storefront) | $20.00 |
| Cloudflare (DNS + WAF) | $0.00 |
| GCS backup bucket (5 GB free) | $0.00 |
| Resend (3k emails/mo free) | $0.00 |
| ImageKit (free tier) | $0.00 |
| Sentry / Axiom (free tiers) | $0.00 |
| **Total** | **~$34.40 / ₹2,900** |

### 3.3 RAM budget on the 2 GB box (tuned)

| Process | Footprint |
|---|---|
| Ubuntu 24.04 minimal + Caddy | 180 MB |
| Postgres 16 (`shared_buffers=256MB`, `work_mem=8MB`, `max_connections=40`) | 320 MB |
| Redis 7 (`maxmemory=192mb`, `allkeys-lru`) | 50 MB |
| Medusa server (Node, `--max-old-space-size=512`) | 450 MB |
| Medusa worker (Node, `--max-old-space-size=384`) | 320 MB |
| **Free headroom** | **~680 MB** |

Worker can run in `MEDUSA_WORKER_MODE=shared` early on to free another ~250 MB.

### 3.4 DNS strategy

- `galle.com` and `www.galle.com` → Vercel, **Cloudflare DNS-only (grey cloud)**. Vercel handles CDN/ISR — never proxy Vercel through Cloudflare's cache, it causes ISR/stale collisions.
- `api.galle.com` → DO VPS, **Cloudflare proxied (orange cloud)** with WAF + bot protection on.
- `admin.galle.com` → same Medusa instance, IP-allowlist via Cloudflare Access (free for ≤50 users).

### 3.5 Scale-up path

| Trigger | Action |
|---|---|
| RAM > 75% sustained | Resize DO droplet to 4 GB ($24/mo), 60-second resize |
| Orders > 100/day | Move Postgres to Neon Launch ($19/mo), keep Redis local |
| Orders > 500/day | Move Redis to Upstash Pay-as-you-go, split Medusa worker to its own droplet |
| International traffic | Add a second DO droplet in NYC/Frankfurt, Cloudflare load balancing |

---

## 4. Repository shape (monorepo)

```text
galle/
├─ apps/
│  ├─ storefront/                 # Next.js 15 — galle.com (deployed to Vercel)
│  └─ medusa/                     # Medusa v2 — api.galle.com (deployed to DO)
├─ packages/
│  ├─ ui/                         # Shared design-system primitives (optional)
│  ├─ config/                     # Shared tsconfig, eslint, tailwind preset, prettier
│  └─ emails/                     # React Email templates (used by Medusa + storefront)
├─ infra/
│  ├─ caddy/Caddyfile             # Reverse proxy config for the DO box
│  ├─ scripts/                    # provision.sh, backup.sh, deploy.sh
│  └─ pm2/ecosystem.config.cjs    # Medusa server + worker process spec
├─ .github/workflows/             # CI: typecheck, lint, test, build, deploy
├─ pnpm-workspace.yaml
├─ turbo.json
├─ package.json
├─ ARCHITECTURE.md                # this file
└─ README.md
```

### 4.1 `apps/storefront` (Next.js 15)

```text
apps/storefront/src/
├─ app/
│  ├─ (marketing)/
│  │  ├─ page.tsx                 # Home
│  │  ├─ about/page.tsx
│  │  ├─ contact/page.tsx
│  │  ├─ journal/page.tsx
│  │  ├─ journal/[slug]/page.tsx
│  │  └─ legal/{privacy,shipping,returns}/page.tsx
│  ├─ (shop)/
│  │  ├─ shop/page.tsx            # Catalog (ISR, nuqs filters)
│  │  ├─ shop/[handle]/page.tsx   # PDP (SSG + ISR + JSON-LD)
│  │  ├─ gifting/page.tsx
│  │  ├─ cart/page.tsx
│  │  └─ checkout/page.tsx
│  │  └─ checkout/success/page.tsx
│  ├─ (account)/
│  │  ├─ account/page.tsx
│  │  ├─ account/orders/page.tsx
│  │  ├─ account/orders/[id]/page.tsx
│  │  ├─ account/addresses/page.tsx
│  │  ├─ account/profile/page.tsx
│  │  └─ track/page.tsx
│  ├─ (auth)/
│  │  ├─ sign-in/page.tsx
│  │  ├─ sign-up/page.tsx
│  │  ├─ forgot-password/page.tsx
│  │  └─ reset-password/page.tsx
│  ├─ api/
│  │  ├─ revalidate/route.ts      # Tag/path revalidation from Medusa webhooks
│  │  ├─ og/[...]/route.tsx       # Dynamic OG images
│  │  └─ health/route.ts
│  ├─ sitemap.ts
│  ├─ robots.ts
│  ├─ manifest.ts
│  ├─ not-found.tsx
│  ├─ error.tsx
│  ├─ global-error.tsx
│  └─ layout.tsx
│
├─ features/                      # Vertical slices
│  ├─ catalog/                    # Listing, filtering, sorting, PDP composition
│  ├─ cart/                       # Server-authoritative cart, useOptimistic UI
│  ├─ checkout/                   # Razorpay flow, address book, shipping
│  ├─ gifting/                    # Multi-product gifting + message
│  ├─ account/                    # Profile, orders, addresses
│  ├─ auth/                       # Sign in/up/reset wrappers around Medusa
│  ├─ search/                     # Debounced suggest + full search
│  ├─ newsletter/                 # Subscribe + double opt-in
│  ├─ journal/                    # MDX collection rendering
│  └─ concierge/                  # Contact + scent-quiz forms
│
├─ components/
│  ├─ ui/                         # Button, Input, Dialog, Toast (Radix-based)
│  ├─ layout/                     # Navbar, Footer, AnnouncementBar, PageShell
│  ├─ media/                      # Image, Video, Gallery, NotePyramid
│  ├─ motion/                     # Reveal, Magnetic, Parallax (respect reduced-motion)
│  └─ typography/                 # Display, Eyebrow, Prose
│
├─ lib/
│  ├─ medusa/                     # Typed Medusa JS SDK client (RSC + browser)
│  ├─ db/                         # Drizzle client + schema for galle_* tables only
│  ├─ env.ts                      # `@t3-oss/env-nextjs` typed env
│  ├─ money.ts                    # paise math, formatINR
│  ├─ seo.ts                      # buildMetadata + JSON-LD helpers
│  ├─ image-loader.ts             # ImageKit loader
│  ├─ analytics.ts                # Typed event taxonomy
│  ├─ logger.ts                   # pino → Axiom
│  ├─ rate-limit.ts
│  └─ utils.ts                    # cn(), invariant()
│
├─ design-system/
│  ├─ tokens.css                  # CSS variables (colour, space, type, motion, radius)
│  ├─ theme.ts                    # TS mirror of tokens
│  └─ fonts.ts                    # next/font (max 2 families)
│
├─ content/
│  ├─ journal/*.mdx
│  └─ legal/*.mdx
│
├─ providers/                     # Client provider tree (Toaster, Theme, Cart hydrator)
├─ middleware.ts                  # Guest cart cookie, auth gates, rate limit
└─ types/
```

### 4.2 `apps/medusa` (Medusa v2)

```text
apps/medusa/src/
├─ admin/                         # Admin UI extensions (widgets, routes)
├─ api/                           # Custom API routes (only when not covered by core)
├─ modules/
│  ├─ fragrance/                  # Custom module: scent family, note pyramid, etc.
│  │  ├─ models/fragrance-profile.ts
│  │  ├─ service.ts
│  │  └─ index.ts
│  └─ concierge/                  # Optional: enquiry pipeline
├─ subscribers/                   # Event handlers (order.placed → email, revalidate)
├─ workflows/                     # Custom workflows (gifting order, sample dispatch)
├─ jobs/                          # Scheduled tasks (abandoned cart, low stock)
├─ scripts/                       # Seed scripts
└─ medusa-config.ts
```

---

## 5. Data architecture

### 5.1 Who owns what

| Concern | Owner | Storage |
|---|---|---|
| Products, variants, prices, inventory | **Medusa** | Postgres (Medusa schema) |
| Customers, addresses | **Medusa** | Postgres (Medusa schema) |
| Carts, orders, payments, refunds, shipments | **Medusa** | Postgres (Medusa schema) |
| Discount codes, gift cards, promotions | **Medusa** | Postgres (Medusa schema) |
| Tax & shipping rules, regions, currencies | **Medusa** | Postgres (Medusa schema) |
| RBAC, admin users, audit log | **Medusa** | Postgres (Medusa schema) |
| Scent family, note pyramid, longevity, sillage, occasion | **Medusa custom module** `fragrance` | Postgres, joined by `product_id` |
| Editorial subtitle, mood tags, "is_discovery_sample" flag | **Medusa `metadata` JSONB** | On the Product / Variant entity |
| Journal posts (blog) | **MDX in repo** (Content Collections) | Git |
| Legal pages | **MDX in repo** | Git |
| Newsletter subscribers | **Drizzle** | Postgres `galle_newsletter_subscribers` |
| Scent-quiz responses (analytics) | **Drizzle** | Postgres `galle_quiz_responses` |
| Concierge enquiries (contact form) | **Drizzle** | Postgres `galle_concierge_enquiries` |
| Custom analytics events | **Drizzle** | Postgres `galle_events` |

Same Postgres instance, two logical schemas (`medusa` default + `galle`), so Drizzle migrations never collide with Medusa's.

### 5.2 Fragrance module (Medusa custom module)

```ts
// apps/medusa/src/modules/fragrance/models/fragrance-profile.ts
import { model } from "@medusajs/framework/utils";

export const FragranceProfile = model.define("fragrance_profile", {
  id: model.id().primaryKey(),
  product_id: model.text().unique(),
  family: model.enum(["Woody", "Floral", "Fresh", "Amber", "Oriental", "Citrus"]),
  top_notes: model.array(),
  heart_notes: model.array(),
  base_notes: model.array(),
  longevity_hours: model.number().nullable(),
  sillage: model.enum(["Intimate", "Moderate", "Strong"]).nullable(),
  occasion: model.array(),       // ["day", "evening", "gifting"]
  editorial_pullquote: model.text().nullable(),
});
```

Surfaced on PDP, Shop filters, and Scent Discovery cards via the storefront's typed Medusa client (`?fields=+fragrance_profile`).

---

## 6. Cart architecture — server-authoritative

No localStorage. No Zustand for cart. No client merge logic. Database is the source of truth from the first click.

### 6.1 Guest cookie (middleware)

```ts
// apps/storefront/src/middleware.ts
import { NextResponse, type NextRequest } from "next/server";
import { randomUUID } from "node:crypto";

export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  if (!req.cookies.get("galle_cart_id")) {
    res.cookies.set("galle_cart_id", randomUUID(), {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 60,
    });
  }
  return res;
}
```

### 6.2 Server action (write path)

```ts
// apps/storefront/src/features/cart/server/actions.ts
"use server";
import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import { medusa } from "@/lib/medusa/server";

const AddSchema = z.object({
  variantId: z.string(),
  quantity: z.number().int().min(1).max(10),
});

export async function addToCart(input: unknown) {
  const { variantId, quantity } = AddSchema.parse(input);
  const cartId = cookies().get("galle_cart_id")!.value;

  await medusa.store.cart.lineItem.create(cartId, {
    variant_id: variantId,
    quantity,
  });

  revalidateTag(`cart:${cartId}`);
}
```

### 6.3 Optimistic UI (read path, instant feedback)

```tsx
// apps/storefront/src/features/cart/components/AddToCartButton.tsx
"use client";
import { useOptimistic, useTransition } from "react";
import { addToCart } from "../server/actions";

export function AddToCartButton({ variantId, cart }: { variantId: string; cart: Cart }) {
  const [optimistic, addOptimistic] = useOptimistic(cart, (state, qty: number) => ({
    ...state,
    itemCount: state.itemCount + qty,
  }));
  const [pending, start] = useTransition();

  return (
    <button
      disabled={pending}
      onClick={() =>
        start(async () => {
          addOptimistic(1);
          await addToCart({ variantId, quantity: 1 });
        })
      }
      className="gold-button"
    >
      Add to Bag · {optimistic.itemCount}
    </button>
  );
}
```

### 6.4 Sign-in handoff

```ts
// One Medusa call. No merge logic, no collisions.
await medusa.store.cart.transferToCustomer(cartId);
```

---

## 7. Auth

- **Medusa customer auth** (email + password, plus Google later) wrapped in our own `/sign-in`, `/sign-up`, `/forgot-password`, `/reset-password` UI.
- HTTP-only session cookie (`galle_session`) set by our server actions, never exposed to JS.
- Rate-limited at middleware (5 sign-in attempts / 15 min / IP).
- Password reset via Resend + React Email template.
- Admin auth is Medusa's built-in dashboard auth, fronted by Cloudflare Access.

---

## 8. Payments — Razorpay via Medusa

- Razorpay registered as a Medusa payment provider.
- Storefront `/checkout` creates a Medusa cart → initiates Razorpay order → mounts the official Razorpay checkout widget client-side → on success, server action confirms the Medusa payment session → order placed → revalidate + email.
- Webhooks: `api.galle.com/webhooks/razorpay` (signature-verified) handles async events (`payment.captured`, `payment.failed`, `refund.processed`).
- Money is **integer paise** end-to-end; `formatINR` is the only place rupee strings appear.

---

## 9. Shipping — Shiprocket via Medusa

- Shiprocket as a Medusa fulfilment provider.
- Order placed → workflow assigns shipment → Shiprocket API creates AWB → tracking URL stored on shipment.
- `/account/track` and `/track` use Medusa's order endpoint, which proxies the latest Shiprocket status.

---

## 10. Caching strategy

| Route | Strategy |
|---|---|
| `/` (Home) | RSC + ISR `revalidate = 600`, tag `home` |
| `/shop` | RSC + ISR `revalidate = 600`, tag `shop` (filters via `nuqs`, not in path) |
| `/shop/[handle]` | RSC + ISR `revalidate = 600`, tag `product:${handle}` |
| `/journal`, `/journal/[slug]` | Static (build-time, MDX) |
| `/about`, `/contact`, `/legal/*` | Static |
| `/cart`, `/checkout`, `/account/*`, `/track` | `dynamic = "force-dynamic"`, `cache: "no-store"` |

### Tag-based revalidation

Medusa subscriber on `product.updated`, `product.deleted`, `inventory.updated` → POST `https://galle.com/api/revalidate` with a signed token → handler calls `revalidateTag(...)`. No more `force-dynamic` everywhere like the old codebase.

---

## 11. Design system

### 11.1 Token contract

`design-system/tokens.css` defines every visual decision as CSS variables. Components never reference raw hex.

Ethereal Essence tokens are defined in `apps/storefront/src/design-system/tokens.css` and mirrored in `DESIGN.md` (Material 3 palette: cream surface `#faf9f5`, primary blush `#6f5959`, champagne secondary `#735c00`, deep rose tertiary `#805253`). Typography: **Bodoni Moda** (display) + **Outfit** (body/UI) via `next/font`.

### 11.2 Rules

- Max **two** font families (one display serif + one neutral sans), loaded via `next/font` with `display: swap` + `size-adjust`.
- No hardcoded hex in components — `tailwind.config.ts` maps every utility to a token.
- Every interactive element uses Radix or extends it. No `<div onClick>`.
- Every motion respects `prefers-reduced-motion`.
- Focus-visible rings everywhere (`outline: 2px solid var(--color-gold-500); outline-offset: 3px;`).

---

## 12. Sections to rebuild (extracted from the old site)

| Surface | Sections / features |
|---|---|
| **Home** | Hero (headline, dual CTA → Shop / Gifting, featured product, trust points, 3-product preview) · Scent Discovery (mood cards by family) · Commitment / Luxury Signals · Journal teaser · Newsletter signup |
| **Shop** | Hero with stats · Family filter chips · Sort (Featured / Price L→H / Price H→L / Alphabetical) · Product grid · Empty state · Gifting cross-link |
| **PDP** (`/shop/[handle]`) | Image gallery · Family + stock badges · Title, price, description · **Note pyramid** (Top / Heart / Base) · Highlights · Qty selector · Add to Cart + Buy Now · Share · Reviews · Related products |
| **Gifting** | Sender + recipient forms (with country code) · Multi-product picker · Gift message · Total calculator · Razorpay checkout · Separate gifting order flow |
| **Cart** | Line items, qty edit, remove, totals, proceed-to-checkout |
| **Checkout** | Auth-aware shipping form · Razorpay flow · Order confirmation email |
| **Account** | Profile edit · Order history · Addresses · Sign out |
| **Auth** | Sign in / Sign up · Forgot / reset password |
| **Track Order** | Lookup by order id or email |
| **Journal** | Index + post pages (MDX) |
| **About** | Brand pillars |
| **Contact** | Contact form → Resend |
| **Legal** | Privacy / Returns / Shipping |
| **Global** | Navbar (logo, nav, search w/ debounced suggest, cart badge, account, mobile drawer) · Footer (brand, links, newsletter) · Announcement bar · Toasts · Smooth scroll |
| **Admin** | Medusa default admin on `admin.galle.com` (products, variants, inventory, orders, customers, discounts, gift cards, regions, tax, shipping) — IP-allowlisted via Cloudflare Access |

---

## 13. Quality & performance budgets (enforced in CI)

| Metric | Budget |
|---|---|
| LCP (mobile, 4G) | < 2.0s |
| CLS | < 0.05 |
| TBT | < 150ms |
| Home JS (gzip) | < 90 KB |
| PDP JS (gzip) | < 130 KB |
| Lighthouse Performance | ≥ 90 |
| Lighthouse Accessibility | ≥ 95 |
| Lighthouse SEO | ≥ 95 |
| Bundle analyser check | runs on every PR |
| Playwright e2e (cart → checkout → success) | green on every PR |
| Visual regression (Storybook + Chromatic free) | green on every PR |

---

## 14. SEO

- `generateMetadata` per route.
- JSON-LD: `Organization` (root), `Product` + `BreadcrumbList` (PDP), `Article` (Journal).
- `app/sitemap.ts` reads products from Medusa + journal slugs from MDX.
- `app/robots.ts`.
- Dynamic OG images per product via `@vercel/og` at `/api/og/product/[handle]`.
- Canonical URLs, hreflang scaffolded for future locales.

---

## 15. Observability

- **Sentry** for storefront (browser + server) and Medusa.
- **Axiom** for structured logs (`pino` → `@axiomhq/pino`).
- **Vercel Analytics** for Web Vitals.
- **Better Stack / UptimeRobot** pinging `api.galle.com/health` every 60s — pages Slack/SMS on failure.
- Typed analytics events (`lib/analytics.ts`) — every product event has a contract.

---

## 16. Security baseline

- HTTP-only, `Secure`, `SameSite=Lax` cookies for cart and session.
- CSRF protection on all server actions (Next 15 default `Origin` check + custom token for non-action mutations).
- Rate limits in middleware (sign-in, password reset, newsletter, contact).
- Zod validation on every input boundary.
- Razorpay webhook signature verification.
- CSP via `next.config.ts` headers (no inline scripts except `next/script` `beforeInteractive`).
- DO box: UFW (22/80/443 only), `fail2ban`, SSH key-only, unattended-upgrades.
- Cloudflare WAF managed rules on `api.galle.com`.
- Admin behind Cloudflare Access (email-link auth, max 50 users free).
- Daily off-site Postgres backups to GCS, 30-day retention, monthly restore drill.

---

## 17. Local development

```bash
# One-time
pnpm install
cp apps/storefront/.env.example apps/storefront/.env.local
cp apps/medusa/.env.example     apps/medusa/.env

# Run everything
docker compose up -d postgres redis      # local infra
pnpm --filter @galle/medusa db:migrate
pnpm --filter @galle/medusa seed
pnpm dev                                  # turbo runs storefront + medusa
```

| Service | URL |
|---|---|
| Storefront | http://localhost:3000 |
| Medusa API | http://localhost:9000 |
| Medusa Admin | http://localhost:9000/app |
| Storybook | http://localhost:6006 |
| React Email preview | http://localhost:3030 |

---

## 18. CI / CD

### Storefront

- GitHub Actions on PR: `typecheck → lint → unit → build → playwright → bundle-size → lighthouse-ci`.
- Preview deploy to Vercel per PR.
- Merge to `main` → production deploy to Vercel.

### Medusa backend

- GitHub Actions on PR: `typecheck → lint → unit → build`.
- Merge to `main` → SSH deploy to DO box:

  ```bash
  ssh galle@api.galle.com '
    cd /srv/galle &&
    git pull &&
    pnpm install --frozen-lockfile &&
    pnpm --filter @galle/medusa build &&
    pnpm --filter @galle/medusa db:migrate &&
    pm2 reload ecosystem.config.cjs
  '
  ```

- Postgres migrations are forward-only; rollback = restore from last `pg_dump`.

---

## 19. Decisions locked in

1. **Commerce engine**: Medusa.js v2, self-hosted. ✅
2. **Storefront**: Next.js 15 + TypeScript strict + Tailwind v4 on Vercel Pro. ✅
3. **Backend host**: DigitalOcean Premium AMD 2 GB · **Bangalore** · $12/mo. ✅
4. **DB + Redis**: Self-hosted on the same DO box (Postgres 16 + Redis 7). ✅
5. **DNS**: Cloudflare — DNS-only for the Vercel domain, proxied for `api.galle.com`. ✅
6. **Backups**: Nightly `pg_dump` → GCS (5 GB free) + weekly DO snapshots. ✅
7. **Cart**: Server-authoritative (`galle_cart_id` cookie) + Server Actions + `useOptimistic`. **No localStorage. No client merge.** ✅
8. **Auth**: Medusa customer auth wrapped in bespoke UI. ✅
9. **Payments**: Razorpay via Medusa. ✅
10. **Shipping**: Shiprocket via Medusa. ✅
11. **Email**: Resend + React Email. ✅
12. **Images**: ImageKit via custom `next/image` loader. ✅
13. **Editorial**: MDX in repo; Sanity-ready slot. ✅

---

## 20. Open items (must be resolved before/during scaffolding)

1. **Figma designs** — needed to lock final design tokens (palette, type, motion). Until shared, scaffold uses placeholder tokens defined in §11.1.
2. **Domain** — confirm `galle.com` (or alternative) for DNS + Cloudflare zone setup.
3. **Razorpay account** — production API keys + webhook secret.
4. **Shiprocket account** — API token + pickup address.
5. **Resend** — verified sending domain + DKIM records.
6. **ImageKit** — endpoint URL + private key.
7. **Brand fonts** — Bodoni Moda + Outfit via Google Fonts (`next/font`). ✅
8. **Feature scope deltas vs. legacy** — confirm whether to ship at v1: wishlist, reviews with photos, discovery sample sets, loyalty, multi-currency, PWA. Default: **no** (deferred to v1.1).

---

## 21. Build order (PR-by-PR)

1. Monorepo skeleton + tooling (Turborepo, pnpm, ESLint, Prettier, TS strict, Lefthook).
2. `apps/medusa` scaffold + Razorpay/Shiprocket providers + Fragrance module + seed.
3. `apps/storefront` scaffold + design tokens + Navbar + Footer + Home (RSC + ISR).
4. Shop listing (RSC + `nuqs` filters + ISR).
5. PDP (with Fragrance Profile, JSON-LD, OG image).
6. Server-authoritative Cart + `useOptimistic` + cart drawer.
7. Checkout + Razorpay integration + order confirmation email.
8. Auth (sign-in / sign-up / reset).
9. Account (profile, orders, addresses) + Track Order.
10. Gifting (multi-product + message + Razorpay).
11. Journal (MDX) + About + Contact + Legal.
12. Admin polish (Medusa admin extensions: Fragrance widget on product page).
13. Observability + analytics + perf hardening.
14. v1 launch.
