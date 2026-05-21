# GALLE Monorepo

Premium perfume storefront (Next.js + Payload CMS v3) on a single Neon database with Drizzle for newsletter and other app tables.

## Quick start (local)

```bash
pnpm install
cp apps/storefront/.env.example apps/storefront/.env.local
# Set DATABASE_URL to Neon database `storefront` (pooled URL for Vercel)

pnpm --filter @galle/storefront dev
```

- Storefront: http://localhost:3000  
- Payload Admin: http://localhost:3000/admin (create your first user on first visit)

**Deploy storefront:** [HOST-NOW.md](./HOST-NOW.md)  
**Payload migration notes:** [PAYLOAD-MIGRATION.md](./PAYLOAD-MIGRATION.md)  
**Architecture:** [ARCHITECTURE.md](./ARCHITECTURE.md)

## Apps

| App | Description |
|-----|-------------|
| `apps/storefront` | Next.js + Payload CMS — catalog, cart (cookie), checkout, admin |

## Pricing (GST-inclusive)

Variant `pricePaise` in Payload is the **final amount the customer pays** (e.g. ₹6,500 → `650000`). Checkout splits base + 18% GST backwards for Razorpay receipts and invoices.

## Product images

Seed images live in `apps/storefront/public/` (`1.png`–`5.png`).

## Docs

- [HOST-NOW.md](./HOST-NOW.md) — Vercel + Neon step-by-step
- [PAYLOAD-MIGRATION.md](./PAYLOAD-MIGRATION.md) — Medusa → Payload checklist
- [DEPLOY.md](./DEPLOY.md) — production notes
- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [DESIGN.md](./DESIGN.md)
