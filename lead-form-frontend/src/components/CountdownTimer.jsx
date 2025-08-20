import React, { useState, useEffect } from "react";

function CountdownTimer({ targetDays = 10 }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    const targetDate = new Date(Date.now() + targetDays * 24 * 60 * 60 * 1000);

    const timer = setInterval(() => {
      const now = new Date();
      const diff = targetDate - now;

      if (diff <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);

      setTimeLeft({ days, hours, minutes });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDays]);

  const cubes = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
  ];

  return (
    <div className="countdown-timer flex flex-wrap justify-center gap-1">
      {cubes.map((cube, idx) => (
        <div
          key={idx}
          className="cube flex flex-col items-center justify-center rounded-lg shadow-md w-12 h-12 sm:w-14 sm:h-14"
          style={{
            background: "linear-gradient(270deg, #3b82f6, #8b5cf6, #ec4899)", // blue -> purple -> pink
          }}
        >
          <span className="text-gray-100 text-lg sm:text-xl font-bold">
            {String(cube.value).padStart(2, "0")}
          </span>
          <small className="text-gray-200 mt-1 text-[0.55rem] sm:text-xs">{cube.label}</small>
        </div>
      ))}
    </div>
  );
}

export default CountdownTimer;
