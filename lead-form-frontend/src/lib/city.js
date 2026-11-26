import { apiUrl } from "./api";

// Same names and spelling as tandem-core AuthService.SUPPORTED_CITIES (the public feed takes these as ?city=)
export const SUPPORTED_CITIES = [
  "Bengaluru", "Mumbai", "Delhi-NCR", "Pune", "Hyderabad", "Chennai", "Kolkata", "Goa", "Chandigarh", "Jaipur", "Indore",
];
export const DEFAULT_CITY = "Bengaluru";

// City centres, for "Pick a nearby city" on the waitlist screen (canvas J1-19a)
const COORDS = {
  Bengaluru: [12.97, 77.59], Mumbai: [19.08, 72.88], "Delhi-NCR": [28.61, 77.21], Pune: [18.52, 73.86], Hyderabad: [17.39, 78.49],
  Chennai: [13.08, 80.27], Kolkata: [22.57, 88.36], Goa: [15.3, 74.12], Chandigarh: [30.73, 76.78], Jaipur: [26.91, 75.79], Indore: [22.72, 75.86],
};

/** The n live cities closest to a point. ponytail: flat-earth distance, fine at India's scale. */
export function nearestCities(lat, lon, n = 4) {
  const d = ([a, b]) => (a - lat) ** 2 + ((b - lon) * Math.cos((lat * Math.PI) / 180)) ** 2;
  return [...SUPPORTED_CITIES].sort((x, y) => d(COORDS[x]) - d(COORDS[y])).slice(0, n);
}
const KEY = "geoCity";

// ponytail: OpenCage and link names vs our list; extend aliases when a city fails to match
const ALIASES = { bangalore: "bengaluru", bombay: "mumbai", delhi: "delhi-ncr", "new delhi": "delhi-ncr", gurugram: "delhi-ncr", gurgaon: "delhi-ncr", noida: "delhi-ncr" };
const norm = (s) => { const n = String(s || "").toLowerCase().trim(); return ALIASES[n] || n; };

/** One of SUPPORTED_CITIES, or undefined when we're not live there. */
export function matchCity(name) {
  const n = norm(name);
  return n ? SUPPORTED_CITIES.find((c) => c.toLowerCase() === n) : undefined;
}

/** Handoff 2.1: ?city= on the link, then the cached city, then the default. Never prompts. */
export function initialCity() {
  let fromLink = null, cached = null;
  try { fromLink = new URLSearchParams(window.location.search).get("city"); } catch { /* no window */ }
  try { cached = localStorage.getItem(KEY); } catch { /* storage blocked */ }
  return matchCity(fromLink) || matchCity(cached) || DEFAULT_CITY;
}

export function rememberCity(city) {
  try { localStorage.setItem(KEY, city); } catch { /* storage blocked */ }
}

/** "Near me": the only place the web asks for GPS. Resolves to { name (raw, from OpenCage), lat, lon }. */
export function cityFromGps() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error("Location isn't available in this browser."));
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      try {
        let sessionId = null;
        try { sessionId = localStorage.getItem("sessionId"); } catch { /* storage blocked */ }
        const res = await fetch(apiUrl("/api/location"), {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lat: coords.latitude, lon: coords.longitude, accuracy: coords.accuracy, sessionId }),
        });
        if (!res.ok) throw new Error();
        resolve({ name: (await res.json()).city || "", lat: coords.latitude, lon: coords.longitude });
      } catch { reject(new Error("Couldn't find your city. Pick one instead.")); }
    }, () => reject(new Error("Location is off. Pick your city instead.")), { timeout: 10000, maximumAge: 600000 });
  });
}
