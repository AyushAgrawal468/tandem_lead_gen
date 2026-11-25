import { call } from "./tandemApi";

// The web login, shared by the deck (/swipe, /, city pages) and the shared link page (/l/links, /e/, /r).
// Browser storage keys: handoff "What the browser stores" (tdm.*)
export const SESSION_KEY = "tdm.token";
const PENDING_REFERRAL_KEY = "tdm.referral"; // a friend's code from /l/links or /r, credited after login
const INVITE_KEY = "tdm.invite"; // handoff: pending invite (event id, referral code); cleared when answered or after 7 days
const INVITE_DAYS = 7;

// Every localStorage call is wrapped: in private mode or a locked-down in-app browser it throws. Then
// values live in memory, so the deck keeps working and the cap holds for the session only.
const mem = new Map();
export const readJson = (key, fallback) => {
  try { const v = localStorage.getItem(key); if (v != null) return JSON.parse(v) ?? fallback; } catch { /* blocked */ }
  return mem.has(key) ? mem.get(key) : fallback;
};
export const writeJson = (key, v) => {
  if (v == null) mem.delete(key); else mem.set(key, v);
  try { v == null ? localStorage.removeItem(key) : localStorage.setItem(key, JSON.stringify(v)); } catch { /* memory only */ }
};

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

/** Journey 2 invite the visitor hasn't answered yet: the homepage deck shows it first (LP-08). */
export const rememberInvite = (eventId, code) => { if (eventId && code) writeJson(INVITE_KEY, { eventId, code, at: Date.now() }); };
export const pendingInvite = () => {
  const inv = readJson(INVITE_KEY, null);
  return inv?.eventId && Date.now() - inv.at < INVITE_DAYS * 864e5 ? inv : null;
};
export const clearInvite = () => writeJson(INVITE_KEY, null);

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
