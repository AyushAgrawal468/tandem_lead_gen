import React, { useState, useEffect, useRef, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation, useNavigationType } from "react-router-dom";

function ScrollToTop() {
  const { pathname } = useLocation();
  const navType = useNavigationType();

  useEffect(() => {
    window.history.scrollRestoration = "manual";
  }, []);

  // Save scroll position on every scroll event
  useEffect(() => {
    const save = () => {
      sessionStorage.setItem(`scrollY:${pathname}`, String(window.scrollY));
    };
    window.addEventListener("scroll", save, { passive: true });
    return () => window.removeEventListener("scroll", save);
  }, [pathname]);

  useEffect(() => {
    if (navType === "PUSH") {
      window.scrollTo(0, 0);
    } else if (navType === "POP") {
      const y = parseInt(sessionStorage.getItem(`scrollY:${pathname}`) ?? "0", 10);
      if (y > 0) {
        // Keep scrolling to target every frame for ~500ms to fight any layout
        // shifts from lazy-loaded sections rendering after navigation.
        let frames = 0;
        const MAX_FRAMES = 30;
        const restore = () => {
          window.scrollTo(0, y);
          if (frames++ < MAX_FRAMES) requestAnimationFrame(restore);
        };
        requestAnimationFrame(restore);
      }
    }
  }, [pathname, navType]);

  return null;
}
import { Helmet } from "react-helmet";
import { apiUrl } from "./lib/api";

import LocationConsent from "./components/LocationConsent";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ReferralRedirect from "./components/ReferralRedirect";
import DownloadRedirect from "./components/DownloadRedirect";
import EventRedirect from "./components/EventRedirect";
import AccountDeletion from "./pages/AccountDeletion";
import ChildSafety from "./pages/ChildSafety";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import RefundPolicy from "./pages/RefundPolicy";

const GA_ID = "G-XTYRTQY6R7";

const Features = lazy(() => import("./components/Features"));
// APP LAUNCHED: Waitlist hidden — uncomment to re-enable
// const Waitlist = lazy(() => import("./components/Waitlist"));
const Blog = lazy(() => import("./components/Blog"));
const FAQ = lazy(() => import("./components/FAQ"));
const DownloadSection = lazy(() => import("./components/DownloadSection"));
const Footer = lazy(() => import("./components/Footer"));

function useSectionEngagement(sectionIds, minimumVisible = 0.5) {
  useEffect(() => {
    if (typeof window === "undefined" || !window.IntersectionObserver) return;

    const clarityAvailable = () =>
      typeof window !== "undefined" && typeof window.clarity === "function";

    const run = () => {
      const state = new Map();
      sectionIds.forEach((id) =>
        state.set(id, { visible: false, enterTs: 0, totalMs: 0 })
      );

      const sendEvent = (name, data) => {
        if (clarityAvailable()) {
          try {
            window.clarity("event", name, data);
          } catch (_) {}
        }
      };

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const id = entry.target.id;
            if (!state.has(id)) return;

            const rec = state.get(id);
            const visibleNow = entry.intersectionRatio >= minimumVisible;
            const now = performance.now();

            if (visibleNow && !rec.visible) {
              rec.visible = true;
              rec.enterTs = now;
              sendEvent("section_enter", { id });
            } else if (!visibleNow && rec.visible) {
              rec.visible = false;
              const delta = now - rec.enterTs;
              rec.totalMs += delta;
              sendEvent("section_exit", {
                id,
                sessionTimeMs: Math.round(delta),
                cumulativeTimeMs: Math.round(rec.totalMs),
              });
            }
          });
        },
        { threshold: [minimumVisible] }
      );

      sectionIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });

      const onBeforeUnload = () => {
        const now = performance.now();
        state.forEach((rec, id) => {
          if (rec.visible) {
            const delta = now - rec.enterTs;
            rec.totalMs += delta;
            rec.visible = false;
            sendEvent("section_exit", {
              id,
              sessionTimeMs: Math.round(delta),
              cumulativeTimeMs: Math.round(rec.totalMs),
              unload: true,
            });
          }
          sendEvent("section_total", {
            id,
            totalTimeMs: Math.round(rec.totalMs),
          });
        });
      };

      window.addEventListener("beforeunload", onBeforeUnload);
      return () => {
        window.removeEventListener("beforeunload", onBeforeUnload);
        observer.disconnect();
      };
    };

    const idleId = window.requestIdleCallback
      ? window.requestIdleCallback(run, { timeout: 2000 })
      : setTimeout(run, 400);

    return () => {
      if (window.cancelIdleCallback && idleId) window.cancelIdleCallback(idleId);
    };
  }, [sectionIds.join("|"), minimumVisible]);
}

// Generate a fresh session id on every page load/refresh
let runtimeSessionId = null;
function getSessionId() {
  if (!runtimeSessionId) {
    runtimeSessionId =
      Math.random().toString(36).substring(2) + Date.now().toString(36);
    try {
      localStorage.setItem("sessionId", runtimeSessionId);
      sessionStorage.setItem("sessionId", runtimeSessionId);
    } catch (_) {}
  }
  return runtimeSessionId;
}

function LandingPage() {
  const navType = useNavigationType();
  const [showConsent, setShowConsent] = useState(false);
  const [timerData, setTimerData] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return;

    const upgradeImg = (img) => {
      if (!(img instanceof HTMLImageElement)) return;
      if (!img.hasAttribute("loading")) img.setAttribute("loading", "lazy");
      img.setAttribute("decoding", "async");
      if (img.getAttribute("fetchpriority") === "high")
        img.removeAttribute("fetchpriority");
    };

    document.querySelectorAll("img").forEach(upgradeImg);

    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes &&
          m.addedNodes.forEach((node) => {
            if (node instanceof HTMLImageElement) upgradeImg(node);
            else if (node && node.querySelectorAll) {
              node.querySelectorAll("img").forEach(upgradeImg);
            }
          });
      }
    });

    mo.observe(document.documentElement, { childList: true, subtree: true });
    return () => mo.disconnect();
  }, []);

  const [deferSections, setDeferSections] = useState(() => {
    // Only skip deferral on genuine back-navigation (saved scroll position exists).
    // On first-ever visit navType is also "POP", so we check sessionStorage too.
    if (navType !== "POP") return false;
    try { return !!sessionStorage.getItem("scrollY:/"); } catch { return false; }
  });
  useEffect(() => {
    if (deferSections) return;
    const reveal = () => setDeferSections(true);
    window.addEventListener("scroll", reveal, { once: true, passive: true });

    const idle = (cb) =>
      window.requestIdleCallback
        ? window.requestIdleCallback(cb, { timeout: 1800 })
        : setTimeout(cb, 300);

    const idleId = idle(() => setDeferSections(true));

    return () => {
      window.removeEventListener("scroll", reveal);
      if (window.cancelIdleCallback && typeof idleId === "number") {
        try {
          window.cancelIdleCallback(idleId);
        } catch {}
      }
    };
  }, [deferSections]);

  const logGuardsRef = useRef({
    usedStoredLog: false,
    consentPrecheckLog: false,
  });
  const consentTimerRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    const FIXED_START_TIME =1769763813000 ;
    const COUNTDOWN_DURATION_MS = 15 * 24 * 60 * 60 * 1000;
    const END_TIME = FIXED_START_TIME + COUNTDOWN_DURATION_MS;

    const computeCountdown = () => {
      const now = Date.now();
      const remainingMs = Math.max(END_TIME - now, 0);
      const timerObj = {
        startTime: FIXED_START_TIME,
        endTime: END_TIME,
        remainingSeconds: remainingMs,
      };
      if (isMounted) setTimerData(timerObj);
    };

    computeCountdown();
    const interval = setInterval(computeCountdown, 1000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  useSectionEngagement(["hero", "features", "waitlist", "blogs", "faq", "footer"]);

  const postLocation = (loc) => {
    const sessionId = getSessionId();
    fetch(apiUrl("api/location"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lat: loc.lat,
        lon: loc.lon,
        accuracy: loc.accuracy,
        ts: loc.ts,
        userId: 1,
        sessionId: sessionId,
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(
            `HTTP ${res.status} ${res.statusText} ${text ? "- " + text : ""}`
          );
        }
        return res.json();
      })
      .then((data) => console.log("✅ Saved to backend:", data))
      .catch((err) => console.error("❌ Error sending location:", err));
  };

  useEffect(() => {
    const getCookie = (name) => {
      return document.cookie
        .split("; ")
        .map((kv) => kv.split("="))
        .reduce(
          (acc, [k, v]) => (k === name ? decodeURIComponent(v || "") : acc),
          ""
        );
    };

    const locationConsent = getCookie("locationConsent");
    const userLocation = getCookie("userLocation");
    const handled = (() => {
      try {
        return sessionStorage.getItem("locationHandled") === "true";
      } catch {
        return false;
      }
    })();

    if ((locationConsent === "true" && userLocation) || handled) {
      if (!logGuardsRef.current.consentPrecheckLog) {
        console.log("📍 Location consent already granted, using stored location");
        logGuardsRef.current.consentPrecheckLog = true;
      }
      return;
    }

    const timer = setTimeout(() => {
      const recheckConsent = getCookie("locationConsent");
      let recheckHandled = false;
      try {
        recheckHandled = sessionStorage.getItem("locationHandled") === "true";
      } catch {}
      if (recheckConsent !== "true" && !recheckHandled) {
        setShowConsent(true);
      }
    }, 800);

    consentTimerRef.current = timer;

    return () => {
      if (consentTimerRef.current) {
        clearTimeout(consentTimerRef.current);
        consentTimerRef.current = null;
      }
    };
  }, []);

  const handleConsent = (allowed, sessionId, locationData, isFromStoredData = false) => {
    setShowConsent(false);
    try {
      sessionStorage.setItem("locationHandled", "true");
    } catch {}

    if (consentTimerRef.current) {
      clearTimeout(consentTimerRef.current);
      consentTimerRef.current = null;
    }

    if (allowed && locationData) {
      if (!isFromStoredData) {
        const loc = {
          lat: locationData.latitude,
          lon: locationData.longitude,
          accuracy: locationData.accuracy || null,
          city: null,
          source: "device",
          ts: locationData.timestamp,
        };
        postLocation(loc);
      }
    }
  };

  return (
    <div className="min-h-screen bg-bg-color text-texthigh font-body-r">
      <Helmet>
        <title>Tandem - Group Planning Made Simple</title>
        <meta
          name="description"
          content="Stop wasting 23 messages per hangout. Tandem gets your friends together 2x more often."
        />
      </Helmet>

      {GA_ID && (
        <Helmet>
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          ></script>
          <script>{`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}</script>
        </Helmet>
      )}

      <LocationConsent visible={showConsent} onConsent={handleConsent} sessionId={getSessionId()} />

      <Navbar />

      <Hero
        timerData={timerData}
        startTime={timerData?.startTime}
        endTime={timerData?.endTime}
        remainingSeconds={timerData?.remainingSeconds}
      />

      <div
        className="cv-lazy"
        style={{
          containIntrinsicSize: "320px",
          minHeight: deferSections ? undefined : "320px",
        }}
      >
        <Suspense
          fallback={
            <div className="w-full py-24 text-center text-white/60">
              Loading features…
            </div>
          }
        >
          {deferSections && <Features />}
        </Suspense>
      </div>

      {/* APP LAUNCHED: Waitlist hidden — uncomment to re-enable
      <div style={{ minHeight: deferSections ? undefined : "400px" }}>
        <Suspense
          fallback={
            <div className="w-full py-16 text-center text-white/60">
              Loading waitlist…
            </div>
          }
        >
          {deferSections && <Waitlist />}
        </Suspense>
      </div>
      */}

      <div
        className="cv-lazy"
        style={{
          containIntrinsicSize: "380px",
          minHeight: deferSections ? undefined : "380px",
        }}
      >
        <Suspense
          fallback={
            <div className="w-full py-16 text-center text-white/60">
              Loading blog…
            </div>
          }
        >
          {deferSections && <Blog />}
        </Suspense>
      </div>

      <div
        className="cv-lazy"
        style={{
          containIntrinsicSize: "260px",
          minHeight: deferSections ? undefined : "260px",
        }}
      >
        <Suspense
          fallback={
            <div className="w-full py-16 text-center text-white/60">
              Loading FAQ…
            </div>
          }
        >
          {deferSections && <FAQ />}
        </Suspense>
      </div>

      <div
        className="cv-lazy"
        style={{
          containIntrinsicSize: "340px",
          minHeight: deferSections ? undefined : "340px",
        }}
      >
        <Suspense fallback={<div className="w-full py-16" />}>
          {deferSections && <DownloadSection />}
        </Suspense>
      </div>

      <div
        className="cv-lazy"
        style={{
          containIntrinsicSize: "220px",
          minHeight: deferSections ? undefined : "220px",
        }}
      >
        <Suspense
          fallback={
            <div className="w-full py-16 text-center text-white/60">
              Loading footer…
            </div>
          }
        >
          {deferSections && <Footer />}
        </Suspense>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Referral Redirect Page (no UI) */}
        <Route path="/r" element={<ReferralRedirect />} />

        {/* Event share deep link — redirects to store; app opens event after install */}
        <Route path="/e/:eventId" element={<EventRedirect />} />

        {/* Download redirect — sends user to App Store or Play Store based on UA */}
        <Route path="/download" element={<DownloadRedirect />} />


        {/*Account-Deletion Page */}
        <Route path="/help/account-deletion" element={<AccountDeletion />} />

        {/* Child-Safety Page */}
        <Route path="/help/child-safety" element={<ChildSafety />} />
        <Route path="/help/refund-policy" element={<RefundPolicy />} />

        {/* Legal Pages */}
        <Route path="/legal/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/legal/terms-and-conditions" element={<TermsAndConditions />} />
        

      </Routes>
    </BrowserRouter>
  );
}
