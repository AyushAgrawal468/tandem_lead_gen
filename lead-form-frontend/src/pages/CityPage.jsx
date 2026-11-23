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
    <div className="aurora" style={{ minHeight: "100dvh", background: T.bg, color: T.high, fontFamily: font }}>
      <Seo title={page.title} description={page.description} path={`/${slug}`} jsonLd={jsonLd} />
      <main className="px-4 md:px-6" style={{ maxWidth: "1120px", margin: "0 auto", paddingTop: "16px" }}>
        <SiteHeader city={city} onCity={setCity} />
        <div className="md:grid md:grid-cols-[1.1fr_1fr] md:gap-16 md:items-center" style={{ marginTop: "32px" }}>
          <div>
            <h1 className="wide text-[29px] xs:text-[31px] md:text-[60px]" style={{ fontWeight: 800, lineHeight: 1.05, margin: 0 }}>Things to do in {page.city} with friends</h1>
            <p className="text-[16px] md:text-[18px]" style={{ color: T.mid, lineHeight: 1.5, margin: "20px 0 0", maxWidth: "560px" }}>{page.intro}</p>
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
