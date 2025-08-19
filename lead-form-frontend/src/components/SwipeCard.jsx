import React from "react";
import { motion } from "framer-motion";

const SwipeCard = ({ imgSrc, onSwipe, allowedDirections = [], overlayImage }) => {
  const handleDragEnd = (event, info) => {
    const { offset } = info;
    if (offset.x > 100 && allowedDirections.includes("right")) onSwipe("right");
    else if (offset.x < -100 && allowedDirections.includes("left")) onSwipe("left");
    else if (offset.y < -100 && allowedDirections.includes("up")) onSwipe("up");
    else if (offset.y > 100 && allowedDirections.includes("down")) onSwipe("down");
  };

  return (
    <motion.div
      className="absolute w-full h-full rounded-2xl shadow-lg flex items-center justify-center overflow-hidden"
      drag={allowedDirections.length > 0}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.05 }}
      style={{ backgroundColor: "#181927" }}
    >
      {/* Main Slide */}
      <img
        src={imgSrc}
        alt="Slide"
        className="w-full h-full object-contain select-none pointer-events-none"
      />

      {/* Full-screen overlay */}
      {overlayImage && (
        <img
          src={overlayImage}
          alt="Action Overlay"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
        />
      )}
    </motion.div>
  );
};

export default SwipeCard;
