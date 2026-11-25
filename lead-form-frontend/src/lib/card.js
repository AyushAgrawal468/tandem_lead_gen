import { formatEventDate, formatTime } from "./formatEventDate";
import { matchCity } from "./city";

// Tokens (handoff "Design tokens"; styles/deck.css has the same values as CSS variables)
export const T = {
  bg: "#111111", surface1: "#1E1E1E", line: "#2E2E2E", surface2: "#414141", green: "#00FFC8", purple: "#8349FF",
  high: "#F2F2F2", mid: "#BCBCBC", low: "#969696", fail: "#F3543F",
};
export const font = '"Anek Latin", Helvetica, sans-serif';

// One card shape for both feeds (handoff 2.2: one shared EventCard)

function priceText(price, display) {
  if (display && String(display).trim()) return String(display).trim();
  const n = Number(String(price ?? "").trim());
  return Number.isFinite(n) && n > 0 ? `₹ ${n}/person` : null; // 0 or blank: price unknown, show nothing
}

// "Sat 23 Nov" in IST
function dayFrom(iso) {
  const d = new Date(iso);
  if (!iso || Number.isNaN(d.getTime())) return null;
  const p = Object.fromEntries(new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", weekday: "short", day: "numeric", month: "short" })
    .formatToParts(d).map((x) => [x.type, x.value]));
  return `${p.weekday} ${p.day} ${p.month}`;
}

// Many scraped events store only the city in location ("mumbai"); the card shows an area, so drop it then
const areaOf = (location) => (location && !matchCity(location) ? location : null);

const descText = (list, extra) => [...(Array.isArray(list) ? list : []), extra].filter((s) => s && String(s).trim()).join("\n\n");

// Handoff "Feed item fields": the frontend strips a trailing city suffix (" - Bengaluru", " | Bangalore")
const CITY_SUFFIX = /\s*[-–|,]\s*(bengaluru|bangalore|mumbai|delhi(-ncr)?|pune|hyderabad|chennai|kolkata|goa|chandigarh|jaipur|indore)\s*$/i;
const cleanTitle = (t) => String(t || "").replace(CITY_SUFFIX, "").trim() || t;

// Six categories (social, games, workshop, art, music, comedy); unknown → social
const CATEGORY_WORDS = [["music", /music|concert|gig|dj|band|jazz|live/i], ["comedy", /comedy|stand.?up|open mic/i],
  ["workshop", /workshop|class|course|making|pottery|cooking|baking/i], ["art", /art|exhibit|museum|gallery|paint|theatre|theater/i],
  ["games", /game|sport|trek|adventure|gaming|kart|bowling|escape|quiz|run|cycl/i]];
const categoryOf = (raw, title) => {
  const c = String(raw || "").toLowerCase();
  if (["social", "games", "workshop", "art", "music", "comedy"].includes(c)) return c;
  return CATEGORY_WORDS.find(([, re]) => re.test(`${raw || ""} ${title || ""}`))?.[0] || "social";
};

// Yellow tag: "Tonight" when it starts later today (IST), else "Under ₹500"
const istDay = (d) => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(d);
function tagOf(startsAt, price) {
  const s = startsAt ? new Date(startsAt) : null, now = new Date();
  if (s && !Number.isNaN(s.getTime()) && s > now && istDay(s) === istDay(now)) return "Tonight";
  const n = Number(price);
  return Number.isFinite(n) && n > 0 && n < 500 ? "Under ₹500" : null;
}

// Fields the handoff's EventCard reads: displayDate, displayPrice, posterUrl, category, tag
const forCard = (c, raw, startsAt, price) => ({
  ...c, title: cleanTitle(c.title), fullTitle: c.title,
  displayDate: [c.day, c.time].filter(Boolean).join(", "), displayPrice: c.price, posterUrl: c.poster,
  category: categoryOf(raw, c.title), tag: tagOf(startsAt, price),
});

/** Public feed (GET /events/public/feed) card → deck card. */
export function fromPublic(e) {
  return forCard({
    id: e.eventId, title: e.title, poster: e.poster || e.imageUrl,
    day: e.displayDate || dayFrom(e.startsAt), time: formatTime(e.eventTime), area: e.area ?? areaOf(e.location),
    price: priceText(e.price, e.displayPrice), description: descText(e.description, e.additionalDescription),
    venue: e.venue || null, endsAt: e.endsAt || null,
  }, e.categoryKey || e.category, e.startsAt, e.price);
}

/** Personal web feed (POST /events/web/feed) EventAdditionalDetails → deck card. */
export function fromPersonal(d) {
  const e = d.event || {};
  return forCard({
    id: e.eventId, title: e.title, poster: e.additionalData?.poster || e.imageUrl,
    day: formatEventDate(e.eventDate, e.eventTime), time: null, area: areaOf(e.location),
    price: priceText(e.price), description: descText(e.description, e.additionalDescription),
  }, e.category || e.eventCategory, e.startsAt, e.price);
}

export const metaLine = (c) => [[c.day, c.time].filter(Boolean).join(", "), c.area].filter(Boolean).join("  •  ");
