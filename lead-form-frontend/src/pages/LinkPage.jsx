import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { apiUrl } from "../lib/api";
import { call, AuthError } from "../lib/tandemApi";
import { SESSION_KEY, writeJson, loadSession, sessionFrom, rememberReferral, creditReferral } from "../lib/session";
import { fromPublic, metaLine, T, font } from "../lib/card";
import { initialCity, matchCity } from "../lib/city";
import { isPhone } from "../lib/app";
import { track, identify } from "../lib/analytics";
import { shareLink, shareText, whatsappUrl } from "../lib/share";
import { EventCard } from "../components/deck/EventCard";

// The handoff card fills its frame (poster flexes), so it needs a height here
const Card = ({ card }) => <div style={{ height: "min(520px, 62dvh)" }}><EventCard event={card} /></div>;
import SwipeDeck from "../components/SwipeDeck";
import PhoneSheet from "../components/PhoneSheet";
import SendSheet from "../components/SendSheet";
import { SiteHeader } from "../components/SiteChrome";
import { DesktopAppPrompt, OpenInBrowser, OpenTandemLink, MatchScreen } from "../components/AppPrompts";

const pill = (main) => ({
  display: "block", width: "100%", boxSizing: "border-box", textAlign: "center", textDecoration: "none", minHeight: "48px", padding: "14px",
  borderRadius: "999px", border: "none", fontFamily: font, fontWeight: 700, fontSize: "16px", cursor: "pointer",
  background: main ? T.high : T.surface2, color: main ? T.bg : T.high,
});
const textLink = { background: "none", border: "none", padding: "8px 0", color: T.green, fontFamily: font, fontSize: "14px", fontWeight: 700, cursor: "pointer" };

/** The old redirect pages' click log (keyless, rate-limited in nginx); never blocks the page. */
function logClick(mode, code, eventId) {
  const ua = navigator.userAgent;
  const platform = /iPhone|iPad|iPod/.test(ua) ? "ios" : /Android/.test(ua) ? "android" : "unknown";
  const q = new URLSearchParams();
  if (code) q.set("referralCode", code);
  if (eventId) q.set("eventId", eventId);
  const path = mode === "referral" && !eventId ? `/api/referral/${encodeURIComponent(code)}`
    : window.location.pathname.startsWith("/e/") ? `/api/event-link/${encodeURIComponent(eventId)}`
    : `/api/links/click?${q}`;
  fetch(apiUrl(path), {
    method: "POST", headers: { "Content-Type": "application/json" }, keepalive: true,
    body: JSON.stringify({ screenWidth: window.screen.width, lang: navigator.language, platform }),
  }).catch(() => { /* tracking never blocks the page */ });
}

function Avatar({ sender }) {
  const box = { width: "28px", height: "28px", borderRadius: "50%", flexShrink: 0, objectFit: "cover", background: T.surface2 };
  return sender.photo
    ? <img src={sender.photo} alt="" style={box} />
    : <span aria-hidden="true" style={{ ...box, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 800, color: T.high }}>{sender.firstName[0]}</span>;
}

// Violet strip with the sender's avatar (design screens 23 and 33)
const Strip = ({ sender, text }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "10px", background: T.purple, color: "#fff", padding: "10px 14px", fontSize: "14px", fontWeight: 700 }}>
    <Avatar sender={sender} />{text}
  </div>
);

const Chip = ({ text }) => (
  <span style={{ position: "absolute", top: "24px", left: "24px", zIndex: 2, background: T.green, color: T.bg, borderRadius: "999px", padding: "6px 14px", fontSize: "14px", fontWeight: 800 }}>{text}</span>
);

/**
 * Journey 2 (handoff 3.4): one page for /l/links (invite), /e/:eventId (event only) and /r (referral).
 * "I'm in" is the first action, always: no "Open in app" at the top, or the acceptance and the
 * referral credit would be lost. noindex comes from the route wrapper (3.3).
 */
export default function LinkPage() {
  const { pathname, search } = useLocation();
  const params = useParams();
  const navigate = useNavigate();
  const q = new URLSearchParams(search);
  const isE = pathname.startsWith("/e/");
  const eventId = isE ? params.eventId : q.get("event-id");
  const code = pathname === "/r" ? q.get("ref") : q.get("referral-code");
  const mode = !eventId ? (code ? "referral" : "broken") : code && !isE ? "invite" : "event";

  const [session, setSession] = useState(loadSession);
  const [data, setData] = useState(null);
  const [stage, setStage] = useState("loading"); // loading card accepted saved already own usedup notnow referral over broken
  const [city, setCity] = useState(initialCity);
  const [phoneOpen, setPhoneOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [stuck, setStuck] = useState(false);
  const [sendOpen, setSendOpen] = useState(false);
  const [match, setMatch] = useState(null);

  const card = data?.event ? fromPublic(data.event) : null;
  const sender = data?.sender;
  const deckStage = ["notnow", "referral", "over", "broken"].includes(stage);

  const isAccepted = async (s) => {
    try { return (await call(`/events/web/accepted?eventId=${encodeURIComponent(eventId)}`, { token: s.token })).accepted; }
    catch { return false; }
  };

  const opened = useRef(false);
  useEffect(() => {
    if (opened.current) return; // one click log and one invite_opened per visit
    opened.current = true;
    logClick(mode, code, eventId);
    rememberReferral(code);
    track("invite_opened", { mode, eventId, hasCode: !!code });
    (async () => {
      let d = { event: null, sender: null };
      try {
        const lq = new URLSearchParams();
        if (eventId) lq.set("eventId", eventId);
        if (code) lq.set("code", code);
        d = await call(`/events/public/link?${lq}`);
      } catch { /* shown as a broken link */ }
      setData(d);
      setCity(matchCity(d.city) || initialCity());
      const s = loadSession();
      if (mode === "referral") return setStage(d.sender ? "referral" : "broken");
      if (!d.event || (mode === "invite" && !d.sender)) return setStage("broken");
      if (d.eventOver) return setStage("over");
      if (mode === "invite" && s?.referralCode === code) return setStage("own");
      if (s && await isAccepted(s)) return setStage("already");
      setStage("card");
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getApp = (from) => {
    track("install_cta_clicked", { from });
    if (isPhone()) navigate(`/download${search}`);
    else { setShowPopup(true); track("app_prompt_shown", { type: "desktop_qr", from }); }
  };

  // Save "I'm in" with the invite (the server skips the 35 count under the 1.5 fraud rules), then
  // the referral credit (pending until onboarding). The sender's push is sent by the server.
  const accept = async (s) => {
    setBusy(true); setError("");
    try {
      const body = { eventId, action: "RIGHT", ...(mode === "invite" ? { inviteRef: { referralCode: code, eventId } } : {}) };
      const r = await call("/events/web/saveAction", { token: s.token, method: "POST", body });
      if (r.limitReached && r.remainingSwipes <= 0 && !(await isAccepted(s))) {
        setStage("usedup"); track("app_prompt_shown", { type: "event_swipes_used_up" });
        return;
      }
      if (await creditReferral(s)) track("referral_credited", { from: mode });
      track("invite_accepted", { mode, eventId });
      if (r.match) { setMatch(r.match); track("match_shown", { eventId }); }
      setStage(mode === "invite" ? "accepted" : "saved");
    } catch (err) {
      if (err instanceof AuthError) { writeJson(SESSION_KEY, null); setSession(null); setPhoneOpen(true); }
      else setError("Couldn't save that. Try again.");
    } finally { setBusy(false); }
  };

  const imIn = () => (session ? accept(session) : setPhoneOpen(true));
  const notNow = () => { setPhoneOpen(false); setStage("notnow"); track("otp_skipped", { variant: mode }); };

  const onVerified = async (d) => {
    const s = sessionFrom(d);
    writeJson(SESSION_KEY, s); setSession(s); setPhoneOpen(false);
    identify(s.userId);
    track("otp_verified", { variant: mode });
    if (mode === "invite" && s.referralCode === code) return setStage("own");
    if (await isAccepted(s)) return setStage("already");
    accept(s);
  };

  // Desktop: arrow keys on the card
  useEffect(() => {
    if (stage !== "card" || phoneOpen) return;
    const onKey = (e) => {
      if (e.key === "ArrowRight") { e.preventDefault(); imIn(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); notNow(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const copyOwn = async () => {
    try { await navigator.clipboard.writeText(shareLink(eventId, code)); setNote("Link copied."); } catch { setNote("Couldn't copy the link."); }
  };

  const h1 = { fontSize: "22px", lineHeight: 1.2, fontWeight: 700, margin: "20px 0 6px" };
  const body = { color: T.mid, fontSize: "16px", lineHeight: 1.5, margin: "0 0 16px" };
  const title = mode === "invite" && sender && card ? `${sender.firstName} wants to go to ${card.title} | Tandem`
    : mode === "referral" && sender ? `${sender.firstName} invited you to Tandem` : card ? `${card.title} | Tandem` : "Tandem";

  return (
    <div className="aurora" style={{ minHeight: "100dvh", background: T.bg, color: T.high, fontFamily: font }}>
      <Helmet><title>{title}</title></Helmet>
      <main style={{ maxWidth: "420px", margin: "0 auto", padding: "0 16px calc(24px + env(safe-area-inset-bottom))" }}>
        <SiteHeader {...(deckStage ? { city, onCity: setCity } : {})} />

        {stage === "loading" && (
          <div aria-busy="true" style={{ marginTop: "24px", background: T.surface1, borderRadius: "16px", height: "480px" }} />
        )}

        {stage === "card" && card && (
          <>
            {mode === "invite"
              ? <><h1 style={h1}>{sender.firstName} is in for this</h1><p style={body}>{[card.title, card.day, card.area].filter(Boolean).join(" · ")}</p></>
              : <><h1 style={h1}>{card.title}</h1><p style={body}>{[card.day, card.area, card.price].filter(Boolean).join(" · ")}</p></>}
            <div style={{ borderRadius: "16px", overflow: "hidden", background: T.surface1 }}>
              {mode === "invite" && <Strip sender={sender} text={`${sender.firstName} is in`} />}
              <Card card={card} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "16px" }}>
              <button onClick={imIn} disabled={busy} style={{ ...pill(true), opacity: busy ? 0.4 : 1 }}>{busy ? "Saving…" : "I'm in"}</button>
              <button onClick={notNow} style={pill(false)}>Not now</button>
            </div>
          </>
        )}

        {(stage === "accepted" || stage === "saved" || stage === "already") && card && (
          <>
            <h1 style={h1}>
              {stage === "accepted" ? `You're in for ${card.title}` : stage === "saved" ? `Saved: ${card.title}` : "You're already in"}
            </h1>
            <p style={body}>
              {stage === "accepted" ? `${sender.firstName} will see it in Tandem. Get the app to plan it together, and allow contacts to find more friends.`
                : stage === "saved" ? "Get the app and allow contacts to see which friends want to go."
                : `${sender ? sender.firstName : "Your friend"} can see it in Tandem. Plan the rest in the app.`}
            </p>
            <div style={{ position: "relative" }}>
              <Chip text={stage === "saved" ? "Saved" : "You're in"} />
              <Card card={card} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "16px" }}>
              <button onClick={() => getApp(stage)} style={pill(true)}>Get the app</button>
              {stage !== "already" && (
                <button onClick={() => navigate(`/swipe?city=${encodeURIComponent(city)}`)} style={pill(false)}>
                  {stage === "saved" ? `See more in ${city}` : `Keep swiping in ${city}`}
                </button>
              )}
            </div>
            <OpenTandemLink onStuck={() => setStuck(true)} />
            {stage === "accepted" && (
              <p style={{ textAlign: "center", margin: "4px 0 0" }}><button onClick={() => setSendOpen(true)} style={textLink}>Send it to someone else</button></p>
            )}
          </>
        )}

        {stage === "own" && card && (
          <>
            <h1 style={h1}>This is your invite</h1>
            <p style={body}>Send it to someone you'd go with.</p>
            <Card card={card} />
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "16px" }}>
              <a href={whatsappUrl(shareText(card, shareLink(eventId, code)))} target="_blank" rel="noopener noreferrer" style={pill(true)}
                onClick={() => track("share_tapped", { eventId, channel: "whatsapp", own: true })}>Send on WhatsApp</a>
              <button onClick={copyOwn} style={pill(false)}>Copy link</button>
            </div>
            {note && <p role="status" style={{ color: T.mid, fontSize: "14px", textAlign: "center" }}>{note}</p>}
          </>
        )}

        {stage === "usedup" && card && (
          <>
            <h1 style={h1}>You've used your 35 web swipes</h1>
            <p style={body}>Save {card.title} in the app, and see which friends want to go.</p>
            <Card card={card} />
            <button onClick={() => getApp("event_swipes_used_up")} style={{ ...pill(true), marginTop: "16px" }}>Get the app</button>
            <OpenTandemLink onStuck={() => setStuck(true)} />
          </>
        )}

        {deckStage && (
          <>
            {stage === "referral" && sender && (
              <div style={{ marginTop: "16px", borderRadius: "16px", overflow: "hidden", background: T.surface1 }}>
                <Strip sender={sender} text={`${sender.firstName} invited you to Tandem`} />
                <p style={{ ...body, margin: 0, padding: "12px 14px", fontSize: "14px" }}>
                  Swipe on what's on in {city}. Get the app to match with {sender.firstName} and your other friends.
                </p>
              </div>
            )}
            {stage === "over" && card && (
              <div aria-hidden="true" style={{ marginTop: "16px", opacity: 0.4, display: "flex", gap: "12px", alignItems: "center", background: T.surface1, borderRadius: "16px", padding: "10px" }}>
                <div style={{ width: "48px", height: "64px", borderRadius: "6px", background: T.surface2, flexShrink: 0 }} />
                <div><p style={{ margin: 0, fontWeight: 700 }}>{card.title}</p><p style={{ margin: "2px 0 0", color: T.low, fontSize: "14px" }}>{metaLine(card)}</p></div>
              </div>
            )}
            {stage !== "referral" && (
              <>
                <h1 style={h1}>{stage === "notnow" ? "No worries" : stage === "over" ? "This one's over" : "This link doesn't work anymore"}</h1>
                <p style={body}>
                  {stage === "notnow" ? `Here's what else is on in ${city}.` : stage === "over" ? `Here's what's on in ${city} this weekend.` : `Here's what's on in ${city} instead.`}
                </p>
              </>
            )}
            {/* The deck fills a bounded column (handoff Layout); 100dvh minus header and the line above */}
            <div style={{ marginTop: stage === "referral" ? "16px" : 0, height: "calc(100dvh - 180px)", minHeight: "460px", display: "flex", flexDirection: "column" }}>
              <SwipeDeck city={city} />
            </div>
          </>
        )}

        {error && <p role="alert" style={{ color: T.fail, fontSize: "14px", marginTop: "12px" }}>{error}</p>}
      </main>

      {phoneOpen && (
        <PhoneSheet variant={mode === "invite" ? "invite" : "event"} sender={sender?.firstName} onClose={notNow} onVerified={onVerified}
          onGetApp={() => { setPhoneOpen(false); getApp("phone_sheet"); }} onStuck={() => setStuck(true)} />
      )}
      {sendOpen && card && (
        <SendSheet card={card} referralCode={session?.referralCode} onClose={() => setSendOpen(false)} onSent={(m) => { setSendOpen(false); setNote(m); }} />
      )}
      {match && card && (
        <MatchScreen match={match} card={card} onGetApp={() => { setMatch(null); getApp("match"); }}
          onKeepSwiping={() => setMatch(null)} onStuck={() => setStuck(true)} />
      )}
      {showPopup && <DesktopAppPrompt onClose={() => setShowPopup(false)} />}
      {stuck && <OpenInBrowser onClose={() => setStuck(false)} />}
    </div>
  );
}
