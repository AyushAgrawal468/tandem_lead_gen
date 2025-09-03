import React, { useState, useEffect } from "react";
import "./PhoneSlideshow.css";

const PhoneSlideshow = ({ images }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000); // change slide every 3 seconds
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="app-background">
      <div className="glow-container">
        <div className="primary-glow"></div>
        <div className="secondary-glow"></div>
        <div className="phone">
          <div className="phone-notch"></div>
          <div className="phone-camera"></div>

          {/* Phone screen with fade effect */}
          <div className="phone-screen">
            {images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`slide-${idx}`}
                className={`slide-image ${idx === current ? "active" : ""}`}
              />
            ))}
          </div>

          {/* Side buttons */}
          <div className="phone-button volume-up"></div>
          <div className="phone-button volume-down"></div>
          <div className="phone-button power"></div>
        </div>
      </div>
    </div>
  );
};

export default PhoneSlideshow;
