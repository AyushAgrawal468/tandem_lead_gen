import React from "react";
import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import { SiteHeader } from "../components/SiteChrome";
import { initialCity } from "../lib/city";
import { T, font } from "../lib/card";

/**
 * 404 (design screen 39). noindex, because nginx serves unknown routes with a 200 through the
 * spa.html fallback, so this is the only thing telling crawlers the page doesn't exist.
 */
export default function NotFound() {
  const city = initialCity();
  return (
    <div style={{ minHeight: "100dvh", background: T.bg, color: T.high, fontFamily: font }}>
      <Seo title="Page not found | Tandem" description="This page took a wrong turn. See what's on near you instead." path="/404" noindex />
      <main style={{ maxWidth: "420px", margin: "0 auto", padding: "16px" }}>
        <SiteHeader />
        <div aria-hidden="true" style={{ marginTop: "32px", background: T.surface1, borderRadius: "16px", padding: "12px", opacity: 0.4 }}>
          <div style={{ height: "280px", borderRadius: "10px", background: T.surface2 }} />
          <div style={{ height: "18px", width: "60%", borderRadius: "4px", background: T.surface2, margin: "14px 2px 8px" }} />
          <div style={{ height: "14px", width: "40%", borderRadius: "4px", background: T.surface2, margin: "0 2px 6px" }} />
        </div>
        <h1 style={{ fontSize: "22px", fontWeight: 700, margin: "24px 0 6px" }}>This page took a wrong turn</h1>
        <p style={{ color: T.mid, fontSize: "16px", margin: "0 0 20px" }}>Here's what's on in {city} instead.</p>
        <Link to="/swipe" style={{ display: "block", textAlign: "center", textDecoration: "none", minHeight: "48px", boxSizing: "border-box", padding: "14px",
          borderRadius: "999px", background: T.high, color: T.bg, fontWeight: 700, fontSize: "16px" }}>See plans</Link>
      </main>
    </div>
  );
}
