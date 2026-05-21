# GALLE — production deploy checklist

> **Host storefront now (skip DigitalOcean):** [HOST-NOW.md](./HOST-NOW.md)  
> **Start here if Medusa is not hosted yet:** [LAUNCH-LOCAL-FIRST.md](./LAUNCH-LOCAL-FIRST.md) — Neon, Upstash, Vercel while Medusa runs on `localhost:9000`.

## Medusa hosting (not free)

`ARCHITECTURE.md` §19 does **not** use a free Medusa host. The plan is:

| Piece | Host | Cost |
|-------|------|------|
| **Storefront** | Vercel Pro | Per Vercel plan |
| **Medusa API + Admin** | **$0 VM** (Oracle / GCP / Fly) — see below; DigitalOcean optional | $0–$12/mo |
| **Postgres + Redis** | Neon + Upstash (free tiers) | $0 |
| **Images** | ImageKit | Free tier / usage |
| **Email** | Resend | Free tier / usage |
| **Backups** | GCS (5 GB free) + DO snapshots | Low |

The only “free” pieces in the architecture are ancillary (e.g. small GCS backup bucket), not the commerce server itself.

### DNS (Cloudflare)

- `www.yourdomain.com` → Vercel (DNS only or CNAME)
- `api.yourdomain.com` → DO VPS IP (proxied optional)

---

## Vercel (storefront) env vars

Set in Project → Settings → Environment Variables:

```
NEXT_PUBLIC_MEDUSA_URL=https://api.yourdomain.com
MEDUSA_BACKEND_URL=https://api.yourdomain.com
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_...
NEXT_PUBLIC_IMAGEKIT_ENDPOINT=https://ik.imagekit.io/galleluxe
IMAGEKIT_PRIVATE_KEY=...
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_... or rzp_test_...
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=GALLE <orders@yourdomain.com>
REVALIDATE_SECRET=<same as Medusa>
DATABASE_URL=postgres://...galle db on VPS or Neon>
NEXT_PUBLIC_SITE_URL=https://www.yourdomain.com
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...
SENTRY_ORG=your-org
SENTRY_PROJECT=galle-storefront
AXIOM_TOKEN=xaat-...
AXIOM_DATASET=galle-storefront
```

---

## DigitalOcean VPS (Medusa) env vars

`/srv/galle/apps/medusa/.env`:

```
DATABASE_URL=postgres://...
REDIS_URL=redis://127.0.0.1:6379
STORE_CORS=https://www.yourdomain.com
ADMIN_CORS=https://api.yourdomain.com
AUTH_CORS=https://www.yourdomain.com
JWT_SECRET=<long random>
COOKIE_SECRET=<long random>
STOREFRONT_URL=https://www.yourdomain.com
REVALIDATE_SECRET=<same as storefront>
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
RAZORPAY_WEBHOOK_SECRET=...
SHIPROCKET_API_TOKEN=...
SHIPROCKET_PICKUP_POSTCODE=400001
```

Deploy: `infra/scripts/provision.sh`, Caddy (`infra/caddy/Caddyfile`), pm2 (`infra/pm2/ecosystem.config.cjs`).

---

## Sentry (Next.js)

1. Create a project at [sentry.io](https://sentry.io) → platform **Next.js**.
2. Copy the **DSN** into `NEXT_PUBLIC_SENTRY_DSN`.
3. Set `SENTRY_ORG` and `SENTRY_PROJECT` for source maps (see `next.config.ts` `withSentryConfig`).
4. Optional: run locally once:

   ```bash
   cd apps/storefront
   npx @sentry/wizard@latest -i nextjs
   ```

Existing files: `sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`, `instrumentation.ts`.

---

## Axiom

1. Create dataset `galle-storefront` at [app.axiom.co](https://app.axiom.co).
2. Create an **API token** with ingest permission → `AXIOM_TOKEN`.
3. Logs ship via `@axiomhq/pino` in `src/lib/logger.ts` when `AXIOM_TOKEN` is set (production).

---

## ImageKit

- Upload product images to `https://ik.imagekit.io/galleluxe/...`
- Set Medusa product image URLs to ImageKit paths or full URLs.
- Storefront uses `NEXT_PUBLIC_IMAGEKIT_ENDPOINT` + `IMAGEKIT_PRIVATE_KEY`.

---

## Resend

- Verify your domain in Resend, then set `RESEND_FROM_EMAIL=GALLE <orders@yourdomain.com>`.
- Until verified, use `onboarding@resend.dev` (already set in `.env.local`).

---

## Razorpay

- Test keys are configured for checkout.
- Add **webhook** in Razorpay dashboard → `https://api.yourdomain.com/webhooks/razorpay` and set `RAZORPAY_WEBHOOK_SECRET` on Medusa.

---

## Security note

If API keys were shared in chat, **rotate** them in each provider dashboard before going live.
