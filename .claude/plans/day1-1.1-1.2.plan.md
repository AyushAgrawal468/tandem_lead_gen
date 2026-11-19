# Plan: Day 1 — 1.1 Staging + 1.2 Lock down the API key

**Source**: HANDOFF.md 1.1, 1.2; Day 0 plan (`web-launch-day0.plan.md`, decisions D10, N1–N8)
**Complexity**: Medium (≈ 3 h + 3 h)
**Status**: WAITING FOR CONFIRMATION

## Facts this plan is built on

| Fact | Source |
|---|---|
| Website box: t4g.medium, Elastic IP `3.108.69.213`, SG `main-app-sg`, bare nginx + systemd + **local PostgreSQL 16** (`localhost:5432/leads_db`) | `t4g-migration.md` |
| Prod landing runs as `tandem.service`: `java -jar …/landing_page-0.0.1-SNAPSHOT.jar --server.port=8080` | `t4g-migration.md:120-127` |
| Prod site: CloudFront → nginx :80 → `/var/www/leadform`, `/api/` → `localhost:8080` | `deploy/nginx/leadform` |
| `application-dev.properties` points at `localhost:5432/leads_db`, **the production DB on this box** | CLAUDE.md, `t4g-migration.md:19` |
| API key + all secrets live in the `app_config` table, loaded once at startup by `ConfigService` | `ConfigService.java` |
| Click endpoints (`POST /api/referral/{code}`, `/api/event-link/{eventId}`, `/api/links/click`) and all 3 `/attribute` endpoints check `X-API-KEY == app.security.api-key` | the 3 landing controllers |
| tandem-core `/auth/attribute` calls `https://tandem.it.com/api/links/attribute` (through CloudFront `/api/*`) with `X-API-KEY`, whose **value is the hardcoded default** in `@Value` | tandem-core `AuthController.java:50, 279, 298` |
| Staging talks to the prod app backend with flagged test accounts | D10 |

## 1.1 Staging

**Doc deviation (must not follow literally):** the doc says "the dev database profile". On this box the dev profile *is* the production DB. Staging gets its own database and profile.

### Tasks
1. **DNS (Route 53)**: hosted zone `tandem.it.com` → create record `staging`, type A, value `3.108.69.213`, TTL 300. Not an alias to CloudFront.
2. **Security group `main-app-sg`**: port 80 is **already open to the internet** (checked Nov 19: `curl http://3.108.69.213/` → 200), so certbot's HTTP challenge works. Port 443 is closed: add inbound `HTTPS 443 0.0.0.0/0` (+ `::/0`).
3. **Database**: `CREATE DATABASE leads_db_staging;` then copy only `app_config` rows from prod (`pg_dump -t app_config leads_db | psql leads_db_staging`). Tables auto-create (`ddl-auto=update`). No prod schema touched.
4. **Profile**: new `landing_page/src/main/resources/application-staging.properties`, with only the datasource URL → `leads_db_staging`.
5. **Service**: `/etc/systemd/system/tandem-staging.service`, running a separate checkout `/home/ubuntu/tandem_lead_gen_staging` on the day's branch: `java -Xmx256m -jar … --server.port=8081 --spring.profiles.active=staging`. `-Xmx256m` keeps the 4 GB box safe next to prod + Postgres.
6. **nginx**: new `deploy/nginx/staging`:
   - `listen 443 ssl` (certbot-managed), `server_name staging.tandem.it.com`
   - `root /var/www/leadform-staging`, same `try_files` as prod (switches to `/spa.html` in 1.6)
   - `/api/` → `localhost:8081`
   - `add_header X-Robots-Tag "noindex, nofollow" always;`
   - No basic auth: it breaks testing inside Instagram/WhatsApp in-app browsers. noindex + an unpublished hostname is enough.
7. **certbot**: `sudo certbot --nginx -d staging.tandem.it.com`.
8. **Deploy script**: `deploy/deploy-staging.sh`: `git -C …_staging pull`, build the jar, restart `tandem-staging`, `npm run build`, `rsync dist/ /var/www/leadform-staging/`.
9. **Test accounts** (D10): list the flagged test phone numbers + their notification-off state in the plan, and use only those on staging.

### Done when
- `curl -I https://staging.tandem.it.com/` → 200, `X-Robots-Tag: noindex`
- `curl https://staging.tandem.it.com/api/...` hits port 8081 (check the `tandem-staging` log), and a test click lands in `leads_db_staging`, not `leads_db`
- Prod untouched: `systemctl status tandem` unchanged, `curl -I https://tandem.it.com/` still 200

### Known gap
Staging bypasses CloudFront, so query-string forwarding (N3a) and real-IP headers aren't tested there. One check on prod with a test link before launch (already in the Day 0 plan).

## 1.2 Lock down the API key and attribution

### Design
- **Click endpoints**: drop the key check. Rate-limit them **in nginx**, not Java (no Bucket4j in landing today; nginx covers it with zero code).
  - Key the limit on the real visitor IP. Behind CloudFront `$remote_addr` is the edge (N1), so derive it from `CloudFront-Viewer-Address` (`ip:port`, set by CloudFront, can't be spoofed through CloudFront):
  - **Port 80 is open to the internet**, so anyone can skip CloudFront, hit the origin directly and send a fake `CloudFront-Viewer-Address` to dodge the limit. Fix without touching the security group (port 80 must stay open for staging's certbot renewals): CloudFront adds a secret origin header, and nginx trusts the viewer-address header only when that secret is present.
    - CloudFront → distribution → **Origins** → `leadgen.tandem.it.com…` → Edit → **Add custom header** `X-Origin-Verify: <64 random chars>`.
    - The secret lives only on the server in `/etc/nginx/conf.d/client-ip.conf`, **not in the repo** (the repo copy holds a placeholder).
    ```nginx
    # /etc/nginx/conf.d/client-ip.conf (http level)
    map $http_x_origin_verify $from_cloudfront {
        "REPLACE_WITH_SECRET" 1;
        default               0;
    }
    # trust CloudFront-Viewer-Address (ip:port) only on requests that came through CloudFront
    map "$from_cloudfront|$http_cloudfront_viewer_address" $client_ip {
        "~^1\|(?<ip>.+):\d+$" $ip;
        default               $remote_addr;
    }
    limit_req_zone $client_ip zone=clicks:10m rate=10r/m;
    ```
    ```nginx
    # in the leadform server block, above location /api/
    # attribute first: regex locations match in order, and [^/]+ would also match "attribute"
    location ~ ^/api/(referral|event-link|links)/attribute$ {
        proxy_pass http://localhost:8080;   # + the same proxy_set_header lines, no click limit
    }
    location ~ ^/api/(referral/[^/]+|event-link/[^/]+|links/click)$ {
        limit_req zone=clicks burst=20 nodelay;
        limit_req_status 429;
        proxy_pass http://localhost:8080;   # + the same proxy_set_header lines
    }
    ```
  - **Verify first**: confirm CloudFront actually forwards `CloudFront-Viewer-Address` on `/api/*` (log `$http_cloudfront_viewer_address` for one request). If it's absent, fall back to the second-to-last `X-Forwarded-For` entry.
- **Attribution endpoints**: new secret, new header.
  - New `app_config` row `app.security.attribution-secret` (64 random chars), checked against header `X-Attribution-Secret` with a constant-time compare.
  - During switchover, also accept `X-API-KEY == app.security.api-key`.
  - Add `ConfigService.matches(key, value)`: returns false (not throw) when the key row is missing, compares with `MessageDigest.isEqual`. **Removing the old key on day 2 is then just `DELETE FROM app_config WHERE config_key='app.security.api-key'` + restart. No second deploy.**
  - One check used by all 3 `/attribute` endpoints: `matches("app.security.attribution-secret", secret) || matches("app.security.api-key", apiKey)`.
- **tandem-core**: `AuthController` sends `X-Attribution-Secret` from `landing-page.attribution-secret` (env `LANDING_ATTRIBUTION_SECRET`), **with no default value**. Delete the hardcoded `landing-page.api-key` default and stop sending `X-API-KEY`.
- **Frontend**: remove the `X-API-KEY` header from `ReferralRedirect.jsx:41`, `EventRedirect.jsx:29`, `CombinedRedirect.jsx:36`.

### Files to change
| File | Action |
|---|---|
| `landing_page/.../service/ConfigService.java` | UPDATE: add `matches()` |
| `landing_page/.../Controller/ReferralHitController.java` | UPDATE: no key on `POST /{code}`; secret-or-old-key on `/attribute` |
| `landing_page/.../Controller/EventLinkController.java` | UPDATE: same |
| `landing_page/.../Controller/CombinedLinkController.java` | UPDATE: same |
| `lead-form-frontend/src/components/{Referral,Event,Combined}Redirect.jsx` | UPDATE: drop the header |
| `deploy/nginx/leadform` (+ server) | UPDATE: client-ip map, `clicks` zone, click location |
| `tandemitcom/tandem_main/tandem-core/.../AuthController.java` | UPDATE: new header + secret, no default |
| tandem-core config / server env | ADD `LANDING_ATTRIBUTION_SECRET` |
| `app_config` (prod + staging DB) | INSERT `app.security.attribution-secret` (data, not schema) |

### Rollout order (prod)
1. Insert the secret row into prod `app_config`; deploy landing (accepts both); deploy nginx limits (`nginx -t` first).
2. Deploy the frontend without the key (the click endpoints are already keyless).
3. Set `LANDING_ATTRIBUTION_SECRET` and deploy tandem-core. Confirm a test install still attributes (`[attributeInstall]` log shows `matched=true`).
4. Day 2: delete the `app.security.api-key` row and restart `tandem`. The old key is now dead everywhere.

The day 1 security fixes may go to prod as soon as they're reviewed (working rule 5), after a second session reviews them (working rule 3).

### Validation
```bash
# no key left in the bundle
npm run build && grep -r "tandem_live_" dist/ ; echo "exit=$? (1 = clean)"
# clicks: keyless 200, then 429 under burst
curl -s -o /dev/null -w "%{http_code}\n" -X POST https://staging.tandem.it.com/api/referral/TEST
for i in $(seq 40); do curl -s -o /dev/null -w "%{http_code} " -X POST https://staging.tandem.it.com/api/referral/TEST; done
# attribute: 401 without the secret, 200 with it
curl -s -o /dev/null -w "%{http_code}\n" -X POST https://staging.tandem.it.com/api/links/attribute -H 'Content-Type: application/json' -d '{}'
curl -s -o /dev/null -w "%{http_code}\n" -X POST https://staging.tandem.it.com/api/links/attribute -H "X-Attribution-Secret: $SECRET" -H 'Content-Type: application/json' -d '{}'
```
Plus one landing unit test for `ConfigService.matches` (missing key → false, wrong → false, right → true).

### Risks
| Risk | Likelihood | Mitigation |
|---|---|---|
| The click regex would also match `/api/referral/attribute` and throttle tandem-core's attribution calls | Handled | The `attribute` location comes first in the design above; the validation curl checks it |
| `CloudFront-Viewer-Address` not forwarded | Medium | Check one request first; fall back to the second-to-last XFF entry |
| Origin reachable directly on :80 (confirmed), so `CloudFront-Viewer-Address` could be spoofed | Confirmed | Secret `X-Origin-Verify` origin header + the nginx map above. Direct hits fall back to `$remote_addr`, i.e. the attacker's own IP |
| tandem-core deployed before landing accepts the new header | Low | Follow the rollout order |
| Shared carrier IPs hit the click limit at the reel spike | Low | 10 r/min + burst 20 per IP is generous for a once-per-visit click; tune after a load test |

### Not in this task (on purpose)
- OTP limits and the landing `/api/leads`, `/api/location` limits → 1.3 (same `$client_ip` map gets reused).
- Spring's "first XFF entry" IP extraction for attribution stays as is. Changing it would alter attribution scoring on both sides; the rate limit doesn't depend on it.
