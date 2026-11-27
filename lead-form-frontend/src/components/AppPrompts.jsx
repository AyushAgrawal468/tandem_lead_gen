import React, { useRef } from "react";
import QrCode from "./QrCode";
import { T, font } from "../lib/card";
import { openTandemUrl, whenStuck } from "../lib/app";
import { useSheetKeys } from "../lib/useSheetKeys";
import { track } from "../lib/analytics";
import { StoreBadges } from "./SiteChrome";
import AppIcon from "../assets/t-logo.svg";
import { loadSession } from "../lib/session";

// App prompts. Copy from the design canvas (KIT-Copy, boards J1-14, J1-15, J1-16, J1-21).
const pill = (main) => ({
  display: "block", width: "100%", boxSizing: "border-box", textAlign: "center", textDecoration: "none", minHeight: "48px", padding: "14px",
  borderRadius: "999px", border: "none", fontFamily: font, fontWeight: 700, fontSize: "16px", cursor: "pointer",
  background: main ? T.high : T.surface2, color: main ? T.bg : T.high,
});

/** "Already have it? Open Tandem": only where the rules table allows it, never at the top of a page, phones only. */
export function OpenTandemLink({ onStuck }) {
  const href = openTandemUrl();
  if (!href) return null;
  return (
    <p style={{ textAlign: "center", fontSize: "14px", color: T.mid, margin: "14px 0 0" }}>
      Already have it?{" "}
      <a href={href} onClick={() => { track("open_tandem_tapped", { platform: /iPhone|iPad|iPod/i.test(navigator.userAgent) ? "ios" : "android" }); whenStuck(onStuck); }} style={{ color: T.green, textDecoration: "none", fontWeight: 700 }}>Open Tandem</a>
    </p>
  );
}

/**
 * Handoff "Bridge": "After you install", three numbered steps, step 1 shows the app icon. Used under
 * every app button. Steps 2 and 3 wait on the doc's open decisions (swipes shown at first sign-in;
 * "we never message your contacts"), so their copy is marked to confirm with Shreyas.
 */
export function Bridge({ compact = false }) {
  // compact: titles only (boards J1-16c inside Instagram, desktop QR prompts)
  const step = (n, title, sub, icon) => (
    <li style={{ display: "flex", gap: "12px", alignItems: "center", textAlign: "left" }}>
      <span aria-hidden="true" style={{ flex: "none", width: "36px", height: "36px", borderRadius: icon ? "10px" : "50%", display: "grid", placeItems: "center",
        background: icon ? "var(--text-1)" : T.surface2, color: T.high, fontWeight: 800, fontSize: "14px" }}>
        {icon ? <img src={AppIcon} alt="" style={{ height: "22px" }} /> : n}
      </span>
      <span style={{ fontSize: "14px", lineHeight: 1.4, color: T.mid }}>
        <strong style={{ color: T.high }}>{title}</strong>{!compact && <><br />{sub}</>}
      </span>
    </li>
  );
  return (
    <div style={{ marginTop: "20px", padding: "16px", borderRadius: "16px", background: "rgba(255,255,255,0.03)", border: `1px solid ${T.line}` }}>
      <p style={{ margin: "0 0 12px", fontSize: "13px", fontWeight: 800, color: "var(--yellow)", textAlign: "left" }}>After you install</p>
      <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "10px" }}>
        {step(1, "Install Tandem", "Free. Look for this icon.", true)}
        {/* [confirm] open decision: does the app show web swipes at first sign-in? */}
        {step(2, `Sign in with ${loadSession()?.masked || "the same number"}`, "Your swipes are already there.")}
        {/* [confirm] open decision: the contacts line must match what the app really does */}
        {step(3, "Allow contacts", "That is how Tandem finds friends who picked the same plans.")}
      </ol>
    </div>
  );
}

/** Design screen 20: any app prompt on desktop is a QR code plus the official store badges. */
export function DesktopAppPrompt({ onClose }) {
  const box = useRef(null);
  useSheetKeys(box, onClose);
  return (
    <div onClick={onClose} className="sheet-backdrop" style={{ zIndex: 2000 }}>
      <div ref={box} role="dialog" aria-modal="true" aria-labelledby="dl-title" onClick={(e) => e.stopPropagation()} className="sheet"
        style={{ textAlign: "center" }}>
        <span className="sheet-handle" aria-hidden="true" />
        <button onClick={onClose} aria-label="Close" autoFocus
          style={{ position: "absolute", top: "12px", right: "12px", width: "36px", height: "36px", padding: 0, borderRadius: "50%", border: "none",
            background: "transparent", color: T.low, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
        <h2 id="dl-title" style={{ fontSize: "24px", fontWeight: 700, margin: "0 0 8px" }}>Get Tandem on your phone</h2>
        <p style={{ color: T.mid, fontSize: "16px", margin: "0 0 20px" }}>Scan with your phone camera.</p>
        <div style={{ marginBottom: "20px" }}><QrCode size={200} /></div>
        <div style={{ display: "flex", justifyContent: "center" }}><StoreBadges /></div>
        <Bridge compact />
      </div>
    </div>
  );
}

/** Design screen 21: a store or app link stayed inside an iOS in-app browser. */
export function OpenInBrowser({ onClose }) {
  return (
    <div onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="oib-title"
      style={{ position: "fixed", inset: 0, zIndex: 2100, background: "rgba(0,0,0,0.85)", color: T.high, fontFamily: font, animation: "deckIn 0.2s" }}>
      <svg className="oib-nudge" width="56" height="56" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke={T.green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        style={{ position: "absolute", top: "12px", right: "20px" }}>
        <path d="M7 17L17 7M9 7h8v8" />
      </svg>
      <div style={{ position: "absolute", top: "84px", left: "16px", right: "16px", maxWidth: "388px", marginLeft: "auto" }}>
        <h2 id="oib-title" style={{ fontSize: "22px", fontWeight: 700, margin: "0 0 6px" }}>Open this in your browser</h2>
        <p style={{ color: T.mid, fontSize: "16px", margin: 0 }}>Tap ... at the top, then "Open in browser".</p>
      </div>
    </div>
  );
}

/** Design screen 14: dismissible banner above the buttons at 10 and 25 swipes; the deck stays usable. */
export function SoftPrompt({ at, onGetApp, onLater }) {
  const text = at >= 25 ? "25 swipes in, and 10 left on the web. Only the app can match you with friends."
    : "10 swipes in. Some of your friends may want the same plans. The app shows you who.";
  return (
    <div role="status" className="toast-in" style={{ background: T.surface1, borderRadius: "12px", padding: "12px 14px", margin: "12px 0 0", display: "flex", alignItems: "center", gap: "12px" }}>
      <p style={{ flex: 1, fontSize: "14px", lineHeight: 1.5, color: T.high, margin: 0 }}>{text}</p>
      <button onClick={onLater} style={{ background: "none", border: "none", color: T.mid, fontFamily: font, fontSize: "14px", cursor: "pointer", padding: "8px 4px" }}>Later</button>
      <button onClick={onGetApp} className="pill" style={{ background: T.high, color: T.bg, border: "none", borderRadius: "999px", fontFamily: font, fontWeight: 700, fontSize: "14px", padding: "10px 14px", cursor: "pointer", whiteSpace: "nowrap" }}>Get Tandem free</button>
    </div>
  );
}

/** Design screen 15 (the one showpiece): two cards slide together with a mint burst. */
export function MatchScreen({ match, card, onGetApp, onKeepSwiping, onStuck }) {
  const box = useRef(null);
  useSheetKeys(box, onKeepSwiping);
  const friend = match.firstName || "A friend";
  const tile = { width: "132px", height: "176px", borderRadius: "14px", overflow: "hidden", background: T.surface2, boxShadow: "0 12px 32px rgba(0,0,0,0.6)" };
  return (
    <div ref={box} role="dialog" aria-modal="true" aria-labelledby="match-title"
      style={{ position: "fixed", inset: 0, zIndex: 1900, background: "rgba(17,17,17,0.96)", color: T.high, fontFamily: font, display: "flex",
        flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px 16px calc(24px + env(safe-area-inset-bottom))", animation: "deckIn 0.2s" }}>
      <div style={{ position: "relative", height: "200px", width: "260px", marginBottom: "28px" }}>
        <div className="match-burst" aria-hidden="true" />
        <div className="match-left" style={{ ...tile, position: "absolute", left: "8px", top: "8px" }}>
          {match.photo ? <img src={match.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "48px", fontWeight: 800 }}>{friend[0]}</div>}
        </div>
        <div className="match-right" style={{ ...tile, position: "absolute", right: "8px", top: "8px" }}>
          {card?.poster ? <img src={card.poster} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <div style={{ height: "100%", display: "flex", alignItems: "flex-end", padding: "12px", fontSize: "16px", fontWeight: 800, lineHeight: 1.15 }}>{card?.title}</div>}
        </div>
      </div>
      <div className="match-text" style={{ maxWidth: "388px", width: "100%", textAlign: "center" }}>
        <h2 id="match-title" className="text-[28px] md:text-[36px]" style={{ fontWeight: 700, lineHeight: 1.15, margin: "0 0 8px" }}>{friend} is in too!</h2>
        <p style={{ color: T.mid, fontSize: "16px", margin: "0 0 24px" }}>{card?.title}{card?.day ? `, ${card.day}` : ""}. Plan it together in the app.</p>
        <button onClick={onGetApp} style={pill(true)} autoFocus>Plan it in Tandem</button>
        <p style={{ color: T.low, fontSize: "14px", margin: "10px 0 0" }}>Free on iPhone and Android. Sign in with the same number.</p>
        <button onClick={onKeepSwiping} style={{ ...pill(false), marginTop: "14px" }}>Keep swiping</button>
        <OpenTandemLink onStuck={onStuck} />
      </div>
    </div>
  );
}

