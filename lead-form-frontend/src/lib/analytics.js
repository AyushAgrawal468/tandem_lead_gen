// Handoff 2.7: first-touch UTM tags, Sentry, PostHog (same EU project as the backend forwarder) and
// Meta Pixel events. Keys come from the build env; blank = off, like the backend (local, demo).
const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY || "";
const POSTHOG_HOST = (import.meta.env.VITE_POSTHOG_HOST || "https://eu.i.posthog.com").replace(/\/$/, "");
const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN || "";
const FIRST_TOUCH_KEY = "firstTouch";
const UTM = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];

const prerender = () => new URLSearchParams(window.location.search).has("prerender");

/** The first visit's UTM tags, city, referrer and landing page; never overwritten. */
export function firstTouch() {
  try { return JSON.parse(localStorage.getItem(FIRST_TOUCH_KEY) || "null") || {}; } catch { return {}; }
}

function saveFirstTouch() {
  if (localStorage.getItem(FIRST_TOUCH_KEY)) return;
  const q = new URLSearchParams(window.location.search);
  const ft = { landing_path: window.location.pathname, referrer: document.referrer || null, city: q.get("city") };
  UTM.forEach((k) => { ft[k] = q.get(k); });
  localStorage.setItem(FIRST_TOUCH_KEY, JSON.stringify(ft));
}

// Person properties, kept from the first touch ($set_once)
const setOnce = () => Object.fromEntries(Object.entries(firstTouch()).filter(([, v]) => v).map(([k, v]) => [`first_${k}`, v]));

function loadScript(src) {
  const s = document.createElement("script");
  s.src = src; s.async = true; s.crossOrigin = "anonymous";
  document.head.appendChild(s);
}

// PostHog's async snippet: a stub that queues calls until array.js loads, so no early event is lost
function loadPostHog() {
  if (window.posthog?.__SV) return;
  const ph = [];
  ph._i = [[POSTHOG_KEY, { api_host: POSTHOG_HOST, person_profiles: "identified_only", capture_pageview: false }, "posthog"]];
  ph.__SV = 1;
  for (const m of ["capture", "identify", "register", "reset", "setPersonProperties"]) ph[m] = (...a) => { ph.push([m, ...a]); };
  window.posthog = ph;
  loadScript(`${POSTHOG_HOST.replace(".i.posthog.com", "-assets.i.posthog.com")}/static/array.js`);
}

/** At boot, before rendering. Skipped in the prerender snapshot, so it never counts a visit or ships a script. */
export function initAnalytics() {
  if (typeof window === "undefined" || prerender()) return;
  try { saveFirstTouch(); } catch { /* storage blocked */ }
  if (SENTRY_DSN) {
    try {
      // Sentry's loader script: async, no bundle weight; the key is the DSN's public key
      window.sentryOnLoad = () => window.Sentry.init({ dsn: SENTRY_DSN, environment: window.location.hostname });
      loadScript(`https://js.sentry-cdn.com/${new URL(SENTRY_DSN).username}.min.js`);
    } catch { /* bad DSN: no Sentry */ }
  }
  if (POSTHOG_KEY && !window.location.hostname.startsWith("demo.")) loadPostHog(); // no demo data in PostHog
  track("link_opened", { path: window.location.pathname, ...Object.fromEntries(new URLSearchParams(window.location.search)), $set_once: setOnce() });
}

// Meta Pixel (loaded site-wide from index.html): the three funnel events it needs
const PIXEL = { otp_verified: ["track", "CompleteRegistration"], waitlist_joined: ["track", "Lead"], install_cta_clicked: ["trackCustom", "InstallIntent"] };

/** One web event to PostHog, plus its Meta Pixel event if it has one. Never throws. */
export function track(event, props = {}) {
  try {
    window.posthog?.capture?.(event, props);
    if (PIXEL[event] && typeof window.fbq === "function") window.fbq(...PIXEL[event]);
  } catch { /* analytics must never break the page */ }
}

/** Right after OTP: join web events to the server events the backend sends under the same user_id. */
export function identify(userId) {
  try { if (userId) window.posthog?.identify?.(userId, {}, setOnce()); } catch { /* ignore */ }
}
