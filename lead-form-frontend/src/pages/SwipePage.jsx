import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import QrCardBg from "../assets/qr-card-bg.svg";
import QrCode from "../assets/qr-code.svg";
import { initialCity } from "../lib/city";
import { WEB_SWIPE_LIMIT, PHONE_ASK_RIGHTS, PHONE_ASK_SWIPES } from "../lib/funnel";
import CityPicker from "../components/CityPicker";
import { SwipeCard, CardFace, EventDetails } from "../components/EventCard";
import { fromPublic, fromPersonal, T, font } from "../lib/card";

// Login + event APIs live on the app backend, not the landing backend behind apiUrl()
const API = (import.meta.env.VITE_TANDEM_API_BASE || "https://api.tandem.it.com").replace(/\/$/, "");
const SESSION_KEY = "webSwipeSession";
const SWIPES_KEY = "webSwipes"; // swipes made before OTP, replayed in order after verifying
const SEEN_KEY = "webSeen"; // every card shown, so no card appears twice
const SEEN_MAX = 500;
// Snapshot rule 3: the prerendered HTML holds the heading and a fixed-height placeholder, never live cards
const PRERENDER = typeof window !== "undefined" && new URLSearchParams(window.location.search).has("prerender");

const btn = (active = true) => ({
  width: "100%", minHeight: "48px", padding: "14px", borderRadius: "999px", border: "none", fontFamily: font, fontWeight: 700,
  fontSize: "16px", cursor: active ? "pointer" : "default", background: T.high, color: T.bg, opacity: active ? 1 : 0.4,
});
const input = {
  width: "100%", padding: "14px", borderRadius: "8px", border: "none", background: T.surface2,
  color: T.high, fontFamily: font, fontSize: "16px", outline: "none", boxSizing: "border-box",
};

const readJson = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key) || "null") ?? fallback; } catch { return fallback; } };
const writeJson = (key, v) => { try { v == null ? localStorage.removeItem(key) : localStorage.setItem(key, JSON.stringify(v)); } catch { /* storage blocked */ } };

function loadSession() {
  const s = readJson(SESSION_KEY, null);
  return s && s.expiresAt > Date.now() ? s : null;
}

class AuthError extends Error {}

async function call(path, { token, method = "GET", body } = {}) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (res.status === 401) throw new AuthError("Session expired");
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.status || `Request failed (${res.status})`);
  return data;
}

function DownloadPopup({ open, onClose }) {
  if (!open) return null;
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="dl-title"
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000, padding: "16px" }}>
      <div style={{ position: "relative", background: T.surface1, borderRadius: "20px", padding: "28px 24px", maxWidth: "360px", width: "100%", textAlign: "center" }}>
        <button onClick={onClose} aria-label="Close" autoFocus
          style={{ position: "absolute", top: "12px", right: "12px", width: "36px", height: "36px", padding: 0, borderRadius: "50%", border: "none",
            background: "transparent", color: T.low, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
        <h2 id="dl-title" style={{ fontSize: "22px", fontWeight: 700, color: T.high, marginBottom: "8px" }}>Get Tandem on your phone</h2>
        <p style={{ color: T.mid, fontSize: "16px", marginBottom: "20px", lineHeight: 1.5 }}>Scan with your phone camera.</p>
        <div style={{ position: "relative", width: "200px", height: "200px", margin: "0 auto 20px" }}>
          <img src={QrCardBg} alt="" width={200} height={200} style={{ display: "block" }} />
          <img src={QrCode} alt="Scan to download Tandem"
            style={{ position: "absolute", top: "14px", left: "50%", transform: "translateX(-50%)", width: "108px", height: "108px", objectFit: "contain" }} />
        </div>
        <Link to="/download" style={{ ...btn(), display: "block", textDecoration: "none", boxSizing: "border-box" }}>Get the app</Link>
      </div>
    </div>
  );
}

// Not now / Never / I'm in (handoff "Swipe directions on the web"); arrow keys on desktop
const ACTIONS = [
  ["LEFT", "Not now", "←", T.mid, "M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"],
  ["DOWN", "Never", "↓", T.fail, "M6 6l12 12M18 6L6 18"],
  ["RIGHT", "I'm in", "→", T.green, "M5 12.5l4.5 4.5L19 7"],
];
function ActionButtons({ onAct, disabled }) {
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: "28px" }}>
      {ACTIONS.map(([a, label, key, color, d]) => (
        <div key={a} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
          <button onClick={() => onAct(a)} disabled={disabled} aria-label={label} aria-keyshortcuts={`Arrow${a === "DOWN" ? "Down" : a === "LEFT" ? "Left" : "Right"}`}
            style={{ width: "56px", height: "56px", padding: 0, borderRadius: "50%", border: "none", cursor: disabled ? "default" : "pointer",
              opacity: disabled ? 0.4 : 1, display: "flex", alignItems: "center", justifyContent: "center",
              background: a === "RIGHT" ? T.green : T.surface2, color: a === "RIGHT" ? T.bg : color }}>
            <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
          </button>
          <span style={{ color: T.mid, fontSize: "12px" }}>{label}<span className="hidden md:inline" style={{ color: T.low }}> {key}</span></span>
        </div>
      ))}
    </div>
  );
}

export default function SwipePage() {
  const [session, setSession] = useState(loadSession);
  const [city, setCity] = useState(initialCity);
  const [queue, setQueue] = useState([]);
  const [cursor, setCursor] = useState(null); // next public-feed page, null when there is none
  const [feed, setFeed] = useState("loading"); // loading | ready | error
  const [local, setLocal] = useState(() => readJson(SWIPES_KEY, []));
  const [remaining, setRemaining] = useState(null); // server count after OTP
  const [details, setDetails] = useState(null);
  const [phoneStep, setPhoneStep] = useState(null); // null | "phone" | "otp" (interim until 2.3's sheet)
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const deckRef = useRef(null);
  const pendingAction = useRef(null);
  const loading = useRef(false);

  const used = session && remaining !== null ? WEB_SWIPE_LIMIT - remaining : local.length;
  const capped = used >= WEB_SWIPE_LIMIT;
  const top = queue[0];

  const signOut = (msg) => { writeJson(SESSION_KEY, null); setSession(null); setError(msg); };

  // Before OTP: public feed page by page. After OTP: the personal web feed (knows past swipes).
  const loadMore = useCallback(async (reset) => {
    if (loading.current) return;
    loading.current = true;
    if (reset) { setQueue([]); setFeed("loading"); }
    try {
      const seen = new Set(readJson(SEEN_KEY, []));
      const add = (cards) => setQueue((q) => (reset ? cards : [...q, ...cards.filter((c) => !q.some((x) => x.id === c.id))]));
      if (session) {
        const data = await call("/events/web/feed", { token: session.token, method: "POST", body: { eventFilters: { location: city } } });
        setRemaining(data.remainingSwipes);
        add((data.events || []).map(fromPersonal).filter((c) => c.id && !seen.has(c.id)));
        setCursor(null);
      } else {
        let next = reset ? "" : cursor, cards = [], pages = 0;
        // Skip pages that are all already-seen cards (a return visitor), at most 3 per load
        while (next !== null && cards.length < 3 && pages++ < 3) {
          const data = await call(`/events/public/feed?city=${encodeURIComponent(city)}${next ? `&cursor=${encodeURIComponent(next)}` : ""}`);
          cards.push(...(data.events || []).map(fromPublic).filter((c) => c.id && !seen.has(c.id)));
          next = data.next_cursor ?? null;
        }
        add(cards);
        setCursor(next);
      }
      setFeed("ready");
    } catch (err) {
      if (err instanceof AuthError) signOut("Session expired, please log in again.");
      else setFeed("error");
    } finally { loading.current = false; }
  }, [session, city, cursor]);

  // New city or just logged in: start a fresh deck
  useEffect(() => {
    if (PRERENDER) { window.__PRERENDER_READY = true; return; }
    loadMore(true);
  }, [city, session?.token]); // eslint-disable-line react-hooks/exhaustive-deps

  // Keep a few cards queued while there are more pages
  useEffect(() => { if (feed === "ready" && !session && queue.length < 3 && cursor !== null) loadMore(false); }, [queue.length, cursor, feed]); // eslint-disable-line react-hooks/exhaustive-deps

  // A card counts as seen once it's on top
  useEffect(() => {
    if (!top) return;
    const seen = readJson(SEEN_KEY, []);
    if (!seen.includes(top.id)) writeJson(SEEN_KEY, [...seen, top.id].slice(-SEEN_MAX));
  }, [top?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Called once the card has flown off
  const onAction = async (action) => {
    const card = queue[0];
    if (!card) return;
    setQueue((q) => q.slice(1));
    if (!session) {
      const list = [...local, { eventId: card.id, action, at: Date.now() }];
      writeJson(SWIPES_KEY, list); setLocal(list);
      const rights = list.filter((s) => s.action === "RIGHT").length;
      // ponytail: interim one-time phone ask; 2.3 replaces it with the real sheet, copy and replay rules
      if (!readJson("webPhoneAsked", false) && ((action === "RIGHT" && rights === PHONE_ASK_RIGHTS) || (list.length === PHONE_ASK_SWIPES && rights < PHONE_ASK_RIGHTS))) {
        writeJson("webPhoneAsked", true); setPhoneStep("phone");
      }
      return;
    }
    try {
      const data = await call("/events/web/saveAction", { token: session.token, method: "POST", body: { eventId: card.id, action } });
      setRemaining(data.remainingSwipes);
    } catch (err) {
      if (err instanceof AuthError) signOut("Session expired, please log in again.");
      else setError("Couldn't save that swipe.");
    }
  };

  // Buttons and arrow keys: on the details page, close it first, then the card flies off
  const act = (action) => {
    if (!top || capped) return;
    if (details) { pendingAction.current = action; window.history.back(); return; }
    deckRef.current?.fly(action);
  };

  // Details is a state of the deck with its own history entry: back returns to the same card, no new URL
  const openDetails = () => {
    if (!top) return;
    window.history.pushState({ tandemDetails: top.id }, "");
    setDetails(top);
  };

  useEffect(() => {
    const onPop = () => {
      setDetails(null);
      const a = pendingAction.current;
      pendingAction.current = null;
      if (a) setTimeout(() => deckRef.current?.fly(a), 50);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (phoneStep || showPopup || e.target.closest?.("input, textarea") || document.getElementById("city-title")) return;
      const a = { ArrowRight: "RIGHT", ArrowLeft: "LEFT", ArrowDown: "DOWN" }[e.key];
      if (a) { e.preventDefault(); act(a); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const run = async (fn) => {
    setBusy(true); setError("");
    try { await fn(); } catch (err) { setError(err.message || "Something went wrong"); } finally { setBusy(false); }
  };

  const sendOtp = () => run(async () => {
    // ponytail: backend NPEs on a null appSignature (Android SMS hash, meaningless on web) — send "" until it's null-safe
    await call("/auth/send-otp", { method: "POST", body: { phone, countryCode: "91", appSignature: "" } });
    setPhoneStep("otp");
  });

  const verifyOtp = () => run(async () => {
    const data = await call("/auth/verify-otp", { method: "POST", body: { phone, countryCode: "91", otp, platform: "WEB" } });
    const s = { token: data.access_token, userId: data.user_id, expiresAt: Date.now() + ((data.expires_in || 600) - 30) * 1000 };
    // Replay the browser's swipes in order (handoff 2.4), then the server counts from here
    for (const sw of local) {
      const r = await call("/events/web/saveAction", { token: s.token, method: "POST", body: { eventId: sw.eventId, action: sw.action } });
      if (r.limitReached) break;
    }
    writeJson(SWIPES_KEY, null); setLocal([]);
    writeJson(SESSION_KEY, s); setSession(s); setPhoneStep(null);
  });

  const validPhone = /^[6-9]\d{9}$/.test(phone);
  const panel = { textAlign: "center", padding: "48px 16px", background: T.surface1, borderRadius: "16px" };

  return (
    <div style={{ minHeight: "100dvh", background: T.bg, color: T.high, fontFamily: font }}>
      <Helmet>
        <title>Swipe on things to do near you | Tandem</title>
        <meta name="description" content="See what's on in your city, swipe right on what you'd do, and get matched with friends who want the same plan." />
      </Helmet>
      <main style={{ maxWidth: "420px", margin: "0 auto", padding: "16px 16px calc(24px + env(safe-area-inset-bottom))" }}>
        <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
          <Link to="/" style={{ color: T.green, fontWeight: 700, fontSize: "20px", textDecoration: "none" }}>tandem</Link>
          <CityPicker city={city} onChange={setCity} />
        </header>

        <section style={{ marginTop: "16px" }}>
          <h1 style={{ fontSize: "22px", fontWeight: 700, lineHeight: 1.2, margin: 0 }}>What's on in {city} this week</h1>
          <p style={{ color: T.mid, fontSize: "14px", lineHeight: 1.5, margin: "4px 0 12px" }}>Swipe right on what you'd do. Get the app to see which friends want the same.</p>

          <div style={{ position: "relative" }}>
            {capped ? (
              <div style={panel}>
                <p style={{ fontSize: "22px", fontWeight: 700, marginBottom: "6px" }}>Keep going in the app</p>
                <p style={{ color: T.mid, fontSize: "16px", marginBottom: "20px" }}>You've used your {WEB_SWIPE_LIMIT} web swipes. Download Tandem to keep going.</p>
                <button onClick={() => setShowPopup(true)} style={btn()}>Download now</button>
              </div>
            ) : top ? (
              <>
                {/* Cards behind the top one peek out rotated, as in the app's Discover stack */}
                {queue.slice(1, 3).map((c, i) => (
                  <div key={c.id} aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 1 - i, pointerEvents: "none",
                    transform: `rotate(${i ? -3 : 3}deg) scale(0.95)`, transformOrigin: "50% 100%", opacity: 0.6, overflow: "hidden", borderRadius: "16px" }}>
                    <CardFace card={c} />
                  </div>
                ))}
                <SwipeCard key={top.id} ref={deckRef} card={top} onAction={onAction} onOpen={openDetails} />
              </>
            ) : feed === "loading" ? (
              <div aria-busy="true" style={{ background: T.surface1, borderRadius: "16px", padding: "12px" }}>
                <div style={{ height: "min(calc((min(100vw, 420px) - 56px) * 4 / 3), calc(100dvh - 445px))", minHeight: "240px", borderRadius: "10px", background: T.surface2 }} />
                <p style={{ color: T.low, fontSize: "14px", margin: "14px 2px 6px" }}>Finding what's on in {city}...</p>
              </div>
            ) : feed === "error" ? (
              <div style={panel}>
                <p style={{ fontSize: "22px", fontWeight: 700, marginBottom: "6px" }}>Couldn't load plans</p>
                <p style={{ color: T.mid, fontSize: "16px", marginBottom: "20px" }}>Check your connection and try again.</p>
                <button onClick={() => loadMore(true)} style={btn()}>Retry</button>
              </div>
            ) : (
              <div style={{ ...panel, background: "transparent", border: `2px dashed ${T.surface2}` }}>
                <p style={{ fontSize: "22px", fontWeight: 700, marginBottom: "6px" }}>That's everything on in {city} right now</p>
                <p style={{ color: T.mid, fontSize: "16px", marginBottom: "20px" }}>New plans land every day. In the app, you see them first, and which friends are in.</p>
                <button onClick={() => setShowPopup(true)} style={btn()}>Get the app</button>
              </div>
            )}
          </div>

          {top && !capped && (
            <>
              <p style={{ color: T.low, fontSize: "12px", textAlign: "center", margin: "12px 0" }}>Right if you're in. Left for not now. Down for never.</p>
              <ActionButtons onAct={act} />
            </>
          )}

          <div style={{ marginTop: "16px", display: "flex", alignItems: "center", gap: "10px" }}>
            <div role="progressbar" aria-label="Web swipes used" aria-valuemin={0} aria-valuemax={WEB_SWIPE_LIMIT} aria-valuenow={Math.min(used, WEB_SWIPE_LIMIT)}
              style={{ flex: 1, height: "4px", borderRadius: "2px", background: T.surface2, overflow: "hidden" }}>
              <div style={{ width: `${Math.min(100, (used / WEB_SWIPE_LIMIT) * 100)}%`, height: "100%", background: T.green, transition: "width 0.15s" }} />
            </div>
            <span style={{ color: T.low, fontSize: "12px" }}>{Math.min(used, WEB_SWIPE_LIMIT)}/{WEB_SWIPE_LIMIT}</span>
          </div>
        </section>

        {error && <p role="alert" style={{ color: T.fail, marginTop: "12px", fontSize: "14px" }}>{error}</p>}
      </main>

      {details && (
        <EventDetails card={details} onBack={() => window.history.back()}
          actions={<div style={{ maxWidth: "420px", margin: "0 auto" }}><ActionButtons onAct={act} disabled={capped} /></div>} />
      )}

      {phoneStep && (
        <div onClick={() => setPhoneStep(null)}
          style={{ position: "fixed", inset: 0, zIndex: 1800, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <div role="dialog" aria-modal="true" aria-labelledby="phone-title" onClick={(e) => e.stopPropagation()}
            style={{ background: T.surface1, width: "100%", maxWidth: "420px", borderRadius: "20px 20px 0 0", padding: "24px 16px calc(24px + env(safe-area-inset-bottom))" }}>
            {phoneStep === "phone" ? (
              <>
                <h2 id="phone-title" style={{ fontSize: "22px", fontWeight: 700, marginBottom: "6px" }}>Save your picks</h2>
                <p style={{ color: T.mid, fontSize: "16px", marginBottom: "16px" }}>Add your number to save them. Your swipes come with you when you get the app.</p>
                <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                  <span style={{ ...input, width: "auto", color: T.low }}>+91</span>
                  <input aria-label="Phone number" inputMode="numeric" autoComplete="tel-national" maxLength={10} value={phone} autoFocus
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} style={input} placeholder="10-digit number" />
                </div>
                <button onClick={sendOtp} disabled={!validPhone || busy} style={btn(validPhone && !busy)}>{busy ? "Sending…" : "Send code"}</button>
              </>
            ) : (
              <>
                <h2 id="phone-title" style={{ fontSize: "22px", fontWeight: 700, marginBottom: "6px" }}>Enter the code</h2>
                <p style={{ color: T.mid, fontSize: "16px", marginBottom: "16px" }}>Sent to +91 {phone}.</p>
                <input aria-label="Code" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={otp} autoFocus
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} style={{ ...input, marginBottom: "16px", letterSpacing: "4px" }} />
                <button onClick={verifyOtp} disabled={otp.length < 4 || busy} style={btn(otp.length >= 4 && !busy)}>{busy ? "Verifying…" : "Verify"}</button>
              </>
            )}
            <button onClick={() => setPhoneStep(null)} style={{ ...btn(), background: T.surface2, color: T.high, marginTop: "10px" }}>Not now</button>
          </div>
        </div>
      )}

      <DownloadPopup open={showPopup} onClose={() => setShowPopup(false)} />
    </div>
  );
}
