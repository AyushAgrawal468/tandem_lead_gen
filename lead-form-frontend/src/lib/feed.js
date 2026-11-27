import { useEffect, useState } from "react";
import { fromPublic } from "./card";
import { call } from "./tandemApi";

const PRERENDER = typeof window !== "undefined" && new URLSearchParams(window.location.search).has("prerender");

/**
 * First page of the public feed, for the live count and the weekend rail. Skipped in the prerender
 * snapshot (it never holds live events). ponytail: the deck loads the same page too; share it if it matters.
 */
export function useCityFeed(city) {
  const [feed, setFeed] = useState(null);
  useEffect(() => {
    if (PRERENDER) return;
    let off = false;
    setFeed(null);
    call(`/events/public/feed?city=${encodeURIComponent(city)}`)
      .then((d) => !off && setFeed({ total: d.total_upcoming, cards: (d.events || []).map((e) => ({ ...fromPublic(e), startsAt: e.startsAt })).filter((c) => c.id) }))
      .catch(() => {});
    return () => { off = true; };
  }, [city]);
  return feed;
}


const istDay = (d) => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(d);

/** The rail's cards: feed cards starting by this Sunday (IST), else the next ones. Also feeds How it works. */
export function railCards(feed) {
  if (!feed?.cards.length) return { cards: [], weekend: false };
  const now = new Date();
  const sunday = istDay(new Date(now.getTime() + ((7 - new Date(istDay(now)).getUTCDay()) % 7) * 864e5));
  const weekend = feed.cards.filter((c) => c.startsAt && istDay(new Date(c.startsAt)) <= sunday);
  return { cards: (weekend.length >= 3 ? weekend : feed.cards).slice(0, 8), weekend: weekend.length >= 3 };
}

// "550+" from total_upcoming: rounded down so the number never overstates the feed
export const plansCount = (n) => (n >= 100 ? `${Math.floor(n / 50) * 50}+` : n >= 20 ? `${Math.floor(n / 10) * 10}+` : String(n));
