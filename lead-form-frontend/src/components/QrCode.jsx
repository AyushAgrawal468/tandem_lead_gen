import React, { useEffect, useState } from "react";
import AppIcon from "../assets/t-logo.svg";
import { utm } from "../lib/app";

/**
 * Handoff: the QR goes to /download with the visitor's UTM tags, at error-correction level H so it
 * still scans with the app icon in the middle. The generator loads only when a QR is shown (desktop).
 */
export default function QrCode({ size = 200 }) {
  const [cells, setCells] = useState(null);
  useEffect(() => {
    const { source, campaign } = utm();
    const url = `${window.location.origin}/download?${new URLSearchParams({ utm_source: source, utm_campaign: campaign })}`;
    import("qrcode-generator").then(({ default: qrcode }) => {
      const qr = qrcode(0, "H");
      qr.addData(url);
      qr.make();
      const n = qr.getModuleCount();
      setCells({ n, on: (r, c) => qr.isDark(r, c), url });
    });
  }, []);

  const pad = 2; // quiet zone, in modules
  return (
    <div style={{ position: "relative", width: size, height: size, margin: "0 auto", background: "#fff", borderRadius: "16px", padding: "10px", boxSizing: "border-box" }}>
      {cells && (
        <svg viewBox={`0 0 ${cells.n + pad * 2} ${cells.n + pad * 2}`} width="100%" height="100%" role="img" aria-label="QR code to get Tandem on your phone" shapeRendering="crispEdges">
          <path fill="#111" d={Array.from({ length: cells.n }, (_, r) => Array.from({ length: cells.n }, (_, c) =>
            cells.on(r, c) ? `M${c + pad},${r + pad}h1v1h-1z` : "").join("")).join("")} />
        </svg>
      )}
      {/* App icon in the centre: about 20% of the code, well inside level H's 30% recovery */}
      <span aria-hidden="true" style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", width: size * 0.2, height: size * 0.2,
        borderRadius: "10px", background: "#fff", display: "grid", placeItems: "center", boxShadow: "0 0 0 3px #fff" }}>
        <img src={AppIcon} alt="" style={{ height: "70%" }} />
      </span>
    </div>
  );
}
