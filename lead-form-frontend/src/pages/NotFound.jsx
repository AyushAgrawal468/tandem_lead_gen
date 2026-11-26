import React from "react";
import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import { SiteHeader } from "../components/SiteChrome";
import { EventCard } from "../components/deck/EventCard";
import { initialCity } from "../lib/city";
import { T, font } from "../lib/card";

/**
 * 404 (canvas J3-39): a greyed card, the heading at the bottom, "See plans". noindex, because nginx serves unknown routes with a 200 through the
 * spa.html fallback, so this is the only thing telling crawlers the page doesn't exist.
 */
export default function NotFound() {
  const city = initialCity();
  return (
    <div className="aurora" style={{ minHeight: "100dvh", background: T.bg, color: T.high, fontFamily: font }}>
      <Seo title="Page not found | Tandem" description="This page took a wrong turn. See what's on near you instead." path="/404" noindex />
      <main style={{ maxWidth: "420px", margin: "0 auto", padding: "0 16px calc(32px + env(safe-area-inset-bottom))", minHeight: "100dvh", boxSizing: "border-box", display: "flex", flexDirection: "column" }}>
        <SiteHeader />
        <div className="ghost" aria-hidden="true">
          <EventCard event={{ title: "Speed Friending", displayDate: "Every Saturday", displayPrice: "₹199 onwards", category: "social" }} />
        </div>
        <div style={{ flex: "1 1 auto", minHeight: "24px" }} />
        <h1 className="nf-h1">This page took a wrong turn</h1>
        <p style={{ color: T.mid, fontSize: "16px", lineHeight: 1.5, margin: "10px 0 24px" }}>Here's what's on in {city} instead.</p>
        <Link to={`/swipe?city=${encodeURIComponent(city)}`} className="btn-primary">See plans</Link>
      </main>
    </div>
  );
}
