import React, { useState } from "react";
import DeckScreen from "../components/DeckScreen";
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
    <div className="aurora" style={{ minHeight: "100dvh", background: T.bg, color: T.high, fontFamily: font }}>
      <Seo title={page.title} description={page.description} path={`/${slug}`} jsonLd={jsonLd} />
      <main className="page">
        <SiteHeader city={city} onCity={setCity} />
        <DeckScreen city={city} onCity={setCity} h1={`Things to do in ${page.city} with friends`}
          aside={<p style={{ color: T.mid, fontSize: "18px", lineHeight: 1.5, margin: 0, maxWidth: "560px" }}>{page.intro}</p>} />
        {/* Phones: the intro sits under the deck screen, so the deck stays one screen tall */}
        <p className="phone-only" style={{ color: T.mid, fontSize: "16px", lineHeight: 1.5, margin: "32px 0 0" }}>{page.intro}</p>
        <HowItWorks />
      </main>
      <SiteFooter />
    </div>
  );
}
