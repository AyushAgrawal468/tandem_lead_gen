#!/bin/bash
# DEMO box deploy (demo.tandem.it.com): landing backend + website from demo_branch.
# Run by ~/deploymentscript.sh on the box AFTER it pulls, so this file is never edited mid-run.
# The website build here skips the Playwright prerender (too heavy for 1 GB; demo is noindex).
# Prerendered builds come from a laptop: deploy/deploy-frontend.sh demo
set -e
trap 'sudo service tandem start' EXIT   # the landing backend comes back up even if a build fails
cd /home/ubuntu/tandem_lead_gen

sudo service tandem stop                # frees memory for both builds on 1 GB
cd landing_page
sudo mvn clean install -DskipTests

cd ../lead-form-frontend
sudo npm ci --no-audit --no-fund
sudo VITE_TANDEM_API_BASE=https://demo-api.tandem.it.com SITE_URL=https://demo.tandem.it.com npm run build
sudo cp dist/index.html dist/spa.html  # nginx fallback name (1.6)
sudo cp -r dist/* /var/www/leadform/
echo "Demo deployed"
