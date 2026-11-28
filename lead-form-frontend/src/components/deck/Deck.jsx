import { useEffect, useRef, useState } from "react";
import { useSwipe } from "./useSwipe";
import { EventCard } from "./EventCard";
import { SwipeButtons } from "./SwipeButtons";
import { Stamp, CheckIcon, ClockIcon, XIcon } from "./parts";
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

  // Coach (canvas J1-01): if nobody touches the deck in 1.5 s, "Drag right if you would go" shows on the first card
  // (once per browser). Whatever card is on top jiggles right and left after 4 s without a touch, key or swipe,
  // and again each time the deck scrolls back into view. Reduced motion gets a gentle 8px jiggle.
  const touched = useRef(false);
  const lastActive = useRef(Date.now());
  const [coach, setCoach] = useState(false);
  useEffect(() => { lastActive.current = Date.now(); setCoach(false); }, [top?.id]); // a new card on top: idle clock restarts, pill goes
  useEffect(() => {
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Right, then left, then home: it reads as "this goes both ways". Reduced motion gets a gentle version
    // (8px, no rotation, slower) so the swipe hint still shows (chosen 27 Nov 2026).
    const [dx, rot, ms] = still ? [8, 0, 1400] : [24, 1.2, 1000];
    const jiggle = () => {
      if (!card.current || document.hidden) return;
      lastActive.current = Date.now();
      card.current.animate([{ transform: "translateX(0)" }, { transform: `translateX(${dx}px) rotate(${rot}deg)` },
        { transform: `translateX(${-dx}px) rotate(${-rot}deg)` }, { transform: "translateX(0)" }],
        { duration: ms, easing: "cubic-bezier(0.37, 0, 0.63, 1)" });
      // ...and the glow for each side as the card leans that way: right = I'm in, left = Not now
      const stack = card.current.parentElement;
      stack.querySelector(".hint-r")?.animate([{ opacity: 0 }, { opacity: 0.9, offset: 0.33 }, { opacity: 0, offset: 0.55 }, { opacity: 0 }], { duration: ms });
      stack.querySelector(".hint-l")?.animate([{ opacity: 0 }, { opacity: 0, offset: 0.45 }, { opacity: 0.9, offset: 0.66 }, { opacity: 0 }], { duration: ms });
    };
    // Coming back to the deck (scrolled away and back) jiggles it straight away
    let away = false;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) away = true;
      else if (away) { away = false; jiggle(); }
    }, { threshold: 0.6 });
    if (card.current) io.observe(card.current.parentElement);
    const first = setTimeout(() => {
      if (touched.current || !card.current) return;
      if (!storageGet("tdm.coached")) { setCoach(true); storageSet("tdm.coached", "1"); }
      jiggle();
    }, 1500);
    const idle = setInterval(() => { if (Date.now() - lastActive.current >= 4000 && !away) jiggle(); }, 500);
    return () => { clearTimeout(first); clearInterval(idle); io.disconnect(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // "Preload the next two posters ... as soon as a card becomes top"
  useEffect(() => {
    cards.slice(index + 1, index + 3).forEach((c) => { if (c.posterUrl) new Image().src = c.posterUrl; });
  }, [top?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section className="deck" tabIndex={0} aria-label="Event cards. Use the arrow keys or the buttons below." {...deckHandlers}
      onPointerDownCapture={() => { touched.current = true; lastActive.current = Date.now(); method.current = "drag"; setCoach(false); }}
      onKeyDownCapture={() => { touched.current = true; lastActive.current = Date.now(); method.current = "key"; setCoach(false); }}>
      <div className="deck-stack" style={{ "--glow": top ? catOf(top.category).color : "transparent" }}>
        {next && <div className="deck-back" ref={back} aria-hidden="true" style={{ transform: "translateY(8px) scale(0.95)" }}>
          <EventCard event={next} desk={desk} /></div>}
        {/* Drag glows (as in the app): the side the card leaves shows what that swipe means */}
        {top && <>
          <div className="deck-hint hint-r" aria-hidden="true"><CheckIcon /><b>I'm in</b></div>
          <div className="deck-hint hint-l" aria-hidden="true"><ClockIcon /><b>Not now</b></div>
          {!panY && !hideNever && <div className="deck-hint hint-d" aria-hidden="true"><XIcon /><b>Never</b></div>}
        </>}
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
