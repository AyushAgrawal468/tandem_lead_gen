import React, { useEffect, useRef } from "react";
import { T, font } from "../lib/card";
import TandemE from "../assets/swipe/tandem-e.svg";

// Event details (handoff: a state of the deck with history.pushState, boards J1-43, J1-D43, J2-43).
// The swipe deck itself lives in components/deck (handoff "Swipe engine").

const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)";

function Poster({ card, style }) {
  return (
    <div style={{ borderRadius: "10px", overflow: "hidden", background: T.surface2, ...style }}>
      {card.poster
        ? <img src={card.poster} alt="" draggable={false} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block", pointerEvents: "none" }} />
        // No image: type-only fallback poster in the card colours
        : <div style={{ height: "100%", display: "flex", alignItems: "flex-end", padding: "20px", fontSize: "28px", fontWeight: 800, lineHeight: 1.1, color: T.high,
            background: `linear-gradient(160deg, ${T.surface2}, ${T.surface1})` }}>{card.title}</div>}
    </div>
  );
}


// ---------- event details page (design screen 43) ----------

// Info tiles as in the app's event details (design: Date, Location, Price, Friends with tinted icons)
const TILE_ICONS = {
  calendar: "M7 3v3M17 3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z",
  pin: "M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  ticket: "M4 7h16v3a2 2 0 0 0 0 4v3H4v-3a2 2 0 0 0 0-4V7zM14 7v10",
  friends: "M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 20a6 6 0 0 1 12 0M16 5.2a3 3 0 0 1 0 5.6M17 14a6 6 0 0 1 4 6",
};
function Tile({ icon, tint, label, children }) {
  return (
    <div style={{ background: `linear-gradient(160deg, ${tint}1f, ${T.surface1} 60%)`, border: `1px solid ${T.line}`, borderRadius: "14px", padding: "12px 14px" }}>
      <p style={{ display: "flex", alignItems: "center", gap: "8px", margin: "0 0 8px", fontSize: "13px", fontWeight: 700, color: T.high }}>
        <span aria-hidden="true" style={{ width: "24px", height: "24px", borderRadius: "50%", background: tint, color: T.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d={TILE_ICONS[icon]} /></svg>
        </span>{label}
      </p>
      <p style={{ margin: 0, fontSize: "14px", lineHeight: 1.4, color: T.mid }}>{children}</p>
    </div>
  );
}

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
  return (
    <div ref={box} tabIndex={-1} role="dialog" aria-modal="true" aria-label={card.title}
      style={{ position: "fixed", inset: 0, zIndex: 1500, background: T.bg, color: T.high, fontFamily: font, overflowY: "auto", outline: "none",
        animation: `detailsIn 0.25s ${EASE_OUT}` }}>
      {/* The glow sits on this inner box (as tall as the content), not on the fixed scroller */}
      <div className="aurora" style={{ minHeight: "100%" }}>
      <header style={{ position: "sticky", top: 0, zIndex: 2, background: "rgba(17,17,17,0.55)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
        borderBottom: `1px solid ${T.line}` }}>
        <div style={{ maxWidth: "960px", margin: "0 auto", display: "flex", alignItems: "center", gap: "4px", padding: "10px 8px" }}>
          <button onClick={onBack} aria-label="Back"
            style={{ width: "44px", height: "44px", padding: 0, border: "none", borderRadius: "50%", background: "transparent", color: T.high, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <span style={{ flex: 1, fontSize: "15px", fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{card.title}</span>
        </div>
      </header>
      <div className="md:grid md:grid-cols-[1fr_1.1fr] md:gap-12 md:items-start" style={{ maxWidth: "960px", margin: "0 auto", padding: "16px 16px 150px" }}>
        <div className="md:sticky md:top-[88px]">
          <Poster card={card} style={{ aspectRatio: "3 / 4", width: "100%", maxHeight: "72vh", borderRadius: "18px" }} />
        </div>
        <div>
          <h1 className="wide text-[24px] md:text-[32px]" style={{ fontWeight: 800, lineHeight: 1.1, margin: "20px 0 16px" }}>{card.fullTitle || card.title}</h1>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            {when && <Tile icon="calendar" tint="#C1F546" label="Date">{when}</Tile>}
            {card.area && <Tile icon="pin" tint="#4FA3FF" label="Location">{card.area}</Tile>}
            {card.price && <Tile icon="ticket" tint="#00FFC8" label="Price">{card.price}</Tile>}
            <Tile icon="friends" tint="#A77DFF" label="Friends">When your friends swipe, they appear here</Tile>
          </div>
          {onShare && (
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "12px", padding: "12px 12px 12px 14px", borderRadius: "14px",
              background: T.surface1, border: `1px solid ${T.line}` }}>
              <img src={TandemE} alt="" style={{ width: "36px", height: "36px", flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: "14px", fontWeight: 700 }}>Invite friends</p>
                <p style={{ margin: 0, fontSize: "12px", color: T.low }}>and enjoy a shared experience</p>
              </div>
              <button onClick={onShare} className="pill" style={{ height: "36px", padding: "0 18px", borderRadius: "999px", fontFamily: font, fontWeight: 700, fontSize: "14px", cursor: "pointer" }}>Invite</button>
            </div>
          )}
          {card.description && (
            <>
              <h2 style={{ fontSize: "16px", fontWeight: 700, margin: "28px 0 8px" }}>About</h2>
              <p style={{ color: T.mid, fontSize: "15px", lineHeight: 1.6, margin: 0, whiteSpace: "pre-line" }}>{card.description}</p>
            </>
          )}
        </div>
      </div>
      <div style={{ position: "fixed", left: 0, right: 0, bottom: 0, padding: "24px 16px calc(16px + env(safe-area-inset-bottom))",
        background: `linear-gradient(transparent, ${T.bg} 40%)` }}>
        {actions}
      </div>
      </div>
    </div>
  );
}
