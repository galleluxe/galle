# Galle — Payload CMS migration

Medusa has been replaced with **Payload CMS v3** embedded in `apps/storefront`.

## Stack

| Layer | Tech |
|-------|------|
| Storefront + Admin | Next.js 15.2 + Payload 3 (`/admin`) |
| Catalog | Payload collections `products`, `product-variants` |
| Orders | Payload collection `orders` |
| Newsletter / quiz / contact | Drizzle tables (unchanged, same Neon DB) |
| Cart | HTTP-only cookie `galle_cart_data` |
| Checkout | Server actions + Razorpay (GST-inclusive prices) |
| Hosting | Vercel + Neon (pooled `DATABASE_URL`) |

## Env vars (Vercel + `.env.local`)

```env
DATABASE_URL=postgresql://...@ep-xxx.neon.tech/storefront?sslmode=require
PAYLOAD_SECRET=long-random-string
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
RESEND_API_KEY=re_...
REVALIDATE_SECRET=galle_revalidate_secret
NEXT_PUBLIC_SITE_URL=https://your-site.vercel.app
```

Use Neon **pooled** connection string on Vercel.

## Local dev

```powershell
cd galle
pnpm install
pnpm --filter @galle/storefront dev
```

1. Open http://localhost:3000/admin — create first admin user.
2. Add **Products** (status: published) and **Product Variants** (`pricePaise` = GST-inclusive paise, e.g. ₹6,500 → `650000`).
3. Storefront shop reads from Payload automatically.

## GST pricing

- `pricePaise` on variants is **GST-inclusive** (what the customer pays).
- Checkout splits backwards: `basePaise = round(total / 1.18)`, `gstPaise = total - base` for receipts.

## Removed

- `apps/medusa/` — delete from repo
- `NEXT_PUBLIC_MEDUSA_*`, `MEDUSA_BACKEND_URL`
- Medusa cart / customer auth (guest checkout only for now)
