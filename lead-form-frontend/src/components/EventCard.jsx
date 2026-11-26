import React, { useEffect, useRef } from "react";
import { PosterFallback, SendIcon } from "./deck/parts";

// Event details (handoff: a state of the deck with history.pushState). Canvas J1-43 (phone: header,
// full-width poster, title, date, venue, price, full description, fixed buttons), J1-D43 (desktop:
// "Back to the deck", poster left, details and buttons right) and J2-43 (the friend strip on an invite).
// The swipe deck itself lives in components/deck (handoff "Swipe engine").

const Icon = ({ d }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
);
const CALENDAR = "M7 3v3M17 3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z";
const PIN = "M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z";
const BACK = "M15 18l-6-6 6-6";

export function EventDetails({ card, onBack, actions, onShare }) {
  const box = useRef(null);
  // Focus the dialog itself (screen readers start here) without drawing a focus ring on the Back button
  useEffect(() => { box.current?.focus(); }, []);
  // Only the details scroll: lock the page underneath (else two scrollbars on desktop), restore on close
  useEffect(() => {
    const html = document.documentElement, prev = html.style.overflow;
    html.style.overflow = "hidden";
    return () => { html.style.overflow = prev; };
  }, []);
  const when = [card.day, card.time].filter(Boolean).join(", ");
  const where = card.venue || card.area;
  return (
    <div ref={box} tabIndex={-1} role="dialog" aria-modal="true" aria-label={card.title} className="ed">
      <header className="ed-head">
        <button onClick={onBack} aria-label="Back to the deck" className="ed-back"><Icon d={BACK} /></button>
        <span>{card.title}</span>
      </header>
      <div className="ed-body">
        <button onClick={onBack} className="ed-back-link"><Icon d={BACK} />Back to the deck</button>
        <div className="ed-main">
          <div className="ed-poster">
            <PosterFallback title={card.title} category={card.category} />
            {card.poster && <img src={card.poster} alt="" draggable={false} onError={(e) => { e.currentTarget.style.display = "none"; }} />}
          </div>
          <div className="ed-info">
            <h1>{card.fullTitle || card.title}</h1>
            {card.strip && <div className="ed-strip"><span className="avatar">{card.strip[0]}</span>{card.strip} is in</div>}
            {when && <div className="ed-row"><Icon d={CALENDAR} />{when}</div>}
            {where && <div className="ed-row"><Icon d={PIN} />{where}</div>}
            {card.price && <div className="ed-price">{card.price}</div>}
            {card.description && <p className="ed-desc">{card.description}</p>}
            <div className="ed-bar">
              <div>{actions}</div>
              {onShare && <button onClick={onShare} aria-label="Send to a friend" className="share-btn"><SendIcon /></button>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
