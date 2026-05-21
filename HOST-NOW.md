# Host Galle now (Vercel + Neon)

Single Next.js app with Payload CMS and Drizzle on one Neon database (`storefront`). No separate commerce server.

**Time:** ~30 minutes if you do steps in order.

---

## Before you start

1. Production build must pass locally:

   ```powershell
   cd galle
   pnpm install
   pnpm --filter @galle/storefront build
   ```

2. Accounts (free tiers):
   - [Vercel](https://vercel.com) — storefront
   - [Neon](https://neon.tech) — Postgres (Payload + Drizzle)
   - [GitHub](https://github.com) — connect Vercel to repo

3. **Rotate secrets** you pasted in chat before going live (Razorpay, Resend, ImageKit, `PAYLOAD_SECRET`).

---

## Step 1 — Neon (one database)

1. Neon → New project → region **Singapore** (or closest to India).
2. Use the default database or create **`storefront`**:

   ```sql
   CREATE DATABASE storefront;
   ```

3. In the Neon dashboard, copy the **pooled** connection string and set the database name to `storefront`:

   ```env
   DATABASE_URL=postgresql://...@ep-....neon.tech/storefront?sslmode=require
   ```

4. Apply Drizzle tables (newsletter, etc.) if not already done:

   ```powershell
   cd apps/storefront
   npx drizzle-kit push
   ```

   Or run `scripts/neon-storefront-schema.sql` in the Neon SQL editor.

5. Payload creates its own prefixed tables on first dev/build (`push: true` in non-production). In production, run migrations or a one-off deploy with `push` enabled once if needed.

---

## Step 2 — Local env

`apps/storefront/.env.local` (see `.env.example`):

| Variable | Notes |
|----------|--------|
| `DATABASE_URL` | Neon **`storefront`** — same DB for Payload + Drizzle |
| `PAYLOAD_SECRET` | Long random string |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` locally |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Razorpay test key |
| `RAZORPAY_KEY_ID` | Server-side (same or live key) |
| `RAZORPAY_KEY_SECRET` | Server-side only |
| `RESEND_API_KEY` | Resend |
| `REVALIDATE_SECRET` | Any secret string |
| ImageKit vars | As in `.env.example` |

```powershell
pnpm --filter @galle/storefront dev
```

Open http://localhost:3000/admin → create the first admin user → add products and variants (`pricePaise` = **GST-inclusive** paise).

---

## Step 3 — Deploy on Vercel

### 3a. Import project

1. [vercel.com/new](https://vercel.com/new) → Import your GitHub repo.
2. **Root Directory:** `apps/storefront`
3. Framework: Next.js (monorepo install from repo root via `vercel.json`).

### 3b. Environment variables

Use the **pooled** Neon URL. Required:

| Variable | Notes |
|----------|--------|
| `DATABASE_URL` | Neon `storefront` pooled URL |
| `PAYLOAD_SECRET` | Same as local (new random for prod) |
| `NEXT_PUBLIC_SITE_URL` | `https://your-project.vercel.app` |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Test for preview; live for production |
| `RAZORPAY_KEY_ID` | Server |
| `RAZORPAY_KEY_SECRET` | Server |
| `RESEND_API_KEY` | Resend |
| `REVALIDATE_SECRET` | Webhook / manual revalidation |
| ImageKit vars | As in `.env.example` |

**Remove** any legacy Medusa variables (`MEDUSA_BACKEND_URL`, `NEXT_PUBLIC_MEDUSA_*`).

### 3c. Deploy

Push to `main`/`master` or click Deploy. After deploy:

1. Visit `https://<your-app>/admin` and sign in.
2. Seed catalog (products + variants with GST-inclusive `pricePaise`).
3. Test checkout with Razorpay test mode.

---

## Pricing reminder

- Store **₹6,500** as `pricePaise: 650000` (inclusive of 18% GST).
- Checkout uses that as the payable total; server actions split base/GST for receipts only.

---

## Checklist

- [ ] `pnpm --filter @galle/storefront build` passes
- [ ] Neon `storefront` DB + Drizzle schema
- [ ] Vercel env (pooled `DATABASE_URL`, `PAYLOAD_SECRET`, Razorpay, Resend)
- [ ] `/admin` user + catalog in Payload
- [ ] Test order end-to-end

See [PAYLOAD-MIGRATION.md](./PAYLOAD-MIGRATION.md) for the full Medusa → Payload migration checklist.
