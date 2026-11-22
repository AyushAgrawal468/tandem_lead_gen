import { STORE_LINK_CHECK_MS } from "./funnel";

// Handoff 2.6 / D8: one helper for store links and "Open Tandem".
const PLAY = "https://play.google.com/store/apps/details?id=com.tandemit.tandemit";
const APP_STORE = "https://apps.apple.com/in/app/tandem-events-experiences/id6756263621";
// App Store Connect provider token for campaign links; leave unset until Shreyas shares it
const APPSTORE_PT = import.meta.env.VITE_APPSTORE_PT || "";

const ua = () => (typeof navigator === "undefined" ? "" : navigator.userAgent);
export const isIOS = () => /iphone|ipad|ipod/i.test(ua());
export const isAndroid = () => /android/i.test(ua());
export const isPhone = () => isIOS() || isAndroid();
// Instagram and Facebook in-app browsers, where store links often stay stuck inside the app
const isInAppBrowser = () => /Instagram|FBAN|FBAV/i.test(ua());

/** The visitor's UTM tags: the current URL first, else the first-touch campaign saved on arrival. */
function utm() {
  const q = typeof window === "undefined" ? new URLSearchParams() : new URLSearchParams(window.location.search);
  let firstTouch = null;
  try { firstTouch = localStorage.getItem("firstTouchCampaign"); } catch { /* storage blocked */ }
  return { source: q.get("utm_source") || "web", campaign: q.get("utm_campaign") || firstTouch || "organic" };
}

/** Store link for this phone, carrying the campaign (Play referrer; App Store ct + pt). */
export function storeUrl() {
  const { source, campaign } = utm();
  if (isIOS()) return `${APP_STORE}?ct=${encodeURIComponent(campaign)}${APPSTORE_PT ? `&pt=${encodeURIComponent(APPSTORE_PT)}` : ""}`;
  return `${PLAY}&referrer=${encodeURIComponent(`utm_source=${source}&utm_campaign=${campaign}`)}`;
}

/**
 * "Open Tandem". Android: the app registers tandem://, so an intent:// URL with the Play Store as
 * fallback. iOS has no scheme: the App Store page, which shows "Open" when installed. Null on desktop.
 */
export function openTandemUrl() {
  if (isAndroid()) return `intent://open#Intent;scheme=tandem;package=com.tandemit.tandemit;S.browser_fallback_url=${encodeURIComponent(storeUrl())};end`;
  if (isIOS()) return storeUrl();
  return null;
}

/**
 * After a store/app link tap: on iOS in-app browsers, if the page is still visible 2.5 s later the
 * link didn't leave the app, so the caller shows "Open in browser".
 */
export function whenStuck(onStuck) {
  if (!isIOS() || !isInAppBrowser()) return;
  setTimeout(() => { if (document.visibilityState === "visible") onStuck(); }, STORE_LINK_CHECK_MS);
}
