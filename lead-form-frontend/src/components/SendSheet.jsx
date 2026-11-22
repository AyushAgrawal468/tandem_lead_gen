import React, { useRef } from "react";
import { T, font, metaLine } from "../lib/card";
import { useSheetKeys } from "../lib/useSheetKeys";
import { shareLink, shareText, whatsappUrl } from "../lib/share";
import { track } from "../lib/analytics";

const pill = (main) => ({
  display: "block", width: "100%", boxSizing: "border-box", textAlign: "center", textDecoration: "none", minHeight: "48px", padding: "14px",
  borderRadius: "999px", border: "none", fontFamily: font, fontWeight: 700, fontSize: "16px", cursor: "pointer",
  background: main ? T.high : T.surface2, color: main ? T.bg : T.high,
});

/**
 * Handoff 2.5 / design screen 13: "Know someone who'd go to {event}?". WhatsApp (wa.me, WhatsApp Web
 * on desktop) plus Copy link on desktop. Tandem never sees who it goes to.
 */
export default function SendSheet({ card, referralCode, onClose, onSent }) {
  const box = useRef(null);
  useSheetKeys(box, onClose);
  const link = shareLink(card.id, referralCode);
  const text = shareText(card, link);

  const copy = async () => {
    track("share_tapped", { eventId: card.id, channel: "copy_link", verified: !!referralCode });
    try { await navigator.clipboard.writeText(link); onSent("Link copied."); } catch { onSent("Couldn't copy the link."); }
  };

  return (
    <div onClick={onClose} className="items-end md:items-center"
      style={{ position: "fixed", inset: 0, zIndex: 1800, background: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center", animation: "deckIn 0.2s" }}>
      <div ref={box} role="dialog" aria-modal="true" aria-labelledby="send-title" onClick={(e) => e.stopPropagation()}
        className="rounded-t-[20px] md:rounded-[20px] sheet-in"
        style={{ background: T.surface1, color: T.high, fontFamily: font, width: "100%", maxWidth: "420px", padding: "24px 16px calc(24px + env(safe-area-inset-bottom))" }}>
        <div style={{ display: "flex", gap: "12px", alignItems: "center", background: T.bg, borderRadius: "12px", padding: "10px", marginBottom: "16px" }}>
          <div style={{ width: "48px", height: "64px", flexShrink: 0, borderRadius: "6px", overflow: "hidden", background: T.surface2 }}>
            {card.poster && <img src={card.poster} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontWeight: 700, fontSize: "16px", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{card.title}</p>
            {metaLine(card) && <p style={{ color: T.low, fontSize: "14px", margin: "2px 0 0" }}>{metaLine(card)}</p>}
          </div>
        </div>
        <h2 id="send-title" className="text-[22px] md:text-[24px]" style={{ fontWeight: 700, lineHeight: 1.2, margin: "0 0 6px" }}>Know someone who'd go to {card.title}?</h2>
        <p style={{ color: T.mid, fontSize: "16px", lineHeight: 1.5, margin: "0 0 16px" }}>Send it to them. If they're in, it's a plan.</p>
        <a href={whatsappUrl(text)} target="_blank" rel="noopener noreferrer" autoFocus style={pill(true)}
          onClick={() => { track("share_tapped", { eventId: card.id, channel: "whatsapp", verified: !!referralCode }); onSent("Sent. When they say they're in, you'll see it in the app."); }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2.1-5.4A8.4 8.4 0 1 1 21 11.5z" /></svg>
            Send on WhatsApp
          </span>
        </a>
        <button onClick={copy} className="hidden md:block" style={{ ...pill(false), marginTop: "10px" }}>Copy link</button>
        <button onClick={onClose} style={{ ...pill(false), marginTop: "10px" }}>Not now</button>
      </div>
    </div>
  );
}
