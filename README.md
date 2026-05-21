# GALLE Monorepo

Premium perfume storefront (Next.js 15) + Medusa v2 commerce backend.

## Quick start (local — Medusa on your PC)

```bash
pnpm install
docker compose up -d
pnpm --filter @galle/medusa db:migrate
pnpm --filter @galle/medusa seed

# Terminal 1: Medusa API + Admin
pnpm --filter @galle/medusa dev

# Terminal 2: Storefront
pnpm --filter @galle/storefront dev
```

- Storefront: http://localhost:3000  
- Medusa Admin: http://localhost:9000/app  

**Host storefront now (Medusa stays local):** [HOST-NOW.md](./HOST-NOW.md)  
**Launch without hosting Medusa yet:** [LAUNCH-LOCAL-FIRST.md](./LAUNCH-LOCAL-FIRST.md)  
**Full production / $0 VM later:** [DEPLOY.md](./DEPLOY.md)

## Apps

| App | Description |
|-----|-------------|
| `apps/storefront` | Next.js 15 — Ethereal Essence design system |
| `apps/medusa` | Medusa v2 + fragrance module |

## Product images

Seed images live in `apps/storefront/public/` (`1.png`–`5.png`).

## Docs

- [HOST-NOW.md](./HOST-NOW.md) — Vercel + Neon + Upstash step-by-step (no DigitalOcean)
- [LAUNCH-LOCAL-FIRST.md](./LAUNCH-LOCAL-FIRST.md) — Neon, Upstash, Vercel, keys; Medusa stays local
- [DEPLOY.md](./DEPLOY.md) — production & $0 VM when ready
- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [DESIGN.md](./DESIGN.md)
