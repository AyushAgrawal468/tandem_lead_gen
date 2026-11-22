import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { OTPInput, REGEXP_ONLY_DIGITS } from "input-otp";
import { call } from "../lib/tandemApi";
import { T, font } from "../lib/card";
import { useSheetKeys } from "../lib/useSheetKeys";
import { OpenTandemLink } from "./AppPrompts";

const RESEND_SECONDS = 30;
const CODE_LENGTH = 4;

const pill = (main, active = true) => ({
  width: "100%", minHeight: "48px", padding: "14px", borderRadius: "999px", border: "none", fontFamily: font, fontWeight: 700, fontSize: "16px",
  cursor: active ? "pointer" : "default", opacity: active ? 1 : 0.4, background: main ? T.high : T.surface2, color: main ? T.bg : T.high,
});
const textBtn = { background: "none", border: "none", padding: "4px 0", color: T.green, fontFamily: font, fontSize: "14px", cursor: "pointer" };

// Copy from the handoff's "Every screen and its copy"
const ASK = {
  normal: (rights) => ["Save your picks", `You're in for ${rights} plans. Add your number to save them. Your swipes come with you when you get the app.`],
  picky: () => ["Picky. We like that.", "Add your number to save your swipes and get better picks."],
  save: () => ["Save your picks", "Add your number to save them. Your swipes come with you when you get the app."],
};

const masked = (p) => `${p.slice(0, 2)}••••${p.slice(-4)}`;

/**
 * Handoff 2.3 / design screens 7-11: phone ask, code entry, phone blocked, code not arriving.
 * Bottom sheet on phones, centred modal on desktop. Not now, Escape and a backdrop tap all close it.
 */
export default function PhoneSheet({ variant = "normal", rights = 3, onClose, onVerified, onGetApp, onStuck }) {
  const [screen, setScreen] = useState("phone"); // phone | code | blocked | slow
  const [phone, setPhone] = useState("");
  const [touched, setTouched] = useState(false);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(0);
  const [resendAt, setResendAt] = useState(0);
  const [resends, setResends] = useState(0);
  const [now, setNow] = useState(Date.now());
  const box = useRef(null);

  const valid = /^[6-9]\d{9}$/.test(phone);
  const wait = Math.max(0, Math.ceil((resendAt - now) / 1000));

  useEffect(() => {
    if (screen !== "code" || !wait) return;
    const t = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(t);
  }, [screen, wait]);

  useSheetKeys(box, onClose);

  const sendErrors = (err) => {
    if (err.data?.code === "BLOCKED") setScreen("blocked");
    else if (err.status === 429 || err.status === 503) setError("Hang on a sec. Too many requests. Try again in a minute.");
    else setError("Couldn't send the code. Try again.");
  };

  const send = async () => {
    if (!valid || busy) return;
    setBusy(true); setError("");
    try {
      // ponytail: backend NPEs on a null appSignature (Android SMS hash, meaningless on web), so send ""
      await call("/auth/send-otp", { method: "POST", body: { phone, countryCode: "91", appSignature: "" } });
      setCode(""); setResendAt(Date.now() + RESEND_SECONDS * 1000); setNow(Date.now()); setScreen("code");
    } catch (err) { sendErrors(err); } finally { setBusy(false); }
  };

  const resend = async () => {
    if (resends >= 1) { setScreen("slow"); return; } // 2nd tap: "Code not arriving?"
    setResends(1); setError("");
    try {
      await call("/auth/send-otp", { method: "POST", body: { phone, countryCode: "91", appSignature: "" } });
      setResendAt(Date.now() + RESEND_SECONDS * 1000); setNow(Date.now());
    } catch (err) { sendErrors(err); }
  };

  const verify = async (value = code) => {
    if (value.length < CODE_LENGTH || busy) return;
    setBusy(true); setError("");
    try {
      const data = await call("/auth/verify-otp", { method: "POST", body: { phone, countryCode: "91", otp: value, platform: "WEB" } });
      onVerified(data);
    } catch (err) {
      const d = err.data || {};
      if (d.code === "BLOCKED" || d.statusId === "BLOCKED") setScreen("blocked");
      else if (d.code === "WRONG_CODE") {
        const n = d.tries_left;
        setError(n === 1 ? "That code didn't work. 1 try left." : `That code didn't work. ${n} tries left.`);
        setShake((s) => s + 1); setCode("");
      } else setError("Couldn't check the code. Try again.");
    } finally { setBusy(false); }
  };

  const [title, body] =
    screen === "phone" ? (ASK[variant] || ASK.normal)(rights)
    : screen === "code" ? ["Enter the code", `We sent a 4-digit code to ${masked(phone)}.`]
    : screen === "blocked" ? ["Too many tries", "Try again in 30 minutes, or get the app and sign in there."]
    : ["Code not arriving?", "SMS can be slow. Get the app and sign in there instead."];

  const codeError = screen === "code" && error.startsWith("That code");

  return (
    <div onClick={onClose} className="items-end md:items-center"
      style={{ position: "fixed", inset: 0, zIndex: 1800, background: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center", animation: "deckIn 0.2s" }}>
      <div ref={box} role="dialog" aria-modal="true" aria-labelledby="phone-title" onClick={(e) => e.stopPropagation()}
        className="rounded-t-[20px] md:rounded-[20px] sheet-in"
        style={{ background: T.surface1, color: T.high, fontFamily: font, width: "100%", maxWidth: "420px", padding: "24px 16px calc(24px + env(safe-area-inset-bottom))" }}>
        <h2 id="phone-title" className="text-[22px] md:text-[24px]" style={{ fontWeight: 700, lineHeight: 1.2, margin: "0 0 6px" }}>{title}</h2>
        <p style={{ color: T.mid, fontSize: "16px", lineHeight: 1.5, margin: "0 0 16px" }}>{body}</p>

        {screen === "phone" && (
          <form onSubmit={(e) => { e.preventDefault(); send(); }}>
            <div style={{ display: "flex", gap: "8px" }}>
              <span style={{ padding: "14px", borderRadius: "8px", background: T.surface2, color: T.low, fontSize: "16px" }}>+91</span>
              <input aria-label="Phone number" type="tel" inputMode="numeric" autoComplete="tel-national" maxLength={10} value={phone} autoFocus
                aria-invalid={touched && !valid} aria-describedby="phone-error"
                onChange={(e) => { setPhone(e.target.value.replace(/\D/g, "")); setError(""); }} onBlur={() => setTouched(true)}
                placeholder="10-digit number"
                style={{ flex: 1, minWidth: 0, padding: "14px", borderRadius: "8px", fontFamily: font, fontSize: "16px", outline: "none", color: T.high,
                  background: touched && !valid && phone ? "#221615" : T.surface2, border: `1px solid ${touched && !valid && phone ? T.fail : "transparent"}` }} />
            </div>
            <p id="phone-error" role="alert" style={{ color: T.fail, fontSize: "14px", minHeight: "21px", margin: "6px 0 0" }}>
              {(touched || phone.length === 10) && phone && !valid ? "Enter a 10-digit mobile number." : error}
            </p>
            <p style={{ color: T.low, fontSize: "12px", lineHeight: 1.5, margin: "4px 0 14px" }}>
              By continuing, you agree to our <Link to="/legal/terms-and-conditions" target="_blank" style={{ color: T.mid, textDecoration: "underline" }}>Terms</Link> and{" "}
              <Link to="/legal/privacy-policy" target="_blank" style={{ color: T.mid, textDecoration: "underline" }}>Privacy Policy</Link>.
            </p>
            <button type="submit" disabled={!valid || busy} style={pill(true, valid && !busy)}>{busy ? "Sending…" : "Send code"}</button>
          </form>
        )}

        {screen === "code" && (
          <>
            <div key={shake} className={codeError ? "otp-shake" : undefined}>
              <OTPInput maxLength={CODE_LENGTH} value={code} onChange={(v) => { setCode(v); if (codeError) setError(""); }} onComplete={verify}
                pattern={REGEXP_ONLY_DIGITS} autoComplete="one-time-code" inputMode="numeric" autoFocus aria-label="4-digit code" disabled={busy}
                render={({ slots }) => (
                  <div style={{ display: "flex", gap: "10px" }}>
                    {slots.map((s, i) => (
                      <div key={i} style={{ width: "56px", height: "56px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "24px", fontWeight: 700, color: codeError ? T.fail : T.high, background: codeError ? "#221615" : T.surface2,
                        border: `1px solid ${codeError ? T.fail : s.isActive ? T.mid : "transparent"}` }}>
                        {s.char ?? (s.hasFakeCaret ? <span style={{ width: "2px", height: "24px", background: T.high }} /> : null)}
                      </div>
                    ))}
                  </div>
                )} />
            </div>
            <p role="alert" style={{ color: T.fail, fontSize: "14px", minHeight: "21px", margin: "8px 0 0" }}>{error}</p>
            <div style={{ margin: "4px 0 14px" }}>
              {wait > 0
                ? <span style={{ color: T.low, fontSize: "14px" }}>Resend in 0:{String(wait).padStart(2, "0")}</span>
                : <button onClick={resend} style={textBtn}>Resend code</button>}
            </div>
            <button onClick={() => verify()} disabled={code.length < CODE_LENGTH || busy} style={pill(true, code.length === CODE_LENGTH && !busy)}>
              {busy ? "Verifying…" : "Verify"}
            </button>
          </>
        )}

        {screen === "blocked" && (
          <>
            <button onClick={onGetApp} style={pill(true)} autoFocus>Get the app</button>
            <OpenTandemLink onStuck={onStuck} />
          </>
        )}

        {screen === "slow" && (
          <>
            <button onClick={onGetApp} style={pill(true)} autoFocus>Get the app</button>
            <button onClick={() => { setScreen("code"); setError(""); }} style={{ ...pill(false), marginTop: "10px" }}>Keep waiting</button>
            <OpenTandemLink onStuck={onStuck} />
          </>
        )}

        {(screen === "phone" || screen === "code") && (
          <button onClick={onClose} style={{ ...pill(false), marginTop: "10px" }}>Not now</button>
        )}
      </div>
    </div>
  );
}
