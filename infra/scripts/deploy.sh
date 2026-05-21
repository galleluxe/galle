#!/usr/bin/env bash
# Production deploy script — run on DO VPS after git pull
set -euo pipefail

APP_DIR="/srv/galle"
cd "${APP_DIR}"

echo "==> Installing dependencies..."
pnpm install --frozen-lockfile

echo "==> Building Medusa..."
pnpm --filter @galle/medusa build

echo "==> Running migrations..."
pnpm --filter @galle/medusa db:migrate

echo "==> Reloading pm2 processes..."
pm2 reload "${APP_DIR}/infra/pm2/ecosystem.config.cjs" --update-env

echo "==> Deploy complete."
pm2 status
