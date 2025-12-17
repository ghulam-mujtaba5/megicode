#!/usr/bin/env bash
set -euo pipefail

TOKEN="${1:-}"
if [ -z "$TOKEN" ]; then
  read -rp "Enter Turso auth token (paste): " TOKEN
fi

ENV_FILE=".env.local"
if [ ! -f "$ENV_FILE" ]; then
  echo ".env.local not found"
  exit 1
fi

BACKUP="${ENV_FILE}.bak.$(date +%Y%m%d%H%M%S)"
cp "$ENV_FILE" "$BACKUP"

if grep -qE '^\s*TURSO_AUTH_TOKEN\s*=' "$ENV_FILE"; then
  sed -E "s|^\s*TURSO_AUTH_TOKEN\s*=.*$|TURSO_AUTH_TOKEN=\"$TOKEN\"|" "$ENV_FILE" > "$ENV_FILE.tmp"
  mv "$ENV_FILE.tmp" "$ENV_FILE"
else
  printf "\nTURSO_AUTH_TOKEN=\"%s\"\n" "$TOKEN" >> "$ENV_FILE"
fi

echo "Updated $ENV_FILE (backup: $BACKUP)"
