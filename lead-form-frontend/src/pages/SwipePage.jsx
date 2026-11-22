import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import QrCardBg from "../assets/qr-card-bg.svg";
import QrCode from "../assets/qr-code.svg";
import { initialCity } from "../lib/city";
import { WEB_SWIPE_LIMIT, PHONE_ASK_RIGHTS, PHONE_ASK_SWIPES } from "../lib/funnel";
import CityPicker from "../components/CityPicker";
import PhoneSheet from "../components/PhoneSheet";
import SendSheet from "../components/SendSheet";
import { rememberFirstTouch, shareLink, shareText, canNativeShare } from "../lib/share";
import { call, AuthError } from "../lib/tandemApi";
import { SwipeCard, CardFace, EventDetails } from "../components/EventCard";
import { fromPublic, fromPersonal, T, font } from "../lib/card";

const SESSION_KEY = "webSwipeSession";
const SWIPES_KEY = "webSwipes"; // swipes made before OTP, replayed in order after verifying
const SEEN_KEY = "webSeen"; // every card shown, so no card appears twice
const SEEN_MAX = 500;
const ASKED_KEY = "webPhoneAsked";
const SHARE_PROMPTED_KEY = "webSharePrompted";
// Snapshot rule 3: the prerendered HTML holds the heading and a fixed-height placeholder, never live cards
const PRERENDER = typeof window !== "undefined" && new URLSearchParams(window.location.search).has("prerender");

const btn = (active = true) => ({
  width: "100%", minHeight: "48px", padding: "14px", borderRadius: "999px", border: "none", fontFamily: font, fontWeight: 700,
  fontSize: "16px", cursor: active ? "pointer" : "default", background: T.high, color: T.bg, opacity: active ? 1 : 0.4,
});
const readJson = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key) || "null") ?? fallback; } catch { return fallback; } };
const writeJson = (key, v) => { try { v == null ? localStorage.removeItem(key) : localStorage.setItem(key, JSON.stringify(v)); } catch { /* storage blocked */ } };

function loadSession() {
  const s = readJson(SESSION_KEY, null);
  return s && s.expiresAt > Date.now() ? s : null;
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
  const [phoneAsk, setPhoneAsk] = useState(null); // null | "normal" | "picky" | "save"
  const [showPopup, setShowPopup] = useState(false);
  const [toast, setToast] = useState(null);
  const [error, setError] = useState("");
  const [totalUpcoming, setTotalUpcoming] = useState(null);
  const [sendCard, setSendCard] = useState(null); // card in the "Send to a friend" sheet
  const deckRef = useRef(null);
  const pendingAction = useRef(null);
  const loading = useRef(false);
  const replaying = useRef(false);

  const used = session && remaining !== null ? WEB_SWIPE_LIMIT - remaining : local.length;
  const capped = used >= WEB_SWIPE_LIMIT;
  const top = queue[0];

  const signOut = (msg) => { writeJson(SESSION_KEY, null); setSession(null); setError(msg); };

  useEffect(() => { rememberFirstTouch(); }, []);

  // One toast at a time, 3 s (design screen 5)
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

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
          if (data.total_upcoming != null) setTotalUpcoming(data.total_upcoming);
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
      const list = [...local, { eventId: card.id, action, at: Date.now(), card: { id: card.id, title: card.title, day: card.day, time: card.time, area: card.area, poster: card.poster } }];
      writeJson(SWIPES_KEY, list); setLocal(list);
      const rights = list.filter((s) => s.action === "RIGHT").length;
      // Ask once: 3rd right swipe, or 8th swipe with fewer than 3 rights. After Not now, only the hard stop asks again.
      if (!readJson(ASKED_KEY, false) && ((action === "RIGHT" && rights === PHONE_ASK_RIGHTS) || (list.length === PHONE_ASK_SWIPES && rights < PHONE_ASK_RIGHTS))) {
        writeJson(ASKED_KEY, true);
        setPhoneAsk(rights >= PHONE_ASK_RIGHTS ? "normal" : "picky");
      }
      return;
    }
    try {
      const data = await call("/events/web/saveAction", { token: session.token, method: "POST", body: { eventId: card.id, action } });
      setRemaining(data.remainingSwipes);
    } catch (err) {
      if (err instanceof AuthError) { signOut("Session expired, please log in again."); return; }
      // Keep it in the browser list; the replay below retries it
      const list = [...readJson(SWIPES_KEY, []), { eventId: card.id, action, at: Date.now() }];
      writeJson(SWIPES_KEY, list); setLocal(list);
      setToast("Couldn't save that swipe. Trying again.");
      setTimeout(() => replay(session), 5000);
    }
  };

  // Handoff 2.4: send every browser swipe to the server in order, then the server counts. A failure
  // keeps the unsent rest in localStorage for the next try. Returns how many were saved.
  const replay = async (s) => {
    if (replaying.current) return 0;
    replaying.current = true;
    let list = readJson(SWIPES_KEY, []), saved = 0;
    try {
      while (list.length) {
        const r = await call("/events/web/saveAction", { token: s.token, method: "POST", body: { eventId: list[0].eventId, action: list[0].action } });
        saved++; list = list.slice(1); writeJson(SWIPES_KEY, list.length ? list : null);
        setRemaining(r.remainingSwipes);
        if (r.limitReached) { list = []; writeJson(SWIPES_KEY, null); }
      }
    } catch (err) {
      if (err instanceof AuthError) signOut("Session expired, please log in again.");
    } finally { replaying.current = false; setLocal(list); }
    return saved;
  };

  // A returning logged-in visitor with unsent swipes (an earlier failure) sends them now
  useEffect(() => { if (session && readJson(SWIPES_KEY, []).length) replay(session); }, [session?.token]); // eslint-disable-line react-hooks/exhaustive-deps

  const onVerified = async (data) => {
    const s = { token: data.access_token, userId: data.user_id, referralCode: data.referral_code || null,
      expiresAt: Date.now() + ((data.expires_in || 600) - 30) * 1000 };
    setPhoneAsk(null);
    const lastRight = [...readJson(SWIPES_KEY, [])].reverse().find((sw) => sw.action === "RIGHT" && sw.card)?.card;
    const saved = await replay(s);
    writeJson(SESSION_KEY, s); setSession(s);
    setToast(saved ? `You're in. ${saved} swipes saved. Get the app to see which friends want the same.` : "You're in. Swipe right on anything you'd do.");
    // Handoff 2.5: once per user, after the You're in toast, offer to send their latest "I'm in"
    if (lastRight && !readJson(SHARE_PROMPTED_KEY, false)) {
      writeJson(SHARE_PROMPTED_KEY, true);
      setTimeout(() => setSendCard(lastRight), 3200);
    }
  };

  // Card share icon: the phone's share sheet, or the Send sheet (WhatsApp Web + Copy link) elsewhere.
  // Sharing doesn't change the card's swipe.
  const share = async (card) => {
    if (!canNativeShare()) { setSendCard(card); return; }
    const link = shareLink(card.id, session?.referralCode);
    try {
      await navigator.share({ text: shareText(card, link) });
      setToast("Sent. When they say they're in, you'll see it in the app.");
    } catch { /* closed the share sheet */ }
  };

  const closePhoneAsk = () => {
    if (phoneAsk !== "save") setToast("No problem. Keep swiping. Your swipes stay on this phone for now.");
    setPhoneAsk(null);
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
      if (phoneAsk || sendCard || showPopup || e.target.closest?.("input, textarea") || document.getElementById("city-title")) return;
      const a = { ArrowRight: "RIGHT", ArrowLeft: "LEFT", ArrowDown: "DOWN" }[e.key];
      if (a) { e.preventDefault(); act(a); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const left = totalUpcoming == null ? 0 : Math.max(0, totalUpcoming - used);
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
                <p style={{ fontSize: "22px", fontWeight: 700, marginBottom: "6px" }}>
                  {left >= 20 ? `${left} more plans in ${city} are waiting in the app.` : "Keep going in the app"}
                </p>
                <p style={{ color: T.mid, fontSize: "16px", marginBottom: "20px" }}>
                  {session
                    ? `You've used your ${WEB_SWIPE_LIMIT} web swipes, and they're saved. Download Tandem and allow contacts to see which friends want the same.`
                    : `You've used your ${WEB_SWIPE_LIMIT} web swipes. Download Tandem to keep going, or save these swipes with your number first.`}
                </p>
                <button onClick={() => setShowPopup(true)} style={btn()}>Download now</button>
                {!session && <button onClick={() => setPhoneAsk("save")} style={{ ...btn(), background: T.surface2, color: T.high, marginTop: "10px" }}>Save my swipes first</button>}
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
                <SwipeCard key={top.id} ref={deckRef} card={top} onAction={onAction} onOpen={openDetails} onShare={() => share(top)} />
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
        <EventDetails card={details} onBack={() => window.history.back()} onShare={() => share(details)}
          actions={<div style={{ maxWidth: "420px", margin: "0 auto" }}><ActionButtons onAct={act} disabled={capped} /></div>} />
      )}

      {toast && (
        <div role="status" className="toast-in" style={{ position: "fixed", left: 0, right: 0, margin: "0 auto", bottom: "calc(150px + env(safe-area-inset-bottom))",
          zIndex: 1700, width: "calc(100% - 32px)", maxWidth: "388px", background: T.surface1, color: T.high, borderRadius: "12px", padding: "12px 14px",
          fontSize: "14px", lineHeight: 1.5, boxShadow: "0 8px 24px rgba(0,0,0,0.5)" }}>{toast}</div>
      )}

      {sendCard && (
        <SendSheet card={sendCard} referralCode={session?.referralCode} onClose={() => setSendCard(null)}
          onSent={(msg) => { setSendCard(null); setToast(msg); }} />
      )}

      {phoneAsk && (
        <PhoneSheet variant={phoneAsk} rights={PHONE_ASK_RIGHTS} onClose={closePhoneAsk} onVerified={onVerified}
          onGetApp={() => { setPhoneAsk(null); setShowPopup(true); }} />
      )}

      <DownloadPopup open={showPopup} onClose={() => setShowPopup(false)} />
    </div>
  );
}
