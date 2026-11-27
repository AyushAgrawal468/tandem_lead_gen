import { useEffect, useRef, useState } from "react";
import { useSwipe } from "./useSwipe";
import { EventCard } from "./EventCard";
import { SwipeButtons } from "./SwipeButtons";
import { Stamp } from "./parts";
import { catOf } from "./categories";
import { loadPixel } from "../../lib/analytics";

const storageGet = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
const storageSet = (k, v) => { try { localStorage.setItem(k, v); } catch { /* blocked */ } };

// Handoff "Swipe engine" Deck.jsx: only two cards are ever in the DOM. Buttons sit OUTSIDE the drag surface.
// Additions: commitRef (event details' buttons swipe the same card), the category glow behind the
// stack, the coach hint, and preloading the next two posters.
export function Deck({ cards, index, onSwipe, onOpenDetails, onShare, locked, desk, hideNever, commitRef, panY, beforeButtons }) {
  // How the swipe was made (analytics "swiped": drag, button, key); set just before each commit path
  const method = useRef("drag");
  const { card, back, stamps, commit, cardHandlers, deckHandlers } =
    useSwipe({ onCommit: (dir) => onSwipe(dir, method.current), onTap: () => onOpenDetails(cards[index]), disabled: locked, panY });
  const commitBy = (how) => (dir) => { method.current = how; commit(dir); };
  const top = cards[index], next = cards[index + 1];
  if (commitRef) commitRef.current = commitBy("button"); // event details' buttons

  // Handoff "Performance": the Meta Pixel loads after the first card renders
  useEffect(() => { if (top) loadPixel(); }, [!!top]); // eslint-disable-line react-hooks/exhaustive-deps

  // Coach (canvas J1-01): if nobody touches the deck in 1.5 s, "Drag right if you would go" shows on the
  // first card and the card nudges 24px right and back; once per browser. Reduced motion keeps the pill, drops the nudge.
  const touched = useRef(false);
  const [coach, setCoach] = useState(false);
  const firstId = useRef(top?.id);
  useEffect(() => {
    if (storageGet("tdm.coached")) return;
    const t = setTimeout(() => {
      if (touched.current || !card.current) return;
      setCoach(true);
      storageSet("tdm.coached", "1");
      if (!matchMedia("(prefers-reduced-motion: reduce)").matches)
        card.current.animate([{ transform: "translateX(0)" }, { transform: "translateX(24px) rotate(1.2deg)" }, { transform: "translateX(0)" }],
          { duration: 700, easing: "cubic-bezier(0.23, 1, 0.32, 1)" });
    }, 1500);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  if (coach && top?.id !== firstId.current) setCoach(false); // first card is gone

  // "Preload the next two posters ... as soon as a card becomes top"
  useEffect(() => {
    cards.slice(index + 1, index + 3).forEach((c) => { if (c.posterUrl) new Image().src = c.posterUrl; });
  }, [top?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section className="deck" tabIndex={0} aria-label="Event cards. Use the arrow keys or the buttons below." {...deckHandlers}
      onPointerDownCapture={() => { touched.current = true; method.current = "drag"; setCoach(false); }}
      onKeyDownCapture={() => { touched.current = true; method.current = "key"; setCoach(false); }}>
      <div className="deck-stack" style={{ "--glow": top ? catOf(top.category).color : "transparent" }}>
        {next && <div className="deck-back" ref={back} aria-hidden="true" style={{ transform: "translateY(8px) scale(0.95)" }}>
          <EventCard event={next} desk={desk} /></div>}
        {top && (
          <div className={panY ? "deck-top pan-y" : "deck-top"} ref={card} key={top.id} {...cardHandlers}>
            <EventCard event={top} desk={desk} strip={top.strip} onShare={() => onShare(top)} />
            <Stamp ref={stamps.right} kind="right" /><Stamp ref={stamps.left} kind="left" /><Stamp ref={stamps.down} kind="down" />
          </div>
        )}
        {coach && (
          <div className="coach toast-in" aria-hidden="true">Drag right if you would go
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </div>
        )}
      </div>
      {beforeButtons /* soft prompt sits between the card and the buttons (canvas J1-14a) */}
      <SwipeButtons desk={desk} disabled={locked} hideNever={hideNever}
        onLeft={() => commitBy("button")("left")} onDown={() => commitBy("button")("down")} onRight={() => commitBy("button")("right")} />
    </section>
  );
}
