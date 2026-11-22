import React, { useState } from "react";
import SwipeDeck from "../components/SwipeDeck";
import Seo, { SITE } from "../components/Seo";
import { SiteHeader, SiteFooter } from "../components/SiteChrome";
import { HowItWorks } from "./HomePage";
import { CITY_PAGES } from "../lib/faq";
import { T, font } from "../lib/card";

/**
 * City pages (handoff 3.2 / design screen 37): /bengaluru and /mumbai. Original intro, the deck preset
 * to the city, how it works, badges, footer. Place details in the JSON-LD.
 */
export default function CityPage({ slug }) {
  const page = CITY_PAGES[slug];
  const [city, setCity] = useState(page.city);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: page.title,
    url: `${SITE}/${slug}`,
    description: page.intro,
    about: {
      "@type": "City",
      name: page.city,
      geo: { "@type": "GeoCoordinates", latitude: page.lat, longitude: page.lng },
      containedInPlace: { "@type": "Country", name: "India" },
    },
  };
  return (
    <div style={{ minHeight: "100dvh", background: T.bg, color: T.high, fontFamily: font }}>
      <Seo title={page.title} description={page.description} path={`/${slug}`} jsonLd={jsonLd} />
      <main style={{ maxWidth: "1040px", margin: "0 auto", padding: "16px 16px 0" }}>
        <SiteHeader city={city} onCity={setCity} />
        <div className="md:grid md:grid-cols-2 md:gap-12 md:items-start" style={{ marginTop: "24px" }}>
          <div className="md:pt-16">
            <h1 className="text-[40px] md:text-[56px]" style={{ fontWeight: 700, lineHeight: 1.1, margin: 0 }}>Things to do in {page.city} with friends</h1>
            <p style={{ color: T.mid, fontSize: "16px", lineHeight: 1.5, margin: "16px 0 0", maxWidth: "640px" }}>{page.intro}</p>
          </div>
          <div style={{ maxWidth: "420px", width: "100%", margin: "24px auto 0" }}>
            <SwipeDeck city={city} />
          </div>
        </div>
        <HowItWorks />
      </main>
      <SiteFooter />
    </div>
  );
}
