import { useEffect, useState } from "react";
import { storeUrl, whenStuck } from "../lib/app";
import { Bridge, OpenInBrowser } from "./AppPrompts";
import { SiteHeader, StoreBadges } from "./SiteChrome";
import QrCardBg from "../assets/qr-card-bg.svg";
import QrCode from "../assets/qr-code.svg";
import { T, font } from "../lib/card";

// Every app prompt goes through /download (handoff 2.6): on phones the store link carries the visitor's
// campaign (Play referrer, App Store ct/pt), and a stuck iOS in-app browser gets "Open in browser".
// Desktop never gets a store link (handoff audit #12): it gets this QR page (board J3-D40). Decided by
// pointer, not user agent, so a touch laptop with a mouse still gets the QR.
export default function DownloadRedirect() {
  const [stuck, setStuck] = useState(false);
  const desktop = typeof window !== "undefined" && !window.matchMedia("(pointer: coarse)").matches;
  useEffect(() => {
    if (desktop) return;
    whenStuck(() => setStuck(true));
    window.location.replace(storeUrl());
  }, [desktop]);

  if (!desktop) return stuck ? <OpenInBrowser onClose={() => setStuck(false)} /> : null;
  return (
    <div className="aurora" style={{ minHeight: "100dvh", background: T.bg, color: T.high, fontFamily: font }}>
      <main className="page">
        <SiteHeader />
        <div style={{ maxWidth: "440px", margin: "56px auto 48px", textAlign: "center" }}>
          <h1 style={{ fontSize: "40px", lineHeight: 1.05, fontWeight: 800, fontStretch: "118%", margin: "0 0 10px" }}>Get Tandem on your phone</h1>
          <p style={{ color: T.mid, fontSize: "16px", margin: "0 0 28px" }}>Scan with your phone camera.</p>
          <div style={{ position: "relative", width: "220px", height: "220px", margin: "0 auto 24px" }}>
            <img src={QrCardBg} alt="" width={220} height={220} style={{ display: "block" }} />
            <img src={QrCode} alt="QR code to download Tandem"
              style={{ position: "absolute", top: "15px", left: "50%", transform: "translateX(-50%)", width: "120px", height: "120px", objectFit: "contain" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}><StoreBadges /></div>
          <Bridge />
        </div>
      </main>
    </div>
  );
}
