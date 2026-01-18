import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { apiUrl } from "../lib/api";

export default function ReferralRedirect() {
  const { code } = useParams();

  useEffect(() => {
    const playStoreUrl =
      "https://play.google.com/store/apps/details?id=com.whatsapp&pcampaignid=web_share";
    const appStoreUrl =
      "https://apps.apple.com/app/whatsapp-messenger/id310633997";

    const trackAndRedirect = async () => {
      const backendUrl = apiUrl(`/api/referral/${code}`);
      try {
        const res = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "X-API-KEY": "tandem_live_7KpQ2mX9vN4aR1cD8fH6jL3sZ0yW5uT2bE9gP1",
      },
    });
        console.log("✅ Backend response status:", res.status);
      } catch (e) {
        console.log("❌ Backend request failed:", e);
      } finally {
        const userAgent =
          navigator.userAgent || navigator.vendor || window.opera;

        let targetUrl = playStoreUrl;

        if (/android/i.test(userAgent)) {
          targetUrl = playStoreUrl;
        } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
          targetUrl = appStoreUrl;
        }

        window.location.replace(targetUrl);
      }
    };

    if (code) trackAndRedirect();
  }, [code]);

  return null;
}
