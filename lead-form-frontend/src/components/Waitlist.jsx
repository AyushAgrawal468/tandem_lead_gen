import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Wordmark from "../assets/tandem-wordmark.svg";
import { apiUrl } from "../lib/api";
import { track } from "../lib/analytics";

/**
 * City not supported + waitlist (canvas J1-19a / J1-19b), full screen. `city` comes from "Near me";
 * "Other city" has none, so the screen asks for it. `near` are the closest live cities (chips).
 * "Tell me" → POST /api/waitlist, then the toast "Done. You'll be the first to know."
 */
export default function Waitlist({ city, near = [], onPick, onClose }) {
  const [name, setName] = useState(city || "");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState("idle"); // idle | busy | done | error
  const box = useRef(null);
  const valid = /^[6-9]\d{9}$/.test(phone) && name.trim().length > 1;

  useEffect(() => {
    box.current?.focus();
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const html = document.documentElement, prev = html.style.overflow;
    html.style.overflow = "hidden"; // sheets lock the page scroll while open
    return () => { window.removeEventListener("keydown", onKey); html.style.overflow = prev; };
  }, [onClose]);

  const join = async (e) => {
    e.preventDefault();
    if (!valid || state === "busy") return;
    setState("busy");
    try {
      const res = await fetch(apiUrl("/api/waitlist"), {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: phone, city: name.trim() }),
      });
      if (!res.ok) throw new Error();
      track("waitlist_joined", { city: name.trim() });
      setState("done");
    } catch { setState("error"); }
  };

  return (
    <div className="wl" role="dialog" aria-modal="true" aria-labelledby="wl-title" ref={box} tabIndex={-1}>
      <div className="wl-in">
        <header className="wl-hdr">
          <Link to="/" onClick={onClose} aria-label="Tandem home"><img src={Wordmark} alt="tandem" width="112" height="26" /></Link>
          <button type="button" className="wl-x" onClick={onClose} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </header>
        <div className="wl-copy">
          <h1 id="wl-title">We're not in {city || "your city"} yet</h1>
          <p>{near.length ? "Pick a nearby city, or leave your number and we'll tell you when we launch there." : "Leave your number and we'll tell you when we launch there."}</p>
        </div>
        {near.length > 0 && (
          <div className="wl-chips">{near.map((c) => <button key={c} type="button" onClick={() => onPick(c)}>{c}</button>)}</div>
        )}
        <div className="wl-push" />
        <form className="wl-form" onSubmit={join}>
          {!city && (
            <div className="wl-field">
              <label htmlFor="wl-city">Your city</label>
              <input id="wl-city" value={name} onChange={(e) => setName(e.target.value)} maxLength={80} autoComplete="address-level2" placeholder="e.g. Lucknow" />
            </div>
          )}
          <div className="wl-field">
            <label htmlFor="wl-phone">Mobile number</label>
            <div style={{ display: "flex", gap: "8px" }}>
              <span className="wl-cc">+91</span>
              <input id="wl-phone" type="tel" inputMode="numeric" autoComplete="tel-national" maxLength={10} value={phone}
                onChange={(e) => { setPhone(e.target.value.replace(/\D/g, "")); if (state === "error") setState("idle"); }} placeholder="10-digit number" />
            </div>
          </div>
          <p className="wl-legal">
            By continuing, you agree to our <Link to="/legal/terms-and-conditions" target="_blank">Terms</Link> and{" "}
            <Link to="/legal/privacy-policy" target="_blank">Privacy Policy</Link>.
          </p>
          {state === "error" && <p role="alert" className="wl-err">Couldn't save that. Try again.</p>}
          <button type="submit" className="btn-primary" disabled={!valid || state === "busy" || state === "done"}>
            {state === "busy" ? "Saving…" : "Tell me"}
          </button>
        </form>
      </div>
      {state === "done" && (
        <div role="status" className="wl-toast toast-in">
          <span aria-hidden="true"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L19 7" /></svg></span>
          Done. You'll be the first to know.
        </div>
      )}
    </div>
  );
}
