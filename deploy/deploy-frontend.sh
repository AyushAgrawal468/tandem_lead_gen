#!/usr/bin/env bash
# Frontend deploy (handoff 1.6, snapshot rule 6): build + prerender on THIS laptop, then copy
# dist/ to the server. The servers are 1 GB t4g.micro boxes: never build or snapshot there.
#
#   SSH_KEY=~/keys/tandem.pem deploy/deploy-frontend.sh demo
#   SSH_KEY=~/keys/tandem.pem deploy/deploy-frontend.sh prod
#
# Files are extracted over /var/www/leadform without deleting, so the previous build's hashed
# assets stay for tabs opened before the deploy.
set -euo pipefail

case "${1:-}" in
  demo) HOST=ubuntu@43.204.129.65; API=https://demo-api.tandem.it.com; SITE=https://demo.tandem.it.com ;;
  prod) HOST=ubuntu@3.108.69.213;  API=https://api.tandem.it.com;      SITE=https://tandem.it.com ;;
  *) echo "usage: $0 demo|prod" >&2; exit 1 ;;
esac
KEY="${SSH_KEY:?set SSH_KEY to the .pem file}"

cd "$(dirname "$0")/../lead-form-frontend"
VITE_TANDEM_API_BASE="$API" SITE_URL="$SITE" npm run build:site

tar -czf - -C dist . | ssh -i "$KEY" "$HOST" 'sudo tar -xzf - -C /var/www/leadform'
echo "Deployed to $1 ($SITE)"
