import React, { useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import StoreButtons from "../assets/store-buttons.svg";
import Wordmark from "../assets/tandem-wordmark.svg";
import CityPicker from "./CityPicker";
import { DesktopAppPrompt } from "./AppPrompts";

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

/** Footer (canvas J3-36 / J3-D36, all content pages): app line + badges, one row of links, the wordmark cut off at the bottom. */
export function SiteFooter() {
  return (
    <div className="foot-wrap">
      <footer id="get-app" className="foot">
        <div className="foot-in">
          <div className="foot-app">
            <p>Get Tandem on iPhone and Android.</p>
            <StoreBadges width={300} />
          </div>
          <nav aria-label="Footer">
            <Link to="/faq">Questions? Read the FAQ.</Link>
            <Link to="/legal/privacy-policy">Privacy Policy</Link>
            <Link to="/legal/terms-and-conditions">Terms</Link>
            <a href={`mailto:${CONTACT}`}>Contact</a>
          </nav>
        </div>
      </footer>
      <div className="foot-mark" aria-hidden="true" style={{ WebkitMaskImage: `url(${Wordmark})`, maskImage: `url(${Wordmark})` }} />
    </div>
  );
}
