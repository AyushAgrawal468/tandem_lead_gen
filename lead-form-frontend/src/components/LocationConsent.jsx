import React, { useEffect, useState, useRef } from "react";

const LocationConsent = ({ visible, onConsent, sessionId }) => {
  const [shouldShow, setShouldShow] = useState(false);
  // One-time log guards to avoid repeated console output in dev/StrictMode
  const logGuardsRef = useRef({
    deniedOnce: false,
    locExpiredOnce: false,
    parseErrorOnce: false,
    geoUnsupportedOnce: false,
    geoRequestOnce: false,
    geoSuccessOnce: false,
    geoErrorOnce: false,
    geoErrorDetailsOnce: false,
    geoBlockedOnce: false,
    deniedClickOnce: false,
  });
  const handledRef = useRef(false);

  // Cookie utility functions
  const setCookie = (name, value, hours) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + (hours * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  };

  const getCookie = (name) => {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  };

  const deleteCookie = (name) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  };

  // Generate and manage UID for storing location in localStorage only
  const nextUID = () => {
    try {
      const n = parseInt(localStorage.getItem('userLocationCounter') || '0', 10) + 1;
      localStorage.setItem('userLocationCounter', String(n));
      return `data_${n}`;
    } catch {
      // Fallback to timestamp-based if localStorage unavailable
      return `data_${Date.now()}`;
    }
  };

  const saveLocationByUID = (locationData) => {
    const uid = nextUID();
    try { localStorage.setItem(`loc:${uid}`, JSON.stringify(locationData)); } catch {}
    // Store only the UID in cookie (2 hours)
    setCookie('userLocation', uid, 2);
    return uid;
  };

  const readLocationByUID = (uid) => {
    try {
      const raw = localStorage.getItem(`loc:${uid}`);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  };

  const deleteLocationByUID = (uid) => {
    try { localStorage.removeItem(`loc:${uid}`); } catch {}
  };

  // Check for existing location consent on component mount
  useEffect(() => {
    const alreadyHandled = (() => {
      try { return sessionStorage.getItem('locationHandled') === 'true'; } catch { return false; }
    })();

    if (alreadyHandled) {
      setShouldShow(false);
      return;
    }

  const existingConsent = getCookie('locationConsent');
  let storedLocation = getCookie('userLocation');
    const deniedConsent = getCookie('locationDenied');
    
    // If user previously denied, don't show popup for this session
    if (deniedConsent === 'true') {
      if (!logGuardsRef.current.deniedOnce) {
        console.log('📍 Location previously denied in this session');
        logGuardsRef.current.deniedOnce = true;
      }
      setShouldShow(false);
      return;
    }
    
    if (existingConsent === 'true' && storedLocation) {
      // Migration: if cookie accidentally contains JSON, migrate to UID
      try {
        const looksJSON = storedLocation.startsWith('%7B') || storedLocation.startsWith('{');
        if (looksJSON) {
          const parsed = JSON.parse(decodeURIComponent(storedLocation));
          const uid = saveLocationByUID(parsed);
          storedLocation = uid;
        }
      } catch {}

      // Read by UID from localStorage
      const uid = storedLocation;
      const locationData = readLocationByUID(uid);
      if (locationData) {
        // Check if location data is still valid (within 2 hours)
        const twoHoursAgo = Date.now() - (2 * 60 * 60 * 1000);
        if (locationData.timestamp && locationData.timestamp > twoHoursAgo) {
          onConsent(true, sessionId, locationData, true);
          setShouldShow(false);
          return;
        } else {
          if (!logGuardsRef.current.locExpiredOnce) {
            console.log('📍 Stored location expired, requesting fresh consent');
            logGuardsRef.current.locExpiredOnce = true;
          }
          deleteCookie('locationConsent');
          deleteCookie('userLocation');
          deleteLocationByUID(uid);
          setShouldShow(visible);
          return;
        }
      } else {
        // No location stored for this UID, clean up
        deleteCookie('locationConsent');
        deleteCookie('userLocation');
        setShouldShow(visible);
        return;
      }
    } else {
      // No valid consent/location found, show popup if requested
      setShouldShow(visible);
    }
  }, [visible, onConsent, sessionId]);

  const handleConsent = (allowed) => {
    if (handledRef.current) return;
    handledRef.current = true;
    try { sessionStorage.setItem('locationHandled', 'true'); } catch {}
    if (allowed) {
      // Set consent cookie for 2 hours
      setCookie('locationConsent', 'true', 2);
      
      // Hide the custom popup first
      setShouldShow(false);
      
      // Then immediately request browser's location permission
      const requestGeo = () => {
        if (!navigator.geolocation) {
          if (!logGuardsRef.current.geoUnsupportedOnce) {
            console.error('❌ Geolocation is not supported by this browser.');
            logGuardsRef.current.geoUnsupportedOnce = true;
          }
          onConsent(true, sessionId, null);
          return;
        }
        if (!logGuardsRef.current.geoRequestOnce) {
          console.log('🔍 Requesting browser location permission...');
          logGuardsRef.current.geoRequestOnce = true;
        }
        navigator.geolocation.getCurrentPosition(
          (position) => {
            if (!logGuardsRef.current.geoSuccessOnce) {
              console.log('✅ Location obtained successfully');
              logGuardsRef.current.geoSuccessOnce = true;
            }
            const locationData = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              timestamp: Date.now()
            };
            // Store only a UID in cookie; persist details in localStorage
            saveLocationByUID(locationData);
            onConsent(true, sessionId, locationData);
          },
          (error) => {
            if (!logGuardsRef.current.geoErrorOnce) {
              console.error('❌ Browser location error:', error.message);
              logGuardsRef.current.geoErrorOnce = true;
            }
            let errorMessage = 'Unknown error';
            switch(error.code) {
              case error.PERMISSION_DENIED:
                errorMessage = 'User denied the request for location access';
                // Mark denial briefly to avoid repeated attempts
                setCookie('locationDenied', 'true', 2);
                break;
              case error.POSITION_UNAVAILABLE:
                errorMessage = 'Location information is unavailable';
                break;
              case error.TIMEOUT:
                errorMessage = 'The request to get user location timed out';
                break;
            }
            if (!logGuardsRef.current.geoErrorDetailsOnce) {
              console.log('📍 Location error details:', errorMessage);
              logGuardsRef.current.geoErrorDetailsOnce = true;
            }
            onConsent(true, sessionId, null);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
        );
      }

      // Use Permissions API to detect blocked state and prompt guidance
      if (navigator.permissions && navigator.permissions.query) {
        try {
          navigator.permissions.query({ name: 'geolocation' }).then((status) => {
            if (status.state === 'denied') {
              if (!logGuardsRef.current.geoBlockedOnce) {
                console.warn('🚫 Geolocation permission is blocked for this site.');
                logGuardsRef.current.geoBlockedOnce = true;
              }
              // Optional: show a quick tip to user how to enable location
              // alert('Location access is blocked in your browser for this site. Click the lock icon in the address bar > Site settings > Location > Allow.');
              setCookie('locationDenied', 'true', 2);
              onConsent(false, sessionId);
              return;
            }
            // 'granted' or 'prompt' -> proceed to request (will show prompt if needed)
            requestGeo();
          }).catch(() => requestGeo());
        } catch {
          requestGeo();
        }
      } else {
        requestGeo();
      }
    } else {
      // User denied - store denial for this browser session to avoid repeated prompts
      if (!logGuardsRef.current.deniedClickOnce) {
        console.log('❌ User denied location consent');
        logGuardsRef.current.deniedClickOnce = true;
      }
  setCookie('locationDenied', 'true', 2); // Store denial for 2 hours
      onConsent(false, sessionId);
      setShouldShow(false);
    }
  };

  return shouldShow ? (
    <div id="location-consent">
      <div className="lc-panel">
        <h3>Location Consent</h3>
        <p>
          We use your location to personalize your experience and improve our
          services. Your location will be sent securely to our backend. You can
          allow or deny this request.
        </p>
        <div className="lc-actions">
          <button
            className="flex justify-center items-center text-black font-bold hover:bg-gray-50 hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer shadow-lg hover:shadow-xl bg-white relative overflow-hidden whitespace-nowrap"
            style={{ 
              borderRadius: '24px',
              padding: 'clamp(6px, 0.8vw, 10px) clamp(12px, 1.6vw, 16px)',
              marginRight: '10px'
            }}
            onClick={() => handleConsent(true)}
          >
            <div className="font-bold tracking-[0] !ml-[unset]" style={{ fontSize: 'clamp(12px, 1.6vw, 18px)', lineHeight: 1.6 }}>
              Allow
            </div>
            <div 
              className="absolute bottom-0 left-0 right-0 h-[3px]"
              style={{
                background: 'linear-gradient(90deg, rgba(193, 245, 70, 1) 0%, rgba(0, 255, 200, 1) 50%, rgba(131, 73, 255, 1) 100%)',
                borderRadius: '0 0 24px 24px'
              }}
            ></div>
          </button>
          <button
            className="flex justify-center items-center text-black font-bold hover:bg-gray-50 hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer shadow-lg hover:shadow-xl bg-white relative overflow-hidden whitespace-nowrap"
            style={{ 
              borderRadius: '24px',
              padding: 'clamp(6px, 0.8vw, 10px) clamp(12px, 1.6vw, 16px)'
            }}
            onClick={() => handleConsent(false)}
          >
            <div className="font-bold tracking-[0] !ml-[unset]" style={{ fontSize: 'clamp(12px, 1.6vw, 18px)', lineHeight: 1.6 }}>
              Deny
            </div>
            <div 
              className="absolute bottom-0 left-0 right-0 h-[3px]"
              style={{
                background: 'linear-gradient(90deg, rgba(193, 245, 70, 1) 0%, rgba(0, 255, 200, 1) 50%, rgba(131, 73, 255, 1) 100%)',
                borderRadius: '0 0 24px 24px'
              }}
            ></div>
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default LocationConsent;
