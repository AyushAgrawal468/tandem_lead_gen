import React, { useState } from "react";
import DeckScreen from "../components/DeckScreen";
import Seo from "../components/Seo";
import { SiteHeader } from "../components/SiteChrome";
import { initialCity } from "../lib/city";
import { CREATORS } from "../lib/funnel";
import { firstTouch } from "../lib/analytics";
import { T, font } from "../lib/card";

// "Saw {creator}'s reel?" when the link (or the first visit) came from a known reel campaign
function creatorName() {
  if (typeof window === "undefined") return null;
  const campaign = new URLSearchParams(window.location.search).get("utm_campaign") || firstTouch().utm_campaign;
  return CREATORS[campaign] || null;
}

/** Journey 1 (/swipe): cards first. */
export default function SwipePage() {
  const [city, setCity] = useState(initialCity);
  const [creator] = useState(creatorName);
  return (
    <div className="aurora" style={{ minHeight: "100dvh", background: T.bg, color: T.high, fontFamily: font }}>
      <Seo title="Swipe on things to do near you | Tandem" path="/"
        description="See what's on in your city, swipe right on what you'd do, and get matched with friends who want the same plan." />
      <main className="page">
        <SiteHeader city={city} onCity={setCity} />
        <DeckScreen city={city}
          h1={creator ? `Saw ${creator}'s reel? Here's what's on in ${city}.` : "Swipe on things to do. Match with friends who want the same."} />
        {/* The crawlable paragraph (snapshot rule 3), under the deck screen */}
        <p style={{ color: T.mid, fontSize: "14px", lineHeight: 1.5, margin: "24px 0 32px", maxWidth: "640px" }}>
          Tandem shows you what's on in your city, from gigs and comedy to treks and food walks. Swipe right on what you'd actually do. When a friend wants the same plan, you both get matched.
        </p>
      </main>
    </div>
  );
}
