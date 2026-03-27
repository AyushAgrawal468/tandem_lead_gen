import { useEffect } from "react";

const PLAY_STORE = "https://play.google.com/store/apps/details?id=com.tandemit.tandemit";
const APP_STORE = "https://apps.apple.com/in/app/tandem-events-experiences/id6756263621";

export default function DownloadRedirect() {
  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    const target =
      ua.includes("iphone") || ua.includes("ipad") ? APP_STORE : PLAY_STORE;
    window.location.replace(target);
  }, []);

  return null;
}