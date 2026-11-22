import React, { forwardRef, useImperativeHandle, useRef } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { useGSAP } from "@gsap/react";
import { T, font, metaLine } from "../lib/card";
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
const POSTER_H = "min(calc((min(100vw, 420px) - 56px) * 4 / 3), calc(100dvh - 490px))";

// Round mint button = "Send to a friend" (design brief: the card's round Tandem button on the web)
export function ShareButton({ onShare, size = 40 }) {
  return (
    <button onClick={(e) => { e.stopPropagation(); onShare(); }} aria-label="Send to a friend"
      style={{ flexShrink: 0, width: `${size}px`, height: `${size}px`, padding: 0, borderRadius: "50%", border: "none", cursor: "pointer",
        background: T.green, color: T.bg, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 12px rgba(0,255,200,0.35)" }}>
      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
      </svg>
    </button>
  );
}

export function CardFace({ card, onShare }) {
  return (
    <div data-event-card="" style={{ background: T.surface1, borderRadius: "16px", overflow: "hidden", boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}>
      <div style={{ padding: "12px 12px 0" }}>
        <Poster card={card} style={{ height: POSTER_H, minHeight: "240px" }} />
      </div>
      <div style={{ padding: "12px 14px 16px", display: "flex", alignItems: "flex-end", gap: "12px" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
        <h2 className="text-[18px] md:text-[20px]" style={{ fontWeight: 700, color: T.high, lineHeight: 1.25, margin: 0,
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
};
const OFF = { RIGHT: { x: 700, rotation: 12 }, LEFT: { x: -700, rotation: -12 }, DOWN: { y: 900, rotation: 0 } };
const reducedMotion = () => typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/**
 * Top card of the deck (handoff 2.2): drag right (I'm in), left (Not now), down (Never) with GSAP
 * Draggable for touch and mouse. Up drags spring back: the web has no up swipe. A tap opens details.
 * The parent calls ref.fly(action) for buttons and arrow keys; onAction fires once the card is off.
 */
export const SwipeCard = forwardRef(function SwipeCard({ card, onAction, onOpen, onShare }, ref) {
  const el = useRef(null);
  const labels = useRef({});
  const flying = useRef(false);

  const showLabels = (x, y) => {
    const down = y > 0 && y > Math.abs(x);
    const o = { RIGHT: !down && x > 0 ? x / SWIPE_PX : 0, LEFT: !down && x < 0 ? -x / SWIPE_PX : 0, DOWN: down ? y / SWIPE_PX : 0 };
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

export function EventDetails({ card, onBack, actions, onShare }) {
  return (
    <div role="dialog" aria-modal="true" aria-label={card.title}
      style={{ position: "fixed", inset: 0, zIndex: 1500, background: T.bg, color: T.high, fontFamily: font, overflowY: "auto",
        animation: `detailsIn 0.25s ${EASE_OUT}` }}>
      <header style={{ position: "sticky", top: 0, zIndex: 1, background: T.bg, display: "flex", alignItems: "center", gap: "8px", padding: "12px 16px" }}>
        <button onClick={onBack} aria-label="Back" autoFocus
          style={{ width: "44px", height: "44px", padding: 0, border: "none", background: "transparent", color: T.high, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <span style={{ flex: 1, fontSize: "16px", fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{card.title}</span>
        {onShare && <ShareButton onShare={onShare} size={40} />}
      </header>
      <div className="md:grid md:grid-cols-2 md:gap-10" style={{ maxWidth: "960px", margin: "0 auto", padding: "0 16px 140px" }}>
        <Poster card={card} style={{ aspectRatio: "3 / 4", width: "100%", maxHeight: "70vh" }} />
        <div>
          <h1 className="text-[22px] md:text-[24px]" style={{ fontWeight: 700, lineHeight: 1.2, margin: "16px 0 6px" }}>{card.title}</h1>
          {metaLine(card) && <p style={{ color: T.low, fontSize: "14px", margin: 0 }}>{metaLine(card)}</p>}
          {card.price && <p style={{ color: T.green, fontSize: "14px", margin: "4px 0 0" }}>{card.price}</p>}
          {card.description && <p style={{ color: T.mid, fontSize: "16px", lineHeight: 1.5, margin: "16px 0 0", whiteSpace: "pre-line" }}>{card.description}</p>}
        </div>
      </div>
      <div style={{ position: "fixed", left: 0, right: 0, bottom: 0, padding: "12px 16px calc(16px + env(safe-area-inset-bottom))",
        background: `linear-gradient(transparent, ${T.bg} 30%)` }}>
        {actions}
      </div>
    </div>
  );
}
