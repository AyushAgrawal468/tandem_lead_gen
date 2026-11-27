// funnel.reducer.js (handoff "Funnel logic", word for word): state for the deck, asks and overlays.
import { FUNNEL } from './funnel.config.js';

export const initial = (stored) => ({
  count: stored.count ?? 0, rights: stored.rights ?? 0,
  swipes: stored.swipes ?? [],          // [{ event_id, direction, client_ts }] until verified
  verified: !!stored.token, asked: stored.asked ?? false,
  shareAsked: stored.shareAsked ?? false, softShown: stored.softShown ?? [],
  queue: [],                             // overlays waiting, shown one at a time
  screen: 'deck',                        // deck | hardStop | endOfDeck | cityNotSupported | feedError
});

// Every overlay type is listed, so nothing sorts by accident.
const ORDER = ['match', 'phoneAsk', 'youreIn', 'sendToFriend', 'soft10', 'soft25'];
const enqueue = (q, item) => [...q, item].sort((a, b) => ORDER.indexOf(a.type) - ORDER.indexOf(b.type));

export function reducer(s, a) {
  switch (a.type) {
    case 'SWIPED': {
      const count = s.count + 1, rights = s.rights + (a.direction === 'RIGHT' ? 1 : 0);
      let q = s.queue, asked = s.asked, softShown = s.softShown;
      // card: a small copy, so a match replayed after sign-in can still show the event (J1-15)
      const swipes = s.verified ? s.swipes : [...s.swipes, { event_id: a.eventId, direction: a.direction, client_ts: Date.now(), card: a.card }];
      if (count >= FUNNEL.SWIPE_LIMIT) {
        // A match on the last swipe still shows first; the hard stop sits under it.
        return { ...s, count, rights, swipes, screen: 'hardStop', queue: a.match ? [{ type: 'match', ...a.match }] : [] };
      }
      if (!s.verified && !asked && (rights === FUNNEL.PHONE_ASK_RIGHTS || count === FUNNEL.PHONE_ASK_TOTAL)) {
        q = enqueue(q, { type: 'phoneAsk', picky: rights < FUNNEL.PHONE_ASK_RIGHTS }); asked = true;
      }
      for (const n of FUNNEL.SOFT_PROMPTS) if (count === n && !softShown.includes(n)) { q = enqueue(q, { type: `soft${n}` }); softShown = [...softShown, n]; }
      if (a.match) q = enqueue(q, { type: 'match', ...a.match });
      return { ...s, count, rights, swipes, asked, softShown, queue: q };
    }
    case 'VERIFIED': {
      let q = enqueue(s.queue.filter(o => o.type !== 'phoneAsk'), { type: 'youreIn', saved: s.count });
      if (!s.shareAsked) q = enqueue(q, { type: 'sendToFriend' });
      return { ...s, verified: true, swipes: [], shareAsked: true, queue: q };
    }
    case 'REPLAY_MATCH': return { ...s, queue: enqueue(s.queue, { type: 'match', ...a.match }) };
    case 'DISMISS': return { ...s, queue: s.queue.slice(1) };
    case 'SERVER_COUNT': return { ...s, count: a.used, screen: a.used >= FUNNEL.SWIPE_LIMIT ? 'hardStop' : s.screen };
    case 'SCREEN': return { ...s, screen: a.screen };
    default: return s;
  }
}
