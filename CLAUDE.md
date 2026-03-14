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
- **Performance**: Below-the-fold sections (Features, Waitlist, Blog, FAQ, Footer) are lazy-loaded via `React.lazy` + `Suspense`, deferred until first scroll or idle callback.
- **Analytics**: Google Analytics 4 (`G-XTYRTQY6R7`) + Microsoft Clarity, with custom section-engagement tracking via `IntersectionObserver`.
- **Session tracking**: A `sessionId` is generated fresh on every page load (stored in `localStorage` + `sessionStorage`). It links location data to waitlist submissions on the backend.

### Legal Pages
| Route | File | Notes |
|---|---|---|
| `/legal/privacy-policy` | `src/pages/PrivacyPolicy.jsx` | Full 14-section policy (A–N) from official PDF. Includes Navbar, dark theme. |
| `/legal/terms-and-conditions` | `src/pages/TermsAndConditions.jsx` | 13-section T&C. Includes Navbar, dark theme. |

Legal pages use the site's dark theme: `#111111` bg, `#F2F2F2` text, `#00FFC8` headings, `"Anek Latin"` font. Content `div` must have `position: relative; z-index: 60` to render above the Navbar's absolute-positioned gradient overlay (`z-index: 49`).

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
| `POST` | `/api/referral/{code}` | `X-API-KEY` header | Track a referral link hit |
| `GET` | `/api/referral/{code}` | None | Retrieve referral hit data |

**Lead submission flow:** When a lead is saved, the backend looks up the matching `UserLocation` record by `sessionId` and sets the `locationFetched` (city) field on the lead — linking the geolocation consent data to the waitlist entry.

**Referral flow:** The `/r?ref=CODE` frontend route calls `POST /api/referral/{code}` (with the hardcoded `X-API-KEY`) then immediately redirects the user to the iOS App Store or Google Play Store based on their user agent.

### Configuration & Profiles
- **`application.properties`** — defaults + profile selector (`spring.profiles.active=${SPRING_PROFILES_ACTIVE:dev}`)
- **`application-dev.properties`** — local PostgreSQL (`localhost:5432/leads_db`)
- **`application-prod.properties`** — production overrides (currently empty placeholder)
- Database: `spring.jpa.hibernate.ddl-auto=update` (auto-migrates schema on startup)
- External service: OpenCage Geocoding API for reverse geocoding locations
- CORS: allows `http://localhost:5173` (dev) and `https://tandem.it.com` (prod)
