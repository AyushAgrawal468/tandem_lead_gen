import React, { useState, useEffect } from "react";
// Ensure CSS is imported for styling

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

  return (
    <div className="countdown-timer">
      <div className="cube">
        <span>{String(timeLeft.days).padStart(2, "0")}</span>
        <small>Days</small>
      </div>
      <div className="cube">
        <span>{String(timeLeft.hours).padStart(2, "0")}</span>
        <small>Hours</small>
      </div>
      <div className="cube">
        <span>{String(timeLeft.minutes).padStart(2, "0")}</span>
        <small>Minutes</small>
      </div>
    </div>
  );
}

export default CountdownTimer;
