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

  // Coach (canvas J1-01): if nobody touches the deck in 1.5 s, "Drag right if you would go" shows on the first card
  // (once per browser). Whatever card is on top jiggles right and left (24px, 2.4 s) after 4 s still, counted from the last jiggle's end, without a touch, key or
  // swipe, and again each time the deck scrolls back into view.
  const touched = useRef(false);
  const lastActive = useRef(Date.now());
  const [coach, setCoach] = useState(false);
  useEffect(() => { lastActive.current = Date.now(); setCoach(false); }, [top?.id]); // a new card on top: idle clock restarts, pill goes
  useEffect(() => {
    // Right, then left, then home: it reads as "this goes both ways". The same 24px for everyone, reduced motion
    // included (asked for 28 Nov 2026: the swipe hint must always show), slow enough to read.
    const [dx, rot, ms] = [24, 1.2, 2400]; // slow: one easy swing right and left
    const jiggle = () => {
      if (!card.current || document.hidden) return;
      lastActive.current = Date.now() + ms; // the 4 s pause counts from the end of this jiggle
      card.current.animate([{ transform: "translateX(0)" }, { transform: `translateX(${dx}px) rotate(${rot}deg)` },
        { transform: `translateX(${-dx}px) rotate(${-rot}deg)` }, { transform: "translateX(0)" }],
        { duration: ms, easing: "cubic-bezier(0.37, 0, 0.63, 1)" });
      // the app's indicator for each side peeks out from behind the card as it leans: right = I'm in, left = Not now
      // A 24px lean would hide them behind the card, so during the jiggle they sit in front of its edges
      const stack = card.current.parentElement;
      stack.classList.add("jiggling");
      setTimeout(() => stack.classList.remove("jiggling"), ms);
      stack.querySelector(".hint-r")?.animate([{ opacity: 0 }, { opacity: 1, offset: 0.25 }, { opacity: 1, offset: 0.38 }, { opacity: 0, offset: 0.52 }, { opacity: 0 }], { duration: ms });
      stack.querySelector(".hint-l")?.animate([{ opacity: 0 }, { opacity: 0, offset: 0.5 }, { opacity: 1, offset: 0.62 }, { opacity: 1, offset: 0.75 }, { opacity: 0, offset: 0.9 }, { opacity: 0 }], { duration: ms });
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
      onPointerDownCapture={(e) => {
        touched.current = true; lastActive.current = Date.now(); method.current = "drag"; setCoach(false);
        // a running jiggle would override the drag: stop it (and its indicators) the moment the card is grabbed
        e.currentTarget.querySelectorAll(".deck-top, .deck-hint").forEach((el) => el.getAnimations().forEach((a) => a.cancel()));
      }}
      onKeyDownCapture={() => { touched.current = true; lastActive.current = Date.now(); method.current = "key"; setCoach(false); }}>
      <div className="deck-stack" style={{ "--glow": top ? catOf(top.category).color : "transparent" }}>
        {next && <div className="deck-back" ref={back} aria-hidden="true" style={{ transform: "translateY(8px) scale(0.95)" }}>
          <EventCard event={next} desk={desk} /></div>}
        {/* The app's swipe indicators, behind the card: the side it moves away from shows what that swipe means */}
        {top && <>
          <div className="deck-hint hint-r" aria-hidden="true"><span>👍</span><b>I'm in</b></div>
          <div className="deck-hint hint-l" aria-hidden="true"><span>🚫</span><b>Not now</b></div>
          {!panY && !hideNever && <div className="deck-hint hint-d" aria-hidden="true"><b>Never</b></div>}
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
