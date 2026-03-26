# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is the **Tandem lead generation** monorepo with two sub-projects:

| Directory | Stack | Purpose |
|---|---|---|
| `lead-form-frontend/` | React 19 + Vite + Tailwind CSS | Landing page & waitlist form |
| `landing_page/` | Spring Boot 3.5.3 (Java 21) + PostgreSQL | REST API backend |

Production URL: `https://tandem.it.com`

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
- **Routes**: `/` (landing page), `/r` (referral redirect), `/help/account-deletion`, `/help/child-safety`, `/legal/privacy-policy`, `/legal/terms-and-conditions`
- **API calls**: always go through `src/lib/api.js` → `apiUrl()` helper. In dev, Vite proxies `/api/*` to `https://tandem.it.com/`. Set `VITE_API_BASE` env var to point to a different backend.
- **Performance**: Below-the-fold sections (Features, Waitlist, Blog, FAQ, Footer) are lazy-loaded via `React.lazy` + `Suspense`, deferred until first scroll or idle callback (`deferSections` state in `LandingPage`). On back-navigation where a saved scroll position exists, `deferSections` starts as `true` immediately so content is ready before scroll restores.
- **Analytics**: Google Analytics 4 (`G-XTYRTQY6R7`) + Microsoft Clarity, with custom section-engagement tracking via `IntersectionObserver`.
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
| `POST` | `/api/referral/{code}` | `X-API-KEY` header | Record a referral click with device fingerprint |
| `GET` | `/api/referral/{code}` | None | Fetch most recent referral hit for a code |
| `POST` | `/api/referral/attribute` | `X-API-KEY` header | Deferred attribution: match an app install to a referral click |

**Lead submission flow:** `LeadController` validates input (name: alphabets+spaces, mobile: 10-digit or `+91` format, email), deduplicates on `(email, mobile)`, then looks up `UserLocation` by `sessionId` to attach the city. Note: `LeadService` exists but is not used by the controller — the save logic is inline.

**Referral click flow:** The `/r?ref=CODE` frontend route calls `POST /api/referral/{code}` with device fingerprint fields (`screenWidth`, `lang`, `platform`) and the `X-API-KEY`, then redirects based on user agent to the iOS App Store or Google Play.

**Deferred attribution flow:** Called by the `otp-auth-service` at app cold start. `POST /api/referral/attribute` receives `{ip, userAgent, screenWidth, lang, installTs}` and scores all referral clicks within a 30-minute window against the install. Scoring: IP match = 60 pts (filtered at query level), user-agent match = 20 pts, time proximity ≤15 min = 15 pts, screen width match = 5 pts. Returns the top match if score ≥ 75.

**IP extraction:** `ReferralHitController` reads `X-Forwarded-For` first (taking the first IP in the comma-separated list), falling back to `request.getRemoteAddr()`. Required for accurate attribution behind load balancers/proxies.

**Location geocoding:** `LocationService` calls the OpenCage Geocoding API and resolves city via fallback hierarchy: city → town → village.

### Configuration & Profiles
- **`application.properties`** — base config: DB pool (HikariCP max 10, min 2), API key, OpenCage key, port 8080
- **`application-dev.properties`** — local PostgreSQL (`localhost:5432/leads_db`)
- **`application-atul.properties`** — another dev override with a different DB password
- **`application-prod.properties`** — empty placeholder; production env vars must be set externally
- Database: `spring.jpa.hibernate.ddl-auto=update` — schema auto-migrates on startup (no Flyway/Liquibase)
- **CORS:** `WebConfig` restricts to `http://localhost:5173` and `https://tandem.it.com`, but `LeadController` and `LocationController` override this with `@CrossOrigin(origins = "*")` — only referral endpoints respect the `WebConfig` restriction.
