# Host Galle now (everything except Medusa)

Medusa stays on your PC (`localhost:9000`). This guide deploys **storefront + Neon + Upstash** first. Skip DigitalOcean until Phase 5 in [LAUNCH-LOCAL-FIRST.md](./LAUNCH-LOCAL-FIRST.md).

**Time:** ~45 minutes if you do steps in order.

---

## Before you start

1. Production build must pass locally:

   ```powershell
   cd galle
   pnpm --filter @galle/storefront build
   ```

2. You need accounts (all have free tiers):
   - [Vercel](https://vercel.com) — storefront
   - [Neon](https://neon.tech) — Postgres for Medusa + Drizzle
   - [Upstash](https://upstash.com) — Redis for Medusa (optional while Medusa is local)
   - [GitHub](https://github.com) — connect Vercel to repo

3. **Rotate secrets** you pasted in chat before going live (Razorpay, Resend, ImageKit, Shiprocket).

---

## Step 1 — Push code to GitHub

From `galle` (monorepo root):

```powershell
git init
git add .
git commit -m "Initial Galle monorepo"
gh repo create galle --private --source=. --push
```

Use your own repo name if `galle` is taken.

---

## Step 2 — Neon (two databases)

1. Neon → New project → region **Singapore** (or closest to India).
2. Create databases **`medusa`** and **`galle`** (SQL editor: `CREATE DATABASE medusa;` / `CREATE DATABASE galle;`).
3. Copy connection strings.

**Local Medusa** (`apps/medusa/.env`):

```env
DATABASE_URL=postgresql://...@ep-....neon.tech/medusa?sslmode=require
```

Then:

```powershell
pnpm --filter @galle/medusa db:migrate
pnpm --filter @galle/medusa seed
```

**Local storefront** (`apps/storefront/.env.local`):

```env
DATABASE_URL=postgresql://...@ep-....neon.tech/galle?sslmode=require
```

Then:

```powershell
cd apps/storefront
npx drizzle-kit push
```

You can stop Docker Postgres once both apps use Neon.

---

## Step 3 — Upstash Redis (Medusa local, cloud Redis)

1. Upstash → Redis → region **ap-south-1** if available.
2. Copy **TLS** URL into `apps/medusa/.env`:

   ```env
   REDIS_URL=rediss://default:...@....upstash.io:6379
   ```

3. Restart Medusa: `pnpm --filter @galle/medusa dev`.

---

## Step 4 — Deploy storefront on Vercel

### 4a. Import project

1. [vercel.com/new](https://vercel.com/new) → Import your GitHub repo.
2. **Root Directory:** `apps/storefront` (important).
3. Framework: Next.js. Build settings are in `apps/storefront/vercel.json` (install/build from monorepo root).

### 4b. Environment variables (Vercel → Settings → Environment Variables)

Copy from `apps/storefront/.env.local`. Use **Production** and **Preview** for all unless noted.

| Variable | Notes |
|----------|--------|
| `MEDUSA_BACKEND_URL` | See Step 5 — not `localhost` on Vercel |
| `NEXT_PUBLIC_MEDUSA_URL` | Same as above |
| `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` | From `npx medusa exec ./src/scripts/create-key.ts` |
| `NEXT_PUBLIC_SITE_URL` | `https://your-project.vercel.app` until custom domain |
| `DATABASE_URL` | Neon **`galle`** connection string |
| `REVALIDATE_SECRET` | Same value as in Medusa `.env` |
| `RESEND_API_KEY` | Resend dashboard |
| `RESEND_FROM_EMAIL` | `GALLE <onboarding@resend.dev>` until domain verified |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Test key for preview; live later |
| `NEXT_PUBLIC_IMAGEKIT_ENDPOINT` | `https://ik.imagekit.io/galleluxe` |
| `IMAGEKIT_PRIVATE_KEY` | ImageKit |
| `NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY` | ImageKit |
| `NEXT_PUBLIC_SENTRY_DSN` | Optional |
| `AXIOM_TOKEN` | Optional |

Do **not** commit `.env.local` to Git.

### 4c. Deploy

Click Deploy. Fix any build errors from the Vercel log (same as local `pnpm --filter @galle/storefront build`).

---

## Step 5 — Shop on Vercel (pick one)

Vercel cannot reach `localhost:9000`. Choose:

### Option A — Marketing site only (fastest)

Leave Medusa URLs unset or use a placeholder. Home, legal, newsletter, and contact work via Neon. **Shop/cart will be empty** until Medusa is public.

### Option B — Cloudflare tunnel (test full shop)

On your PC while Medusa runs:

```powershell
cloudflared tunnel --url http://localhost:9000
```

Use the `https://....trycloudflare.com` URL in Vercel:

```env
NEXT_PUBLIC_MEDUSA_URL=https://....trycloudflare.com
MEDUSA_BACKEND_URL=https://....trycloudflare.com
```

In `apps/medusa/.env`:

```env
STORE_CORS=https://your-project.vercel.app,http://localhost:3000
AUTH_CORS=https://your-project.vercel.app,http://localhost:3000
```

Restart Medusa. Tunnel URL changes each run — testing only.

### Option C — Wait for free VM (Phase 5)

Deploy Medusa on Oracle/GCP/Fly later; set stable API URL in Vercel. See [DEPLOY.md](./DEPLOY.md).

---

## Step 6 — Verify after deploy

| Check | How |
|-------|-----|
| Build | Vercel deployment green |
| Images | Product images load (ImageKit + Medusa if tunneled) |
| Newsletter | Footer signup → row in Neon `galle` DB |
| Email | Test checkout with your email (Resend) |
| Razorpay | Checkout → Pay (test mode) |
| Admin | Still `http://localhost:9000/app` on your PC |

```powershell
pnpm --filter @galle/storefront check:env
```

(Run locally; compare vars to Vercel dashboard.)

---

## Step 7 — Custom domain (optional)

1. Vercel → Project → Domains → add `www.galle.com` (or your domain).
2. Update DNS at registrar per Vercel instructions.
3. Set `NEXT_PUBLIC_SITE_URL=https://www.galle.com`.
4. Add domain to Medusa `STORE_CORS` / `AUTH_CORS` when Medusa is hosted.

---

## What stays local until later

| Item | Where |
|------|--------|
| Medusa API + Admin | Your PC (`:9000`) |
| Product catalog edits | Medusa Admin |
| Razorpay webhook (full flow) | Needs public Medusa URL (VM later) |

---

## Quick checklist

- [ ] `pnpm --filter @galle/storefront build` passes
- [ ] Repo on GitHub
- [ ] Neon `medusa` + `galle`, migrate + drizzle push
- [ ] Upstash in Medusa `.env` (optional)
- [ ] Vercel project root = `apps/storefront`, env vars set
- [ ] Deploy green; site URL updated
- [ ] Tunnel or accept shop offline until VM

**Next:** [LAUNCH-LOCAL-FIRST.md](./LAUNCH-LOCAL-FIRST.md) Phase 5 — Medusa on a $0 VM (not DigitalOcean).
