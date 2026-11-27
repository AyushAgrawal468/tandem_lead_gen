import TMark from "../../assets/tandem-mark.svg";
import { catOf } from "./categories";

// Small pieces the handoff names but does not define: icons, the stamp, the category badge and the
// fallback poster. Category colours also tint the glow behind the stack ("Stack" in Components).
const I = (d) => function Icon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>;
};
export const ClockIcon = I(<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>);
export const XIcon = I(<path d="M6 6l12 12M18 6L6 18" />);
export const CheckIcon = I(<path d="M5 12.5l4.5 4.5L19 7" />);
// Send to a friend: the Tandem scribble (the app's mark), drawn in currentColor through a mask
export const SendIcon = () => <span className="t-mark" aria-hidden="true" style={{ WebkitMaskImage: `url(${JSON.stringify(TMark)})`, maskImage: `url(${JSON.stringify(TMark)})` }} />;


export function CategoryBadge({ category }) {
  const c = catOf(category);
  return (
    <span className="cat-badge" aria-hidden="true" style={{ color: c.color, borderColor: c.color }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={c.d} /></svg>
    </span>
  );
}

// Missing or broken poster: the title on the category colour, never a broken image icon
export function PosterFallback({ title, category }) {
  const c = catOf(category).color;
  return <div className="poster-fallback" style={{ background: `linear-gradient(160deg, ${c}, ${c}99 55%, var(--card))` }}>{title}</div>;
}

// React 19 passes ref as a prop
export function Stamp({ ref, kind }) {
  const text = { right: "I'M IN", left: "NOT NOW", down: "NEVER" }[kind];
  return <div ref={ref} className={`stamp stamp-${kind}`} aria-hidden="true" style={{ opacity: 0 }}>{text}</div>;
}
