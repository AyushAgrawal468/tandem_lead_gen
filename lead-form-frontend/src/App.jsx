import React, { useState, useEffect, useRef, lazy, Suspense } from "react";
import { Helmet } from "react-helmet";
import { apiUrl } from "./lib/api";
import LocationConsent from "./components/LocationConsent";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AccountDeletion from "./pages/AccountDeletion";

const GA_ID = "G-XTYRTQY6R7";

const Features = lazy(() => import("./components/Features"));
const Waitlist = lazy(() => import("./components/Waitlist"));
const Blog = lazy(() => import("./components/Blog"));
const FAQ = lazy(() => import("./components/FAQ"));
const Footer = lazy(() => import("./components/Footer"));

function useSectionEngagement(sectionIds, minimumVisible = 0.5) {
  useEffect(() => {
    if (typeof window === "undefined" || !window.IntersectionObserver) return;
    const observer = new IntersectionObserver(() => {}, { threshold: [minimumVisible] });
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sectionIds.join("|"), minimumVisible]);
}

let runtimeSessionId = null;
function getSessionId() {
  if (!runtimeSessionId) {
    runtimeSessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
    try {
      localStorage.setItem("sessionId", runtimeSessionId);
      sessionStorage.setItem("sessionId", runtimeSessionId);
    } catch (_) {}
  }
  return runtimeSessionId;
}

function HomePage({ showConsent, handleConsent, timerData }) {
  return (
    <div className="min-h-screen bg-bg-color text-texthigh font-body-r">
      <Helmet>
        <title>Tandem - Group Planning Made Simple</title>
        <meta name="description" content="Stop wasting 23 messages per hangout. Tandem gets your friends together 2x more often." />
      </Helmet>

      {GA_ID && (
        <Helmet>
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}></script>
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

      <Suspense fallback={null}><Features /></Suspense>
      <Suspense fallback={null}><Waitlist /></Suspense>
      <Suspense fallback={null}><Blog /></Suspense>
      <Suspense fallback={null}><FAQ /></Suspense>
      <Suspense fallback={null}><Footer /></Suspense>
    </div>
  );
}

function App() {
  const [showConsent, setShowConsent] = useState(false);
  const [timerData, setTimerData] = useState(null);

  useSectionEngagement(["hero", "features", "waitlist", "blogs", "faq", "footer"]);

  // ✅ RESTORED COUNTDOWN TIMER LOGIC
  useEffect(() => {
    let isMounted = true;

    const FIXED_START_TIME = 1769751555000; // Jan 30, 2026
    const COUNTDOWN_DURATION_MS = 15 * 24 * 60 * 60 * 1000; // 15 days
    const END_TIME = FIXED_START_TIME + COUNTDOWN_DURATION_MS;

    const updateTimer = () => {
      const now = Date.now();
      const remainingMs = Math.max(END_TIME - now, 0);

      if (isMounted) {
        setTimerData({
          startTime: FIXED_START_TIME,
          endTime: END_TIME,
          remainingSeconds: remainingMs,
        });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleConsent = () => {};

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              showConsent={showConsent}
              handleConsent={handleConsent}
              timerData={timerData}
            />
          }
        />
        <Route path="/help/account-deletion" element={<AccountDeletion />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
