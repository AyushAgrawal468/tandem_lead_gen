import React, { useEffect, useState } from "react";
import { SUPPORTED_CITIES, matchCity, rememberCity, cityFromGps } from "../lib/city";

// Design brief: chips are pills, Surface 2 unselected, Purple selected with white text; sheet on Surface 1
const T = { surface1: "#252525", surface2: "#414141", purple: "#8349FF", text: "#F2F2F2", low: "#969696", fail: "#F3543F" };
const font = '"Anek Latin", Helvetica, sans-serif';
const chip = (on) => ({
  display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 14px", minHeight: "40px", borderRadius: "999px", border: "none",
  fontFamily: font, fontSize: "14px", cursor: "pointer", background: on ? T.purple : T.surface2, color: on ? "#fff" : T.text,
});
const pin = (
  <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" />
  </svg>
);

/**
 * Handoff 2.1 / design screen 4: the header city chip opens a sheet of live cities.
 * GPS is asked for only when someone taps "Near me", never on page load.
 */
export default function CityPicker({ city, onChange }) {
  const [open, setOpen] = useState(false);
  const [locating, setLocating] = useState(false);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const pick = (c) => { rememberCity(c); onChange(c); setOpen(false); setNote(""); };

  const nearMe = async () => {
    setLocating(true); setNote("");
    try {
      const found = await cityFromGps();
      const live = matchCity(found);
      // ponytail: "not live there" is a line for now; design screen 19 (waitlist) replaces it later
      if (live) pick(live);
      else setNote(found ? `We're not in ${found} yet. Pick a nearby city.` : "Couldn't find your city. Pick one instead.");
    } catch (err) {
      setNote(err.message);
    } finally { setLocating(false); }
  };

  return (
    <>
      {/* Handoff header: 44px pill with a yellow pin */}
      <button onClick={() => setOpen(true)} aria-haspopup="dialog" aria-label={`City: ${city}. Change city`} className="city-chip">
        <span className="pin">{pin}</span>{city}
        <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M6 9l6 6 6-6" /></svg>
      </button>

      {open && (
        <div onClick={() => setOpen(false)} className="items-end md:items-center"
          style={{ position: "fixed", inset: 0, zIndex: 2000, background: "rgba(0,0,0,0.7)", display: "flex", justifyContent: "center" }}>
          <div role="dialog" aria-modal="true" aria-labelledby="city-title" onClick={(e) => e.stopPropagation()}
            className="rounded-t-[20px] md:rounded-[20px]"
            style={{ background: T.surface1, width: "100%", maxWidth: "420px", padding: "24px 16px 28px", fontFamily: font }}>
            <h2 id="city-title" style={{ fontSize: "22px", fontWeight: 700, color: T.text, marginBottom: "16px" }}>Pick your city</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              <button onClick={nearMe} disabled={locating} autoFocus style={{ ...chip(false), border: `1px solid ${T.low}` }}>
                <span style={{ color: T.purple, display: "inline-flex" }}>{pin}</span>{locating ? "Finding you…" : "Near me"}
              </button>
              {SUPPORTED_CITIES.map((c) => (
                <button key={c} onClick={() => pick(c)} aria-pressed={c === city} style={chip(c === city)}>{c}</button>
              ))}
            </div>
            {note && <p role="status" style={{ color: T.fail, fontSize: "14px", marginTop: "14px" }}>{note}</p>}
          </div>
        </div>
      )}
    </>
  );
}
