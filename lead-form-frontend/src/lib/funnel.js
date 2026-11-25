import { FUNNEL } from "./funnel.config.js";

// Older names for the numbers in funnel.config.js (the handoff's single source); keep using FUNNEL in new code.
export const WEB_SWIPE_LIMIT = FUNNEL.SWIPE_LIMIT; // = backend EventService.WEB_SWIPE_LIMIT
export const PHONE_ASK_RIGHTS = FUNNEL.PHONE_ASK_RIGHTS;
export const PHONE_ASK_SWIPES = FUNNEL.PHONE_ASK_TOTAL;
export const SOFT_PROMPTS = FUNNEL.SOFT_PROMPTS;
export const STORE_LINK_CHECK_MS = FUNNEL.OPEN_IN_BROWSER_HINT_MS;
export const CREATORS = FUNNEL.CREATORS;
export const INVITE_EXEMPT_PER_DAY = 5; // mirrors EventService.INVITE_EXEMPT_PER_DAY
