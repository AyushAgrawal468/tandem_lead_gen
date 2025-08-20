import React, { useState, useEffect } from "react";
import SwipeCard from "./SwipeCard";
import {
  instructionSlides,
  eventSlides,
  responseOverlays,
} from "../data/phoneSlides";

const PhonePreview = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentOverlay, setCurrentOverlay] = useState(null);

  const totalSlides = instructionSlides.length + eventSlides.length;

  const getSlideType = (index) => {
    if (index < instructionSlides.length) return "instruction";
    else if (index < totalSlides) return "event";
    else return "outro";
  };

  const handleNext = () =>
    setCurrentIndex((prev) => Math.min(prev + 1, totalSlides));
  const handlePrev = () =>
    setCurrentIndex((prev) => Math.max(prev - 1, 0));

  const handleSwipe = (direction) => {
    const slideType = getSlideType(currentIndex);

    if (slideType === "instruction" && !["left", "right"].includes(direction))
      return;

    if (slideType === "event" && responseOverlays[direction]) {
      setCurrentOverlay(responseOverlays[direction]);
      setTimeout(() => {
        setCurrentOverlay(null);
        handleNext();
      }, 1000);
    } else {
      handleNext();
    }
  };

  useEffect(() => {
    const onKeyDown = (e) => {
      const slideType = getSlideType(currentIndex);
      if (slideType === "instruction") {
        if (e.key === "ArrowRight") handleNext();
        if (e.key === "ArrowLeft") handlePrev();
      }
      if (slideType === "event") {
        if (e.key === "ArrowRight") handleSwipe("right");
        if (e.key === "ArrowLeft") handleSwipe("left");
        if (e.key === "ArrowUp") handleSwipe("up");
        if (e.key === "ArrowDown") handleSwipe("down");
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [currentIndex]);

  const currentSlideType = getSlideType(currentIndex);
  let slideSrc = "";

  if (currentSlideType === "instruction")
    slideSrc = instructionSlides[currentIndex];
  else if (currentSlideType === "event")
    slideSrc = eventSlides[currentIndex - instructionSlides.length];

  const allowedDirs =
    currentSlideType === "instruction"
      ? ["left", "right"]
      : currentSlideType === "event"
      ? ["left", "right", "up", "down"]
      : [];

  return (
    <section className="w-full flex flex-col items-center justify-center py-12 px-4 bg-[#181927] mt-16">
      <div className="relative w-[85vw] max-w-[280px] aspect-[9/18] flex items-center justify-center">
        {/* Glow */}
        <div
          className="absolute rounded-3xl pointer-events-none"
          style={{
            width: "150%",
            height: "150%",
            background:
              "radial-gradient(circle at center, rgba(129,140,248,0.25), transparent 70%)",
            filter: "blur(80px)",
            zIndex: -1,
            animation: "pulseGlow 3s ease-in-out infinite alternate",
          }}
        />

        {/* Phone */}
        <div className="relative w-full h-full rounded-3xl bg-[#23243a] shadow-2xl border-4 border-[#23243a] flex items-center justify-center overflow-hidden">
          {currentSlideType === "outro" ? (
            <div className="flex items-center justify-center h-full w-full text-center p-6">
              <h2 className="text-lg md:text-xl font-bold text-gray-200 leading-relaxed">
                Eagerly waiting for you on our app.
                <br />
                Hope to see you soon.
              </h2>
            </div>
          ) : (
            <SwipeCard
              imgSrc={slideSrc}
              onSwipe={handleSwipe}
              allowedDirections={allowedDirs}
              overlayImage={currentOverlay}
            />
          )}
          <div className="absolute inset-0 rounded-3xl border-4 border-[#23243a] pointer-events-none" />
        </div>
      </div>
    </section>
  );
};

export default PhonePreview;
