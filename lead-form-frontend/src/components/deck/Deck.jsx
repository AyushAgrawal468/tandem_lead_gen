import { useEffect } from "react";
import { useSwipe } from "./useSwipe";
import { EventCard } from "./EventCard";
import { SwipeButtons } from "./SwipeButtons";
import { Stamp } from "./parts";
import { catOf } from "./categories";

// Handoff "Swipe engine" Deck.jsx: only two cards are ever in the DOM. Buttons sit OUTSIDE the drag surface.
// Additions: commitRef (event details' buttons swipe the same card), the category glow behind the
// stack, and preloading the next two posters.
export function Deck({ cards, index, onSwipe, onOpenDetails, onShare, locked, desk, hideNever, commitRef }) {
  const { card, back, stamps, commit, cardHandlers, deckHandlers } =
    useSwipe({ onCommit: onSwipe, onTap: () => onOpenDetails(cards[index]), disabled: locked });
  const top = cards[index], next = cards[index + 1];
  if (commitRef) commitRef.current = commit;

  // "Preload the next two posters ... as soon as a card becomes top"
  useEffect(() => {
    cards.slice(index + 1, index + 3).forEach((c) => { if (c.posterUrl) new Image().src = c.posterUrl; });
  }, [top?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section className="deck" tabIndex={0} aria-label="Event cards. Use the arrow keys or the buttons below." {...deckHandlers}>
      <div className="deck-stack" style={{ "--glow": top ? catOf(top.category).color : "transparent" }}>
        {next && <div className="deck-back" ref={back} aria-hidden="true" style={{ transform: "translateY(8px) scale(0.95)" }}>
          <EventCard event={next} desk={desk} /></div>}
        {top && (
          <div className="deck-top" ref={card} key={top.id} {...cardHandlers}>
            <EventCard event={top} desk={desk} onShare={() => onShare(top)} />
            <Stamp ref={stamps.right} kind="right" /><Stamp ref={stamps.left} kind="left" /><Stamp ref={stamps.down} kind="down" />
          </div>
        )}
      </div>
      <SwipeButtons desk={desk} disabled={locked} hideNever={hideNever}
        onLeft={() => commit("left")} onDown={() => commit("down")} onRight={() => commit("right")} />
    </section>
  );
}
