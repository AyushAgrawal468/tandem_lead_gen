import React, { useCallback, useEffect, useRef, useState } from "react";
import { EventDetails } from "./EventCard";
import { CategoryBadge, PosterFallback } from "./deck/parts";
import { DesktopAppPrompt } from "./AppPrompts";
import { call } from "../lib/tandemApi";
import { fromPublic, PRIMARY } from "../lib/card";
import { plansCount } from "../lib/feed";
import { track } from "../lib/analytics";

const PRERENDER = typeof window !== "undefined" && new URLSearchParams(window.location.search).has("prerender");

/**
 * Every upcoming plan in the city, under the /swipe deck: a grid (2 / 3 / 4 a row) that loads the next page of the
 * public feed as you near the bottom, until the feed ends, so the full 500+ shows, not only the 35 web swipes.
 * A tile opens the event details; its ask is the app (the swipe buttons there belong to the deck's top card).
 */
export default function AllEvents({ city }) {
  const [cards, setCards] = useState([]);
  const [total, setTotal] = useState(null);
  const [state, setState] = useState("idle"); // idle | loading | done | error
  const [details, setDetails] = useState(null);
  const [qr, setQr] = useState(false);
  const cursor = useRef(null);
  const end = useRef(null);
  const busy = useRef(false);

  const load = useCallback(async (reset = false) => {
    if (busy.current || PRERENDER) return;
    busy.current = true; setState("loading");
    try {
      const q = new URLSearchParams({ city });
      if (!reset && cursor.current) q.set("cursor", cursor.current);
      const d = await call(`/events/public/feed?${q}`);
      const page = (d.events || []).map(fromPublic).filter((c) => c.id);
      if (d.total_upcoming != null) setTotal(d.total_upcoming);
      setCards((prev) => {
        const seen = new Set(reset ? [] : prev.map((c) => c.id));
        return [...(reset ? [] : prev), ...page.filter((c) => !seen.has(c.id) && seen.add(c.id))];
      });
      cursor.current = d.next_cursor || null;
      setState(cursor.current && page.length ? "idle" : "done");
    } catch { setState("error"); } finally { busy.current = false; }
  }, [city]);

  // New city: start over
  useEffect(() => { cursor.current = null; setCards([]); setTotal(null); load(true); }, [city]); // eslint-disable-line react-hooks/exhaustive-deps

  // Near the bottom (600px ahead): next page. Re-armed after each page so a tall screen keeps filling.
  useEffect(() => {
    if (state !== "idle" || !end.current) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) load(); }, { rootMargin: "600px 0px" });
    io.observe(end.current);
    return () => io.disconnect();
  }, [state, cards.length, load]);

  // Details sit on the history stack, so the phone's back button closes them
  const open = (c) => {
    track("event_details_opened", { event_id: c.id, source: "all_events" });
    window.history.pushState({ tandemDetails: c.id }, "");
    setDetails(c);
  };
  useEffect(() => {
    const onPop = () => setDetails(null);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // Phones go to /download (the right store); a mouse gets the QR prompt
  const getApp = (e) => {
    track("install_cta_clicked", { source: "all_events" });
    if (window.matchMedia("(pointer: coarse)").matches) return;
    e.preventDefault(); setQr(true);
  };

  if (PRERENDER) return null;
  return (
    <section className="all-events" aria-labelledby="all-events-title">
      <h2 id="all-events-title">{total ? `${plansCount(total)} plans in ${city}` : `Everything on in ${city}`}</h2>
      <p className="all-events-sub">Tap any plan for the details. Swipe on them all in the app.</p>
      <ul className="all-grid">
        {cards.map((c) => (
          <li key={c.id}>
            <button type="button" className="rail-card" onClick={() => open(c)} aria-label={[c.title, c.day].filter(Boolean).join(", ")}>
              <div className="rail-poster">
                <PosterFallback title={c.title} category={c.category} />
                {c.poster && <img src={c.poster} alt="" loading="lazy" onError={(e) => { e.currentTarget.style.display = "none"; }} />}
              </div>
              <CategoryBadge category={c.category} />
              {c.tag && <span className="card-tag">{c.tag}</span>}
              <div className="rail-info">
                <b>{c.title}</b>
                {c.day && <span>{c.day}</span>}
                {c.price && <span className="price">{c.price}</span>}
              </div>
            </button>
          </li>
        ))}
      </ul>
      <div ref={end} aria-hidden="true" />
      {state === "loading" && <p className="all-events-note" role="status">Loading more plans…</p>}
      {state === "error" && <p className="all-events-note">Couldn't load more plans. <button type="button" onClick={() => load()}>Try again</button></p>}

      {details && (
        <EventDetails card={details} onBack={() => window.history.back()}
          actions={<a href={`/download${window.location.search}`} onClick={getApp} className="all-events-cta" style={{ ...PRIMARY, color: "var(--bg)" }}>Get Tandem free</a>} />
      )}
      {qr && <DesktopAppPrompt onClose={() => setQr(false)} />}
    </section>
  );
}
