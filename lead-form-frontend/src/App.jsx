import React, { useState, useEffect, useRef, lazy, Suspense } from "react";
import { apiUrl } from './lib/api';
import LocationConsent from "./components/LocationConsent";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
// Lazy load below-the-fold heavy sections to reduce initial bundle & blocking time
const Features = lazy(() => import('./components/Features'));
const Waitlist = lazy(() => import('./components/Waitlist'));
const Blog = lazy(() => import('./components/Blog'));
const FAQ = lazy(() => import('./components/FAQ'));
const Footer = lazy(() => import('./components/Footer'));
// Simple section engagement tracker using IntersectionObserver + Clarity custom events (deferred to idle)
function useSectionEngagement(sectionIds, minimumVisible = 0.5) {
  useEffect(() => {
    if (typeof window === 'undefined' || !(window).IntersectionObserver) return;
    const clarityAvailable = () => typeof window !== 'undefined' && typeof (window).clarity === 'function';
    const run = () => {
      const state = new Map();
      sectionIds.forEach(id => state.set(id, { visible: false, enterTs: 0, totalMs: 0 }));
      const sendEvent = (name, data) => {
        if (clarityAvailable()) {
          try { (window).clarity('event', name, data); } catch (_) {}
        }
      };
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          const id = entry.target.id;
          if (!state.has(id)) return;
          const rec = state.get(id);
          const visibleNow = entry.intersectionRatio >= minimumVisible;
          const now = performance.now();
          if (visibleNow && !rec.visible) {
            rec.visible = true;
            rec.enterTs = now;
            sendEvent('section_enter', { id });
          } else if (!visibleNow && rec.visible) {
            rec.visible = false;
            const delta = now - rec.enterTs;
            rec.totalMs += delta;
            sendEvent('section_exit', { id, sessionTimeMs: Math.round(delta), cumulativeTimeMs: Math.round(rec.totalMs) });
          }
        });
      }, { threshold: [minimumVisible] });
      sectionIds.forEach(id => {
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
            sendEvent('section_exit', { id, sessionTimeMs: Math.round(delta), cumulativeTimeMs: Math.round(rec.totalMs), unload: true });
          }
          sendEvent('section_total', { id, totalTimeMs: Math.round(rec.totalMs) });
        });
      };
      window.addEventListener('beforeunload', onBeforeUnload);
      return () => {
        window.removeEventListener('beforeunload', onBeforeUnload);
        observer.disconnect();
      };
    };
    const idleId = window.requestIdleCallback ? window.requestIdleCallback(run, { timeout: 2000 }) : setTimeout(run, 400);
    return () => {
      if (window.cancelIdleCallback && idleId) window.cancelIdleCallback(idleId);
    };
  }, [sectionIds.join('|'), minimumVisible]);
}
// Lazy load timer component
const CountdownTimer = lazy(() => import('./components/CountdownTimer'));

// Generate a fresh session id on every page load/refresh
let runtimeSessionId = null;
function getSessionId() {
  if (!runtimeSessionId) {
    runtimeSessionId =
      Math.random().toString(36).substring(2) + Date.now().toString(36);
    try {
      // Overwrite any stored value so other code sees the current session
      localStorage.setItem("sessionId", runtimeSessionId);
      sessionStorage.setItem("sessionId", runtimeSessionId);
    } catch (_) {}
  }
  return runtimeSessionId;
}

function App() {
  const [showConsent, setShowConsent] = useState(false);
  const [timerData, setTimerData] = useState(null);
  // Defer non-critical sections until idle/first scroll for faster FCP
  const [deferSections, setDeferSections] = useState(false);
  useEffect(() => {
    // Reveal on first scroll OR after idle timeout
    if (deferSections) return;
    const reveal = () => setDeferSections(true);
    window.addEventListener('scroll', reveal, { once: true, passive: true });
    const idle = (cb) => (window.requestIdleCallback ? window.requestIdleCallback(cb, { timeout: 1800 }) : setTimeout(cb, 300));
    const idleId = idle(() => setDeferSections(true));
    return () => {
      window.removeEventListener('scroll', reveal);
      if (window.cancelIdleCallback && typeof idleId === 'number') {
        try { window.cancelIdleCallback(idleId); } catch {}
      }
    };
  }, [deferSections]);
  // One-time log guards to avoid console spam in dev/StrictMode
  const logGuardsRef = useRef({ usedStoredLog: false, consentPrecheckLog: false });
  const consentTimerRef = useRef(null);

  // Local countdown (mirrors backend logic): fixed start + 20 days
  useEffect(() => {
    let isMounted = true;
    const FIXED_START_TIME = 1762300800000; // NOV 5, 2025 00:00:00 UTC (ms)
    const COUNTDOWN_DURATION_MS = 28 * 24 * 60 * 60 * 1000; // 28 days
    const END_TIME = FIXED_START_TIME + COUNTDOWN_DURATION_MS;

    const computeCountdown = () => {
      const now = Date.now();
      const remainingMs = Math.max(END_TIME - now, 0);
      const timerObj = {
        startTime: FIXED_START_TIME,
        endTime: END_TIME,
        remainingSeconds: remainingMs, // keep ms to match timer expectations
      };
      if (isMounted) setTimerData(timerObj);
    };

    computeCountdown();
    const interval = setInterval(computeCountdown, 1000); // update every second for smoother UX
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Track engagement for key sections (ensure each has an id)
  useSectionEngagement(['hero','features','waitlist','blogs','faq','footer']);

  // helper to post location with fresh sessionId
  const postLocation = (loc) => {
    const sessionId = getSessionId(); // ✅ always fetch latest
    fetch(apiUrl('api/location'), {
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
          throw new Error(`HTTP ${res.status} ${res.statusText} ${text ? '- ' + text : ''}`);
        }
        return res.json();
      })
      .then((data) => console.log("✅ Saved to backend:", data))
      .catch((err) => {
        // Common causes: backend not running on 8080, proxy misconfig, CORS, or network
        console.error("❌ Error sending location:", err);
      });
  };

  useEffect(() => {
    // Check if LocationConsent component has already handled consent
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
      try { return sessionStorage.getItem("locationHandled") === "true"; } catch { return false; }
    })();

    // If LocationConsent component already handled this, don't show popup
    if ((locationConsent === "true" && userLocation) || handled) {
      if (!logGuardsRef.current.consentPrecheckLog) {
        console.log("📍 Location consent already granted, using stored location");
        logGuardsRef.current.consentPrecheckLog = true;
      }
      return;
    }

    // Only show consent popup if not already handled by LocationConsent component
    const timer = setTimeout(() => {
      // Double-check that LocationConsent didn't handle it in the meantime
      const recheckConsent = getCookie("locationConsent");
      let recheckHandled = false;
      try { recheckHandled = sessionStorage.getItem("locationHandled") === "true"; } catch {}
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
    try { sessionStorage.setItem("locationHandled", "true"); } catch {}
    if (consentTimerRef.current) {
      clearTimeout(consentTimerRef.current);
      consentTimerRef.current = null;
    }
    
    if (allowed && locationData) {
      // Only send to backend if this is fresh location data, not from stored cookies
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
        console.log("📍 Fresh location received and sent to backend:", loc);
      } else {
        if (!logGuardsRef.current.usedStoredLog) {
          console.log("📍 Using stored location data (not sending to backend again)");
          logGuardsRef.current.usedStoredLog = true;
        }
      }
    } else if (allowed && !locationData) {
      console.log("📍 Permission granted but no location data received");
    } else {
      console.log("📍 Location permission denied by user");
    }
  };

  return (
    <div className="min-h-screen bg-bg-color text-texthigh font-body-r">
      <LocationConsent
        visible={showConsent}
        onConsent={handleConsent}
        sessionId={getSessionId()}
      />
      <Navbar />
      {/* Pass timerData props explicitly to Hero/CountdownTimer */}
      <Hero
        timerData={timerData}
        startTime={timerData?.startTime}
        endTime={timerData?.endTime}
        remainingSeconds={timerData?.remainingSeconds}
      />
      <div className="cv-lazy" style={{ containIntrinsicSize: '320px', minHeight: deferSections ? undefined : '320px' }}>
        <Suspense fallback={<div className="w-full py-24 text-center text-white/60">Loading features…</div>}>
          {deferSections && <Features />}
        </Suspense>
      </div>
      {/* Removed cv-lazy on Waitlist to avoid clipping its decorative top on desktop/tablet */}
      <div style={{ minHeight: deferSections ? undefined : '400px' }}>
        <Suspense fallback={<div className="w-full py-16 text-center text-white/60">Loading waitlist…</div>}>
          {deferSections && <Waitlist />}
        </Suspense>
      </div>
      <div className="cv-lazy" style={{ containIntrinsicSize: '380px', minHeight: deferSections ? undefined : '380px' }}>
        <Suspense fallback={<div className="w-full py-16 text-center text-white/60">Loading blog…</div>}>
          {deferSections && <Blog />}
        </Suspense>
      </div>
      <div className="cv-lazy" style={{ containIntrinsicSize: '260px', minHeight: deferSections ? undefined : '260px' }}>
        <Suspense fallback={<div className="w-full py-16 text-center text-white/60">Loading FAQ…</div>}>
          {deferSections && <FAQ />}
        </Suspense>
      </div>
      <div className="cv-lazy" style={{ containIntrinsicSize: '220px', minHeight: deferSections ? undefined : '220px' }}>
        <Suspense fallback={<div className="w-full py-16 text-center text-white/60">Loading footer…</div>}>
          {deferSections && <Footer />}
        </Suspense>
      </div>
    </div>
  );
}

export default App;
