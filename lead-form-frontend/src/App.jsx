import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import PhonePreview from "./components/PhonePreview";
import Features from "./components/Features";
import LeadForm from "./components/LeadForm";
import Footer from "./components/Footer";
import ExperienceSection from "./components/ExperienceSection";
import LaunchingSoon from "./components/LaunchingSoon";
import CountdownTimer from "./components/CountdownTimer";
import BlogsPage from "./components/BlogsPage";

function App() {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    const CONSENT_KEY = "location_consent";
    const LOCATION_KEY = "user_location";
    const EXPIRE_DAYS = 365;

    const setCookie = (name, value, days = EXPIRE_DAYS) => {
      const expires = new Date(
        Date.now() + days * 24 * 60 * 60 * 1000
      ).toUTCString();
      document.cookie = `${name}=${encodeURIComponent(
        value
      )}; expires=${expires}; path=/; SameSite=Lax`;
    };

    const getCookie = (name) => {
      return document.cookie
        .split("; ")
        .map((kv) => kv.split("="))
        .reduce(
          (acc, [k, v]) => (k === name ? decodeURIComponent(v || "") : acc),
          ""
        );
    };

    const saveConsent = (consent) => setCookie(CONSENT_KEY, consent);
    const saveLocation = (obj) => {
      setCookie(LOCATION_KEY, JSON.stringify(obj));
      fetch("http://localhost:8080/api/location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lat: obj.lat,
          lon: obj.lon,
          accuracy: obj.accuracy,
          ts: obj.ts,
          userId: 1,
        }),
      })
        .then((res) => res.json())
        .then((data) => console.log("✅ Saved to backend:", data))
        .catch((err) =>
          console.error("❌ Error sending location to backend:", err)
        );
    };

    const readLocation = () => {
      try {
        return JSON.parse(getCookie(LOCATION_KEY) || "null");
      } catch {
        return null;
      }
    };

    const loadLocationContent = (location) => {
      console.log("📍 Location loaded:", location);
    };

    const ipFallback = async () => {
      try {
        const res = await fetch("https://ipapi.co/json/");
        if (!res.ok) throw new Error("IP lookup failed");
        const j = await res.json();
        if (j?.latitude && j?.longitude) {
          const loc = {
            lat: j.latitude,
            lon: j.longitude,
            city: j.city || null,
            source: "ip",
            ts: Date.now(),
          };
          saveLocation(loc);
          loadLocationContent(loc);
        }
      } catch (e) {
        console.warn("❌ IP fallback failed", e);
      }
    };

    const requestGeolocation = () => {
      if (!navigator.geolocation) {
        ipFallback();
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = {
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
            city: null,
            source: "device",
            ts: Date.now(),
          };
          saveLocation(loc);
          loadLocationContent(loc);
        },
        (err) => {
          console.warn("❌ Geolocation error:", err);
          if (err.code === err.PERMISSION_DENIED) saveConsent("denied");
          ipFallback();
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    };

    // Check consent & stored location
    const consent = getCookie(CONSENT_KEY);
    const stored = readLocation();

    if (consent === "granted" && stored) {
      loadLocationContent(stored);
    } else if (!consent) {
      // Delay showing the consent popup by 1.5 seconds
      const timer = setTimeout(() => setShowConsent(true), 1500);
      return () => clearTimeout(timer);
    }

    // eslint-disable-next-line
  }, []);

  const handleConsent = (allowed) => {
    const CONSENT_KEY = "location_consent";
    setShowConsent(false);
    if (allowed) {
      document.cookie = `${CONSENT_KEY}=granted; path=/; SameSite=Lax`;
      // Trigger geolocation request
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const LOCATION_KEY = "user_location";
            const loc = {
              lat: pos.coords.latitude,
              lon: pos.coords.longitude,
              accuracy: pos.coords.accuracy,
              city: null,
              source: "device",
              ts: Date.now(),
            };
            document.cookie = `${LOCATION_KEY}=${JSON.stringify(
              loc
            )}; path=/; SameSite=Lax`;
            fetch("http://localhost:8080/api/location", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                lat: loc.lat,
                lon: loc.lon,
                accuracy: loc.accuracy,
                ts: loc.ts,
                userId: 1,
              }),
            })
              .then((res) => res.json())
              .then((data) => console.log("✅ Saved to backend:", data))
              .catch((err) =>
                console.error("❌ Error sending location to backend:", err)
              );
          },
          (err) => {
            console.warn("❌ Geolocation error:", err);
          },
          { enableHighAccuracy: true }
        );
      }
    } else {
      document.cookie = `${CONSENT_KEY}=denied; path=/; SameSite=Lax`;
    }
  };

  return (
    <Router>
      <div className="font-sans min-h-screen bg-[#181927] overflow-x-hidden relative">
        <Header />

        <Routes>
          <Route
            path="/"
            element={
              <main className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <PhonePreview />
                <ExperienceSection />
                <Features />
                <CountdownTimer targetDays={10} />
                <LeadForm />
                <LaunchingSoon />
              </main>
            }
          />

          <Route
            path="/blogs"
            element={
              <main className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
                <BlogsPage />
              </main>
            }
          />
        </Routes>

        <Footer />

        {/* React-controlled Location Consent */}
        {showConsent && (
          <div
            id="location-consent"
            className="absolute inset-0 flex items-end justify-center z-50"
            aria-live="polite"
          >
            <div className="lc-panel bg-[#23243a] rounded-lg shadow-lg p-4 m-4 max-w-sm w-full">
              <h3 className="text-gray-300 text-lg font-semibold">Allow location?</h3>
              <p className="text-gray-400 mt-2">
                We use location to show content relevant to your area. Allow using
                your device location?
              </p>
              <div className="lc-actions flex justify-end gap-2 mt-3">
                <button
                  className="lc-btn lc-allow px-4 py-2 rounded font-bold text-white"
                  onClick={() => handleConsent(true)}
                >
                  Allow
                </button>
                <button
                  className="lc-btn lc-deny px-4 py-2 rounded font-bold text-white bg-red-600 hover:bg-red-700"
                  onClick={() => handleConsent(false)}
                >
                  No thanks
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;
