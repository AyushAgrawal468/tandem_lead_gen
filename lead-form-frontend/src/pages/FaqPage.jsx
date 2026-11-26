import React, { useState } from "react";
import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import { SiteHeader, SiteFooter } from "../components/SiteChrome";
import { RailCard } from "./HomePage";
import { useCityFeed } from "../lib/feed";
import { initialCity } from "../lib/city";
import { QA, FAQ_ORDER, faqJsonLd } from "../lib/faq";
import { T, font } from "../lib/card";

// First sentence in bright text, the rest muted (canvas J3-38)
const split = (a) => { const i = a.indexOf(". "); return i < 0 ? [a, ""] : [a.slice(0, i + 1), a.slice(i + 1)]; };

/**
 * /faq (canvas J3-38 / J3-D38): each question an H2, answered in its first sentence, no accordions.
 * Then "See what's on in {city}" with a live card (desktop, sticky on the right) and "See plans".
 */
export default function FaqPage() {
  const [city, setCity] = useState(initialCity);
  const feed = useCityFeed(city);
  const to = `/swipe?city=${encodeURIComponent(city)}`;
  return (
    <div className="aurora" style={{ minHeight: "100dvh", background: T.bg, color: T.high, fontFamily: font }}>
      <Seo title="Tandem FAQ: how matching, pricing and privacy work" path="/faq" jsonLd={faqJsonLd(FAQ_ORDER)}
        description="How Tandem works, what it costs, which cities it's in, and what your friends can and can't see." />
      <div className="page">
        <SiteHeader city={city} onCity={setCity} />
        <main className="faq">
          <div className="faq-main">
            <h1>Tandem FAQ</h1>
            <div>
              {FAQ_ORDER.map((k) => {
                const [lead, rest] = split(QA[k][1]);
                return (
                  <article key={k}>
                    <h2>{QA[k][0]}</h2>
                    <p><b>{lead}</b>{rest}</p>
                  </article>
                );
              })}
            </div>
          </div>
          <aside className="faq-aside">
            <b>See what's on in {city}</b>
            {feed?.cards[0] && <div className="desk-only"><RailCard c={feed.cards[0]} to={to} /></div>}
            <Link to={to} className="btn-primary">See plans</Link>
          </aside>
        </main>
      </div>
      <SiteFooter />
    </div>
  );
}
