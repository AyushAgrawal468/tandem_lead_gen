// App-style event date: "28th Mar 26, 5 PM". Unknown formats are shown as-is.
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const ordinal = (d) => {
  const s = d % 100 >= 11 && d % 100 <= 13 ? "th" : ["th", "st", "nd", "rd"][d % 10] || "th";
  return `${d}${s}`;
};

// "28/03/2026" (scraper) or "2026-03-28" (ISO)
function formatDay(text) {
  const dmy = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  const iso = text.match(/^(\d{4})-(\d{2})-(\d{2})/);
  const [d, mo, y] = dmy ? [dmy[1], dmy[2], dmy[3]] : iso ? [iso[3], iso[2], iso[1]] : [];
  if (!d || +mo < 1 || +mo > 12) return null;
  return `${ordinal(+d)} ${MONTHS[+mo - 1]} ${y.slice(2)}`;
}

// "5:00 PM" -> "5 PM", "5:30 PM" -> "5:30 PM"; takes the start of "5:00 PM to 11:00 PM"
function formatTime(text) {
  const m = (text || "").match(/(\d{1,2})(?::(\d{2}))?\s*([AP]M)/i);
  if (!m) return null;
  return `${+m[1]}${m[2] && m[2] !== "00" ? `:${m[2]}` : ""} ${m[3].toUpperCase()}`;
}

export function formatEventDate(eventDate, eventTime) {
  const raw = (eventDate || "").trim();
  if (!raw || raw === "TBD") return formatTime(eventTime) || "";
  const days = raw.split(/\s+to\s+/i).map(formatDay);
  const time = formatTime(eventTime);
  // Unknown format (e.g. created events: "Sat, 18 Oct, 6:00 PM") — keep as-is, add time only if missing
  if (days.some((d) => !d)) return [raw, formatTime(raw) ? null : time].filter(Boolean).join(", ");
  return [days.join(" – "), time].filter(Boolean).join(", ");
}
