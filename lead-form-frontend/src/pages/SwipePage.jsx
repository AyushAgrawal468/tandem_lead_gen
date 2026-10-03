import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import QrCardBg from "../assets/qr-card-bg.svg";
import QrCode from "../assets/qr-code.svg";
import TLogo from "../assets/t-logo.svg";
import { formatEventDate } from "../lib/formatEventDate";

// Login + event APIs live on the app backend, not the landing backend behind apiUrl()
const API = (import.meta.env.VITE_TANDEM_API_BASE || "https://api.tandem.it.com").replace(/\/$/, "");
const SESSION_KEY = "webSwipeSession";
const SWIPE_PX = 110;

const C = { bg: "#111111", text: "#F2F2F2", low: "#969696", green: "#00FFC8", card: "#1c1c1c", line: "#2a2a2a", fail: "#F3543F" };
const font = '"Anek Latin", Helvetica, sans-serif';
const btn = (active = true) => ({
  width: "100%", padding: "14px", borderRadius: "12px", border: "none", fontFamily: font, fontWeight: 700,
  fontSize: "16px", cursor: active ? "pointer" : "default", background: active ? C.green : "#2f2f2f", color: active ? "#111" : C.low,
});
const input = {
  width: "100%", padding: "14px", borderRadius: "12px", border: `1px solid ${C.line}`, background: C.card,
  color: C.text, fontFamily: font, fontSize: "16px", outline: "none", boxSizing: "border-box",
};

function loadSession() {
  try {
    const s = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
    return s && s.expiresAt > Date.now() ? s : null;
  } catch { return null; }
}
function saveSession(s) {
  try { s ? localStorage.setItem(SESSION_KEY, JSON.stringify(s)) : localStorage.removeItem(SESSION_KEY); } catch { /* storage blocked */ }
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

function DownloadPopup({ open }) {
  if (!open) return null;
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="dl-title"
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000, padding: "16px" }}>
      <div style={{ background: C.card, borderRadius: "20px", padding: "28px 24px", maxWidth: "360px", width: "100%", textAlign: "center", border: `1px solid ${C.line}` }}>
        <h2 id="dl-title" style={{ fontSize: "24px", fontWeight: 700, color: C.text, marginBottom: "8px" }}>Get the full experience</h2>
        <p style={{ color: C.low, fontSize: "15px", marginBottom: "20px", lineHeight: 1.5 }}>
          Download Tandem to keep discovering events and see which friends want to go too.
        </p>
        <div style={{ position: "relative", width: "200px", height: "200px", margin: "0 auto 20px" }}>
          <img src={QrCardBg} alt="" width={200} height={200} style={{ display: "block" }} />
          <img src={QrCode} alt="Scan to download Tandem"
            style={{ position: "absolute", top: "14px", left: "50%", transform: "translateX(-50%)", width: "108px", height: "108px", objectFit: "contain" }} />
        </div>
        <Link to="/download" style={{ ...btn(), display: "block", textDecoration: "none", boxSizing: "border-box" }}>Download the app</Link>
      </div>
    </div>
  );
}

// Mirrors the app's Discover card: invite banner, inset poster, title, date, price, logo badge
function EventCard({ details, onSwipe, disabled }) {
  const e = details.event || {};
  const [drag, setDrag] = useState({ x: 0, y: 0, active: false });
  const start = useRef(null);
  // Not details.inviteMessage — backend fills that with a share text on every organic card
  const banner = e.inviterName ? `${e.inviterName} invited you to this event` : null;
  const when = formatEventDate(e.eventDate, e.eventTime);
  const price = e.price && /^\d+(\.\d+)?$/.test(String(e.price).trim()) ? `₹ ${e.price}/person` : e.price;

  const end = () => {
    if (!start.current) return;
    start.current = null;
    const { x, y } = drag;
    const action = y < -SWIPE_PX && Math.abs(y) > Math.abs(x) ? "UP" : x > SWIPE_PX ? "RIGHT" : x < -SWIPE_PX ? "LEFT" : null;
    if (action === "LEFT" || action === "RIGHT") {
      setDrag({ x: action === "RIGHT" ? 600 : -600, y, active: false }); // fly off, then hand over
      // On success this card unmounts; on failure it slides back
      setTimeout(() => Promise.resolve(onSwipe(action)).finally(() => setDrag({ x: 0, y: 0, active: false })), 200);
    } else {
      setDrag({ x: 0, y: 0, active: false });
      if (action) onSwipe(action);
    }
  };

  const hint = (opacity, text, color, side) => (
    <span style={{ position: "absolute", top: "24px", [side]: "20px", zIndex: 2, opacity, border: `3px solid ${color}`, color,
      fontWeight: 800, fontSize: "22px", padding: "2px 10px", borderRadius: "8px", transform: `rotate(${side === "left" ? -12 : 12}deg)` }}>
      {text}
    </span>
  );

  return (
    <div
      onPointerDown={(ev) => { if (disabled) return; start.current = { x: ev.clientX, y: ev.clientY }; ev.currentTarget.setPointerCapture(ev.pointerId); }}
      onPointerMove={(ev) => start.current && setDrag({ x: ev.clientX - start.current.x, y: ev.clientY - start.current.y, active: true })}
      onPointerUp={end}
      onPointerCancel={end}
      style={{
        position: "relative", touchAction: "none", userSelect: "none", cursor: "grab", borderRadius: "16px", overflow: "hidden",
        background: "linear-gradient(180deg, #232323 0%, #1a1a1a 100%)", boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
        transform: `translate(${drag.x}px, ${drag.y}px) rotate(${drag.x / 20}deg)`,
        transition: drag.active ? "none" : "transform 0.2s ease",
      }}>
      {hint(Math.min(1, Math.max(0, drag.x / SWIPE_PX)), "INTERESTED", C.green, "left")}
      {hint(Math.min(1, Math.max(0, -drag.x / SWIPE_PX)), "SKIP", C.fail, "right")}
      {banner && (
        <div style={{ background: "linear-gradient(90deg, #6B4BD8, #4B3A8C)", color: "#EDE7FF", fontSize: "14px", padding: "10px 14px" }}>{banner}</div>
      )}
      <div style={{ padding: "12px 12px 0" }}>
        <div style={{ aspectRatio: "1 / 1", borderRadius: "10px", overflow: "hidden", background: "#2a2a2a" }}>
          {e.imageUrl && <img src={e.imageUrl} alt="" draggable={false} style={{ width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }} />}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: "12px", padding: "14px 14px 18px" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 style={{ fontSize: "22px", fontWeight: 700, color: C.text, lineHeight: 1.25, marginBottom: "4px" }}>{e.title}</h2>
          {when && <p style={{ color: C.low, fontSize: "15px" }}>{when}</p>}
          {price && <p style={{ color: C.green, fontSize: "15px", marginTop: "6px" }}>{price}</p>}
        </div>
        <span aria-hidden="true" style={{ flexShrink: 0, width: "40px", height: "40px", borderRadius: "50%", background: "linear-gradient(135deg, #00FFC8, #7B5CFF)",
          display: "flex", alignItems: "center", justifyContent: "center" }}>
          <img src={TLogo} alt="" style={{ height: "22px", filter: "brightness(0) invert(1)" }} />
        </span>
      </div>
    </div>
  );
}

export default function SwipePage() {
  const [session, setSession] = useState(loadSession);
  const [step, setStep] = useState(() => (loadSession() ? "prefs" : "phone"));
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [cities, setCities] = useState(() => loadSession()?.cities || []);
  const [city, setCity] = useState("");
  const [prefGroups, setPrefGroups] = useState([]);
  const [picked, setPicked] = useState([]);
  const [events, setEvents] = useState([]);
  const [remaining, setRemaining] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const run = async (fn) => {
    setBusy(true); setError("");
    try { await fn(); }
    catch (err) {
      if (err instanceof AuthError) { saveSession(null); setSession(null); setStep("phone"); setError("Session expired, please log in again."); }
      else setError(err.message || "Something went wrong");
    } finally { setBusy(false); }
  };

  useEffect(() => {
    if (step !== "prefs" || !session || prefGroups.length) return;
    run(async () => {
      const data = await call(`/user/preferences?userId=${encodeURIComponent(session.userId)}`, { token: session.token });
      setPrefGroups(data.preferences || []);
    });
  }, [step, session]); // eslint-disable-line react-hooks/exhaustive-deps

  const sendOtp = () => run(async () => {
    await call("/auth/send-otp", { method: "POST", body: { phone, countryCode: "91" } });
    setStep("otp");
  });

  const verifyOtp = () => run(async () => {
    const data = await call("/auth/verify-otp", { method: "POST", body: { phone, countryCode: "91", otp, platform: "WEB" } });
    const s = {
      token: data.access_token, userId: data.user_id, cities: data.supported_cities || [],
      expiresAt: Date.now() + ((data.expires_in || 600) - 30) * 1000,
    };
    saveSession(s); setSession(s); setCities(s.cities); setStep("prefs");
  });

  const loadFeed = () => run(async () => {
    const data = await call("/events/web/feed", {
      token: session.token, method: "POST",
      body: { eventFilters: { location: city, category: picked } },
    });
    setRemaining(data.remainingSwipes);
    setEvents(data.events || []);
    setStep("swipe");
    if (data.limitReached || !(data.events || []).length) setShowPopup(true);
  });

  const swipe = (action) => {
    const current = events[0];
    if (!current || busy) return;
    if (action === "UP") { setShowPopup(true); return; } // inviting friends needs the app
    return run(async () => {
      const data = await call("/events/web/saveAction", {
        token: session.token, method: "POST",
        body: { eventId: current.event.eventId, broadcastId: current.event.broadcastId, action },
      });
      const rest = events.slice(1);
      setEvents(rest);
      setRemaining(data.remainingSwipes);
      if (data.limitReached || !rest.length) setShowPopup(true);
    });
  };

  const toggle = (name) => setPicked((p) => (p.includes(name) ? p.filter((n) => n !== name) : [...p, name]));
  const validPhone = /^[6-9]\d{9}$/.test(phone);

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: font }}>
      <Helmet><title>Discover events · Tandem</title></Helmet>
      <main style={{ maxWidth: "420px", margin: "0 auto", padding: "32px 16px 48px" }}>
        <Link to="/" style={{ color: C.green, fontWeight: 700, fontSize: "20px", textDecoration: "none" }}>tandem</Link>

        {step === "phone" && (
          <section style={{ marginTop: "40px" }}>
            <h1 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "8px" }}>Find your next plan</h1>
            <p style={{ color: C.low, marginBottom: "24px" }}>Log in with your phone number to see events picked for you.</p>
            <label htmlFor="phone" style={{ display: "block", color: C.low, fontSize: "14px", marginBottom: "6px" }}>Phone number</label>
            <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
              <span style={{ ...input, width: "auto", color: C.low }}>+91</span>
              <input id="phone" inputMode="numeric" autoComplete="tel-national" maxLength={10} value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} style={input} placeholder="10-digit number" />
            </div>
            <button onClick={sendOtp} disabled={!validPhone || busy} style={btn(validPhone && !busy)}>{busy ? "Sending…" : "Send OTP"}</button>
          </section>
        )}

        {step === "otp" && (
          <section style={{ marginTop: "40px" }}>
            <h1 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "8px" }}>Enter OTP</h1>
            <p style={{ color: C.low, marginBottom: "24px" }}>Sent to +91 {phone}. <button onClick={() => setStep("phone")} style={{ color: C.green, background: "none", border: "none", cursor: "pointer", fontFamily: font, fontSize: "inherit", padding: 0 }}>Change</button></p>
            <label htmlFor="otp" style={{ display: "block", color: C.low, fontSize: "14px", marginBottom: "6px" }}>OTP</label>
            <input id="otp" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} style={{ ...input, marginBottom: "16px", letterSpacing: "4px" }} />
            <button onClick={verifyOtp} disabled={otp.length < 4 || busy} style={btn(otp.length >= 4 && !busy)}>{busy ? "Verifying…" : "Verify"}</button>
          </section>
        )}

        {step === "prefs" && (
          <section style={{ marginTop: "32px" }}>
            <h1 style={{ fontSize: "26px", fontWeight: 700, marginBottom: "20px" }}>What are you into?</h1>
            <label htmlFor="city" style={{ display: "block", color: C.low, fontSize: "14px", marginBottom: "6px" }}>City</label>
            <select id="city" value={city} onChange={(e) => setCity(e.target.value)} style={{ ...input, marginBottom: "20px" }}>
              <option value="">Select your city</option>
              {cities.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            {prefGroups.map((g) => (
              <div key={g.code || g.name} style={{ marginBottom: "16px" }}>
                <p style={{ color: C.low, fontSize: "14px", marginBottom: "8px" }}>{g.icon} {g.name}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {(g.subCategories || []).map((s) => {
                    const on = picked.includes(s.name);
                    return (
                      <button key={s.name} onClick={() => toggle(s.name)} aria-pressed={on}
                        style={{ padding: "8px 14px", borderRadius: "999px", fontFamily: font, fontSize: "14px", cursor: "pointer",
                          border: `1px solid ${on ? C.green : C.line}`, background: on ? "rgba(0,255,200,0.12)" : C.card, color: on ? C.green : C.text }}>
                        {s.icon} {s.displayName || s.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            <div style={{ position: "sticky", bottom: "16px", marginTop: "24px" }}>
              <button onClick={loadFeed} disabled={!city || !picked.length || busy} style={btn(city && picked.length && !busy)}>
                {busy ? "Loading…" : "Show my events"}
              </button>
            </div>
          </section>
        )}

        {step === "swipe" && (
          <section style={{ marginTop: "20px" }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "14px" }}>
              <h1 style={{ fontSize: "24px", fontWeight: 700 }}>Discover</h1>
              {remaining !== null && <span style={{ color: C.low, fontSize: "14px" }}>{remaining} swipes left</span>}
            </div>
            {events[0] && <EventCard key={events[0].event?.eventId} details={events[0]} onSwipe={swipe} disabled={busy} />}
            {/* Mobile: swipe only (like the app). Desktop: buttons too. */}
            {events[0] && (
              <p className="md:hidden" style={{ color: C.low, fontSize: "13px", textAlign: "center", marginTop: "16px" }}>
                Swipe right if interested · left to skip · up to invite friends
              </p>
            )}
            {events[0] && (
              <div className="hidden md:flex" style={{ justifyContent: "center", gap: "20px", marginTop: "20px" }}>
                {[
                  ["LEFT", "M6 6l12 12M18 6L6 18", "Skip", C.fail],
                  ["UP", "M12 19V5M6 11l6-6 6 6", "Invite friends", "#FFD84D"],
                  ["RIGHT", "M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z", "Interested", C.green],
                ].map(([a, d, label, color]) => (
                  <button key={a} onClick={() => swipe(a)} disabled={busy} aria-label={label} title={label}
                    style={{ width: "60px", height: "60px", padding: 0, borderRadius: "50%", border: `2px solid ${color}`, background: C.card, color, cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {/* SVG, not text glyphs — font baselines pushed glyphs off-center */}
                    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" fill={a === "RIGHT" ? color : "none"}
                      stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d={d} />
                    </svg>
                  </button>
                ))}
              </div>
            )}
          </section>
        )}

        {error && <p role="alert" style={{ color: C.fail, marginTop: "16px", fontSize: "14px" }}>{error}</p>}
      </main>
      <DownloadPopup open={showPopup} />
    </div>
  );
}
