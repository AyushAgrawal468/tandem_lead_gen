import React from "react";
import { Link } from "react-router-dom";
import StoreButtons from "../assets/store-buttons.svg";
import CityPicker from "./CityPicker";
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

/** Design screens 1 and 36: wordmark, city chip (pages with a deck), FAQ link. */
export function SiteHeader({ city, onCity }) {
  return (
    <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", fontFamily: font }}>
      <Link to="/" className="wide" style={{ color: T.green, fontWeight: 800, fontSize: "24px", textDecoration: "none" }}>tandem</Link>
      <nav style={{ display: "flex", alignItems: "center", gap: "18px" }}>
        <Link to="/faq" style={{ color: T.high, fontSize: "15px", textDecoration: "none", opacity: 0.85 }}>FAQ</Link>
        {onCity && <CityPicker city={city} onChange={onCity} />}
      </nav>
    </header>
  );
}

/** Design screen 42: store badges, FAQ, Privacy Policy, Terms, contact. */
export function SiteFooter() {
  const link = { color: T.mid, fontSize: "14px", textDecoration: "none" };
  return (
    <footer style={{ borderTop: `1px solid ${T.line}`, marginTop: "96px", padding: "48px 0 calc(48px + env(safe-area-inset-bottom))", fontFamily: font }}>
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
