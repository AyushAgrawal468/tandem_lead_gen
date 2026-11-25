import React from "react";
import SwipeDeck from "./SwipeDeck";

/**
 * The deck screen (handoff "DeckHeading" + "Layout by breakpoint"): the big words "Swipe. Match. Go."
 * (decorative, aria-hidden, "Match." outlined), then the real h1 sentence or the reel's creator line,
 * then the live deck. Phone and tablet: one column, exactly the screen's height. Desktop: copy left,
 * deck right (420 x 660). `aside` shows under the h1 on desktop only.
 */
export default function DeckScreen({ city, h1, aside }) {
  return (
    <div className="deck-screen">
      <div className="deck-copy">
        <div className="big-words" aria-hidden="true"><span>Swipe.</span><span className="outline">Match.</span><span>Go.</span></div>
        <h1 className="deck-h1">{h1}</h1>
        {aside && <div className="desk-only">{aside}</div>}
      </div>
      <div className="deck-col">
        <SwipeDeck city={city} />
      </div>
    </div>
  );
}
