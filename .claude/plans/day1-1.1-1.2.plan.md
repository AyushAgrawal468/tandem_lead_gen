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

## 1.1 Staging → demo server (revised Nov 19)

**Decision (D10, revised):** a separate demo website server at `demo.tandem.it.com`, talking to the existing **demo app backend** `demo-api.tandem.it.com`. Production servers, data and users are never touched; no flagged test accounts on prod are needed.

Facts: `demo-api.tandem.it.com` is live (`/healthz` → 200, behind CloudFront). The API nginx sends `Access-Control-Allow-Origin *`, so the demo site can call it. The frontend's app-backend URL is a build variable (`VITE_TANDEM_API_BASE`, default `https://api.tandem.it.com`).

### Checks before building (demo-api)
1. Which EC2 runs demo-api, and which branch is deployed there. It needs the current tandem_main code (web endpoints), and later each day's backend changes.
2. Enough upcoming events in its Mongo for Bengaluru and Mumbai (≥ 40 each) to fill a deck.
3. OTP on demo: is `SEND_OTP` off in its `general_configurations` (no MSG91 cost), or do test numbers get real SMS?
4. demo-api's tandem-core must call the **demo** landing backend for attribution: set `landing-page.url` (env `LANDING_PAGE_URL`) to `https://demo.tandem.it.com` and give it its own `LANDING_ATTRIBUTION_SECRET`.

### Tasks
| # | Step | Detail |
|---|---|---|
| 1 | Launch EC2 | t4g.small (ARM, Ubuntu 24.04), Mumbai, own security group: 80 + 443 open, 22 from your IP only. Elastic IP |
| 2 | Install stack | Java 21, Maven, Node 20, nginx, PostgreSQL 16 (reuse `t4g-migration.md` steps 1-2) |
| 3 | Database | `CREATE DATABASE leads_db;` on the demo box, seed `app_config` (demo values: own attribution secret, OpenCage key, Telegram) |
| 4 | Code | Clone `tandem_lead_gen` to `/home/ubuntu/tandem_lead_gen`, check out the day's branch, build the jar |
| 5 | Service | `tandem.service` on 8080, same as prod (it's its own box, so no port juggling) |
| 6 | Frontend | `VITE_TANDEM_API_BASE=https://demo-api.tandem.it.com npm run build` → `/var/www/leadform` |
| 7 | nginx | Copy `deploy/nginx/leadform` with `server_name demo.tandem.it.com` + `X-Robots-Tag: noindex` |
| 8 | DNS + HTTPS | **Recommended:** a CloudFront distribution in front (same 3 behaviours as prod), so the CloudFront-specific parts of 1.2, 1.6 and 3.5 are tested before prod. Route 53 `demo` → that distribution |
| 9 | Deploy script | `deploy/deploy-demo.sh`: pull branch, build jar, restart, build frontend with the demo API base, copy to `/var/www/leadform` |

### Done when
- `https://demo.tandem.it.com/` serves the site with `X-Robots-Tag: noindex`
- `/swipe` on demo logs in with OTP against demo-api, and swipes land in demo-api's database, not prod
- A test click lands in the demo box's `leads_db`
- Production unchanged

### Progress (Nov 19): cloned from prod instead of a fresh install
- AMI `leadgen-prod-copy-2026-11-19` of LEADGEN-t4g (no reboot) → **DEMO-LEADGEN-t4g** `i-0d2af07b2822faca8`, t4g.micro, SG `demo-leadgen-sg` (22 my IP, 80 any)
- Elastic IP `43.204.129.65` moved from the stopped Eureka box; Route 53 `eureka` record deleted. `http://43.204.129.65/` → 200
- **Prod website box is a t4g.micro (1 GB), not t4g.medium**: launch-load risk, decide on resize before the reels
- **Wildcard `*.tandem.it.com` → 3.108.69.213 (prod)**: `demo.tandem.it.com` hits prod until its own record exists
- Next on the copy: Telegram + health check off, wipe copied user/click data, demo `app_config` secrets, branch, `server_name demo.tandem.it.com`, frontend built with `VITE_TANDEM_API_BASE=https://demo-api.tandem.it.com`, CloudFront + `demo` record

### Undo from earlier today
- Route 53 `staging` record: delete (unused)
- `main-app-sg` port 443: close again (prod origin only needs 80 from CloudFront)

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
