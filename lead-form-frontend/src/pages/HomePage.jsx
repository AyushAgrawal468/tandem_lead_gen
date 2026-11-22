import React, { useState } from "react";
import { Helmet } from "react-helmet";
import SwipeDeck from "../components/SwipeDeck";
import Seo, { SITE } from "../components/Seo";
import { SiteHeader, SiteFooter } from "../components/SiteChrome";
import { initialCity } from "../lib/city";
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

const h2 = "text-[28px] md:text-[36px]";
const h2Style = { fontWeight: 700, lineHeight: 1.15, margin: "0 0 12px" };
const body = { color: T.mid, fontSize: "16px", lineHeight: 1.5, margin: 0, maxWidth: "640px" };

function Section({ q, children }) {
  return (
    <section style={{ marginTop: "56px" }}>
      <h2 className={h2} style={h2Style}>{QA[q][0]}</h2>
      {children || <p style={body}>{QA[q][1]}</p>}
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

      <main style={{ maxWidth: "1040px", margin: "0 auto", padding: "16px 16px 0" }}>
        <SiteHeader city={city} onCity={setCity} />

        <div className="md:grid md:grid-cols-2 md:gap-12 md:items-start" style={{ marginTop: "24px" }}>
          <div className="md:pt-20">
            <h1 className="text-[40px] md:text-[56px]" style={{ fontWeight: 700, lineHeight: 1.1, margin: 0 }}>
              Swipe on things to do. Match with friends who want the same.
            </h1>
            <p style={{ ...body, margin: "16px 0 0" }}>
              No more "let's plan something" that never happens. Swipe on what you'd actually do, and the app matches you with friends who want the same.
            </p>
          </div>
          <div style={{ maxWidth: "420px", width: "100%", margin: "24px auto 0" }}>
            <SwipeDeck city={city} />
          </div>
        </div>

        <Section q="how">
          <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "20px", maxWidth: "640px" }}>
            {STEPS.map(([title, text], i) => (
              <li key={title} style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                <span aria-hidden="true" style={{ flexShrink: 0, width: "36px", height: "36px", borderRadius: "50%", background: T.green, color: T.bg,
                  fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</span>
                <p style={body}><strong style={{ color: T.high }}>{title}</strong> {text}</p>
              </li>
            ))}
          </ol>
        </Section>
        <Section q="groupChat" />
        <Section q="free" />
        <Section q="cities" />
        <Section q="privacy" />
      </main>

      <SiteFooter />
    </div>
  );
}
