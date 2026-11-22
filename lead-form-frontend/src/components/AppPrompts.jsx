import React, { useRef } from "react";
import QrCardBg from "../assets/qr-card-bg.svg";
import QrCode from "../assets/qr-code.svg";
import StoreButtons from "../assets/store-buttons.svg";
import { T, font } from "../lib/card";
import { openTandemUrl, whenStuck } from "../lib/app";
import { useSheetKeys } from "../lib/useSheetKeys";
import { track } from "../lib/analytics";

// Handoff 2.6: app prompts. Copy from "Every screen and its copy".
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
      <a href={href} onClick={() => { track("open_tandem_tapped"); whenStuck(onStuck); }} style={{ color: T.green, textDecoration: "none", fontWeight: 700 }}>Open Tandem</a>
    </p>
  );
}

/** Design screen 20: any app prompt on desktop is a QR code plus the official store badges. */
export function DesktopAppPrompt({ onClose }) {
  const box = useRef(null);
  useSheetKeys(box, onClose);
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000, padding: "16px" }}>
      <div ref={box} role="dialog" aria-modal="true" aria-labelledby="dl-title" onClick={(e) => e.stopPropagation()} className="sheet-in"
        style={{ position: "relative", background: T.surface1, color: T.high, fontFamily: font, borderRadius: "20px", padding: "28px 24px", maxWidth: "400px", width: "100%", textAlign: "center" }}>
        <button onClick={onClose} aria-label="Close" autoFocus
          style={{ position: "absolute", top: "12px", right: "12px", width: "36px", height: "36px", padding: 0, borderRadius: "50%", border: "none",
            background: "transparent", color: T.low, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
        <h2 id="dl-title" style={{ fontSize: "24px", fontWeight: 700, margin: "0 0 8px" }}>Get Tandem on your phone</h2>
        <p style={{ color: T.mid, fontSize: "16px", margin: "0 0 20px" }}>Scan with your phone camera.</p>
        <div style={{ position: "relative", width: "200px", height: "200px", margin: "0 auto 20px" }}>
          <img src={QrCardBg} alt="" width={200} height={200} style={{ display: "block" }} />
          <img src={QrCode} alt="QR code to download Tandem"
            style={{ position: "absolute", top: "14px", left: "50%", transform: "translateX(-50%)", width: "108px", height: "108px", objectFit: "contain" }} />
        </div>
        {/* store-buttons.svg is 560x50: App Store 0-272, Google Play 288-560 */}
        <div style={{ position: "relative", width: "100%", maxWidth: "336px", margin: "0 auto" }}>
          <img src={StoreButtons} alt="Download on the App Store and Google Play" draggable={false} style={{ display: "block", width: "100%", height: "auto" }} />
          <a href="https://apps.apple.com/in/app/tandem-events-experiences/id6756263621" target="_blank" rel="noopener noreferrer" aria-label="Download on the App Store"
            style={{ position: "absolute", top: 0, left: 0, width: "48.5%", height: "100%", borderRadius: "24px" }} />
          <a href="https://play.google.com/store/apps/details?id=com.tandemit.tandemit" target="_blank" rel="noopener noreferrer" aria-label="Get it on Google Play"
            style={{ position: "absolute", top: 0, right: 0, width: "48.5%", height: "100%", borderRadius: "24px" }} />
        </div>
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
  const text = at >= 25 ? "25 swipes in. Only the app can match you with friends."
    : "10 swipes in. Get the app and allow contacts to see which friends want the same.";
  return (
    <div role="status" className="toast-in" style={{ background: T.surface1, borderRadius: "12px", padding: "12px 14px", margin: "12px 0 0", display: "flex", alignItems: "center", gap: "12px" }}>
      <p style={{ flex: 1, fontSize: "14px", lineHeight: 1.5, color: T.high, margin: 0 }}>{text}</p>
      <button onClick={onLater} style={{ background: "none", border: "none", color: T.mid, fontFamily: font, fontSize: "14px", cursor: "pointer", padding: "8px 4px" }}>Later</button>
      <button onClick={onGetApp} style={{ background: T.high, color: T.bg, border: "none", borderRadius: "999px", fontFamily: font, fontWeight: 700, fontSize: "14px", padding: "10px 14px", cursor: "pointer", whiteSpace: "nowrap" }}>Get the app</button>
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
        <button onClick={onGetApp} style={pill(true)} autoFocus>Get the app</button>
        <button onClick={onKeepSwiping} style={{ ...pill(false), marginTop: "10px" }}>Keep swiping</button>
        <OpenTandemLink onStuck={onStuck} />
      </div>
    </div>
  );
}

