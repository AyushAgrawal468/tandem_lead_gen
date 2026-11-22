import React, { useState } from "react";
import { Helmet } from "react-helmet";
import SwipeDeck from "../components/SwipeDeck";
import Seo, { SITE } from "../components/Seo";
import { SiteHeader, SiteFooter } from "../components/SiteChrome";
import { initialCity, SUPPORTED_CITIES } from "../lib/city";
import { STEPS, QA } from "../lib/faq";
import { T, font } from "../lib/card";

const GA_ID = "G-XTYRTQY6R7";

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization", "@id": `${SITE}/#org`, name: "Tandem", url: SITE,
      sameAs: ["https://www.instagram.com/get.tandem", "https://www.linkedin.com/company/orbitandem", "https://www.youtube.com/@Get_Tandem", "https://x.com/get_tandem2025"],
    },
    { "@type": "WebSite", "@id": `${SITE}/#website`, name: "Tandem", url: SITE, publisher: { "@id": `${SITE}/#org` } },
    {
      "@type": "MobileApplication", name: "Tandem", operatingSystem: "Android, iOS", applicationCategory: "LifestyleApplication",
      offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
      installUrl: ["https://apps.apple.com/in/app/tandem-events-experiences/id6756263621", "https://play.google.com/store/apps/details?id=com.tandemit.tandemit"],
      publisher: { "@id": `${SITE}/#org` },
    },
  ],
};

const body = { color: T.mid, fontSize: "16px", lineHeight: 1.5, margin: 0 };
// Section labels use Yellow on the background (design brief)
const label = { margin: "0 0 8px", fontSize: "14px", fontWeight: 700, letterSpacing: "1px", color: "#C1F546" };

/** One answer in the homepage grid: an H2 question answered in its first sentence. */
function Answer({ q, children }) {
  return (
    <section>
      <h2 className="text-[24px] md:text-[28px]" style={{ fontWeight: 700, lineHeight: 1.15, margin: "0 0 12px" }}>{QA[q][0]}</h2>
      {children || <p style={body}>{QA[q][1]}</p>}
    </section>
  );
}

/** "How does Tandem work?" as three step cards (design screen 36); also on the city pages (3.2). */
export function HowItWorks() {
  return (
    <section style={{ marginTop: "64px" }}>
      <p style={label}>HOW IT WORKS</p>
      <h2 className="text-[28px] md:text-[36px]" style={{ fontWeight: 700, lineHeight: 1.15, margin: "0 0 28px" }}>{QA.how[0]}</h2>
      <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" }}>
        {STEPS.map(([title, text], i) => (
          <li key={title} style={{ background: T.surface1, borderRadius: "16px", padding: "24px" }}>
            <span aria-hidden="true" style={{ width: "40px", height: "40px", borderRadius: "50%", background: T.green, color: T.bg,
              fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</span>
            <h3 style={{ margin: "16px 0 6px", fontSize: "20px", fontWeight: 700 }}>{title.replace(/\.$/, "")}</h3>
            <p style={body}>{text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

/**
 * Journey 3 homepage (handoff 3.1 / design screen 36): the promise and the live deck above the fold,
 * then real-text answers crawlers read. Swiping here runs the full Journey 1 flow.
 */
export default function HomePage() {
  const [city, setCity] = useState(initialCity);
  return (
    <div style={{ minHeight: "100dvh", background: T.bg, color: T.high, fontFamily: font }}>
      <Seo title="Tandem: things to do with friends in Bengaluru, Mumbai and more" path="/" jsonLd={JSON_LD}
        description="Swipe on concerts, comedy, treks and food walks near you. When a friend wants the same plan, Tandem matches you. Free on iOS and Android." />
      <Helmet>
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}></script>
        <script>{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}</script>
      </Helmet>

      <main className="px-4 md:px-6" style={{ maxWidth: "1120px", margin: "0 auto", paddingTop: "16px" }}>
        <SiteHeader city={city} onCity={setCity} />

        <div className="md:grid md:grid-cols-2 md:gap-12 md:items-start" style={{ marginTop: "24px" }}>
          <div className="md:pt-20">
            <h1 className="text-[40px] md:text-[56px]" style={{ fontWeight: 700, lineHeight: 1.1, margin: 0 }}>
              Swipe on things to do. Match with friends who want the same.
            </h1>
            <p className="text-[16px] md:text-[18px]" style={{ ...body, fontSize: undefined, margin: "20px 0 0", maxWidth: "520px" }}>
              No more "let's plan something" that never happens. Swipe on what you'd actually do, and the app matches you with friends who want the same.
            </p>
          </div>
          <div style={{ maxWidth: "420px", width: "100%", margin: "24px auto 0" }}>
            <SwipeDeck city={city} />
          </div>
        </div>

        <HowItWorks />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "40px 64px", marginTop: "72px" }}>
          <Answer q="groupChat" />
          <Answer q="free" />
          <Answer q="cities">
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {SUPPORTED_CITIES.map((c) => <li key={c} style={{ padding: "8px 14px", borderRadius: "999px", background: T.surface2, fontSize: "14px" }}>{c}</li>)}
            </ul>
          </Answer>
          <Answer q="privacy" />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
