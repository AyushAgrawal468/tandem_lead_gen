import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import PhonePreview from "./components/PhonePreview";
import Features from "./components/Features";
import LeadForm from "./components/LeadForm";
import Footer from "./components/Footer";
import ExperienceSection from "./components/ExperienceSection";
import LaunchingSoon from "./components/LaunchingSoon";
import CountdownTimer from "./components/CountdownTimer";

// ✅ Blogs page
import BlogsPage from "./components/BlogsPage";

function App() {
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
        .reduce((acc, [k, v]) => (k === name ? decodeURIComponent(v || "") : acc), "");
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
        .catch((err) => console.error("❌ Error sending location to backend:", err));
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

    // 🚀 Check consent & stored location
    const consent = getCookie(CONSENT_KEY);
    const stored = readLocation();

    if (consent === "granted" && stored) {
      loadLocationContent(stored);
      return;
    }

    const popupEl = document.getElementById("location-consent");
    if (popupEl && !consent) popupEl.classList.remove("lc-hidden");

    const onDocClick = (e) => {
      if (!e.target) return;
      const allow =
        e.target.id === "lc-allow" || e.target.closest?.("#lc-allow");
      const deny =
        e.target.id === "lc-deny" || e.target.closest?.("#lc-deny");

      if (allow || deny) {
        popupEl?.classList.add("lc-hidden");
        if (allow) {
          saveConsent("granted");
          requestGeolocation();
        } else {
          saveConsent("denied");
        }
      }
    };

    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  return (
    <Router>
      <div className="font-sans min-h-screen bg-[#181927]">
        <Header />

        <Routes>
          {/* 🏠 Home Page */}
          <Route
            path="/"
            element={
              <>
                <PhonePreview />
                <ExperienceSection />
                <Features />
                <CountdownTimer targetDays={10} />
                <LeadForm />
                <LaunchingSoon />
              </>
            }
          />

          {/* 📰 Blogs Page */}
          <Route path="/blogs" element={<BlogsPage />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
