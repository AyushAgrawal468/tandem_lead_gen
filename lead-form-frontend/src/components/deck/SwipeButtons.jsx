import { ClockIcon, XIcon, CheckIcon } from "./parts";

// Handoff "SwipeButtons reference", word for word. One component for the deck and for Journey 2 invites (pass hideNever).
const Btn = ({ label, keyHint, cls, onClick, disabled, desk, children }) => (
  <div className="sb">
    <button type="button" className={`sb-btn ${cls}`} aria-label={label} onClick={onClick} disabled={disabled}>{children}</button>
    <span className="sb-label" aria-hidden="true">{label}{desk && <span className="sb-key"> {keyHint}</span>}</span>
  </div>
);

export function SwipeButtons({ onLeft, onDown, onRight, disabled, desk, hideNever }) {
  const p = { disabled, desk };
  return (
    <div className="sb-row">
      <Btn {...p} label="Not now" keyHint="←" cls="sb-notnow" onClick={onLeft}><ClockIcon /></Btn>
      {!hideNever && <Btn {...p} label="Never" keyHint="↓" cls="sb-never" onClick={onDown}><XIcon /></Btn>}
      <Btn {...p} label="I'm in" keyHint="→" cls="sb-in" onClick={onRight}><CheckIcon /></Btn>
    </div>
  );
}
