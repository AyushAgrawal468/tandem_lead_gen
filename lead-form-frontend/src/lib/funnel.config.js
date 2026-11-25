// funnel.config.js (handoff "Funnel logic", word for word): the only place these numbers exist.
export const FUNNEL = {
  SWIPE_LIMIT: 35,            // must equal backend WEB_SWIPE_LIMIT
  PHONE_ASK_RIGHTS: 3,        // ask at the 3rd I'm in...
  PHONE_ASK_TOTAL: 8,         // ...or the 8th swipe, whichever comes first
  SOFT_PROMPTS: [10, 25],     // dismissible app banners
  HARD_STOP_LOW: 20,          // under this, the stop screen uses the 'quick look' copy (J1-16b)
  FEED_PAGE: 10, PREFETCH_AT: 4, // fetch the next page when 4 cards remain
  RESEND_S: 30, TOAST_MS: 3000,
  OPEN_IN_BROWSER_HINT_MS: 2500,
  DEFAULT_CITY: 'bengaluru',
  CITIES: ['bengaluru', 'mumbai'],
  CREATORS: { sukalyan_reel1: 'Sukalyan' }, // utm_campaign → name for the reel heading
};
