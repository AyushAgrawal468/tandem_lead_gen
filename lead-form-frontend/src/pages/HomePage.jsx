import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import DeckScreen from "../components/DeckScreen";
import Seo, { SITE } from "../components/Seo";
import { SiteHeader, SiteFooter, StoreBadges } from "../components/SiteChrome";
import { CategoryBadge, PosterFallback } from "../components/deck/parts";
import QrCode from "../components/QrCode";
import { initialCity, SUPPORTED_CITIES } from "../lib/city";
import { STEPS, QA, CITY_PAGES } from "../lib/faq";
import { T, font } from "../lib/card";
import { useCityFeed } from "../lib/feed";

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

const istDay = (d) => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(d);

// "550+" from total_upcoming: rounded down so the number never overstates the feed
const plansCount = (n) => (n >= 100 ? `${Math.floor(n / 50) * 50}+` : n >= 20 ? `${Math.floor(n / 10) * 10}+` : String(n));

function LiveCount({ feed, city }) {
  if (!feed?.total) return null;
  return <p className="live-count"><b>{plansCount(feed.total)}</b>plans in {city} this week, from the live feed</p>;
}

/** One feed card as a link (weekend rail, FAQ aside). */
export function RailCard({ c, to }) {
  return (
    <Link to={to} className="rail-card" aria-label={[c.title, c.day].filter(Boolean).join(", ")}>
      <div className="rail-poster">
        <PosterFallback title={c.title} category={c.category} />
        {c.poster && <img src={c.poster} alt="" loading="lazy" onError={(e) => { e.currentTarget.style.display = "none"; }} />}
      </div>
      <CategoryBadge category={c.category} />
      {c.tag && <span className="card-tag">{c.tag}</span>}
      <div className="rail-info">
        <b>{c.title}</b>
        {c.day && <span>{c.day}</span>}
        {c.price && <span className="price">{c.price}</span>}
      </div>
    </Link>
  );
}

/** "This weekend in {city}": feed cards starting by this Sunday (IST). Fewer than 3 → the next ones, titled "Coming up". */
export function WeekendRail({ feed, city }) {
  if (!feed?.cards.length) return null;
  const now = new Date();
  const sunday = istDay(new Date(now.getTime() + ((7 - new Date(istDay(now)).getUTCDay()) % 7) * 864e5));
  const weekend = feed.cards.filter((c) => c.startsAt && istDay(new Date(c.startsAt)) <= sunday);
  const cards = (weekend.length >= 3 ? weekend : feed.cards).slice(0, 8);
  const to = `/swipe?city=${encodeURIComponent(city)}`;
  return (
    <section className="home-sec" style={{ gap: "18px" }}>
      <div className="rail-head">
        <h2>{weekend.length >= 3 ? "This weekend" : "Coming up"} in {city}</h2>
        <Link to={to}>Swipe them all</Link>
      </div>
      <ul className="rail">
        {cards.map((c) => <li key={c.id}><RailCard c={c} to={to} /></li>)}
      </ul>
    </section>
  );
}

const Mini = ({ className = "", style }) => <div className={`mini ${className}`} style={style}>Coffee Conversations</div>;
const ILLUSTRATIONS = [
  <><Mini style={{ transform: "rotate(-6deg)" }} /><span className="ill-stamp">I'M IN</span></>,
  <><Mini style={{ transform: "rotate(5deg)" }} /><span className="ill-chip"><span className="avatar">A</span>Arjun swiped too</span></>,
  <>
    <Mini className="small" style={{ transform: "rotate(-10deg)", marginLeft: "-70px" }} />
    <Mini className="small" style={{ transform: "rotate(9deg)", marginLeft: "70px" }} />
    <div style={{ position: "absolute", left: "50%", top: "50%", width: "220px", height: "220px", transform: "translate(-50%, -50%)", borderRadius: "50%", background: "radial-gradient(circle, rgba(0,255,200,0.35), rgba(0,255,200,0) 65%)" }} />
    <span className="ill-chip mint">Arjun is in too!</span>
  </>,
];

/** "How does Tandem work?": three illustrated steps (canvas J3-36); also on the city pages. */
export function HowItWorks() {
  return (
    <section className="home-sec" style={{ gap: "24px" }}>
      <h2>{QA.how[0]}</h2>
      <ol className="steps-ill">
        {STEPS.map(([title, text], i) => (
          <li key={title}>
            <div className="ill" aria-hidden="true">{ILLUSTRATIONS[i]}</div>
            <div className="step-row">
              <span className="step-num" aria-hidden="true" style={i === 2 ? { WebkitTextStrokeColor: "var(--mint)" } : undefined}>{i + 1}</span>
              <span><b>{title}</b><span>{text}</span></span>
            </div>
          </li>
        ))}
      </ol>
      <p style={{ margin: 0, fontSize: "12px", color: T.low }}>Names shown are examples.</p>
    </section>
  );
}

function GroupChat() {
  return (
    <section className="home-sec">
      <h2 className="big">{QA.groupChat[0]}</h2>
      <p className="lead">{QA.groupChat[1]}</p>
      <div className="chat-pair" aria-hidden="true">
        <figure style={{ background: "var(--card-2)", border: "1px solid var(--line-chat)" }}>
          <figcaption>The group chat, Thursday</figcaption>
          <div className="bubble">someone plan something this weekend pls</div>
          <div className="bubble me">yes!! anything</div>
          <div className="bubble">there's a gig in Indiranagar?</div>
          <div className="bubble">maybe, who else is in</div>
          <div className="bubble" style={{ opacity: 0.45 }}>Seen by 6</div>
        </figure>
        <figure style={{ background: "var(--mint-deep)", border: `1px solid ${T.green}`, gap: "12px" }}>
          <figcaption style={{ margin: 0 }}>Tandem, same Thursday</figcaption>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <div style={{ width: "56px", height: "72px", borderRadius: "10px", background: T.purple, flex: "none" }} />
            <div><b style={{ fontSize: "18px" }}>Arjun is in too!</b><div style={{ fontSize: "14px", color: T.mid }}>Coffee Conversations, every Saturday</div></div>
          </div>
          <div style={{ height: "40px", borderRadius: "999px", background: T.green, color: T.bg, fontSize: "14px", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>Plan it in the app</div>
        </figure>
      </div>
    </section>
  );
}

const TIERS = [["Free", "With ads"], ["Plus", "₹149 a month"], ["Premium", "₹199 a month"]];
const SUB = `No more "let's plan something" that never happens. Swipe on what you'd actually do, and the app matches you with friends who want the same.`;

/**
 * Journey 3 homepage (canvas J3-36 / J3-D36): the live deck above the fold, then the intro (phones),
 * this weekend's plans, how it works, group chat vs Tandem, price tiers, cities and the closing band.
 * Swiping here runs the full Journey 1 flow.
 */
export default function HomePage() {
  const [city, setCity] = useState(initialCity);
  const feed = useCityFeed(city);
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

        <DeckScreen city={city} onCity={setCity} scrollable h1="Swipe on things to do. Match with friends who want the same."
          aside={<>
            <p style={{ color: T.mid, fontSize: "18px", lineHeight: 1.55, margin: "0 0 16px", maxWidth: "500px" }}>{SUB}</p>
            <div style={{ marginBottom: "24px" }}><LiveCount feed={feed} city={city} /></div>
            <StoreBadges width={300} />
          </>} />

        <div className="home">
          <div className="phone-intro">
            <p className="lead">{SUB}</p>
            <LiveCount feed={feed} city={city} />
            <StoreBadges width={300} />
          </div>
          <WeekendRail feed={feed} city={city} />
          <HowItWorks />
          <GroupChat />
          <div className="home-split">
            <section className="home-sec">
              <h2 className="big">{QA.free[0]}</h2>
              <p className="lead">Yes. Tandem is free, with ads. Plus and Premium remove ads and add more features. Invite a friend and you both get a month of Premium free.</p>
              <ul className="tiers">{TIERS.map(([n, v]) => <li key={n}><b>{n}</b><span>{v}</span></li>)}</ul>
            </section>
            <section className="home-sec">
              <h2 className="big">{QA.cities[0]}</h2>
              <p className="city-run">
                {SUPPORTED_CITIES.map((c, i) => {
                  const slug = Object.keys(CITY_PAGES).find((k) => CITY_PAGES[k].city === c);
                  return <React.Fragment key={c}>{i > 0 && <i aria-hidden="true">/</i>}{slug ? <Link to={`/${slug}`}>{c}</Link> : <span>{c}</span>}</React.Fragment>;
                })}
              </p>
            </section>
          </div>
          <section className="band">
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div className="big-words" aria-hidden="true"><span>Swipe.</span><span className="outline">Match.</span><span>Go.</span></div>
              <p style={{ margin: 0, color: T.mid }}>Get Tandem on iPhone and Android.</p>
              <StoreBadges width={300} />
            </div>
            <div className="desk-only"><QrCode size={180} /></div>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
