import React, { useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import StoreButtons from "../assets/store-buttons.svg";
import Wordmark from "../assets/tandem-wordmark.svg";
import CityPicker from "./CityPicker";
import { DesktopAppPrompt } from "./AppPrompts";
import { T, font } from "../lib/card";

const APP_STORE = "https://apps.apple.com/in/app/tandem-events-experiences/id6756263621";
const PLAY = "https://play.google.com/store/apps/details?id=com.tandemit.tandemit";
const CONTACT = "support@tandem.app"; // same address as the account-deletion page

/** Official App Store + Google Play badges (store-buttons.svg is 560x50: App Store 0-272, Play 288-560). */
export function StoreBadges({ width = 336 }) {
  return (
    <div style={{ position: "relative", width: "100%", maxWidth: `${width}px` }}>
      <img src={StoreButtons} alt="Download on the App Store and get it on Google Play" draggable={false} style={{ display: "block", width: "100%", height: "auto" }} />
      <a href={APP_STORE} target="_blank" rel="noopener noreferrer" aria-label="Download on the App Store"
        style={{ position: "absolute", top: 0, left: 0, width: "48.5%", height: "100%", borderRadius: "24px" }} />
      <a href={PLAY} target="_blank" rel="noopener noreferrer" aria-label="Get it on Google Play"
        style={{ position: "absolute", top: 0, right: 0, width: "48.5%", height: "100%", borderRadius: "24px" }} />
    </div>
  );
}

/**
 * Handoff "Header": phone 60px, wordmark left and city chip right, nothing else (fits at 320px; FAQ is
 * in the footer). From 640px: 64px with a bottom border, city chip next to the wordmark, FAQ and
 * "Get Tandem free" (outline pill) on the right.
 */
export function SiteHeader({ city, onCity }) {
  const [qr, setQr] = useState(false);
  // AppPrompt rule: decide by pointer, not user agent. Touch → /download (the right store, with UTM);
  // mouse → the store badges in the footer, or the QR prompt on pages without one
  const getTandem = (e) => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    e.preventDefault();
    const footer = document.getElementById("get-app");
    if (footer) footer.scrollIntoView({ behavior: "smooth" }); else setQr(true);
  };
  const chip = onCity && <CityPicker city={city} onChange={onCity} />;
  return (
    <header className="hdr">
      <div className="hdr-left">
        <Link to="/" aria-label="Tandem home" style={{ display: "flex", alignItems: "center", minHeight: "44px" }}>
          <img src={Wordmark} alt="tandem" width="138" height="32" className="hdr-wordmark" />
        </Link>
        {chip && <span className="hidden sm:inline-flex">{chip}</span>}
      </div>
      {chip && <span className="sm:hidden">{chip}</span>}
      <nav className="hdr-right" aria-label="Main">
        <Link to="/faq" className="hdr-link">FAQ</Link>
        <a href={`/download${typeof window !== "undefined" ? window.location.search : ""}`} onClick={getTandem} className="outline-pill">Get Tandem free</a>
      </nav>
      {/* Portal: the header's backdrop-filter would trap a fixed modal inside the header */}
      {qr && createPortal(<DesktopAppPrompt onClose={() => setQr(false)} />, document.body)}
    </header>
  );
}

/** Design screen 42: store badges, FAQ, Privacy Policy, Terms, contact. */
export function SiteFooter() {
  const link = { color: T.mid, fontSize: "14px", textDecoration: "none" };
  return (
    <footer id="get-app" style={{ borderTop: `1px solid ${T.line}`, marginTop: "96px", padding: "48px 0 calc(48px + env(safe-area-inset-bottom))", fontFamily: font }}>
      <div className="px-4 md:px-6" style={{ maxWidth: "1120px", margin: "0 auto", display: "flex", flexWrap: "wrap", gap: "28px 48px", alignItems: "flex-end", justifyContent: "space-between" }}>
        <div>
          <p className="wide text-[24px] md:text-[30px]" style={{ color: T.high, fontWeight: 700, lineHeight: 1.15, margin: "0 0 18px", maxWidth: "460px" }}>Get Tandem on iPhone and Android.</p>
          <StoreBadges />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <nav aria-label="Footer" style={{ display: "flex", flexWrap: "wrap", gap: "12px 28px" }}>
            <Link to="/faq" style={link}>FAQ</Link>
            <Link to="/legal/privacy-policy" style={link}>Privacy Policy</Link>
            <Link to="/legal/terms-and-conditions" style={link}>Terms</Link>
            <a href={`mailto:${CONTACT}`} style={link}>Contact</a>
          </nav>
          <p style={{ color: T.low, fontSize: "12px", margin: 0 }}>Questions? <Link to="/faq" style={{ color: T.green, textDecoration: "none" }}>Read the FAQ</Link>.</p>
        </div>
      </div>
    </footer>
  );
}
