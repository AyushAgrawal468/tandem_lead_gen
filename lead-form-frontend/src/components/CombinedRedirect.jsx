import { useEffect, useRef } from "react";
import { apiUrl } from "../lib/api";

const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.tandemit.tandemit";
const APP_STORE_URL =
  "https://apps.apple.com/in/app/tandem-events-experiences/id6756263621";

export default function CombinedRedirect() {
  const hasCalled = useRef(false);

  useEffect(() => {
    if (hasCalled.current) return;
    hasCalled.current = true;

    const params = new URLSearchParams(window.location.search);
    const referralCode = params.get("referral-code");
    const eventId = params.get("event-id");

    const ua = navigator.userAgent;
    const isIos = /iPhone|iPad|iPod/.test(ua);
    const isAndroid = /Android/.test(ua);
    const platform = isIos ? "ios" : isAndroid ? "android" : "unknown";
    const storeUrl = isIos ? APP_STORE_URL : PLAY_STORE_URL;

    const trackAndRedirect = async () => {
      try {
        const url = new URL(apiUrl("/api/links/click"), window.location.origin);
        if (referralCode) url.searchParams.set("referralCode", referralCode);
        if (eventId) url.searchParams.set("eventId", eventId);

        await fetch(url.toString(), {
          method: "POST",
          headers: {
            "X-API-KEY": "tandem_live_7KpQ2mX9vN4aR1cD8fH6jL3sZ0yW5uT2bE9gP1",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            screenWidth: window.screen.width,
            lang: navigator.language,
            platform,
          }),
        });
      } catch (e) {
        // tracking failure must not block the redirect
        console.log("Combined link tracking failed:", e);
      } finally {
        window.location.replace(storeUrl);
      }
    };

    trackAndRedirect();
  }, []);

  return null;
}