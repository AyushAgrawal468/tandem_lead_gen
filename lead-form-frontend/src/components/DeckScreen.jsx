import React, { useEffect, useState } from "react";
import { FUNNEL } from "../lib/funnel.config.js";
import { firstTouch } from "../lib/analytics";
import SwipeDeck from "./SwipeDeck";

/**
 * The deck screen (handoff "DeckHeading" + "Layout by breakpoint"): the big words "Swipe. Match. Go."
 * (decorative, aria-hidden, "Match." outlined), then the real h1 sentence or the reel's creator line,
 * then the live deck. Phone and tablet: one column, exactly the screen's height. Desktop: copy left,
 * deck right (420 x 660). `aside` shows under the h1 on desktop only. `scrollable` (homepage, city pages):
 * a vertical drag on the card scrolls the page instead of swiping Never.
 */
export default function DeckScreen({ city, onCity, h1, aside, scrollable }) {
  // Heading by source (canvas LP-00-Map, J1-02b), read after mount so the prerendered HTML keeps the plain H1:
  // a reel (utm_campaign in the creator map) → the creator line; a poster or QR (utm_medium=offline) → "You scanned it."
  // Coming back before the cap is a toast in the deck ("Welcome back. Pick up where you left off.").
  const [state, setState] = useState({});
  useEffect(() => {
    const q = new URLSearchParams(window.location.search), ft = firstTouch();
    setState({ creator: FUNNEL.CREATORS[q.get("utm_campaign") || ft.utm_campaign], scanned: (q.get("utm_medium") || ft.utm_medium) === "offline" });
  }, []);
  const [signedIn, setSignedIn] = useState(null); // LP-09, from SwipeDeck
  const line = state.creator ? `Saw ${state.creator}'s reel? Here's what's on in ${city}.` : state.scanned ? "You scanned it. Now swipe it." : h1;
  return (
    <div className="deck-screen">
      <div className="deck-copy">
        {signedIn && (
          <p className="signed-in"><span>Signed in as {signedIn.masked}</span>
            {signedIn.count > 0 && <b>{signedIn.count} {signedIn.count === 1 ? "swipe" : "swipes"} saved</b>}</p>
        )}
        <div className="big-words" aria-hidden="true"><span>Swipe.</span><span className="outline">Match.</span><span>Go.</span></div>
        <h1 className="deck-h1">{line}</h1>
        {aside && <div className="desk-only">{aside}</div>}
      </div>
      <div className="deck-col">
        <SwipeDeck city={city} onCity={onCity} panY={scrollable} onSignedIn={setSignedIn} />
      </div>
    </div>
  );
}
