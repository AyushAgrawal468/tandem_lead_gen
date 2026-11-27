import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { OTPInput, REGEXP_ONLY_DIGITS } from "input-otp";
import { call } from "../lib/tandemApi";
import { T, font, PRIMARY } from "../lib/card";
import { useSheetKeys } from "../lib/useSheetKeys";
import { OpenTandemLink } from "./AppPrompts";
import { track } from "../lib/analytics";

const RESEND_SECONDS = 30;
const CODE_LENGTH = 4;

const pill = (main, active = true) => ({
  width: "100%", minHeight: "48px", padding: "14px", borderRadius: "999px", border: "none", fontFamily: font, fontWeight: 700, fontSize: "16px",
  cursor: active ? "pointer" : "default", opacity: active ? 1 : 0.4, background: main ? T.high : T.surface2, color: main ? T.bg : T.high,
  ...(main ? PRIMARY : {}),
});
const textBtn = { background: "none", border: "none", padding: "4px 0", color: T.green, fontFamily: font, fontSize: "14px", cursor: "pointer" };

// Copy from the design canvas (KIT-Copy, boards J1-07 to J1-11, J2-24, J2-30)
const ASK = {
  normal: ({ rights }) => ["Save your picks", `You're in for ${rights} plans. Add your number and they'll be waiting when you sign in to the app.`],
  picky: () => ["Picky. We like that.", "Add your number to save your swipes. Sign in to the app with it later and they come with you."],
  save: () => ["Save your picks", "Add your number and they'll be waiting when you sign in to the app."],
  // Journey 2 (shared link page, 3.4)
  invite: ({ sender }) => [`Tell ${sender} you're in`, `Add your number to say yes. ${sender} sees it in Tandem.`],
  event: () => ["Save this plan", "Add your number to save it. Get the app to see which friends want to go."],
};

const masked = (p) => `${p.slice(0, 2)}••••${p.slice(-4)}`;

/**
 * Handoff 2.3 / design screens 7-11: phone ask, code entry, phone blocked, code not arriving.
 * Bottom sheet on phones, centred modal on desktop. Not now (number step), Escape and a backdrop tap close it.
 */
export default function PhoneSheet({ variant = "normal", rights = 3, sender = "Your friend", onClose, onVerified, onGetApp, onStuck }) {
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
    // Handoff "Error codes": the backend's names are BLOCKED, COOLDOWN, PHONE_LIMIT, SMS_BUDGET
    const code = err.data?.code;
    track("otp_failed", { code: code || err.status });
    if (code === "BLOCKED" || code === "OTP_BLOCKED") { setScreen("blocked"); track("app_prompt_shown", { type: "phone_blocked" }); }
    else if (code === "SMS_BUDGET" || code === "OTP_GLOBAL_CAP" || err.status === 503) setError("We can't send codes right now. Try again in a bit.");
    else if (code === "COOLDOWN" || code === "OTP_COOLDOWN") setError(`Hang on a sec. You can ask for a new code in ${err.data?.retryAfterSeconds ?? 30} seconds.`);
    else if (err.status === 429) setError("Hang on a sec. Too many requests. Try again in a minute.");
    else setError("Couldn't send the code. Try again.");
  };

  const send = async () => {
    if (!valid || busy) return;
    setBusy(true); setError("");
    try {
      // ponytail: backend NPEs on a null appSignature (Android SMS hash, meaningless on web), so send ""
      await call("/auth/send-otp", { method: "POST", body: { phone, countryCode: "91", appSignature: "" } });
      track("otp_requested", { variant });
      setCode(""); setResendAt(Date.now() + RESEND_SECONDS * 1000); setNow(Date.now()); setScreen("code");
    } catch (err) { sendErrors(err); } finally { setBusy(false); }
  };

  const resend = async () => {
    if (resends >= 1) { setScreen("slow"); track("app_prompt_shown", { type: "code_not_arriving" }); return; } // 2nd tap: "Code not arriving?"
    setResends(1); setError("");
    try {
      await call("/auth/send-otp", { method: "POST", body: { phone, countryCode: "91", appSignature: "" } });
      track("otp_requested", { variant, resend: true });
      setResendAt(Date.now() + RESEND_SECONDS * 1000); setNow(Date.now());
    } catch (err) { sendErrors(err); }
  };

  const verify = async (value = code) => {
    if (value.length < CODE_LENGTH || busy) return;
    setBusy(true); setError("");
    try {
      const data = await call("/auth/verify-otp", { method: "POST", body: { phone, countryCode: "91", otp: value, platform: "WEB" } });
      onVerified(data, masked(phone)); // masked number for "Signed in as" (LP-09)
    } catch (err) {
      const d = err.data || {};
      if (d.code === "BLOCKED" || d.statusId === "BLOCKED") { setScreen("blocked"); track("app_prompt_shown", { type: "phone_blocked" }); }
      else if (d.code === "WRONG_CODE") {
        const n = d.tries_left;
        setError(n === 1 ? "That code didn't work. 1 try left." : `That code didn't work. ${n} tries left.`);
        setShake((s) => s + 1); setCode("");
      } else setError("Couldn't check the code. Try again.");
    } finally { setBusy(false); }
  };

  const [title, body] =
    screen === "phone" ? (ASK[variant] || ASK.normal)({ rights, sender })
    : screen === "code" ? ["Enter the code", `We sent a 4-digit code to ${masked(phone)}.`]
    : screen === "blocked" ? ["Too many tries", "Try again in 30 minutes, or get the app and sign in there."]
    : ["Code not arriving?", "SMS can be slow. Get the app and sign in there instead."];

  const codeError = screen === "code" && error.startsWith("That code");

  return (
    <div onClick={onClose} className="sheet-backdrop">
      <div ref={box} role="dialog" aria-modal="true" aria-labelledby="phone-title" onClick={(e) => e.stopPropagation()}
        className="sheet wide">
        <span className="sheet-handle" aria-hidden="true" />
        {/* Desktop modal close (J1-D07); phones close with Not now, Escape or a backdrop tap */}
        <button type="button" onClick={onClose} aria-label="Close" className="sheet-x">
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
        {(screen === "phone" || screen === "code") && (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", margin: "0 0 18px" }}>
            <div aria-hidden="true" style={{ display: "flex", gap: "4px", width: "64px" }}>
              <span style={{ flex: "1 1 0", height: "3px", borderRadius: "3px", background: T.green }} />
              <span style={{ flex: "1 1 0", height: "3px", borderRadius: "3px", background: screen === "code" ? T.green : T.surface2 }} />
            </div>
            <p style={{ margin: 0, fontSize: "12px", lineHeight: 1.5, color: T.low }}>{screen === "phone" ? "Step 1 of 2: your number" : "Step 2 of 2: the code"}</p>
          </div>
        )}
        <h2 id="phone-title" className="text-[22px] md:text-[24px]" style={{ fontWeight: 700, lineHeight: 1.18, fontStretch: "112%", margin: "0 0 8px" }}>{title}</h2>
        <p style={{ color: T.mid, fontSize: "16px", lineHeight: 1.5, margin: "0 0 16px" }}>{body}</p>

        {screen === "phone" && (
          <form onSubmit={(e) => { e.preventDefault(); send(); }}>
            <label htmlFor="phone-input" style={{ display: "block", margin: "0 0 6px", fontSize: "14px", fontWeight: 700, color: T.mid }}>Mobile number</label>
            <div style={{ display: "flex", gap: "8px" }}>
              <span style={{ height: "54px", boxSizing: "border-box", padding: "0 16px", borderRadius: "8px", background: T.surface2, color: T.high, fontSize: "16px", fontWeight: 700, display: "flex", alignItems: "center" }}>+91</span>
              <input id="phone-input" type="tel" inputMode="numeric" autoComplete="tel-national" maxLength={10} value={phone} autoFocus
                aria-invalid={touched && !valid} aria-describedby="phone-error"
                onChange={(e) => { setPhone(e.target.value.replace(/\D/g, "")); setError(""); }} onBlur={() => setTouched(true)}
                placeholder="10-digit number"
                style={{ flex: 1, minWidth: 0, padding: "14px", borderRadius: "8px", fontFamily: font, fontSize: "16px", outline: "none", color: T.high,
                  background: touched && !valid && phone ? "var(--fail-tint)" : T.surface2, border: `1px solid ${touched && !valid && phone ? T.fail : "transparent"}` }} />
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
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "10px" }}>
                    {slots.map((s, i) => (
                      <div key={i} style={{ height: "64px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "28px", fontWeight: 800, fontStretch: "112%", color: codeError ? T.fail : T.high, background: codeError ? "var(--fail-tint)" : T.surface2,
                        border: `1.5px solid ${codeError ? T.fail : s.isActive ? T.high : "transparent"}` }}>
                        {s.char ?? (s.hasFakeCaret ? <span style={{ width: "2px", height: "24px", background: T.high }} /> : null)}
                      </div>
                    ))}
                  </div>
                )} />
            </div>
            <p role="alert" style={{ color: T.fail, fontSize: "14px", minHeight: "21px", margin: "8px 0 0" }}>{error}</p>
            <div style={{ margin: "4px 0 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              {wait > 0
                ? <span style={{ color: T.low, fontSize: "14px" }}>Resend in 0:{String(wait).padStart(2, "0")}</span>
                : <button onClick={resend} style={textBtn}>Resend code</button>}
              <button onClick={() => { setScreen("phone"); setCode(""); setError(""); }} style={{ ...textBtn, color: T.mid, fontWeight: 700 }}>Change number</button>
            </div>
            <button onClick={() => verify()} disabled={code.length < CODE_LENGTH || busy} style={pill(true, code.length === CODE_LENGTH && !busy)}>
              {busy ? "Verifying…" : "Verify and save"}
            </button>
          </>
        )}

        {screen === "blocked" && (
          <>
            <button onClick={onGetApp} style={pill(true)} autoFocus>Get Tandem free</button>
            <p style={{ color: T.low, fontSize: "14px", textAlign: "center", margin: "10px 0 0" }}>Sign in there with the same number.</p>
            <OpenTandemLink onStuck={onStuck} />
          </>
        )}

        {screen === "slow" && (
          <>
            <button onClick={onGetApp} style={pill(true)} autoFocus>Get Tandem free</button>
            <button onClick={() => { setScreen("code"); setError(""); }} style={{ ...pill(false), marginTop: "10px" }}>Keep waiting</button>
            <OpenTandemLink onStuck={onStuck} />
          </>
        )}

        {/* Code step (J1-09a) has no Not now: Escape or a backdrop tap still close it */}
        {screen === "phone" && (
          <button onClick={onClose} style={{ ...pill(false), marginTop: "10px" }}>Not now</button>
        )}
      </div>
    </div>
  );
}
