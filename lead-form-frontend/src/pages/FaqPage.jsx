import React from "react";
import Seo from "../components/Seo";
import { SiteHeader, SiteFooter } from "../components/SiteChrome";
import { QA, STEPS, FAQ_ORDER, faqJsonLd } from "../lib/faq";
import { T, font } from "../lib/card";

/** /faq (handoff 3.1 / design screen 38): each question an H2, answered in its first sentence, no accordions. */
export default function FaqPage() {
  return (
    <div className="aurora" style={{ minHeight: "100dvh", background: T.bg, color: T.high, fontFamily: font }}>
      <Seo title="Tandem FAQ: how matching, pricing and privacy work" path="/faq" jsonLd={faqJsonLd(FAQ_ORDER)}
        description="How Tandem works, what it costs, which cities it's in, and what your friends can and can't see." />
      <div className="px-4 md:px-6" style={{ maxWidth: "1120px", margin: "0 auto", paddingTop: "16px" }}>
        <SiteHeader />
      </div>
      <main className="px-4 md:px-6" style={{ maxWidth: "720px", margin: "0 auto", paddingTop: "48px" }}>
        <h1 className="wide text-[34px] md:text-[52px]" style={{ fontWeight: 800, lineHeight: 1.05, margin: "0 0 12px" }}>Tandem FAQ</h1>
        <p style={{ color: T.low, fontSize: "16px", margin: "0 0 16px" }}>How matching, pricing and privacy work.</p>
        {FAQ_ORDER.map((k, i) => (
          <section key={k} style={{ padding: "28px 0", borderBottom: i < FAQ_ORDER.length - 1 ? `1px solid ${T.line}` : "none" }}>
            <h2 className="wide text-[21px] md:text-[24px]" style={{ fontWeight: 700, lineHeight: 1.2, margin: "0 0 10px" }}>{QA[k][0]}</h2>
            <p style={{ color: T.mid, fontSize: "16px", lineHeight: 1.5, margin: 0 }}>{QA[k][1]}</p>
            {k === "how" && (
              <ol style={{ color: T.mid, fontSize: "16px", lineHeight: 1.5, margin: "8px 0 0", paddingLeft: "20px" }}>
                {STEPS.map(([title, text]) => <li key={title}><strong style={{ color: T.high }}>{title}</strong> {text}</li>)}
              </ol>
            )}
          </section>
        ))}
      </main>
      <SiteFooter />
    </div>
  );
}
