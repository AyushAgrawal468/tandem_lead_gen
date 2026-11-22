import { call } from "./tandemApi";

// The web login, shared by the deck (/swipe, /, city pages) and the shared link page (/l/links, /e/, /r).
export const SESSION_KEY = "webSwipeSession";
const PENDING_REFERRAL_KEY = "webPendingReferral"; // a friend's code from /l/links or /r, credited after login

export const readJson = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key) || "null") ?? fallback; } catch { return fallback; } };
export const writeJson = (key, v) => { try { v == null ? localStorage.removeItem(key) : localStorage.setItem(key, JSON.stringify(v)); } catch { /* storage blocked */ } };

export function loadSession() {
  const s = readJson(SESSION_KEY, null);
  return s && s.expiresAt > Date.now() ? s : null;
}

/** verify-otp response → the stored session. */
export function sessionFrom(data) {
  return {
    token: data.access_token, userId: data.user_id, referralCode: data.referral_code || null,
    expiresAt: Date.now() + ((data.expires_in || 600) - 30) * 1000,
  };
}

export const rememberReferral = (code) => { if (code) writeJson(PENDING_REFERRAL_KEY, code); };

/**
 * Handoff 1.5: after login, hand the friend's code to tandem-core, which keeps it as pending and credits
 * both users only once this account finishes onboarding in the app. Returns true when it was sent.
 */
export async function creditReferral(session) {
  const code = readJson(PENDING_REFERRAL_KEY, null);
  if (!code || !session || code === session.referralCode) return false;
  try {
    await call("/user/web-referral", { token: session.token, method: "POST", body: { referralCode: code } });
    writeJson(PENDING_REFERRAL_KEY, null);
    return true;
  } catch { return false; } // kept for the next login
}
