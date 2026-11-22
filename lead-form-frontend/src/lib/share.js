import { firstTouch } from "./analytics";

// Handoff 2.5: "Send to a friend" shares a link, never phone numbers.

/** /l/links share link. Before verifying there's no referral code yet; the friend still lands on the event. */
export function shareLink(eventId, referralCode) {
  const p = new URLSearchParams({ "event-id": eventId });
  if (referralCode) p.set("referral-code", referralCode);
  p.set("utm_source", "invite");
  p.set("utm_medium", "share");
  // The sharer's first-touch campaign, so a friend's install traces back to the reel
  p.set("utm_campaign", firstTouch().utm_campaign || "organic");
  return `${window.location.origin}/l/links?${p}`;
}

export const shareText = (card, link) => `I'm in for ${card.title}${card.day ? ` on ${card.day}` : ""}. You in? ${link}`;

export const whatsappUrl = (text) => `https://wa.me/?text=${encodeURIComponent(text)}`;

// Phones get the native share sheet; desktops get WhatsApp Web + Copy link
export const canNativeShare = () =>
  typeof navigator !== "undefined" && !!navigator.share && window.matchMedia?.("(pointer: coarse)").matches;
