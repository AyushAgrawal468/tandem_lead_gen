import { useState, useEffect } from "react";
import LocationConsent from "./components/LocationConsent";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Waitlist from "./components/Waitlist";
import Blog from "./components/Blog";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import CountdownTimer from "./components/CountdownTimer"; // ✅ import timer

function getSessionId() {
  let sessionId = localStorage.getItem("sessionId");
  if (!sessionId) {
    sessionId =
      Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem("sessionId", sessionId);
  }
  return sessionId;
}

function App() {
  const [showConsent, setShowConsent] = useState(false);
  const [timerData, setTimerData] = useState(null);

  // fetch countdown from backend every minute
  useEffect(() => {
    let isMounted = true;
    const fetchCountdown = () => {
      fetch("http://localhost:8080/countdown")
        .then((res) => res.json())
        .then((data) => {
          console.log('⏳ Backend countdown data:', data);
          // Ensure startTime, endTime, remainingSeconds are present and correct
          // If remainingSeconds is in seconds, convert to ms for timer
          let timerObj = { ...data };
          if (typeof timerObj.remainingSeconds === 'number' && timerObj.remainingSeconds < 1000000000000) {
            // If value is in seconds, convert to ms
            timerObj.remainingSeconds = timerObj.remainingSeconds * 1000;
          }
          if (!timerObj.startTime && timerObj.endTime && timerObj.remainingSeconds) {
            timerObj.startTime = timerObj.endTime - timerObj.remainingSeconds;
          }
          if (isMounted) setTimerData(timerObj);
        })
        .catch((err) => console.error("❌ Error fetching countdown:", err));
    };
    fetchCountdown();
    const interval = setInterval(fetchCountdown, 60 * 1000); // every minute
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // helper to post location with fresh sessionId
  const postLocation = (loc) => {
    const sessionId = getSessionId(); // ✅ always fetch latest
    fetch("http://localhost:8080/api/location", {
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
      .then((res) => res.json())
      .then((data) => console.log("✅ Saved to backend:", data))
      .catch((err) => console.error("❌ Error sending location:", err));
  };

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
      postLocation(obj); // ✅ reuse helper
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

    const consent = getCookie(CONSENT_KEY);
    const stored = readLocation();

    if (consent === "granted" && stored) {
      loadLocationContent(stored);
    } else if (!consent) {
      const timer = setTimeout(() => setShowConsent(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleConsent = (allowed) => {
    const CONSENT_KEY = "location_consent";
    setShowConsent(false);
    if (allowed) {
      document.cookie = `${CONSENT_KEY}=granted; path=/; SameSite=Lax`;
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
            postLocation(loc); // ✅ reuse helper
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
      <Features />
      <Waitlist />
      <Blog />
      <FAQ />
      <Footer />
    </div>
  );
}

export default App;
