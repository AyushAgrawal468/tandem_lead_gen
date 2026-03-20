import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { apiUrl } from "../lib/api";

export default function ReferralRedirect() {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("ref");
  const hasCalled = useRef(false);

  useEffect(() => {
    if (hasCalled.current) return;
    hasCalled.current = true;

    const playStoreUrl =
      "https://play.google.com/store/apps/details?id=com.whatsapp&pcampaignid=web_share";
    const appStoreUrl =
      "https://apps.apple.com/app/whatsapp-messenger/id310633997";

    const redirectUser = () => {
      const ua = navigator.userAgent.toLowerCase();
      const targetUrl =
        ua.includes("iphone") || ua.includes("ipad")
          ? appStoreUrl
          : playStoreUrl;

      window.location.replace(targetUrl);
    };

    const trackReferral = async () => {
      const ua = navigator.userAgent;
      const platform = /iPhone|iPad|iPod/.test(ua)
        ? "ios"
        : /Android/.test(ua)
        ? "android"
        : "unknown";

      try {
        await fetch(apiUrl(`/api/referral/${code}`), {
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
        console.log("Referral API failed:", e);
      } finally {
        redirectUser();
      }
    };

    if (code) {
      trackReferral();   // code hai → save + redirect
    } else {
      redirectUser();    // code nahi → seedha redirect
    }
  }, [code]);

  return null;
}
