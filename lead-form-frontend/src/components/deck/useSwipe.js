// useSwipe.js (handoff "Swipe engine", word for word): one top card. Pointer handlers go on the CARD,
// keyboard on the DECK. Additions: a 'dragging' class, so the card's yellow tag hides while dragging; and
// panY (homepage, city pages): the card moves sideways only, a vertical drag scrolls the page (touch-action: pan-y).
import { useRef, useCallback, useEffect } from 'react';

const C = { DIST: 100, VEL: 0.5, MIN: 30, UP: 0.25, ROT_DIV: 20, ROT_MAX: 12, FLY_MS: 220, SNAP_MS: 200, TAP_PX: 8, TAP_MS: 300, VEL_WINDOW: 100 };
const EASE = 'cubic-bezier(0.23, 1, 0.32, 1)';
const BACK_REST = 'translateY(8px) scale(0.95)';

// The app's drag glows ("I'm in" / "Not now" / "Never" beside the card), driven by how far the card has moved
const hints = (stack, r, l, d) => { if (!stack) return; stack.style.setProperty("--hint-r", r); stack.style.setProperty("--hint-l", l); stack.style.setProperty("--hint-d", d); };

export function useSwipe({ onCommit, onTap, disabled, panY }) {
  const card = useRef(null), back = useRef(null);
  const sR = useRef(null), sL = useRef(null), sD = useRef(null);
  const stamps = { right: sR, left: sL, down: sD };
  const s = useRef({ id: null, x0: 0, y0: 0, t0: 0, dx: 0, dy: 0, moved: 0, raf: 0, busy: false, trail: [] });
  const reduce = useRef(false);
  useEffect(() => { reduce.current = matchMedia('(prefers-reduced-motion: reduce)').matches; }, []);

  const paint = useCallback(() => {
    const { dx, dy } = s.current, el = card.current; s.current.raf = 0; if (!el) return;
    const rot = reduce.current ? 0 : Math.max(-C.ROT_MAX, Math.min(C.ROT_MAX, dx / C.ROT_DIV));
    el.style.transform = `translate(${dx}px, ${dy}px) rotate(${rot}deg)`;
    const horiz = Math.abs(dx) >= dy, p = Math.min(1, Math.max(Math.abs(dx), Math.max(dy, 0)) / C.DIST);
    if (sR.current) sR.current.style.opacity = horiz && dx > 0 ? p : 0;
    hints(el.parentElement, horiz && dx > 0 ? p : 0, horiz && dx < 0 ? p : 0, !horiz && dy > 0 ? p : 0);
    if (sL.current) sL.current.style.opacity = horiz && dx < 0 ? p : 0;
    if (sD.current) sD.current.style.opacity = !horiz && dy > 0 ? p : 0;
    if (back.current && !reduce.current) back.current.style.transform = `translateY(${8 * (1 - p)}px) scale(${0.95 + 0.05 * p})`;
  }, []);

  const schedule = () => { if (!s.current.raf) s.current.raf = requestAnimationFrame(paint); };
  const setTransition = (ms) => {
    if (card.current) card.current.style.transition = ms ? `transform ${ms}ms ${EASE}, opacity 200ms ease` : 'none';
    if (back.current) back.current.style.transition = ms ? `transform ${ms}ms ${EASE}` : 'none';
  };

  const commit = useCallback((dir) => {
    if (disabled || s.current.busy || !card.current) return;
    s.current.busy = true;
    setTransition(C.FLY_MS);
    if (reduce.current) card.current.style.opacity = 0;
    else {
      s.current.dx = dir === 'right' ? 560 : dir === 'left' ? -560 : 0;
      s.current.dy = dir === 'down' ? 720 : 40;
      paint();
      stamps[dir].current && (stamps[dir].current.style.opacity = 1);
    }
    setTimeout(() => {
      // Reset the card behind BEFORE the parent advances, or the next 'back' card mounts at full size.
      if (back.current) { back.current.style.transition = 'none'; back.current.style.transform = BACK_REST; }
      Object.assign(s.current, { dx: 0, dy: 0, busy: false });
      if (card.current) hints(card.current.parentElement, 0, 0, 0);
      onCommit(dir); // parent advances the index; the new top card mounts at rest (keyed by event id)
    }, C.FLY_MS);
  }, [disabled, onCommit, paint]);

  const onPointerDown = (e) => {
    if (disabled || s.current.busy || e.button > 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const now = performance.now();
    Object.assign(s.current, { id: e.pointerId, x0: e.clientX, y0: e.clientY, t0: now, dx: 0, dy: 0, moved: 0, trail: [{ x: e.clientX, y: e.clientY, t: now }] });
    setTransition(0);
    card.current?.classList.add('dragging');
  };
  const onPointerMove = (e) => {
    if (e.pointerId !== s.current.id) return;
    const mx = e.clientX - s.current.x0, my = e.clientY - s.current.y0;
    s.current.moved = Math.max(s.current.moved, Math.hypot(mx, my));
    s.current.dx = mx; s.current.dy = panY ? 0 : my < 0 ? my * C.UP : my;
    // Keep only the last 100ms of samples: a flick is judged on how it ends, not on a rest before it.
    const now = performance.now(), tr = s.current.trail;
    tr.push({ x: e.clientX, y: e.clientY, t: now });
    while (tr.length > 2 && now - tr[0].t > C.VEL_WINDOW) tr.shift();
    schedule();
  };
  const onPointerUp = (e) => {
    if (e.pointerId !== s.current.id) return;
    s.current.id = null;
    card.current?.classList.remove('dragging');
    const { dx, dy, t0, moved } = s.current, t = Math.max(1, performance.now() - t0);
    if (e.type === 'pointerup' && moved < C.TAP_PX && t < C.TAP_MS) { onTap?.(); return; }
    const tr = s.current.trail, a = tr[0], z = tr[tr.length - 1], wt = Math.max(16, z.t - a.t);
    const vx = (z.x - a.x) / wt, vy = (z.y - a.y) / wt; // signed px/ms over the last 100ms
    if (Math.abs(dx) >= dy) {
      const flick = Math.abs(vx) > C.VEL && Math.sign(vx) === Math.sign(dx) && Math.abs(dx) > C.MIN;
      if (Math.abs(dx) > C.DIST || flick) return commit(dx > 0 ? 'right' : 'left');
    } else if (dy > C.DIST || (vy > C.VEL && dy > C.MIN)) return commit('down');
    setTransition(C.SNAP_MS); s.current.dx = 0; s.current.dy = 0; paint();
  };
  const onKeyDown = (e) => {
    if (e.target !== e.currentTarget) return; // don't steal arrows from buttons or inputs inside
    const map = { ArrowRight: 'right', ArrowLeft: 'left', ArrowDown: 'down' };
    if (map[e.key]) { e.preventDefault(); commit(map[e.key]); }
  };

  useEffect(() => () => cancelAnimationFrame(s.current.raf), []);
  return { card, back, stamps, commit,
    cardHandlers: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp },
    deckHandlers: { onKeyDown } };
}
