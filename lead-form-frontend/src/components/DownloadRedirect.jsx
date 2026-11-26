import { useEffect, useState } from "react";
import { storeUrl, whenStuck } from "../lib/app";
import { Bridge, OpenInBrowser } from "./AppPrompts";
import { SiteHeader, StoreBadges } from "./SiteChrome";
import QrCode from "./QrCode";
import Seo from "./Seo";
import { T, font } from "../lib/card";

// Every app prompt goes through /download (handoff 2.6): on phones the store link carries the visitor's
// campaign (Play referrer, App Store ct/pt), and a stuck iOS in-app browser gets "Open in browser".
// Desktop never gets a store link (handoff audit #12): it gets this QR page (canvas J3-D40: copy, badges and steps left, QR right). Decided by
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
      <Seo title="Get Tandem on your phone | Tandem" description="Scan the code with your phone camera to get Tandem on iPhone or Android." path="/download" noindex />
      <main className="page">
        <SiteHeader />
        <div className="dl">
          <div className="dl-copy">
            <h1>Get Tandem on your phone</h1>
            <p>Scan with your phone camera to download.</p>
            <StoreBadges />
            <div style={{ maxWidth: "460px" }}><Bridge compact /></div>
          </div>
          <div className="dl-qr"><QrCode size={280} /></div>
        </div>
      </main>
    </div>
  );
}
