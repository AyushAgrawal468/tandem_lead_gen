import React, { useState } from "react";
import { Helmet } from "react-helmet";
import DeckScreen from "../components/DeckScreen";
import Seo, { SITE } from "../components/Seo";
import { SiteHeader, SiteFooter, StoreBadges } from "../components/SiteChrome";
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

const body = { color: T.mid, fontSize: "16px", lineHeight: 1.55, margin: 0 };

/** One answer in the homepage grid: an H2 question answered in its first sentence. */
function Answer({ q, children }) {
  return (
    <section style={{ borderTop: `1px solid ${T.line}`, paddingTop: "28px" }}>
      <h2 className="wide text-[22px] md:text-[26px]" style={{ fontWeight: 700, lineHeight: 1.15, margin: "0 0 12px" }}>{QA[q][0]}</h2>
      {children || <p style={body}>{QA[q][1]}</p>}
    </section>
  );
}

// One glyph per step: a card being swiped, two friends, a match
const STEP_ICONS = [
  "M7 4h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM19 7l2 1-2 9",
  "M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 20a6 6 0 0 1 12 0M16 5.2a3 3 0 0 1 0 5.6M17 14a6 6 0 0 1 4 6",
  "M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z",
];
const STEP_TINTS = ["#00FFC8", "#4FA3FF", "#A77DFF"];

/** "How does Tandem work?" as three connected steps (design screen 36); also on the city pages (3.2). */
export function HowItWorks() {
  return (
    <section style={{ marginTop: "96px" }}>
      <h2 className="wide text-[28px] md:text-[40px]" style={{ fontWeight: 700, lineHeight: 1.1, margin: "0 0 36px", maxWidth: "640px" }}>{QA.how[0]}</h2>
      <ol className="steps" style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {STEPS.map(([title, text], i) => (
          <li key={title} style={{ position: "relative" }}>
            <span aria-hidden="true" style={{ width: "52px", height: "52px", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center",
              color: STEP_TINTS[i], background: `radial-gradient(circle at 30% 25%, ${STEP_TINTS[i]}33, ${T.surface1} 70%)`, border: `1px solid ${STEP_TINTS[i]}40` }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={STEP_ICONS[i]} /></svg>
            </span>
            <p style={{ color: T.low, fontSize: "13px", margin: "18px 0 4px" }}>Step {i + 1}</p>
            <h3 className="wide" style={{ margin: "0 0 8px", fontSize: "20px", fontWeight: 700 }}>{title.replace(/\.$/, "")}</h3>
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
    <div className="aurora" style={{ minHeight: "100dvh", background: T.bg, color: T.high, fontFamily: font }}>
      <Seo title="Tandem: things to do with friends in Bengaluru, Mumbai and more" path="/" jsonLd={JSON_LD}
        description="Swipe on concerts, comedy, treks and food walks near you. When a friend wants the same plan, Tandem matches you. Free on iOS and Android." />
      <Helmet>
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}></script>
        <script>{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}</script>
      </Helmet>

      <main className="page">
        <SiteHeader city={city} onCity={setCity} />

        <DeckScreen city={city} onCity={setCity} h1="Swipe on things to do. Match with friends who want the same."
          aside={<>
            <p style={{ ...body, fontSize: "18px", margin: "0 0 32px", maxWidth: "500px" }}>
              No more "let's plan something" that never happens. Swipe on what you'd actually do, and the app matches you with friends who want the same.
            </p>
            <StoreBadges width={300} />
          </>} />

        <HowItWorks />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 400px), 1fr))", gap: "48px 72px", marginTop: "96px" }}>
          <Answer q="groupChat" />
          <Answer q="free" />
          <Answer q="cities">
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {SUPPORTED_CITIES.map((c) => <li key={c} className="glass" style={{ padding: "8px 14px", borderRadius: "999px", fontSize: "14px" }}>{c}</li>)}
            </ul>
          </Answer>
          <Answer q="privacy" />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
