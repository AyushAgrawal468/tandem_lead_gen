import { formatEventDate, formatTime } from "./formatEventDate";
import { matchCity } from "./city";

// Design brief tokens (section 2)
export const T = {
  bg: "#111111", surface1: "#1E1F21", line: "rgba(255,255,255,0.08)", surface2: "#414141", green: "#00FFC8", purple: "#8349FF",
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

/** Public feed (GET /events/public/feed) card → deck card. */
export function fromPublic(e) {
  return {
    id: e.eventId, title: e.title, poster: e.poster || e.imageUrl,
    day: e.displayDate || dayFrom(e.startsAt), time: formatTime(e.eventTime), area: areaOf(e.location),
    price: priceText(e.price, e.displayPrice), description: descText(e.description, e.additionalDescription),
  };
}

/** Personal web feed (POST /events/web/feed) EventAdditionalDetails → deck card. */
export function fromPersonal(d) {
  const e = d.event || {};
  return {
    id: e.eventId, title: e.title, poster: e.additionalData?.poster || e.imageUrl,
    day: formatEventDate(e.eventDate, e.eventTime), time: null, area: areaOf(e.location),
    price: priceText(e.price), description: descText(e.description, e.additionalDescription),
  };
}

export const metaLine = (c) => [[c.day, c.time].filter(Boolean).join(", "), c.area].filter(Boolean).join("  •  ");
