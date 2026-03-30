import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { apiUrl } from "../lib/api";

const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.tandemit.tandemit";
const APP_STORE_URL =
  "https://apps.apple.com/in/app/tandem-events-experiences/id6756263621";

export default function EventRedirect() {
  const { eventId } = useParams();
  const hasCalled = useRef(false);

  useEffect(() => {
    if (hasCalled.current) return;
    hasCalled.current = true;

    const ua = navigator.userAgent;
    const isIos = /iPhone|iPad|iPod/.test(ua);
    const isAndroid = /Android/.test(ua);
    const platform = isIos ? "ios" : isAndroid ? "android" : "unknown";
    const storeUrl = isIos ? APP_STORE_URL : PLAY_STORE_URL;

    const trackAndRedirect = async () => {
      try {
        await fetch(apiUrl(`/api/event-link/${eventId}`), {
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
        console.log("Event link tracking failed:", e);
      } finally {
        window.location.replace(storeUrl);
      }
    };

    trackAndRedirect();
  }, [eventId]);

  return null;
}