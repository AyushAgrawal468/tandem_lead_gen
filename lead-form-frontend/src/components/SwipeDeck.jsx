import React, { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { FUNNEL } from "../lib/funnel.config.js";
import { reducer, initial } from "../lib/funnel.reducer.js";
import { isPhone } from "../lib/app";
import { Bridge, DesktopAppPrompt, OpenInBrowser, OpenTandemLink, SoftPrompt, MatchScreen } from "./AppPrompts";
import { SUPPORTED_CITIES } from "../lib/city";
import PhoneSheet from "./PhoneSheet";
import SendSheet from "./SendSheet";
import { shareLink, shareText, canNativeShare } from "../lib/share";
import { track, identify } from "../lib/analytics";
import { call, AuthError } from "../lib/tandemApi";
import { SESSION_KEY, readJson, writeJson, loadSession, sessionFrom, creditReferral, pendingInvite, clearInvite } from "../lib/session";
import { EventDetails } from "./EventCard";
import { Deck } from "./deck/Deck";
import { SwipeButtons } from "./deck/SwipeButtons";
import { XIcon } from "./deck/parts";
import { fromPublic, fromPersonal, T, font } from "../lib/card";

// Handoff "What the browser stores"
const K = { swipes: "tdm.swipes", count: "tdm.count", neverToast: "tdm.neverToast", rights: "tdm.rights", asked: "tdm.asked", shareAsked: "tdm.shareAsked",
  softShown: "tdm.softShown", seen: "tdm.seen", pending: "tdm.pending", lastRight: "tdm.lastRight" };
const SEEN_MS = 30 * 864e5; // tdm.seen entries last 30 days
const LIMIT = FUNNEL.SWIPE_LIMIT;
const LABEL = { RIGHT: "I'm in", LEFT: "Not now", DOWN: "Never" };
// Snapshot rule 3: the prerendered HTML holds the heading and a fixed-height placeholder, never live cards
const PRERENDER = typeof window !== "undefined" && new URLSearchParams(window.location.search).has("prerender");

const btn = (active = true) => ({
  width: "100%", minHeight: "48px", padding: "14px", borderRadius: "999px", border: "none", fontFamily: font, fontWeight: 700,
  fontSize: "16px", cursor: active ? "pointer" : "default", background: T.high, color: T.bg, opacity: active ? 1 : 0.4,
});

const stored = () => ({
  count: readJson(K.count, 0), rights: readJson(K.rights, 0), swipes: readJson(K.swipes, []),
  token: loadSession()?.token, asked: readJson(K.asked, false), shareAsked: readJson(K.shareAsked, false), softShown: readJson(K.softShown, []),
});
const freshSeen = () => Object.fromEntries(Object.entries(readJson(K.seen, {})).filter(([, t]) => t > Date.now() - SEEN_MS));
const markSeen = (id) => { const seen = freshSeen(); if (!seen[id]) writeJson(K.seen, { ...seen, [id]: Date.now() }); };
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * The live deck (handoff "Funnel logic" + "Edge cases"): every screen decision comes from the
 * handoff's reducer; overlays show one at a time (match, phone ask, you're in, send to friend, soft
 * prompts). Used by /, /swipe and the city pages. The page owns the city (header chip) and heading.
 */
export default function SwipeDeck({ city, onCity, panY, onSignedIn, stripSlot }) {
  const [s, dispatch] = useReducer(reducer, null, () => initial(stored()));
  const [session, setSession] = useState(loadSession);
  const [queue, setQueue] = useState([]); // cards still to swipe; queue[0] is the top card
  const [cursor, setCursor] = useState(null); // next public-feed page, null when there is none
  const [feed, setFeed] = useState("loading"); // loading | ready | error
  const [details, setDetails] = useState(null);
  const [invite, setInvite] = useState(null); // LP-08: the pending invite's card, shown as a strip until answered or dismissed
  const [saveAsk, setSaveAsk] = useState(false); // "Save my swipes first" from the hard stop
  const [sendCard, setSendCard] = useState(null); // card in the Send sheet (share button)
  const [showPopup, setShowPopup] = useState(false);
  const [toast, setToast] = useState(null);
  const [said, setSaid] = useState(""); // the polite live region
  const [totalUpcoming, setTotalUpcoming] = useState(null);
  const [stuck, setStuck] = useState(false);
  const [returnVisit, setReturnVisit] = useState(false); // came back already capped
  const navigate = useNavigate();
  const commitRef = useRef(null); // the Deck's commit: event details' buttons swipe the same card
  const pendingAction = useRef(null);
  const loading = useRef(false);
  const flushing = useRef(false);
  const startedAt = useRef(Date.now());
  const desk = typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches;

  const top = queue[0];
  const overlay = s.queue[0];
  const capped = s.screen === "hardStop";

  // Coming back with swipes left (KIT toasts: "Return visit, not capped")
  // LP-09: the page shows "Signed in as {masked} · {n} swipes saved" above the heading
  useEffect(() => { onSignedIn?.(session?.masked ? { masked: session.masked, count: s.count } : null); }, [session, s.count]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { if (s.count > 0 && s.count < LIMIT) setToast("Welcome back. Pick up where you left off."); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Persist what the reducer owns: counts and asks are lifetime, never cleared
  useEffect(() => {
    writeJson(K.count, s.count); writeJson(K.rights, s.rights); writeJson(K.swipes, s.swipes.length ? s.swipes : null);
    writeJson(K.asked, s.asked); writeJson(K.shareAsked, s.shareAsked); writeJson(K.softShown, s.softShown);
  }, [s.count, s.rights, s.swipes, s.asked, s.shareAsked, s.softShown]);

  // Toasts: 3 s, one at a time. "You're in" is a queued overlay shown as a toast.
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), FUNNEL.TOAST_MS);
    return () => clearTimeout(t);
  }, [toast]);
  useEffect(() => {
    if (overlay?.type !== "youreIn") return;
    const t = setTimeout(() => dispatch({ type: "DISMISS" }), FUNNEL.TOAST_MS);
    return () => clearTimeout(t);
  }, [overlay]);

  const signOut = (msg) => { writeJson(SESSION_KEY, null); setSession(null); setToast(msg); };
  const serverCount = (remaining) => { if (remaining != null) dispatch({ type: "SERVER_COUNT", used: LIMIT - remaining }); };

  // Before verify: the public feed, page by page. After: the personal web feed (knows past swipes and
  // reports remainingSwipes, so after verify the server's count wins).
  const loadMore = useCallback(async (reset) => {
    if (loading.current) return;
    loading.current = true;
    if (reset) { setQueue([]); setFeed("loading"); }
    try {
      const seen = freshSeen();
      const add = (cards) => setQueue((q) => (reset ? cards : [...q, ...cards.filter((c) => !q.some((x) => x.id === c.id))]));
      if (session) {
        const data = await call("/events/web/feed", { token: session.token, method: "POST", body: { eventFilters: { location: city } } });
        serverCount(data.remainingSwipes);
        if (reset && data.remainingSwipes <= 0) setReturnVisit(true);
        add((data.events || []).map(fromPersonal).filter((c) => c.id && !seen[c.id]));
        setCursor(null);
      } else {
        let next = reset ? "" : cursor, cards = [], pages = 0;
        // Skip pages that are all already-seen cards (a return visitor), at most 3 per load
        while (next !== null && cards.length < FUNNEL.PREFETCH_AT && pages++ < 3) {
          const data = await call(`/events/public/feed?city=${encodeURIComponent(city)}${next ? `&cursor=${encodeURIComponent(next)}` : ""}`);
          cards.push(...(data.events || []).map(fromPublic).filter((c) => c.id && !seen[c.id]));
          next = data.next_cursor ?? null;
          if (data.total_upcoming != null) setTotalUpcoming(data.total_upcoming);
        }
        add(cards);
        setCursor(next);
      }
      if (reset) await loadInvite();
      setFeed("ready");
    } catch (err) {
      if (err instanceof AuthError) signOut("Session expired, please log in again.");
      else setFeed("error");
    } finally { loading.current = false; }
  }, [session, city, cursor]);

  // LP-08: a pending invite (from /l/links) shows as a strip above the deck. Gone or started → dropped.
  const loadInvite = async () => {
    const inv = pendingInvite();
    if (!inv) return;
    try {
      const d = await call(`/events/public/link?eventId=${encodeURIComponent(inv.eventId)}&code=${encodeURIComponent(inv.code)}`);
      if (!d.event || d.eventOver) { clearInvite(); return; }
      const card = { ...fromPublic(d.event), strip: d.sender?.firstName || "A friend", invite: inv };
      setInvite(card);
    } catch { /* the deck works without it */ }
  };

  useEffect(() => {
    if (PRERENDER) { window.__PRERENDER_READY = true; return; }
    loadMore(true);
  }, [city, session?.token]); // eslint-disable-line react-hooks/exhaustive-deps

  // "Fetch the next page when 4 cards remain"
  useEffect(() => { if (feed === "ready" && !session && queue.length <= FUNNEL.PREFETCH_AT && cursor !== null) loadMore(false); }, [queue.length, cursor, feed]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!top) return;
    track("card_viewed", { event_id: top.id, position: s.count + 1, category: top.category });
    markSeen(top.id);
  }, [top?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const endOfDeck = feed === "ready" && !top && !capped;
  useEffect(() => { if (endOfDeck) track("end_of_deck", { count: s.count, verified: !!session }); }, [endOfDeck]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!capped || PRERENDER) return;
    track("cap_reached", { count: s.count, verified: !!session });
    track("app_prompt_shown", { type: session && returnVisit ? "return" : "hard_stop" });
  }, [capped]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (overlay?.type === "phoneAsk") track("phone_ask_shown", { trigger: overlay.picky ? "total" : "rights" });
    else if (overlay?.type === "soft10" || overlay?.type === "soft25") track("app_prompt_shown", { type: overlay.type });
    else if (overlay?.type === "match") track("match_shown", { event_id: overlay.eventId });
  }, [overlay]);

  // Phones go through /download (keeps the UTM tags); desktop gets the QR prompt
  const getApp = (type) => {
    track("install_cta_clicked", { type, platform: isPhone() ? "phone" : "desktop" });
    if (isPhone()) navigate(`/download${window.location.search}`);
    else { setShowPopup(true); track("app_prompt_shown", { type: "desktop_qr", from: type }); }
  };

  // Verified saves that failed, happened offline, or wait for replay sit in tdm.pending and go out in
  // order with 1, 2, 4 s backoff. clientTs travels with each save as its idempotency key.
  const flush = async (sess = session) => {
    if (!sess || flushing.current) return;
    flushing.current = true;
    let list = readJson(K.pending, []), tries = 0;
    try {
      while (list.length && navigator.onLine !== false) {
        const sw = list[0];
        try {
          const inv = pendingInvite();
          const inviteRef = inv && inv.eventId === sw.event_id && sw.direction === "RIGHT" ? { referralCode: inv.code, eventId: inv.eventId } : undefined;
          const r = await call("/events/web/saveAction", { token: sess.token, method: "POST",
            body: { eventId: sw.event_id, action: sw.direction, clientTs: sw.client_ts, inviteRef } });
          if (inviteRef) clearInvite();
          serverCount(r.remainingSwipes);
          if (r.match) dispatch({ type: "REPLAY_MATCH", match: { eventId: sw.event_id, match: r.match, card: sw.card } });
          list = list.slice(1); writeJson(K.pending, list.length ? list : null); tries = 0;
          if (r.limitReached) { list = []; writeJson(K.pending, null); }
        } catch (err) {
          if (err instanceof AuthError) { signOut("Session expired, please log in again."); return; }
          if (err.data?.code === "EVENT_OVER" || err.status === 410) { list = list.slice(1); writeJson(K.pending, list.length ? list : null); continue; }
          if (++tries > 3) return; // the rest waits for the next flush (online event, next visit)
          await wait(1000 * 2 ** (tries - 1));
        }
      }
    } finally { flushing.current = false; }
  };
  useEffect(() => {
    const online = () => flush();
    window.addEventListener("online", online);
    if (session && readJson(K.pending, []).length) flush();
    return () => window.removeEventListener("online", online);
  }, [session?.token]); // eslint-disable-line react-hooks/exhaustive-deps

  // Called once the card has flown off (the Deck's onSwipe)
  const onAction = async (direction, method) => {
    const card = queue[0];
    if (!card) return;
    const next = queue[1];
    setQueue((q) => q.slice(1));
    if (direction === "RIGHT") writeJson(K.lastRight, { id: card.id, title: card.title, day: card.day, time: card.time, area: card.area, price: card.price, poster: card.poster });
    track("swiped", { event_id: card.id, direction, method, count: s.count + 1 });
    if (direction === "DOWN" && !readJson(K.neverToast, false)) { writeJson(K.neverToast, true); setToast("Got it. You'll see less like this."); }
    setSaid(`Saved as ${LABEL[direction]}. ${Math.min(s.count + 1, LIMIT)} of ${LIMIT}.${next ? ` Next: ${next.title}.` : ""}`);
    // Any answer to the invite card clears it; an unverified I'm in keeps it for the replay's inviteRef
    if (card.invite && (session || direction !== "RIGHT")) clearInvite();
    if (!session) { dispatch({ type: "SWIPED", direction, eventId: card.id, card: { id: card.id, title: card.title, day: card.day, poster: card.poster } }); return; }

    const sw = { event_id: card.id, direction, client_ts: Date.now(), card: { id: card.id, title: card.title, day: card.day, poster: card.poster } };
    if (navigator.onLine === false) {
      dispatch({ type: "SWIPED", direction, eventId: card.id });
      writeJson(K.pending, [...readJson(K.pending, []), sw]);
      setToast("You're offline. Swipes will save when you're back.");
      return;
    }
    try {
      const inviteRef = card.invite && direction === "RIGHT" ? { referralCode: card.invite.code, eventId: card.id } : undefined;
      const r = await call("/events/web/saveAction", { token: session.token, method: "POST", body: { eventId: card.id, action: direction, clientTs: sw.client_ts, inviteRef } });
      dispatch({ type: "SWIPED", direction, eventId: card.id, match: r.match ? { eventId: card.id, match: r.match, card } : undefined });
      serverCount(r.remainingSwipes);
    } catch (err) {
      if (err instanceof AuthError) { signOut("Session expired, please log in again."); return; }
      if (err.data?.code === "EVENT_OVER" || err.status === 410) { setToast("That one just started."); return; }
      if (err.data?.code === "SWIPE_LIMIT") { dispatch({ type: "SERVER_COUNT", used: LIMIT }); return; }
      dispatch({ type: "SWIPED", direction, eventId: card.id });
      writeJson(K.pending, [...readJson(K.pending, []), sw]);
      setToast(err.status === 429 ? "Hang on a sec. Too many requests. Try again in a minute." : "Couldn't save that swipe. Trying again.");
      flush();
    }
  };

  // After verify: replay every stored swipe through saveAction in order, one at a time, then clear
  // them; the reloaded personal feed reports the server's count. A replay match shows before You're in.
  const onVerified = async (data, masked) => {
    const sess = sessionFrom(data, masked);
    identify(sess.userId);
    track("otp_verified", { is_new_user: !!data.is_new_user });
    writeJson(K.pending, [...readJson(K.pending, []), ...s.swipes]);
    writeJson(SESSION_KEY, sess);
    setSaveAsk(false);
    dispatch({ type: "VERIFIED" });
    await flush(sess);
    // The server's count wins (GET /events/web/swipesRemaining; the reloaded feed reports it too)
    try { serverCount((await call("/events/web/swipesRemaining", { token: sess.token })).remainingSwipes); } catch { /* older backend */ }
    setSession(sess);
    if (await creditReferral(sess)) track("referral_credited", { link: "r" });
  };

  // Card share button: the phone's share sheet, or the Send sheet (WhatsApp Web + Copy link) elsewhere
  const share = async (card) => {
    if (!canNativeShare()) { setSendCard(card); return; }
    track("share_tapped", { event_id: card.id, channel: "share_sheet", verified: !!session });
    try {
      await navigator.share({ text: shareText(card, shareLink(card.id, session?.referralCode)) });
      setToast("Sent. When they say they're in, you'll see it in the app.");
    } catch { /* closed the share sheet */ }
  };

  const closePhoneAsk = () => {
    track("otp_skipped", { trigger: overlay?.picky ? "total" : "rights" });
    dispatch({ type: "DISMISS" });
    setToast("No problem. Keep swiping. Your swipes stay on this phone for now.");
  };

  // Event details buttons: close details, then the same card flies off
  const act = (direction) => {
    if (!top || capped) return;
    if (details) { pendingAction.current = direction; window.history.back(); return; }
    commitRef.current?.(direction.toLowerCase());
  };
  const openDetails = () => {
    if (!top) return;
    track("event_details_opened", { event_id: top.id });
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

  const left = totalUpcoming == null ? 0 : Math.max(0, totalUpcoming - s.count);
  const quickLook = Date.now() - startedAt.current < 2 * 60 * 1000; // J1-16b: 35 swipes in under about 2 minutes
  // End states fill the hero down to the progress bar, buttons at the bottom (canvas LP-05); taller content scrolls
  const panel = { textAlign: "center", padding: "40px 16px", background: T.surface1, border: `1px solid ${T.line}`, borderRadius: "22px",
    flex: "1 0 auto", display: "flex", flexDirection: "column" };
  const push = <div aria-hidden="true" style={{ flex: "1 1 auto", minHeight: "8px" }} />;
  const stopTitle = { fontSize: "28px", lineHeight: 1.1, fontWeight: 800, fontStretch: "112%", margin: "0 0 8px" };
  const lastRight = readJson(K.lastRight, null);
  const sheetOpen = (overlay && overlay.type !== "youreIn") || sendCard || saveAsk;

  return (
    <div style={{ position: "relative", color: T.high, fontFamily: font, display: "flex", flexDirection: "column", gap: "14px", flex: "1 1 auto", minHeight: 0 }}>
      <section aria-label={`Plans in ${city}`} style={{ display: "flex", flexDirection: "column", gap: "14px", flex: "1 1 auto", minHeight: 0 }}>
        {/* LP-08: tap puts the invite card on top (it carries the friend strip); x drops the invite.
            Above the big words when the page gives a slot (DeckScreen), else right above the deck */}
        {invite && !capped && ((strip) => (stripSlot ? createPortal(strip, stripSlot) : strip))(
          <div className="invite-strip">
            <button onClick={() => { setQueue((q) => [invite, ...q.filter((c) => c.id !== invite.id)]); setInvite(null); }}>
              <span className="avatar">{invite.strip[0]}</span>
              <span><b>{invite.strip} is in for {invite.title}.</b> Tap to answer.</span>
            </button>
            <button onClick={() => { clearInvite(); setInvite(null); }} aria-label="Dismiss invite" className="invite-x"><XIcon /></button>
          </div>
        )}
        <div className={top && !capped ? undefined : "deck-scroll"} style={{ position: "relative", display: "flex", flexDirection: "column", flex: "1 1 auto", minHeight: 0 }}>
          {capped ? (
            session && returnVisit ? (
              // J1-22: return after the cap
              <div style={panel}>
                <p style={stopTitle}>Welcome back</p>
                <p style={{ color: T.mid, fontSize: "16px", lineHeight: 1.5, margin: "0 0 24px" }}>Your swipes are saved. Get the app to keep going and see who's in.</p>
                {push}
                <button onClick={() => getApp("return")} className="pill" style={btn()}>Get Tandem free</button>
                <OpenTandemLink onStuck={() => setStuck(true)} />
                <Bridge />
              </div>
            ) : (
              // J1-16a / J1-16b / J1-17: hard stop, verified or not, normal or quick look
              <div style={panel}>
                <div className="stop-stack" aria-hidden="true">
                  <i /><i /><i /><i />
                  <b><span>{left >= FUNNEL.HARD_STOP_LOW && !quickLook ? `${left}+` : "New"}</span>plans</b>
                </div>
                <p style={stopTitle}>
                  {left >= FUNNEL.HARD_STOP_LOW && !quickLook ? `${left}+ more plans in ${city} are waiting in the app` : "Keep going in the app"}
                </p>
                <p style={{ color: T.mid, fontSize: "16px", lineHeight: 1.5, margin: "0 0 24px" }}>
                  {!session ? `You've used your ${LIMIT} web swipes. Download Tandem to keep going, or save these swipes with your number first.`
                    : left >= FUNNEL.HARD_STOP_LOW && !quickLook ? `You've used your ${LIMIT} web swipes, and all ${LIMIT} are saved.`
                    : `You've used your ${LIMIT} web swipes, and they're saved. New plans land every day, and the app shows you first.`}
                </p>
                {push}
                <button onClick={() => getApp("hard_stop")} className="pill" style={btn()}>Get Tandem free</button>
                {!session && <button onClick={() => { setSaveAsk(true); track("phone_ask_shown", { trigger: "hard_stop" }); }}
                  style={{ ...btn(), background: T.surface2, color: T.high, marginTop: "10px" }}>Save my swipes first</button>}
                {session && <><OpenTandemLink onStuck={() => setStuck(true)} /><Bridge /></>}
              </div>
            )
          ) : top ? (
            <Deck cards={queue} index={0} commitRef={commitRef} desk={desk} panY={panY}
              beforeButtons={(overlay?.type === "soft10" || overlay?.type === "soft25") && (
                <SoftPrompt at={overlay.type === "soft25" ? 25 : 10} onLater={() => dispatch({ type: "DISMISS" })}
                  onGetApp={() => { dispatch({ type: "DISMISS" }); getApp(overlay.type); }} />
              )}
              locked={!!sheetOpen || (overlay && overlay.type.startsWith("soft")) || showPopup || !!details}
              onSwipe={(dir, method) => onAction(dir.toUpperCase(), method)} onOpenDetails={openDetails} onShare={share} />
          ) : feed === "loading" ? (
            // J1-06a: skeleton card, round buttons visible but disabled
            <div aria-busy="true" style={{ display: "flex", flexDirection: "column", gap: "14px", flex: "1 1 auto", minHeight: 0 }}>
              <div className="card" style={{ flex: "1 1 auto", height: "auto", minHeight: 0 }}>
                <div className="card-poster" />
                <p style={{ color: T.low, fontSize: "14px", margin: "14px 16px 16px" }}>Finding what's on in {city}…</p>
              </div>
              <SwipeButtons disabled desk={desk} onLeft={() => {}} onDown={() => {}} onRight={() => {}} />
            </div>
          ) : feed === "error" ? (
            // J1-06b
            <div style={panel}>
              <p style={{ fontSize: "22px", fontWeight: 800, margin: "0 0 6px" }}>Couldn't load plans</p>
              <p style={{ color: T.mid, fontSize: "16px", margin: "0 0 20px" }}>Check your connection and try again.</p>
              {push}
              <button onClick={() => loadMore(true)} className="pill" style={btn()}>Retry</button>
            </div>
          ) : (
            // J1-18: end of deck
            <div style={panel}>
              <p style={{ fontSize: "22px", fontWeight: 800, margin: "0 0 6px" }}>That's everything on in {city} right now</p>
              <p style={{ color: T.mid, fontSize: "16px", margin: "0 0 20px" }}>New plans land every day. In the app, you see them first, and which friends are in.</p>
              {push}
              <button onClick={() => getApp("end_of_deck")} className="pill" style={btn()}>Get Tandem free</button>
              {onCity && (
                <>
                  <p style={{ color: T.low, fontSize: "14px", margin: "24px 0 10px" }}>Try another city</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center" }}>
                    {SUPPORTED_CITIES.filter((c) => c !== city).slice(0, 4).map((c) => (
                      <button key={c} onClick={() => onCity(c)} className="city-chip">{c}</button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>



        <div className="progress">
          <div className="bar" role="progressbar" aria-label="Web swipes used" aria-valuemin={0} aria-valuemax={LIMIT} aria-valuenow={Math.min(s.count, LIMIT)}>
            <div className="fill" style={{ transform: `scaleX(${Math.min(1, s.count / LIMIT)})` }} />
          </div>
          {Math.min(s.count, LIMIT)}/{LIMIT}
        </div>
      </section>

      {/* One polite live region for swipes and toasts */}
      <p aria-live="polite" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)", margin: 0 }}>{toast || said}</p>

      {details && (
        <EventDetails card={details} onBack={() => window.history.back()} onShare={() => share(details)}
          actions={<SwipeButtons desk={desk} disabled={capped} onLeft={() => act("LEFT")} onDown={() => act("DOWN")} onRight={() => act("RIGHT")} />} />
      )}

      {/* Toast pill (handoff "Toast"): never over a sheet or modal; placed by .deck-toast */}
      {(toast || overlay?.type === "youreIn") && !sheetOpen && (
        overlay?.type === "youreIn" ? (
          // J1-12: a status card, not a pill
          <div role="status" className="deck-toast youre-in toast-in">
            <span className="ok" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L19 7" /></svg></span>
            <div><b>You're in</b>{overlay.saved
              ? `${overlay.saved} swipes saved to ${(session || loadSession())?.masked || "your number"}. Sign in to the app with this number to see which friends want the same.`
              : "Swipe right on anything you'd do."}</div>
          </div>
        ) : <div role="status" className="deck-toast toast-in">{toast}</div>
      )}

      {overlay?.type === "phoneAsk" && (
        <PhoneSheet variant={overlay.picky ? "picky" : "normal"} rights={FUNNEL.PHONE_ASK_RIGHTS} onClose={closePhoneAsk} onVerified={onVerified}
          onGetApp={() => { dispatch({ type: "DISMISS" }); getApp("phone_sheet"); }} onStuck={() => setStuck(true)} />
      )}
      {saveAsk && (
        <PhoneSheet variant="save" rights={FUNNEL.PHONE_ASK_RIGHTS} onClose={() => { setSaveAsk(false); track("otp_skipped", { trigger: "hard_stop" }); }}
          onVerified={onVerified} onGetApp={() => { setSaveAsk(false); getApp("phone_sheet"); }} onStuck={() => setStuck(true)} />
      )}

      {overlay?.type === "match" && (
        <MatchScreen match={overlay.match} card={overlay.card} onGetApp={() => { dispatch({ type: "DISMISS" }); getApp("match"); }}
          onKeepSwiping={() => dispatch({ type: "DISMISS" })} onStuck={() => setStuck(true)} />
      )}

      {/* Send to friend: once per user ever, after You're in, with their latest I'm in */}
      {overlay?.type === "sendToFriend" && (lastRight
        ? <SendSheet card={lastRight} referralCode={session?.referralCode} onClose={() => dispatch({ type: "DISMISS" })}
            onSent={(msg) => { dispatch({ type: "DISMISS" }); setToast(msg); }} />
        : <AutoDismiss onDone={() => dispatch({ type: "DISMISS" })} />)}

      {sendCard && (
        <SendSheet card={sendCard} referralCode={session?.referralCode} onClose={() => setSendCard(null)}
          onSent={(msg) => { setSendCard(null); setToast(msg); }} />
      )}

      {showPopup && <DesktopAppPrompt onClose={() => setShowPopup(false)} />}
      {stuck && <OpenInBrowser onClose={() => setStuck(false)} />}
    </div>
  );
}

// No right swipe yet: nothing to send, so the send-to-friend step passes
function AutoDismiss({ onDone }) {
  useEffect(() => { onDone(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}
