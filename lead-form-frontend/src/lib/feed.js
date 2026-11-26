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

