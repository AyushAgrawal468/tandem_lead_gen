import React, { useState } from "react";
import DeckScreen from "../components/DeckScreen";
import Seo, { SITE } from "../components/Seo";
import { SiteHeader, SiteFooter, StoreBadges } from "../components/SiteChrome";
import { HowItWorks, WeekendRail } from "./HomePage";
import { useCityFeed, railCards } from "../lib/feed";
import { CITY_PAGES } from "../lib/faq";
import { T, font } from "../lib/card";

const SUB = "See what's on and swipe on what you'd do. Get the app to find friends who want to go too.";

/**
 * City pages (canvas J3-37 / J3-D37): /bengaluru and /mumbai. The deck preset to the city, the sub line and
 * the original intro, this weekend's plans, how it works, footer (with the badges). Place details in the JSON-LD.
 */
export default function CityPage({ slug }) {
  const page = CITY_PAGES[slug];
  const [city, setCity] = useState(page.city);
  const feed = useCityFeed(city);
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
        <DeckScreen city={city} onCity={setCity} scrollable h1={`Things to do in ${page.city} with friends`}
          aside={<>
            <p style={{ color: T.high, fontSize: "18px", lineHeight: 1.5, margin: "0 0 12px", maxWidth: "500px" }}>{SUB}</p>
            <p style={{ color: T.mid, fontSize: "16px", lineHeight: 1.55, margin: "0 0 24px", maxWidth: "500px" }}>{page.intro}</p>
            <StoreBadges width={300} />
          </>} />
        <div className="home">
          {/* Phones: the intro sits under the deck screen, so the deck stays one screen tall */}
          <div className="phone-intro">
            <p className="lead" style={{ color: T.high }}>{SUB}</p>
            <p className="lead">{page.intro}</p>
          </div>
          <WeekendRail feed={feed} city={city} />
          <HowItWorks cards={railCards(feed).cards} />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
