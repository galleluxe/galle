#!/usr/bin/env bash
# One-time DigitalOcean Bangalore VPS provisioning for Galle Medusa backend
set -euo pipefail

echo "==> Updating system packages..."
sudo apt-get update -y && sudo apt-get upgrade -y

echo "==> Installing dependencies..."
sudo apt-get install -y curl git ufw fail2ban unattended-upgrades \
  postgresql-16 redis-server caddy nodejs npm

echo "==> Configuring UFW..."
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

echo "==> Creating app user and directories..."
sudo useradd -m -s /bin/bash galle 2>/dev/null || true
sudo mkdir -p /srv/galle /var/log/galle /var/log/caddy
sudo chown -R galle:galle /srv/galle /var/log/galle

echo "==> Installing Node 20 via nvm for galle user..."
sudo -u galle bash -c '
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
  nvm install 20
  npm install -g pm2 pnpm@9
'

echo "==> Installing pm2 startup..."
sudo env PATH=$PATH:/home/galle/.nvm/versions/node/v20.*/bin pm2 startup systemd -u galle --hp /home/galle

echo "==> Provisioning complete. Next steps:"
echo "  1. Clone repo to /srv/galle"
echo "  2. Copy apps/medusa/.env with production secrets"
echo "  3. Run infra/scripts/deploy.sh"
