// Web funnel numbers (handoff "When we ask for the phone and the app"). Starting values, tuned from
// PostHog data; keep WEB_SWIPE_LIMIT equal to the backend's EventService.WEB_SWIPE_LIMIT.
export const WEB_SWIPE_LIMIT = 35;
export const PHONE_ASK_RIGHTS = 3; // ask for the phone at the 3rd right swipe...
export const PHONE_ASK_SWIPES = 8; // ...or the 8th swipe if they haven't liked 3 yet
export const SOFT_PROMPTS = [10, 25];
export const INVITE_EXEMPT_PER_DAY = 5; // mirrors EventService.INVITE_EXEMPT_PER_DAY
export const STORE_LINK_CHECK_MS = 2500;

// Swipe gesture (design brief section 5)
export const SWIPE_PX = 100;
export const SWIPE_VELOCITY = 0.5; // px per ms

// Creator names for the /swipe heading "Saw {creator}'s reel? ...", keyed by utm_campaign (handoff 3.1).
// Add each reel's campaign here when its tagged link goes out.
export const CREATORS = {
  sukalyan_reel1: "Sukalyan",
};
