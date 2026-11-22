// Handoff 2.5: "Send to a friend" shares a link, never phone numbers.
const FIRST_TOUCH_KEY = "firstTouchCampaign";

/** Keep the first utm_campaign this browser arrived with, so a friend's install traces back to the reel. */
export function rememberFirstTouch() {
  try {
    const c = new URLSearchParams(window.location.search).get("utm_campaign");
    if (c && !localStorage.getItem(FIRST_TOUCH_KEY)) localStorage.setItem(FIRST_TOUCH_KEY, c);
  } catch { /* storage blocked */ }
}

function firstTouch() {
  try { return localStorage.getItem(FIRST_TOUCH_KEY) || "organic"; } catch { return "organic"; }
}

/** /l/links share link. Before verifying there's no referral code yet; the friend still lands on the event. */
export function shareLink(eventId, referralCode) {
  const p = new URLSearchParams({ "event-id": eventId });
  if (referralCode) p.set("referral-code", referralCode);
  p.set("utm_source", "invite");
  p.set("utm_medium", "share");
  p.set("utm_campaign", firstTouch());
  return `${window.location.origin}/l/links?${p}`;
}

export const shareText = (card, link) => `I'm in for ${card.title}${card.day ? ` on ${card.day}` : ""}. You in? ${link}`;

export const whatsappUrl = (text) => `https://wa.me/?text=${encodeURIComponent(text)}`;

// Phones get the native share sheet; desktops get WhatsApp Web + Copy link
export const canNativeShare = () =>
  typeof navigator !== "undefined" && !!navigator.share && window.matchMedia?.("(pointer: coarse)").matches;
