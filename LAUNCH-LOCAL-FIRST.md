# Launch setup — everything except hosted Medusa

Use this order while **Medusa runs on your PC** (`localhost:9000`). You can test storefront, payments, email, images, newsletter, and (optionally) a Vercel preview before paying for a VPS.

**Medusa on a server comes last** (see [DEPLOY.md](./DEPLOY.md) § zero-cost VM).

---

## What works locally vs what needs a public Medusa URL

| Feature | Local Medusa (`localhost:9000`) | Vercel storefront only |
|---------|--------------------------------|-------------------------|
| Browse shop / PDP | Yes | Needs tunnel or wait for VM |
| Cart / checkout | Yes | Needs tunnel or wait for VM |
| Medusa Admin | Yes (`:9000/app`) | N/A |
| ImageKit images | Yes | Yes |
| Resend order email | Yes | Yes |
| Razorpay test popup | Yes | Yes (keys in Vercel env) |
| Newsletter / contact / quiz | Yes (with Drizzle DB) | Yes (Neon `DATABASE_URL`) |
| ISR revalidate webhook | Yes | Needs public Medusa + public storefront |

---

## Phase 0 — Already on your machine (do this daily)

```powershell
cd galle
docker compose up -d          # local Postgres + Redis (optional if using Neon/Upstash below)
pnpm install
pnpm --filter @galle/medusa db:migrate
pnpm --filter @galle/medusa seed   # if empty catalog

# Terminal 1
pnpm --filter @galle/medusa dev

# Terminal 2
pnpm --filter @galle/storefront dev
```

- Storefront: http://localhost:3000  
- Admin: http://localhost:9000/app  

Confirm `.env.local` and `apps/medusa/.env` have your keys (ImageKit, Resend, Razorpay test, publishable key).

```powershell
pnpm --filter @galle/storefront check:env
```

---

## Phase 1 — Free managed Postgres & Redis (Medusa still runs locally)

Medusa can use **cloud DB/Redis** while the Node process stays on your laptop.

### 1a. Neon (Postgres) — free

1. Sign up: https://neon.tech  
2. Create project **galle** in region **Asia (Singapore)** or closest to India.  
3. Create **two databases** (or one DB with two schemas — two DBs is simpler):
   - `medusa` → connection string for `apps/medusa/.env` → `DATABASE_URL`
   - `galle` → connection string for `apps/storefront/.env.local` → `DATABASE_URL`

4. Update `apps/medusa/.env`:

   ```env
   DATABASE_URL=postgresql://...@ep-....neon.tech/medusa?sslmode=require
   ```

5. Re-run migrations against Neon:

   ```powershell
   pnpm --filter @galle/medusa db:migrate
   pnpm --filter @galle/medusa seed
   ```

6. Update `apps/storefront/.env.local`:

   ```env
   DATABASE_URL=postgresql://...@ep-....neon.tech/galle?sslmode=require
   ```

7. Push Drizzle tables (newsletter, quiz, concierge):

   ```powershell
   cd apps/storefront
   npx drizzle-kit push
   ```

You can stop Docker Postgres if both URLs point to Neon.

### 1b. Upstash (Redis) — free

1. Sign up: https://upstash.com  
2. Create Redis database, region **ap-south-1** (Mumbai) if available.  
3. Copy the **TLS** URL into `apps/medusa/.env`:

   ```env
   REDIS_URL=rediss://default:...@....upstash.io:6379
   ```

4. Restart `pnpm --filter @galle/medusa dev`.

---

## Phase 2 — Services you already have keys for

| Service | Test locally |
|---------|----------------|
| **ImageKit** | Upload images in dashboard → set URLs on products in Admin |
| **Resend** | Place test checkout with your email; check inbox (from `onboarding@resend.dev` until domain verified) |
| **Razorpay test** | Checkout → Pay → use Razorpay test card docs |
| **Shiprocket** | Only needed when fulfilling real orders; can wait |

---

## Phase 3 — Storefront on Vercel (optional, before Medusa host)

Useful to test Vercel build, env, ImageKit, Resend, Drizzle — **not** full shop unless Medusa is reachable.

### 3a. Deploy storefront

1. Push repo to GitHub.  
2. Vercel → New Project → import repo.  
3. **Root Directory:** `apps/storefront`  
4. Framework: Next.js (auto).  
5. Add environment variables from `apps/storefront/.env.example` / your `.env.local` **except**:
   - Keep `NEXT_PUBLIC_MEDUSA_URL` / `MEDUSA_BACKEND_URL` as localhost **only for local dev**
   - For Vercel preview without VM: use a tunnel (below) or skip shop until Phase 5

6. Deploy.

### 3b. Temporary tunnel (test Vercel + local Medusa)

If you want Vercel preview to talk to your laptop Medusa:

```powershell
# Example: Cloudflare Tunnel (install cloudflared once)
cloudflared tunnel --url http://localhost:9000
```

Copy the `https://....trycloudflare.com` URL into Vercel env:

```env
NEXT_PUBLIC_MEDUSA_URL=https://....trycloudflare.com
MEDUSA_BACKEND_URL=https://....trycloudflare.com
```

Update `apps/medusa/.env` CORS:

```env
STORE_CORS=https://your-project.vercel.app,http://localhost:3000
AUTH_CORS=https://your-project.vercel.app,http://localhost:3000
```

Restart Medusa. Tunnel URL changes each run — fine for testing only.

---

## Phase 4 — Observability (optional, anytime)

| Tool | Action |
|------|--------|
| **Sentry** | Create Next.js project → `NEXT_PUBLIC_SENTRY_DSN` in `.env.local` / Vercel |
| **Axiom** | Create dataset → `AXIOM_TOKEN` (logs in production builds) |

Skip until you want error tracking.

---

## Phase 5 — Host Medusa (later, $0 options)

When local + Neon + Upstash work:

1. Oracle / GCP / Fly free VM (see DEPLOY.md).  
2. Point VM `DATABASE_URL` / `REDIS_URL` to **same** Neon + Upstash (no data migration).  
3. Set production URLs in Vercel + Medusa CORS.  
4. Razorpay live keys + webhook URL on VM.

---

## Checklist (copy to your notes)

- [ ] Phase 0: Medusa + storefront running locally  
- [ ] Phase 1a: Neon `medusa` + `galle` DBs, migrate + drizzle push  
- [ ] Phase 1b: Upstash Redis in Medusa `.env`  
- [ ] Phase 2: Test order email (Resend), checkout (Razorpay test), images (ImageKit)  
- [ ] Phase 3: Vercel deploy (optional)  
- [ ] Phase 4: Sentry/Axiom (optional)  
- [ ] Phase 5: Medusa VM (last)  

---

## Daily dev commands

```powershell
docker compose up -d   # only if still using local PG/Redis
pnpm --filter @galle/medusa dev
pnpm --filter @galle/storefront dev
```
