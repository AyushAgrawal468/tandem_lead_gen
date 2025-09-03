import React from "react";

const LocationConsent = ({ visible, onConsent, sessionId }) => {
  const handleConsent = (allowed) => {
    // Always forward both consent choice and sessionId
    onConsent(allowed, sessionId);
  };

  return visible ? (
    <div id="location-consent">
      <div className="lc-panel">
        <h3>Location Consent</h3>
        <p>
          We use your location to personalize your experience and improve our
          services. Your location will be sent securely to our backend. You can
          allow or deny this request.
        </p>
        <div className="lc-actions">
          <button className="lc-btn lc-allow" onClick={() => handleConsent(true)}>
            Allow
          </button>
          <button className="lc-btn lc-deny" onClick={() => handleConsent(false)}>
            Deny
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default LocationConsent;
