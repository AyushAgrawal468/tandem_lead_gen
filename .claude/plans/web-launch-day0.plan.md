# Plan: Tandem Web Launch — Day 0 check + build plan

**Source**: `C:\Users\HP\Downloads\HANDOFF.md.pdf` (Nov 18, 2026)
**Method**: ECC `/plan` (restate → ground in code → phases → risks → wait for confirm). No code changed.
**Complexity**: Large (~80 build hours; see estimates)

## Repos (corrected paths)

| Doc says | Real path | Notes |
|---|---|---|
| `tandem_main` | `C:\D-Drive\Tandem repos\tandemitcom\tandem_main` (branch `migration_branch_demo`, last commit 2026-11-17) | `C:\D-Drive\Tandem repos\tandem_main` is a **stale Sep-2025 copy**: no tandem-core, no web endpoints. Don't open Claude Code there. |
| `tandem-core` | `tandem-core/` (modules: `otp_auth_service`, `push_notification`, `ambassador`, …) | OTP/auth code is in `com.tandem.otp_auth_service` |
| `nginx/sites-enabled/api-tandem` | `ngnix/sites-enabled/api-tandem` (spelled `ngnix`) | API host only. **The website server (t4g.medium) nginx config is not in any repo.** |
| Flutter app | `C:\D-Drive\Tandem repos\tandem_flutter_ui\tandem_ui` | |
| `tandem_lead_gen` | this repo | Has uncommitted work in `App.jsx` and `SwipePage.jsx`: commit it before day 1 |

## 1. Task check: doc vs code

| Task | Doc says | Code says | Verdict | Fix |
|---|---|---|---|---|
| 1.1 Staging | Add if missing | `staging.tandem.it.com` doesn't resolve. No staging | Missing | Build it on day 1 as planned. Needs DNS + cert + a second Spring port + a staging DB |
| 1.2 Key | Remove key from 3 JSX files | Key hardcoded in `CombinedRedirect.jsx:36`, `EventRedirect.jsx:29`, `ReferralRedirect.jsx:41`, **and as the `@Value` default in tandem-core `AuthController.java:50`** | Mismatch | Remove the default in tandem-core too, or the old key keeps working after it's "removed" |
| 1.2 Attribution | Only `attributeInstall` sends a secret | tandem-core `AuthController.java:252-298` calls `/api/links/attribute` with `X-API-KEY` | OK | Add a new header for the secret, and accept both for one day |
| 1.3 sendOtp limits | Add cooldown + hourly cap | `AuthService.sendOtp` (L99) has neither. Its block check (`isUserBlocked`, L164) reads `BlockedUser` (resend counter, keyed by national number), **not** the wrong-attempt table | Missing + Risk | A phone blocked in verify can still request SMS. Make sendOtp check the same `OtpWrongAttempt` block |
| 1.3 verifyOtp limits | Add 3-wrong → 30-min block, return attempts left | **Already exists** (L216-249: 3 wrong in 30 min → `statusId: "BLOCKED"`). Returns no `tries_left` | Mismatch (smaller task) | Only add `tries_left` to the wrong-code response |
| 1.3 Global SMS cap | Hourly cap + Telegram alert | Nothing. A `SEND_OTP` kill switch exists in `general_configurations` | Missing | Counter + config key. Reuse the kill switch at 100% |
| 1.3 nginx | `limit_req` on OTP | Only a global `apilimit` 20r/s on `location /` | OK | Add a separate zone for `/auth/send-otp` and `/auth/verify-otp` |
| 1.4 GET referral | Delete | `ReferralHitController.java:66` | OK | |
| 1.4 CORS | Remove `@CrossOrigin("*")` | On 6 controllers, **including `AmbassadorPageController`** (doc lists 5) | Mismatch | Remove from all 6 |
| 1.4 /eureka | 403 on the public API host | `api-tandem:83` proxies `/eureka` to 8761 on the public host | OK | |
| 1.5 Public feed | New, cursor, `total_upcoming` | Doesn't exist. `/web/feed` needs `X-User-Id` and the recommender needs a `UserState`. The gateway `SecurityConfig.java:23-28` permits only `/auth/**` and a few others | Missing | Build it as a plain Mongo query (city + date ≥ now, sort by start date then `_id`, cursor = last key), not through the recommender. Add a gateway `permitAll` rule |
| 1.5 DOWN from web | Accept DOWN | `EventController.java:224` rejects anything except LEFT/RIGHT. The recommender already handles DOWN (`TandemRecommender.java:208`) | OK (one-line change) | Allow DOWN in the check |
| 1.5 Left resurfacing | ~14 days | `Config.LEFT_VALIDITY_DAYS = 21`, `DEFER_BASE_DAYS = 21` | **Mismatch** | Shreyas: change the doc to 21 days, or change config for **app and web** (affects the app) |
| 1.5 inviteRef | New field on saveAction | Not present. Count = `countByUserIdAndSource(userId,"WEB")` (`EventService.java:545`) | Missing | Store `inviteExempt: true` on the Mongo action doc and count WEB where not exempt. Mongo, so no schema migration |
| 1.5 Match in response | Confirm, or add | `saveWebEventAction` discards `SwipeResult` (`.thenReturn(remaining-1)`, L560). The match only goes out as a push | Missing | Return the match flag + friend userId, then fetch first name and photo via tandem-core `/user/batch` |
| 1.5 Referral credit | Reuse pendingReferralCode logic | `applyReferralReward` (`UserService.java:444`) already blocks self, already-applied and the same phone. verifyOtp computes `isNewUser` (L255) but **doesn't return it**. Referral codes are created lazily, so a new web user has none | Mismatch | Return `is_new_user` from verify-otp. Have the new endpoint call `applyReferralReward` with an "account created ≤ N min ago" check (`creationDate`), and create the code at verify for WEB |
| 1.5 Sender push | "{friend} is in for {event}" | `applyReferralReward` already notifies both users of the *reward*. No event-specific push | Missing | New push via `push_notification` module, fired from saveAction when inviteRef is valid |
| 1.5 Sender lookup | `UserRepository.findByReferralCode` | Exists (`UserController.java:666`) | OK | New internal endpoint, first name + photo only |
| 1.5 Event summary | Add price, poster | `/internal/{eventId}/summary` (L348) returns title, imageUrl, location, mapsUrl, displayDate. **No city and no start time** | Mismatch | Also add `city` (for "Keep swiping in {city}") and start time (for "Event over") |
| 1.6 Router mode | Decide framework vs Playwright | Declarative `<BrowserRouter>` (`App.jsx:519`), `react-helmet`, `React.lazy`, GSAP + Lenis, build to `dist/` | Decided | **Playwright is the primary method** (Shreyas, Nov 18). Framework mode moves to "Planned after launch" |
| 1.6 nginx try_files | On the website server | Site is nginx 1.24 (not Apache), serving `/var/www/leadform/`. Config not in a repo | Missing | Copy `/etc/nginx/sites-enabled/*` from the server into the repo on day 0 |
| 2.1 Cities | Doc's 9 cities | `SUPPORTED_CITIES` (`AuthService.java:43`) = 11: adds **Chennai, Indore**. Spelled `Delhi-NCR` | Mismatch | Fix the homepage copy |
| 2.6 Open Tandem | Scheme if one exists | Android: `tandem://` + verified https for `tandem.it.com`. **iOS: no `tandem://` scheme** (Info.plist has only the fb scheme), but has `applinks:tandem.it.com` | Mismatch | Android: `intent://…#Intent;scheme=tandem;package=com.tandemit.tandemit;S.browser_fallback_url=…`. iOS: App Store link (shows "Open" when installed) |
| 2.6 Install referrer | Read by the app? | Not read (no `install_referrer` package) | OK (planned after launch) | |
| 3.5 Previews | nginx → landing controller | No such controller. Live `/e/abc` is served by the SPA (200 text/html) | Missing | As planned |
| CLAUDE.md | Says Apache, WellKnownController, Spring `GET /download` | nginx. No `WellKnownController` (`.well-known` is served by the API nginx, `api-tandem:119-130`). `/download` is React `DownloadRedirect.jsx`; only a stale CORS mapping exists in `WebConfig.java:36` | Mismatch | Fix CLAUDE.md before day 1 |

### Day 0 check: second pass (Nov 19), the remaining prompt items

| Task | Doc says | Code says | Verdict | Fix |
|---|---|---|---|---|
| 1.4 Web feed cards | No friend details or phones | `EventAdditionalDetails` has no phone, but carries `inviteeName`, `event.inviterName`, `friendSwipedRight` and the raw `additionalData` map | Risk | Personal feed: the logged-in user's own friends, acceptable. **Public feed must use a trimmed DTO** (title, poster, imageUrl, date, location, price, category) |
| 1.4 AmbassadorPageService | Allowlisted fields | `fetchPageData` returns the upstream body unchanged (`AmbassadorPageService.java:40-41`) | Missing | Copy only named fields into a new map |
| 2.2 Personal feed after OTP | "Knows what they've already swiped" | Yes, with expiry: UP by hours, RIGHT 7 d, LEFT 21 d, DOWN 60 d (`EventUtils.java:52-61`). WEB actions are saved to the same collection, so they're excluded too. Out of inventory, step 3 brings LEFT/DOWN back early (`TandemRecommender.java:877`) | OK + Risk | The browser's seen-ID set must still filter, as the doc says |
| 1.5 Paging | Cursor + `next_cursor` | **No cursor, offset or skip anywhere in event-service** | Missing | Build in the public feed (keyset on `startDate,_id`) |
| 2.2 Lenis | Remove | Only in `package.json`. No `import` in `src` | OK (trivial) | `npm uninstall lenis` |
| 2.3 OTP | `input-otp`, consent, 30 s timer | `SwipePage.jsx` (368 lines) calls send/verify-otp with `platform: "WEB"`. No `input-otp` dependency, consent line or timer | Missing | As planned |
| 2.6 /download | Writes UTM into the store links | `DownloadRedirect.jsx:3-4` uses bare store URLs with no `referrer=`, `ct=` or `pt=` | Missing | Add campaign params from the first-touch UTM |
| 2.6 Waitlist | Exists, uses `/api/leads` | Yes (`Waitlist.jsx:197`) | OK | Reuse it as a one-field form |
| 2.7 PostHog | Same project as the backend forwarder | Backend uses `POSTHOG_API_KEY` env, host `eu.i.posthog.com` (`application.yml:131-132`). The web has no PostHog and no Sentry | Missing | Web must use the same project key and the EU host |
| 1.6 Sitemap | Indexed routes only | `generate-sitemap.mjs` lists only `/`. `robots.txt` = `Allow: /` + sitemap | Missing | Add the 5 routes + `/help/*`, `/legal/*`. Write the crawler rules |
| 3.4 Universal links | Why do they go through the store? | AASA is live (`paths: ["*"]`, `MF5NQJQ727.com.tandemit.tandemit`), assetlinks is live with 3 fingerprints, and the app handles `/e/` and `/l/links` (`app_router.dart:186-197`). **Config looks right, so the cause isn't in the code.** Likely the in-app browser (Instagram/FB don't hand off universal links) or iOS remembering "open in Safari" | Can't confirm from code | Use the 1-hour device test in 3.4 |
| Copy placeholders | `{tries_left}`, `{N}`, `{sender}`, `{area}`, `{price}`, `{day}`, `{city}` | `tries_left`: missing. `total_upcoming`: missing. `{sender}`: needs the new lookup. `{area}` = `location`. `{price}` = `price`. `{day}` from `dateInfo`. Event city isn't in the summary | Missing (4) | Covered by 1.3 and 1.5 above |
| Phone/app rules | 35 swipe cap | `WEB_SWIPE_LIMIT = 7` (`EventService.java:541`) | OK (planned change) | Set to 35 |
| Inventory + poster coverage | ≥40 events per city; every event has `imageUrl` + `additionalData.poster` | **Can't check from code. Needs a prod Mongo query** | Open | Ayush runs the query |

### Website nginx + CloudFront findings (Nov 19, `deploy/nginx/leadform`)

| # | Finding | Impact | Fix (task) |
|---|---|---|---|
| N1 | **CloudFront terminates TLS** and forwards to nginx :80. `$remote_addr` = CloudFront edge IP | `limit_req` keyed on `$binary_remote_addr` would throttle *everyone* behind one edge together | Key limits on the real client IP: `real_ip_header X-Forwarded-For` + `set_real_ip_from` the CloudFront ranges, or forward `CloudFront-Viewer-Address` (1.2, 1.3) |
| N2 | `X-Forwarded-For` first entry is client-supplied (CloudFront appends to it) | Attribution and Spring per-IP limits can be spoofed by sending a fake XFF | Read the **last** XFF entry added by CloudFront, or `CloudFront-Viewer-Address` (1.2, 1.3) |
| N3 | CloudFront caches responses (`x-cache` header present) | Prerendered HTML and link previews can be served stale after a deploy. **If the cache key ignores query strings, every `/l/links?...` invite gets the same WhatsApp preview** | Check the CloudFront behaviours: forward query strings for `/l/links` and `/r`; short TTL or no-cache on HTML; invalidate `/*` on deploy (1.6, 3.5) |
| N3a | CloudFront behaviours (checked Nov 19): `/api/*` and `/.well-known/*` = CachingDisabled + AllViewerExceptHostHeader; **Default (*) = UseOriginCacheControlHeaders, no origin request policy** | Default behaviour: **query strings are neither in the cache key nor forwarded to nginx**, so `/l/links?event-id=…&referral-code=…` reaches the origin as bare `/l/links`. Fine for today's SPA (the browser still has the URL), **fatal for the 3.5 preview controller**. With no `Cache-Control` from nginx, HTML isn't cached (default TTL 0), so no stale-deploy problem, but hashed assets aren't cached at the edge either | 3.5: add behaviours `/l/links*`, `/r*`, `/e/*` → CachingDisabled (or UseOriginCacheControlHeaders-QueryStrings) + AllViewerExceptHostHeader, placed above Default. 1.6: nginx sends `Cache-Control: public, max-age=31536000, immutable` on `/assets/*` and `no-cache` on HTML |
| N4 | `try_files $uri /index.html` (no `$uri/`) | Prerendered `dist/swipe/index.html` would never be served | `try_files $uri $uri/index.html /spa.html;` (1.6) |
| N5 | `/robots.txt`, `/sitemap.xml` come from the static root via `location /` | The new `location = /r` and `^~ /l/links`, `^~ /e/` don't touch them | None. Exact/prefix match as planned (3.5) |
| N6 | `.well-known` files are static, from `/var/www/html/.well-known/` | Must survive the new SPA rules: they do (more specific `location` blocks) | Keep these blocks above/unchanged |
| N7 | Deploy is `cp -r dist/* /var/www/leadform/` | Old hashed assets are never deleted: "keep the previous build's assets" already happens, but the folder grows forever | Optional cleanup of assets older than 2 days (1.6) |
| N8 | Only port 80, no 443 on the box | `staging.tandem.it.com` needs either its own CloudFront distribution (or an alternate domain on this one with Host-based routing) or certbot + 443 open on the instance | Decide in 1.1. Simplest: certbot on the box + security group 443, staging only |

### Decisions finalised (Nov 19): the code's existing behaviour wins

| # | Question | Decision | Source in code | Doc change |
|---|---|---|---|---|
| D1 | Left-swipe resurfacing | **21 days**, same as the app. No config change | `Config.LEFT_VALIDITY_DAYS = 21`, `DEFER_BASE_DAYS = 21` | Swipe table + 1.5: "about 14 days" → "about 21 days" |
| D2 | When the phone is blocked | **3 wrong codes within 30 min → blocked for 30 min.** The 3rd wrong code triggers the block | `AuthService.verifyOtp` L216-249 (`statusId: "BLOCKED"`) | Day 4 test row: "the 4th wrong code shows Phone blocked" → "the 3rd wrong code; any further try shows Phone blocked". 1.3 = only add `tries_left` |
| D3 | What counts as a newly created account (referral credit) | **`lastLogin == null` at verify**, returned as `is_new_user` from `/auth/verify-otp` | `AuthService.java:255` (`isNewUser`) | 1.5 referral credit: "account created by this verify" = `is_new_user: true` |
| D4 | Referral rules | **Reuse `applyReferralReward` as is**: blocks self-referral, already-applied and a phone rewarded before. Referrer reward capped at 6 months | `UserService.java:444` | None |
| D5 | Cities | **`SUPPORTED_CITIES` as is**: Bengaluru, Mumbai, Delhi-NCR, Pune, Hyderabad, Chennai, Kolkata, Goa, Chandigarh, Jaipur, Indore | `AuthService.java:43-45` | Homepage "Which cities" answer: add Chennai, Indore; spell "Delhi-NCR" |
| D6 | DOWN handling | **Recommender as is**: bans the event + suppresses the category; DOWN expires after 60 days | `TandemRecommender.java:208`, `DOWN_VALIDITY_DAYS = 60` | None |
| D7 | Which swipes are hidden in the personal feed | **As is**: RIGHT 7 d, LEFT 21 d, DOWN 60 d, UP by hours. The browser's seen-ID set covers the rest | `EventUtils.java:52-61` | None |
| D8 | "Open Tandem" | **As the app is today**: Android `tandem://` via `intent://` with a fallback URL; iOS → App Store link (no scheme on iOS) | `AndroidManifest.xml:87-92`, `Info.plist` | 2.6: state the per-platform behaviour |
| D10 | Staging data | **Separate demo website server (`demo.tandem.it.com`) using the demo app backend `demo-api.tandem.it.com`.** No prod test accounts | Ayush, Nov 19 (revised) | 1.1 rewritten for a demo server |
| D9 | Prerendering | **Playwright primary**, `spa.html` fallback (Shreyas, Nov 18) | — | Already applied |

Numbers the doc sets that **change** the code (decided in the doc, not open): `WEB_SWIPE_LIMIT` 7 → 35; phone ask at the 3rd right or 8th swipe; soft prompts at 10 and 25; 5 exempt invite swipes a day.

Still open (no code to follow): traps 1-4 definition, reel date, approved screens, default city, prices, robots crawler choice, copy `[confirm]` facts, App Store `pt=` token, inventory query, website nginx config, staging backend.

**Doc contradictions to settle** (resolved by D1, D2 above)
- Phone blocked: the copy table says the **3rd** wrong code, but the day 4 test says the **4th**. The server blocks on the 3rd attempt *before* the 4th is checked. Pick one; the server today matches "3 wrong, then blocked".
- Left resurfacing: 14 days in the doc vs 21 in code.
- `{area}` and `{price}`: event docs have `location` and `price` fields. Confirm `additionalData.poster` coverage with a DB query (couldn't check offline).

**Schema / app-change flags**
- No Postgres schema change is needed if `is_new_user` is computed in memory and exempt swipes are a new field on a Mongo document.
- Flutter change needed for iOS "Open Tandem" via a scheme. It's out of scope, so use store links on iOS.

## 2. "Ayush confirms": answers from code

| Question | Answer | Proof |
|---|---|---|
| Custom URL scheme | Android yes (`tandem://`). iOS no | `AndroidManifest.xml:87-92`; `ios/Runner/Info.plist:61-64` |
| DOWN from web | Not today. One-line change | `EventController.java:224` |
| Left resurfacing ~14d | **No: 21 days** | `Config.java:111,116` |
| Notify sender | Push infra exists (`push_notification` module; `applyReferralReward` already notifies) | `UserService.java:444+` |
| Referral on web sign-up | No code at verify (lazy). Can be applied after verify. "New" = `lastLogin == null`, not returned | `AuthService.java:255`; `ContactController.java:205,525` |
| Inventory per city | **Unknown. Needs a prod Mongo query** | — |
| Install referrer | Not read | no `install_referrer` package in `pubspec.yaml` |
| App Store `pt=` | Not in code. Get from App Store Connect | — |
| Staging | None | DNS lookup fails |
| Framework mode | Declarative today. Decision: Playwright prerender is primary; framework mode is after launch | `App.jsx:2,519` |

## 3. Build plan (sequenced; nothing cut)

### Before day 1 (Ayush, ~2h)
1. Commit or stash the current `App.jsx`/`SwipePage.jsx` work.
2. Pull the website server's nginx config into the repo.
3. Run a Mongo query: upcoming events per city, and how many have `imageUrl` / `additionalData.poster`.
4. ~~Choose the prerender method~~ Done: Playwright is primary.
5. Fix CLAUDE.md (below). Post this table as comments on the doc.

### Day 1: backend (session A: tandem_main) + rendering (session B: lead_gen)
| # | Task | Est. h |
|---|---|---|
| 1.1 | Staging nginx block, port, DB profile, DNS/cert | 3 |
| 1.2 | Keyless clicks + per-IP limit; `/attribute` secret (dual-accept); drop the JSX keys **and** the tandem-core default | 3 |
| 1.3 | sendOtp cooldown/hourly/global cap + Telegram alert; sendOtp honours the verify block; `tries_left`; nginx OTP zone; landing limits | 4 |
| 1.4 | Delete GET referral; Ambassador allowlist; `/eureka` 403; CORS on 6 controllers | 2 |
| 1.5 | Public feed + gateway permit + cache (4); DOWN (0.5); inviteRef + exempt count (3); referral credit + `is_new_user` + code at verify (2); sender push (1.5); accepted check (0.5); match payload (1.5); sender lookup (0.5); summary fields (0.5); test reset (1) | 15 |
| 1.6 | **Playwright prerender (primary):** after `npm run build`, copy `dist/index.html` → `dist/spa.html` first, then a Playwright script loads `/`, `/swipe`, `/bengaluru`, `/mumbai`, `/faq` and writes `dist/<route>/index.html`. nginx: `root /var/www/leadform; try_files $uri $uri/index.html /spa.html;`. Keep the previous build's hashed assets for a day; regenerate sitemap and robots . **Snapshot rules (Shreyas's traps 1-4, Nov 20):** (1) homepage snapshot never overwrites `spa.html`; (2) intro animations off while snapshotting, so no text is saved invisible; (3) no live event cards in saved pages; (4) full title and description tags on every page before saving | 4 |

### Day 2: Journey 1 (`/swipe`)
| # | Task | Est. h |
|---|---|---|
| — | `funnelConfig.js` (all numbers + creator map) + deck state machine (`useReducer`) | 3 |
| 2.1 | City order + chips, GPS only on "Near me" | 2 |
| 2.2 | Public feed paging, seen-ID set, `EventCard`, GSAP Draggable for 3 directions + keys, remove Lenis | 7 |
| 2.3 | Phone step, `input-otp`, consent, timer, error screens | 4 |
| 2.4 | localStorage queue + ordered replay, limit 35 | 2 |
| 2.5 | Share sheet / wa.me + link builder | 1.5 |
| 2.6 | All prompts + order rule, Open-Tandem helper, `/download` campaign params, in-app browser hint, QR, waitlist | 5 |
| 2.7 | PostHog, Sentry, Meta Pixel, first-touch | 3 |

### Day 3: Journeys 3 + 2
| # | Task | Est. h |
|---|---|---|
| 3.1 | Homepage rebuild + `/faq` + JSON-LD + 404 | 5 |
| 3.2 | City pages | 2 |
| 3.3 | noindex | 0.5 |
| 3.4 | One shared-link page, all 9 states, AASA check (≤1h) | 8 |
| 3.5 | Preview controller (fills tags into `spa.html`, never a prerendered `index.html`) + nginx `location = /r`, `^~ /l/links`, `^~ /e/` | 4 |
| 3.6 | CPU/mem alerts, SMS alerts, Sentry alerts | 2 |

### Day 4 test additions
| Link or state | Check |
|---|---|
| Prerendered routes | curl every prerendered route: real copy present, nothing at opacity 0, head tags complete, `/e/x` serves the shell and not the homepage |

### Planned after launch (additions)
| Item | Why it waits |
|---|---|
| React Router framework mode (`ssr: false` + `prerender`) | Playwright prerender is primary for launch. Framework mode needs a routing/entry/helmet rewrite across ~15 routes |

**Total build ≈ 81 h**, about 8 days for one engineer at 10 h/day. Two parallel sessions save session time, not review and test time. **The 3-day build is not realistic; the reel date needs the buffer, or a second engineer.**

### Top 3 overrun risks
1. **1.5 backend (15h on day 1)**: about ten changes across event-service, tandem-core and the gateway, each needing an internal-auth hop. Mitigation: do the public feed and inviteRef first (they unblock the frontend), and leave the push and test reset for last.
2. **Deck state machine, 2.2–2.6**: about 25 screens with ordering rules, replay, a cap shared between browser and server, and three swipe directions in in-app browsers. Mitigation: write the reducer and test its transitions before any UI.
3. **3.4 shared-link page**: 9 states, OTP inside the invite flow, fraud rules, and real-device testing inside WhatsApp, Instagram and FB webviews. Mitigation: reuse the deck's phone step and `EventCard` without changes.

## 4. CLAUDE.md corrections (diff)

```diff
- **Event share deep link flow:** ... Apache serves React for this path.
+ **Event share deep link flow:** ... nginx serves React (SPA fallback) for this path.
- `.well-known/assetlinks.json` ... the server proxies `/.well-known/*` to Spring Boot ... Do NOT serve these as static files via `.htaccess` — Apache's SPA rewrite ...
- Both files are hardcoded in `WellKnownController.java` with `Content-Type: application/json`.
+ `.well-known/*` is served by nginx (see tandem_main `ngnix/sites-enabled/api-tandem`), not by landing_page. There is no WellKnownController.
- | `GET` | `/download` | None | Public marketing redirect ... |
+ (remove: `/download` is the React route `DownloadRedirect.jsx`; `WebConfig`'s `/download` CORS mapping is dead)
- ... `/e/{eventId}` — Apache routes that path to React, not Spring Boot.
+ ... nginx routes that path to React, not Spring Boot.
+ Related repos: backend = `../tandemitcom/tandem_main` (NOT `../tandem_main`, which is stale). Website server nginx config: <path once committed>.
+ Production web server: nginx 1.24, static files in `/var/www/leadform/`.
```

**WAITING FOR CONFIRMATION**: proceed / modify / settle the open questions first.
