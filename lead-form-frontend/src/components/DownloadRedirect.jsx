import { useEffect, useState } from "react";
import { storeUrl, whenStuck } from "../lib/app";
import { OpenInBrowser } from "./AppPrompts";

// Every app prompt goes through /download (handoff 2.6): the store link carries the visitor's campaign
// (Play referrer, App Store ct/pt). In iOS in-app browsers a stuck store link shows "Open in browser".
export default function DownloadRedirect() {
  const [stuck, setStuck] = useState(false);
  useEffect(() => {
    whenStuck(() => setStuck(true));
    window.location.replace(storeUrl());
  }, []);

  return stuck ? <OpenInBrowser onClose={() => setStuck(false)} /> : null;
}
