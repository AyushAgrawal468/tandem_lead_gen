import React, { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { useGSAP } from "@gsap/react";
import { T, font, metaLine } from "../lib/card";
import TandemE from "../assets/swipe/tandem-e.svg";
import { SWIPE_PX, SWIPE_VELOCITY } from "../lib/funnel";

gsap.registerPlugin(Draggable, useGSAP);

const EASE_OUT = "cubic-bezier(0.2, 0.8, 0.2, 1)";

// ---------- card face ----------

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

// Poster is 3:4, but shrinks on short screens (in-app browsers) so the buttons stay on screen
const POSTER_H = "min(calc((min(100vw, 420px) - 56px) * 4 / 3), calc(100dvh - 502px))";

// The card's round Tandem button (the app's gradient "e") = "Send to a friend" on the web (design brief)
export function ShareButton({ onShare, size = 48 }) {
  return (
    <button onClick={(e) => { e.stopPropagation(); onShare(); }} aria-label="Send to a friend"
      style={{ flexShrink: 0, width: `${size}px`, height: `${size}px`, padding: 0, borderRadius: "50%", border: "none", cursor: "pointer", background: "none",
        filter: "drop-shadow(0 6px 16px rgba(0,200,190,0.35))" }}>
      <img src={TandemE} alt="" draggable={false} style={{ width: "100%", height: "100%", display: "block" }} />
    </button>
  );
}

export function CardFace({ card, onShare }) {
  return (
    <div data-event-card="" style={{ background: `linear-gradient(180deg, #26282B, ${T.surface1})`, border: `1px solid ${T.line}`, borderRadius: "20px",
      overflow: "hidden", boxShadow: "0 24px 48px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3)" }}>
      <div style={{ padding: "10px 10px 0" }}>
        <Poster card={card} style={{ height: POSTER_H, minHeight: "240px", borderRadius: "14px" }} />
      </div>
      <div style={{ padding: "14px 16px 18px", display: "flex", alignItems: "flex-end", gap: "12px" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
        <h2 className="wide text-[18px] md:text-[20px]" style={{ fontWeight: 700, color: T.high, lineHeight: 1.25, margin: 0,
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{card.title}</h2>
        {metaLine(card) && <p style={{ color: T.low, fontSize: "14px", lineHeight: 1.5, margin: "4px 0 0" }}>{metaLine(card)}</p>}
        {card.price && <p style={{ color: T.green, fontSize: "14px", lineHeight: 1.5, margin: "2px 0 0" }}>{card.price}</p>}
        </div>
        {onShare && <ShareButton onShare={onShare} />}
      </div>
    </div>
  );
}

// ---------- the draggable top card ----------

const LABELS = {
  RIGHT: { text: "I'm in", color: T.green, pos: { top: "28px", left: "24px" }, rot: -12 },
  LEFT: { text: "Not now", color: T.mid, pos: { top: "28px", right: "24px" }, rot: 12 },
  DOWN: { text: "Never", color: T.fail, pos: { bottom: "120px", left: "50%" }, rot: 0 },
  UP: { text: "Send to a friend", color: "#A77DFF", pos: { bottom: "120px", left: "50%" }, rot: 0 },
};
const OFF = { RIGHT: { x: 700, rotation: 12 }, LEFT: { x: -700, rotation: -12 }, DOWN: { y: 900, rotation: 0 } };
const reducedMotion = () => typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/**
 * Top card of the deck (handoff 2.2): drag right (I'm in), left (Not now), down (Never) with GSAP
 * Draggable for touch and mouse. Up opens Send to a friend (the Tandem button) and springs back. A tap opens details.
 * The parent calls ref.fly(action) for buttons and arrow keys; onAction fires once the card is off.
 */
export const SwipeCard = forwardRef(function SwipeCard({ card, onAction, onOpen, onShare }, ref) {
  const el = useRef(null);
  const labels = useRef({});
  const flying = useRef(false);

  const showLabels = (x, y) => {
    const down = y > 0 && y > Math.abs(x), up = y < 0 && -y > Math.abs(x);
    const o = { RIGHT: !down && !up && x > 0 ? x / SWIPE_PX : 0, LEFT: !down && !up && x < 0 ? -x / SWIPE_PX : 0,
      DOWN: down ? y / SWIPE_PX : 0, UP: up && onShare ? -y / SWIPE_PX : 0 };
    for (const k in o) if (labels.current[k]) labels.current[k].style.opacity = Math.min(1, o[k]);
  };

  const fly = (action) => {
    if (flying.current || !el.current) return;
    flying.current = true;
    for (const k in LABELS) if (labels.current[k]) labels.current[k].style.opacity = k === action ? 1 : 0;
    const done = () => onAction(action);
    if (reducedMotion()) gsap.to(el.current, { opacity: 0, duration: 0.2, onComplete: done });
    else gsap.to(el.current, { ...OFF[action], opacity: 0, duration: 0.25, ease: "power1.in", onComplete: done });
  };
  useImperativeHandle(ref, () => ({ fly }));

  useGSAP(() => {
    let last = { x: 0, y: 0, t: 0 }, v = { x: 0, y: 0 };
    const [d] = Draggable.create(el.current, {
      type: "x,y",
      zIndexBoost: false, // the default lifts the card to z-index 1000+, over the sticky header
      minimumMovement: 6,
      onPress() { last = { x: this.x, y: this.y, t: performance.now() }; v = { x: 0, y: 0 }; },
      onDrag() {
        const now = performance.now(), dt = Math.max(1, now - last.t);
        v = { x: (this.x - last.x) / dt, y: (this.y - last.y) / dt };
        last = { x: this.x, y: this.y, t: now };
        if (!reducedMotion()) gsap.set(el.current, { rotation: Math.max(-12, Math.min(12, this.x / 20)) });
        showLabels(this.x, this.y);
      },
      onDragEnd() {
        const { x, y } = this;
        // Distance first, then a fast flick; an up drag never counts
        const action =
          y > SWIPE_PX && y > Math.abs(x) ? "DOWN"
          : x > SWIPE_PX ? "RIGHT" : x < -SWIPE_PX ? "LEFT"
          : v.y > SWIPE_VELOCITY && v.y > Math.abs(v.x) ? "DOWN"
          : v.x > SWIPE_VELOCITY ? "RIGHT" : v.x < -SWIPE_VELOCITY ? "LEFT" : null;
        if (action) { fly(action); return; }
        // Up is the app's Tandem swipe: on the web it opens "Send to a friend" (the round button); the card stays
        if (onShare && -y > SWIPE_PX && -y > Math.abs(x)) onShare();
        showLabels(0, 0);
        gsap.to(el.current, { x: 0, y: 0, rotation: 0, duration: reducedMotion() ? 0 : 0.2, ease: "power2.out" });
      },
      onClick() {
        // The share button sits on the card; its tap must not open the details page too
        if (!flying.current && !this.pointerEvent?.target?.closest?.("button")) onOpen?.();
      },
    });
    return () => d.kill();
  }, { scope: el });

  return (
    <div ref={el} role="group" aria-label={card.title}
      style={{ position: "relative", zIndex: 2, touchAction: "none", userSelect: "none", cursor: "grab", animation: `deckIn 0.2s ${EASE_OUT}` }}>
      {Object.entries(LABELS).map(([k, l]) => (
        <span key={k} ref={(n) => { labels.current[k] = n; }} aria-hidden="true"
          style={{ position: "absolute", zIndex: 3, opacity: 0, pointerEvents: "none", ...l.pos,
            transform: `${k === "DOWN" ? "translateX(-50%) " : ""}rotate(${l.rot}deg)`,
            border: `3px solid ${l.color}`, color: l.color, background: "rgba(17,17,17,0.6)",
            fontWeight: 800, fontSize: "22px", padding: "2px 12px", borderRadius: "8px", whiteSpace: "nowrap" }}>
          {l.text}
        </span>
      ))}
      <CardFace card={card} onShare={onShare} />
    </div>
  );
});

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
          <h1 className="wide text-[24px] md:text-[32px]" style={{ fontWeight: 800, lineHeight: 1.1, margin: "20px 0 16px" }}>{card.title}</h1>
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
