import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { WEB_SWIPE_LIMIT, PHONE_ASK_RIGHTS, PHONE_ASK_SWIPES, SOFT_PROMPTS } from "../lib/funnel";
import { isPhone } from "../lib/app";
import { DesktopAppPrompt, OpenInBrowser, OpenTandemLink, SoftPrompt, MatchScreen } from "./AppPrompts";
import PhoneSheet from "./PhoneSheet";
import SendSheet from "./SendSheet";
import { shareLink, shareText, canNativeShare } from "../lib/share";
import { track, identify } from "../lib/analytics";
import { call, AuthError } from "../lib/tandemApi";
import { SESSION_KEY, readJson, writeJson, loadSession, sessionFrom, creditReferral } from "../lib/session";
import { EventDetails } from "./EventCard";
import { Deck } from "./deck/Deck";
import { SwipeButtons } from "./deck/SwipeButtons";
import { fromPublic, fromPersonal, T, font } from "../lib/card";

const SWIPES_KEY = "webSwipes"; // swipes made before OTP, replayed in order after verifying
const SEEN_KEY = "webSeen"; // every card shown, so no card appears twice
const SEEN_MAX = 500;
const ASKED_KEY = "webPhoneAsked";
const SHARE_PROMPTED_KEY = "webSharePrompted";
const SOFT_SHOWN_KEY = "webSoftPromptsShown";
// Snapshot rule 3: the prerendered HTML holds the heading and a fixed-height placeholder, never live cards
const PRERENDER = typeof window !== "undefined" && new URLSearchParams(window.location.search).has("prerender");

const btn = (active = true) => ({
  width: "100%", minHeight: "48px", padding: "14px", borderRadius: "999px", border: "none", fontFamily: font, fontWeight: 700,
  fontSize: "16px", cursor: active ? "pointer" : "default", background: T.high, color: T.bg, opacity: active ? 1 : 0.4,
});

/**
 * The live deck (handoff 2.2 to 2.7): cards first, phone step, replay, share, app prompts. Used by
 * /swipe and the homepage (3.1), so swiping on the homepage runs the full Journey 1 flow.
 * The page owns the city (header chip) and the heading.
 */
export default function SwipeDeck({ city }) {
  const [session, setSession] = useState(loadSession);
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
  const [softAt, setSoftAt] = useState(null); // 10 or 25 while that banner shows
  const [match, setMatch] = useState(null); // { match: { firstName, photo }, card }
  const [stuck, setStuck] = useState(false); // "Open in browser"
  const [returnVisit, setReturnVisit] = useState(false); // logged-in visitor who came back already capped
  const firstLoad = useRef(true);
  const desk = typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches;
  const navigate = useNavigate();
  const commitRef = useRef(null); // the Deck's commit: buttons on event details swipe the same card
  const pendingAction = useRef(null);
  const loading = useRef(false);
  const replaying = useRef(false);

  const used = session && remaining !== null ? WEB_SWIPE_LIMIT - remaining : local.length;
  const capped = used >= WEB_SWIPE_LIMIT;
  const top = queue[0];

  const signOut = (msg) => { writeJson(SESSION_KEY, null); setSession(null); setError(msg); };

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
        if (firstLoad.current && data.remainingSwipes <= 0) setReturnVisit(true);
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
      firstLoad.current = false;
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
    track("card_viewed", { eventId: top.id, city, verified: !!session });
    const seen = readJson(SEEN_KEY, []);
    if (!seen.includes(top.id)) writeJson(SEEN_KEY, [...seen, top.id].slice(-SEEN_MAX));
  }, [top?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Every app prompt: phones go through /download (keeps the UTM tags), desktop gets the QR prompt
  const getApp = (from) => {
    track("install_cta_clicked", { from });
    if (isPhone()) navigate(`/download${window.location.search}`);
    else { setShowPopup(true); track("app_prompt_shown", { type: "desktop_qr", from }); }
  };

  // Soft prompts at 10 and 25 counted swipes, once each; the next swipe dismisses the banner
  const afterCount = (n) => {
    const shown = readJson(SOFT_SHOWN_KEY, []);
    if (SOFT_PROMPTS.includes(n) && !shown.includes(n)) { writeJson(SOFT_SHOWN_KEY, [...shown, n]); setSoftAt(n); track("app_prompt_shown", { type: `soft_${n}` }); }
    else setSoftAt(null);
  };

  const endOfDeck = feed === "ready" && !top && !capped;
  useEffect(() => { if (endOfDeck) track("end_of_deck", { city }); }, [endOfDeck]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!capped || PRERENDER) return;
    track("cap_reached", { verified: !!session });
    track("app_prompt_shown", { type: session && returnVisit ? "return_visit" : "hard_stop" });
  }, [capped]); // eslint-disable-line react-hooks/exhaustive-deps

  // Called once the card has flown off
  const onAction = async (action) => {
    const card = queue[0];
    if (!card) return;
    setQueue((q) => q.slice(1));
    track("swiped", { direction: action.toLowerCase(), eventId: card.id, city, verified: !!session });
    if (!session) {
      const list = [...local, { eventId: card.id, action, at: Date.now(), card: { id: card.id, title: card.title, day: card.day, time: card.time, area: card.area, poster: card.poster } }];
      writeJson(SWIPES_KEY, list); setLocal(list);
      afterCount(list.length);
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
      afterCount(WEB_SWIPE_LIMIT - data.remainingSwipes);
      if (data.match) { setMatch({ match: data.match, card }); track("match_shown", { eventId: card.id }); } // rare on the web: matching needs contacts
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
    const s = sessionFrom(data);
    setPhoneAsk(null);
    identify(s.userId);
    track("otp_verified", { variant: phoneAsk });
    const lastRight = [...readJson(SWIPES_KEY, [])].reverse().find((sw) => sw.action === "RIGHT" && sw.card)?.card;
    const saved = await replay(s);
    writeJson(SESSION_KEY, s); setSession(s);
    if (await creditReferral(s)) track("referral_credited", { from: "deck" }); // a friend's /r link from earlier
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
    track("share_tapped", { eventId: card.id, channel: "native", verified: !!session });
    try {
      await navigator.share({ text: shareText(card, link) });
      setToast("Sent. When they say they're in, you'll see it in the app.");
    } catch { /* closed the share sheet */ }
  };

  const closePhoneAsk = () => {
    track("otp_skipped", { variant: phoneAsk });
    if (phoneAsk !== "save") setToast("No problem. Keep swiping. Your swipes stay on this phone for now.");
    setPhoneAsk(null);
  };

  // Buttons and arrow keys: on the details page, close it first, then the card flies off
  const act = (action) => {
    if (!top || capped) return;
    if (details) { pendingAction.current = action; window.history.back(); return; }
    commitRef.current?.(action.toLowerCase());
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
      if (a) setTimeout(() => commitRef.current?.(a.toLowerCase()), 50);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);


  const left = totalUpcoming == null ? 0 : Math.max(0, totalUpcoming - used);
  const panel = { textAlign: "center", padding: "48px 16px", background: T.surface1, borderRadius: "16px" };
  const stopTitle = { fontSize: "28px", lineHeight: 1.15, fontWeight: 700, margin: "0 0 8px" };
  // Hard stop and return visit: a fanned stack of cards behind the message
  const fan = (
    <div aria-hidden="true" style={{ position: "relative", height: "220px", margin: "8px 0 28px" }}>
      <div style={{ position: "absolute", left: "50%", top: "16px", width: "140px", height: "186px", marginLeft: "-70px", borderRadius: "14px", background: T.surface1, transform: "rotate(-12deg) translateX(-66px)" }} />
      <div style={{ position: "absolute", left: "50%", top: "16px", width: "140px", height: "186px", marginLeft: "-70px", borderRadius: "14px", background: "#2E2E2E", transform: "rotate(12deg) translateX(66px)" }} />
      <div style={{ position: "absolute", left: "50%", top: 0, width: "150px", height: "200px", marginLeft: "-75px", borderRadius: "14px", background: "#3A1D8F", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-28px", right: "-28px", width: "100px", height: "100px", borderRadius: "50%", background: T.green }} />
      </div>
    </div>
  );

  return (
    <div style={{ color: T.high, fontFamily: font, display: "flex", flexDirection: "column", gap: "14px", flex: "1 1 auto", minHeight: 0 }}>
        <section aria-label={`Plans in ${city}`} style={{ display: "flex", flexDirection: "column", gap: "14px", flex: "1 1 auto", minHeight: 0 }}>
          <div className={top && !capped ? undefined : "deck-scroll"} style={{ position: "relative", display: "flex", flexDirection: "column", flex: "1 1 auto", minHeight: 0 }}>
            {capped ? (
              session && returnVisit ? (
              <div>
                {fan}
                <p style={stopTitle}>Welcome back</p>
                <p style={{ color: T.mid, fontSize: "16px", lineHeight: 1.5, margin: "0 0 24px" }}>Your swipes are saved. Get the app to keep going and see who's in.</p>
                <button onClick={() => getApp("return_visit")} className="pill" style={btn()}>Get the app</button>
                <OpenTandemLink onStuck={() => setStuck(true)} />
              </div>
              ) : (
              <div>
                {fan}
                <p style={stopTitle}>
                  {left >= 20 ? `${left} more plans in ${city} are waiting in the app.` : "Keep going in the app"}
                </p>
                <p style={{ color: T.mid, fontSize: "16px", lineHeight: 1.5, margin: "0 0 24px" }}>
                  {session
                    ? `You've used your ${WEB_SWIPE_LIMIT} web swipes, and they're saved. Download Tandem and allow contacts to see which friends want the same.`
                    : `You've used your ${WEB_SWIPE_LIMIT} web swipes. Download Tandem to keep going, or save these swipes with your number first.`}
                </p>
                <button onClick={() => getApp("hard_stop")} className="pill" style={btn()}>Download now</button>
                {!session && <button onClick={() => setPhoneAsk("save")} style={{ ...btn(), background: T.surface2, color: T.high, marginTop: "10px" }}>Save my swipes first</button>}
                <OpenTandemLink onStuck={() => setStuck(true)} />
              </div>
              )
            ) : top ? (
              <>
                <Deck cards={queue} index={0} commitRef={commitRef} desk={desk}
                  locked={!!(phoneAsk || sendCard || match || showPopup || details)}
                  onSwipe={(dir) => onAction(dir.toUpperCase())} onOpenDetails={openDetails} onShare={share} />
              </>
            ) : feed === "loading" ? (
              // J1-06a: skeleton card, round buttons visible but disabled
              <div aria-busy="true" style={{ display: "flex", flexDirection: "column", gap: "14px", flex: "1 1 auto", minHeight: 0 }}>
                <div className="card" style={{ flex: "1 1 auto", height: "auto", minHeight: 0 }}>
                  <div className="card-poster" />
                  <p style={{ color: T.low, fontSize: "14px", margin: "14px 16px 16px" }}>Finding what's on in {city}...</p>
                </div>
                <SwipeButtons disabled desk={desk} onLeft={() => {}} onDown={() => {}} onRight={() => {}} />
              </div>
            ) : feed === "error" ? (
              <div style={panel}>
                <p style={{ fontSize: "22px", fontWeight: 700, marginBottom: "6px" }}>Couldn't load plans</p>
                <p style={{ color: T.mid, fontSize: "16px", marginBottom: "20px" }}>Check your connection and try again.</p>
                <button onClick={() => loadMore(true)} className="pill" style={btn()}>Retry</button>
              </div>
            ) : (
              <div style={{ ...panel, background: "transparent", border: `2px dashed ${T.surface2}` }}>
                <p style={{ fontSize: "22px", fontWeight: 700, marginBottom: "6px" }}>That's everything on in {city} right now</p>
                <p style={{ color: T.mid, fontSize: "16px", marginBottom: "20px" }}>New plans land every day. In the app, you see them first, and which friends are in.</p>
                <button onClick={() => getApp("end_of_deck")} className="pill" style={btn()}>Get the app</button>
              </div>
            )}
          </div>

          {top && !capped && (
            <>
              {softAt && !phoneAsk && !sendCard && !match && (
                <SoftPrompt at={softAt} onGetApp={() => { setSoftAt(null); getApp(`soft_${softAt}`); }} onLater={() => setSoftAt(null)} />
              )}
            </>
          )}

          <div className="progress">
            <div className="bar" role="progressbar" aria-label="Web swipes used" aria-valuemin={0} aria-valuemax={WEB_SWIPE_LIMIT} aria-valuenow={Math.min(used, WEB_SWIPE_LIMIT)}>
              <div className="fill" style={{ width: `${Math.min(100, (used / WEB_SWIPE_LIMIT) * 100)}%` }} />
            </div>
            {Math.min(used, WEB_SWIPE_LIMIT)}/{WEB_SWIPE_LIMIT}
          </div>
        </section>

        {error && <p role="alert" style={{ color: T.fail, marginTop: "12px", fontSize: "14px" }}>{error}</p>}

      {details && (
        <EventDetails card={details} onBack={() => window.history.back()} onShare={() => share(details)}
          actions={<SwipeButtons desk={desk} disabled={capped} onLeft={() => act("LEFT")} onDown={() => act("DOWN")} onRight={() => act("RIGHT")} />} />
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
          onGetApp={() => { setPhoneAsk(null); getApp("phone_sheet"); }} onStuck={() => setStuck(true)} />
      )}

      {match && (
        <MatchScreen match={match.match} card={match.card} onGetApp={() => { setMatch(null); getApp("match"); }}
          onKeepSwiping={() => setMatch(null)} onStuck={() => setStuck(true)} />
      )}

      {showPopup && <DesktopAppPrompt onClose={() => setShowPopup(false)} />}
      {stuck && <OpenInBrowser onClose={() => setStuck(false)} />}
    </div>
  );
}
