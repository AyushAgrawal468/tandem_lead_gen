# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is the **Tandem lead generation** monorepo with two sub-projects:

| Directory | Stack | Purpose |
|---|---|---|
| `lead-form-frontend/` | React 19 + Vite + Tailwind CSS | Landing page & waitlist form |
| `landing_page/` | Spring Boot 3.5.3 (Java 21) + PostgreSQL | REST API backend |

Production URL: `https://tandem.it.com`

**Production web server:** CloudFront (TLS) → nginx 1.24 on port 80 (not Apache). Live config: `/etc/nginx/sites-enabled/leadform`, copied in `deploy/nginx/leadform`. The frontend build is served as static files from `/var/www/leadform/` (`try_files $uri /index.html`). `/api/` is proxied to the landing backend (`tandem` service, port 8080) on the same host. Because of CloudFront, nginx's `$remote_addr` is a CloudFront edge IP, not the visitor's IP.

**Related repos:**
- App backend: `../tandemitcom/tandem_main` (`tandem-core`, `event-service`, `api-gateway`; nginx config for the API host in `ngnix/sites-enabled/`). **Do not use `../tandem_main`**: it's a stale September 2025 copy with no `tandem-core` and no web endpoints.
- Flutter app: `../tandem_flutter_ui/tandem_ui`.

---

## Frontend (`lead-form-frontend/`)

### Commands
```bash
cd lead-form-frontend

npm run dev          # Start dev server (port 5173)
npm run build        # Generates sitemap then builds to dist/
npm run preview      # Preview production build locally
npm run lint         # ESLint
npm run generate:sitemap  # Regenerate sitemap only
```

### Architecture
- **Entry**: `src/main.jsx` → `src/App.jsx`
- **Routes**: `/` (`HomePage.jsx`: promise + live deck, then crawlable answers), `/faq` (`FaqPage.jsx`, FAQPage JSON-LD), `*` (`NotFound.jsx`, noindex), `/r` (referral redirect), `/e/:eventId` (event share deep link), `/l/links` (combined event+referral link), `/a/:token` (ambassador page), `/swipe` (web swipe deck), `/download` (`DownloadRedirect.jsx`: sends mobile users to the right store; this is a React route, not a Spring endpoint), `/help/account-deletion`, `/help/child-safety`, `/help/refund-policy`, `/legal/privacy-policy`, `/legal/terms-and-conditions`
- **API calls**: always go through `src/lib/api.js` → `apiUrl()` helper. In dev, Vite proxies `/api/*` to `https://tandem.it.com/`. Set `VITE_API_BASE` env var to point to a different backend.
- **Deck**: `components/SwipeDeck.jsx` is the whole Journey 1 flow (cards, phone sheet, replay, share, app prompts). `/swipe` and `/` both render it; the page owns the city (`SiteHeader` chip) and the heading. Funnel numbers and the creator map live in `src/lib/funnel.js`. Every page sets its head through `components/Seo.jsx` (title, description, canonical, Open Graph, JSON-LD).
- **Analytics**: Google Analytics 4 (`G-XTYRTQY6R7`) + Microsoft Clarity, with custom section-engagement tracking via `IntersectionObserver`.
- **Prerendering**: `npm run build:site` = `vite build` + `scripts/prerender.mjs` (Playwright): copies `dist/index.html` to `dist/spa.html`, then renders `/`, `/swipe`, `/faq` (and `/bengaluru`, `/mumbai` with 3.2) into `dist/<route>/index.html`. In `?prerender=1` mode the deck shows a placeholder (no event cards) and analytics stays off; JSON-LD is kept in the snapshot. nginx: `try_files $uri $uri/index.html /spa.html;`. Code that touches `window`/`localStorage` must run inside `useEffect`. React Router framework mode is after launch.
- **Session tracking**: A `sessionId` is generated fresh on every page load (stored in `localStorage` + `sessionStorage`). It links location data to waitlist submissions on the backend.

### Scroll Restoration (`src/App.jsx` — `ScrollToTop` component)
- `window.history.scrollRestoration = "manual"` — prevents the browser from interfering.
- **Forward navigation (PUSH)**: scrolls to top of the new page.
- **Back navigation (POP)**: restores the saved `scrollY` position using a 30-frame `requestAnimationFrame` retry loop (~500ms at 60fps). This fights layout shifts from lazy sections rendering after navigation.
- Scroll position is saved to `sessionStorage` as `scrollY:<pathname>` on every scroll event.
- **Do not** use page height (`scrollHeight`) as a condition for restoring scroll — it varies between sessions (different images loaded, viewport size, etc.) and causes the restore to silently never fire.

### Legal Pages
| Route | File | Notes |
|---|---|---|
| `/legal/privacy-policy` | `src/pages/PrivacyPolicy.jsx` | Full 14-section policy (A–N) from official PDF. Includes Navbar, dark theme. |
| `/legal/terms-and-conditions` | `src/pages/TermsAndConditions.jsx` | 11-section T&C (A–K), content mirrors the official Google Doc. Includes Navbar, dark theme. |

Legal pages use the site's dark theme: `#111111` bg, `#F2F2F2` text, `#00FFC8` headings, `"Anek Latin"` font. Content `div` must have `position: relative; z-index: 60` to render above the Navbar's absolute-positioned gradient overlay (`z-index: 49`).

### UI Change Workflow
After **any** UI change, verify with the Playwright MCP server before considering the task done:
1. Start dev server if needed (`npm run dev`)
2. Navigate to the affected page
3. Simulate real user behaviour (scroll, click, go back)
4. Measure outcome via `mcp__playwright__browser_evaluate` (e.g. `window.scrollY`, DOM state)
5. Fix and re-verify in a loop until behaviour matches requirements exactly

### Environment Variables
| Variable | Default | Description |
|---|---|---|
| `VITE_API_BASE` | *(empty = same-origin)* | Absolute API base URL, e.g. `https://tandem.it.com` |

---

## Backend (`landing_page/`)

### Commands
```bash
cd landing_page

./mvnw spring-boot:run                          # Run with active profile (default: dev)
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
./mvnw clean package                            # Build JAR
./mvnw test                                     # Run all tests
./mvnw test -Dtest=LandingPageApplicationTests  # Run a single test class
```

### Architecture
Standard Spring Boot layered architecture: `Controller → Service → Repository → Entity`

**REST API endpoints:**

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/api/leads` | None | Submit waitlist lead (name, email, mobile, sessionId) |
| `POST` | `/api/location` | None | Save user geolocation (lat, lon, accuracy, sessionId) |
| `POST` | `/api/referral/{code}` | None (nginx rate limit) | Record a referral click with device fingerprint |
| `POST` | `/api/referral/attribute` | `X-Attribution-Secret` (old `X-API-KEY` until its `app_config` row is deleted) | Deferred attribution: match an app install to a referral click |
| `POST` | `/api/event-link/{eventId}` | None (nginx rate limit) | Record an event share link click with device fingerprint |
| `POST` | `/api/event-link/attribute` | `X-Attribution-Secret` (as above) | Deferred attribution: match an app install to an event link click; returns `eventId` |
| `POST` | `/api/links/click` | None (nginx rate limit) | Record a combined event+referral link click (`?referralCode=&eventId=`); stored in `combined_link_hits` |
| `POST` | `/api/links/attribute` | `X-Attribution-Secret` (as above) | Unified deferred attribution: checks `combined_link_hits` first, falls back to `referral_hits`; returns `{ matched, referralCode, eventId }` |
| `GET` | `/api/ambassador/page` | None | Ambassador page data for `/a/:token`, proxied from the app backend; only allowlisted fields are returned (`AmbassadorPageService.ALLOWED`) |

`GET /api/referral/{code}` was deleted in launch task 1.4 (it exposed the last clicker's IP and user agent).

There is no Spring `/download` endpoint. `/download` is the React route `DownloadRedirect.jsx`.

**Lead submission flow:** `LeadController` delegates entirely to `LeadService.saveLead()`, which handles deduplication on `(email, mobile)`, looks up `UserLocation` by `sessionId` to attach the city, then saves.

**Referral click flow:** The `/r?ref=CODE` frontend route calls `POST /api/referral/{code}` with device fingerprint fields (`screenWidth`, `lang`, `platform`) and the `X-API-KEY`, then redirects based on user agent to the iOS App Store or Google Play.

**Deferred attribution flow:** Called by `tandem-core` (`otp_auth_service` module, `AuthController` `/auth/attribute`) at app cold start. Receives `{ip, userAgent, screenWidth, lang, installTs}` and scores candidates within a 30-minute window. **Scoring (identical across all 3 attribution endpoints):** exact IP match = 60 pts / same /24 subnet = 40 pts, time proximity ≤15 min = 30 pts, screen width match ±2px = 10 pts. Threshold: ≥ 75 pts to attribute. UA is NOT scored (browser UA never matches Dart HTTP client UA). For new `/l/links` format use `POST /api/links/attribute`; for legacy `/r?ref=` use `POST /api/referral/attribute`; for event-only links use `POST /api/event-link/attribute`.

**Event share deep link flow:** `/e/:eventId` React route (`EventRedirect.jsx`) handles the fallback when the app is NOT installed — nginx serves React for this path. If the app IS installed, the OS intercepts `https://tandem.it.com/e/<eventId>` via Universal Links / App Links before any browser request. `EventRedirect.jsx` calls `POST /api/event-link/{eventId}` (tracked in `event_link_hits` table) then redirects to App Store or Play Store. On first app launch after install, the app calls `POST /api/event-link/attribute` → fingerprint match → returns `{ matched, eventId }` → app navigates to the event. Same fingerprint scoring as referral attribution (threshold 75). There is no Spring Boot controller for `GET /e/{eventId}` — nginx routes that path to React, not Spring Boot.

**Combined event+referral link flow:** `/l/links?event-id=<id>&referral-code=<code>` React route (`CombinedRedirect.jsx`) — used when a shareable link carries both an event and a referral. `CombinedRedirect.jsx` calls `POST /api/links/click` with both IDs as query params (`referralCode`, `eventId`) and device fingerprint in the body, then redirects to the store. Hit stored in `combined_link_hits` table. On app cold start, `POST /api/links/attribute` checks `combined_link_hits` first (with resolved deduplication), then falls back to legacy `referral_hits`. Returns `{ matched, referralCode, eventId }`. Note: `referralCode` is optional (nullable); `eventId` is required (saved as `""` if absent).

**Universal Links / App Links setup:**
- `.well-known/assetlinks.json` and `.well-known/apple-app-site-association` are static files served by nginx on the website host, from `/var/www/html/.well-known/` via `alias` with `Content-Type: application/json` (see `deploy/nginx/leadform`), not by landing_page. The API host has its own copies (`ngnix/sites-enabled/api-tandem` in tandem_main). There is no `WellKnownController`. Any new SPA fallback rule must not catch `/.well-known/*`.
- Android: `assetlinks.json` live with 3 SHA-256 fingerprints (`C7:07…`, `8E:49…`, `D1:39…`), package `com.tandemit.tandemit`. `AndroidManifest.xml` has verified https intent filters for `tandem.it.com` and `api.tandem.it.com`, plus a `tandem://` custom scheme.
- iOS: AASA live (Team ID `MF5NQJQ727`, Bundle ID `com.tandemit.tandemit`). Associated Domains `applinks:tandem.it.com` is in the entitlements, and the app parses `/e/` and `/l/links` (`lib/routes/app_router.dart`). iOS has **no** `tandem://` scheme.
- Both use `paths: ["*"]` to cover all current and future deep link paths.

**IP extraction:** All three click-tracking controllers (`ReferralHitController`, `EventLinkController`, `CombinedLinkController`) read `X-Forwarded-For` first (taking the first IP in the comma-separated list), falling back to `request.getRemoteAddr()`. Required for accurate attribution behind load balancers/proxies.

**Location geocoding:** `LocationService` calls the OpenCage Geocoding API and resolves city via fallback hierarchy: city → town → village.

### Configuration & Profiles
- **`application.properties`** — base config: DB pool (HikariCP max 10, min 2), API key, OpenCage key, port 8080, `app.store.*` URLs (unused leftovers from a removed Spring `/download` endpoint)
- **`application-dev.properties`** — local PostgreSQL (`localhost:5432/leads_db`)
- **`application-atul.properties`** — another dev override with a different DB password
- **`application-prod.properties`** — empty placeholder; production env vars must be set externally
- Database: `spring.jpa.hibernate.ddl-auto=update` — schema auto-migrates on startup (no Flyway/Liquibase)
- **CORS:** `WebConfig` is the only CORS policy for `/api/**`: `http://localhost:5173`, `https://tandem.it.com`, `https://www.tandem.it.com`, `https://demo.tandem.it.com`. Don't add `@CrossOrigin` to controllers (all removed in launch task 1.4). The `/download` mapping in `WebConfig` is dead: no Spring endpoint serves it.
- **Timezone:** All entity `@PrePersist` hooks use `LocalDateTime.now()` (JVM default timezone). Attribution services query with `LocalDateTime.now(ZoneOffset.UTC)`. These are consistent only when the JVM runs in UTC — do not change the server timezone without updating the entities to use `LocalDateTime.now(ZoneOffset.UTC)`.
