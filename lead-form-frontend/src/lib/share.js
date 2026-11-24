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

// Same message as the app's discovery invite (event-service EventService.buildDiscoveryInviteMessage)
export function shareText(card, link) {
  const when = [card.day, card.time].filter(Boolean).join(", ");
  const details = [`🎉 ${card.title}`, when && `🗓️ ${when}`, card.price, card.area && `📍${card.area}`].filter(Boolean).join("\n");
  return [
    "Hey!", "",
    "Found this on Tandem and thought of you 👀", "",
    details, "",
    "Download the app - you'll land straight on this event after signing up:",
    link, "",
    "Let me know if you're in!",
  ].join("\n");
}

export const whatsappUrl = (text) => `https://wa.me/?text=${encodeURIComponent(text)}`;

// Phones get the native share sheet; desktops get WhatsApp Web + Copy link
export const canNativeShare = () =>
  typeof navigator !== "undefined" && !!navigator.share && window.matchMedia?.("(pointer: coarse)").matches;
