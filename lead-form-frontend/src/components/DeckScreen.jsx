import React, { useEffect, useState } from "react";
import { FUNNEL } from "../lib/funnel.config.js";
import { readJson } from "../lib/session";
import { firstTouch } from "../lib/analytics";
import SwipeDeck from "./SwipeDeck";

/**
 * The deck screen (handoff "DeckHeading" + "Layout by breakpoint"): the big words "Swipe. Match. Go."
 * (decorative, aria-hidden, "Match." outlined), then the real h1 sentence or the reel's creator line,
 * then the live deck. Phone and tablet: one column, exactly the screen's height. Desktop: copy left,
 * deck right (420 x 660). `aside` shows under the h1 on desktop only.
 */
export default function DeckScreen({ city, onCity, h1, aside }) {
  // Homepage states (handoff LP-00-Map), read after mount so the prerendered HTML stays the first-visit version:
  // came from a reel (utm_campaign in the creator map) → the creator line; came back before the cap → swipes left
  const [state, setState] = useState({});
  useEffect(() => {
    const campaign = new URLSearchParams(window.location.search).get("utm_campaign") || firstTouch().utm_campaign;
    const count = readJson("tdm.count", 0);
    setState({ creator: FUNNEL.CREATORS[campaign], left: count > 0 && count < FUNNEL.SWIPE_LIMIT ? FUNNEL.SWIPE_LIMIT - count : null });
  }, []);
  const line = state.creator ? `Saw ${state.creator}'s reel? Here's what's on in ${city}.` : h1;
  return (
    <div className="deck-screen">
      <div className="deck-copy">
        <div className="big-words" aria-hidden="true"><span>Swipe.</span><span className="outline">Match.</span><span>Go.</span></div>
        <h1 className="deck-h1">{line}</h1>
        {state.left != null && <p className="deck-h1" style={{ color: "var(--mint)" }}>Welcome back. {state.left} swipes left.</p>}
        {aside && <div className="desk-only">{aside}</div>}
      </div>
      <div className="deck-col">
        <SwipeDeck city={city} onCity={onCity} />
      </div>
    </div>
  );
}
