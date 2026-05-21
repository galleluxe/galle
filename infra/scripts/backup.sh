#!/usr/bin/env bash
# Nightly Postgres backup → GCS (run via cron: 0 2 * * *)
set -euo pipefail

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/tmp/galle-backups"
BACKUP_FILE="${BACKUP_DIR}/galle_${TIMESTAMP}.sql.gz"
GCS_BUCKET="${GCS_BACKUP_BUCKET:-gs://galle-backups}"
RETENTION_DAYS=30

mkdir -p "${BACKUP_DIR}"

echo "==> Dumping Postgres..."
pg_dump "${DATABASE_URL:-postgresql://medusa:medusa@localhost:5432/medusa}" | gzip > "${BACKUP_FILE}"

echo "==> Uploading to GCS..."
if command -v gsutil &>/dev/null; then
  gsutil cp "${BACKUP_FILE}" "${GCS_BUCKET}/daily/"
  echo "==> Pruning backups older than ${RETENTION_DAYS} days..."
  gsutil ls "${GCS_BUCKET}/daily/" | while read -r obj; do
    age_days=$(( ( $(date +%s) - $(gsutil stat "$obj" | grep "Creation time" | awk '{print $3}') ) / 86400 ))
    if [ "${age_days}" -gt "${RETENTION_DAYS}" ]; then
      gsutil rm "$obj"
    fi
  done 2>/dev/null || true
else
  echo "WARN: gsutil not found. Backup saved locally at ${BACKUP_FILE}"
fi

rm -f "${BACKUP_FILE}"
echo "==> Backup complete."
