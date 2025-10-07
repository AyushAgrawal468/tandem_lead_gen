import React, { useEffect, useMemo, useRef, useState } from 'react'

/**
 * CountdownTimer
 * Props:
 * - endTime: number (required) – target time to count down to (ms)
 * - remainingSeconds: number (required) – seconds left in countdown
 * - startTime: number (optional) – start time of countdown (ms)
 * - className?: string – extra classes
 *
 * Behavior:
 * - Shows zero-padded remaining days as two digits and the label "Days remaining".
 * - Renders a bottom progress bar that shrinks as time passes.
 * - Progress is measured against [startTime, endTime]; if startTime is absent,
 *   it uses the remaining duration at mount as 100%.
 */
const CountdownTimer = ({
  className = '',
  width = 200,
  height = 100,
  radius = 16,
  strokeWidth = 6,
  background,
  displayWidth,
  displayHeight,
  remainingSeconds,
  endTime,
  startTime,
}) => {
  // Use backend-provided remainingSeconds (now in ms!)
  // Accept fixed_START_TIME from backend
  const [remainingMs, setRemainingMs] = useState(
    typeof remainingSeconds === 'number' ? remainingSeconds : 0
  );

  useEffect(() => {
    setRemainingMs(typeof remainingSeconds === 'number' ? remainingSeconds : 0);
  }, [remainingSeconds]);

  useEffect(() => {
    if (remainingMs <= 0) return;
    const interval = setInterval(() => {
      setRemainingMs(prev => (prev > 0 ? prev - 1000 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [remainingMs]);

  const dayMs = 24 * 60 * 60 * 1000;

  // Days remaining
  // Calculate days remaining, always show at least '01' if time remains, '00' only when finished
  let remainingDays = Math.ceil(remainingMs / dayMs);
  if (isNaN(remainingDays) || remainingDays < 0) {
    remainingDays = 0;
  }
  let daysText = remainingMs > 0 ? String(Math.max(1, remainingDays)).padStart(2, '0') : '00';

  // Progress bar decreases in 1-minute steps
  const sectionMs = 1 * 60 * 1000; // 1 minute in ms
  // Use fixed_START_TIME from backend if present
  const effectiveStartTime = typeof fixed_START_TIME === 'number' ? fixed_START_TIME : (startTime ?? null);
  const effectiveEndTime = typeof endTime === 'number' ? endTime : null;
  // If all times are present, use them for progress calculation
  let totalDurationMs = 0;
  let progress = 0;
  if (effectiveStartTime !== null && effectiveEndTime !== null) {
    totalDurationMs = effectiveEndTime - effectiveStartTime;
    // Calculate elapsed and left
    const elapsedMs = Math.max(0, Date.now() - effectiveStartTime);
    const leftMs = Math.max(0, effectiveEndTime - Date.now());
    // Progress: percent left
    progress = totalDurationMs > 0 ? Math.min(100, Math.max(0, (leftMs / totalDurationMs) * 100)) : 0;
  } else {
    // Fallback: use remainingMs and a default duration
    totalDurationMs = 10 * 24 * 60 * 60 * 1000;
    progress = Math.min(100, Math.max(0, (remainingMs / totalDurationMs) * 100));
  }

  // SVG progress path config - maintain consistent proportions
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 640;
  const W = isMobile ? 140 : width;
  const H = isMobile ? (height * 140 / width) : height; // Maintain aspect ratio on mobile
  const R = isMobile ? (radius * 140 / width) : radius; // Scale radius proportionally
  const SW = strokeWidth;
  const pathRef = useRef(null);
  const [pathLen, setPathLen] = useState(1);

  useEffect(() => {
    if (pathRef.current) {
      try {
        setPathLen(pathRef.current.getTotalLength());
      } catch (_) {}
    }
  }, []);

  const visibleLen = pathLen * (progress / 100);
  const isFull = progress >= 99.5;

  return (
    <div
      className={`relative flex items-center justify-center countdown-timer ${className}`}
      style={{
        width: displayWidth ?? W,
        height: displayHeight ?? H,
        color: 'var(--Text-High, #F2F2F2)',
        fontFamily: 'Anek Latin, sans-serif',
        overflow: 'hidden',
        position: 'relative',
        borderRadius: `${radius + strokeWidth/2}px`,
        padding: `${strokeWidth * 2}px`, // increase padding so background doesn't show beyond SVG border
        boxSizing: 'border-box',
      }}
    >
      {/* Gradient fill strictly inside the stroke area */}
      <div
        className="absolute countdown-bg"
        style={{
          top: strokeWidth,
          right: strokeWidth,
          bottom: strokeWidth,
          left: strokeWidth,
          borderRadius: Math.max(0, radius - strokeWidth),
          zIndex: 0,
          pointerEvents: 'none'
        }}
      />
      <style>{`
        @media (max-width: 640px) {
          /* Keep responsive sizing but maintain uniform progress bar positioning */
          .countdown-timer { 
            width: 140px !important; 
            /* Use same proportional padding as desktop to maintain SVG alignment */
            padding: ${strokeWidth * 2}px !important; 
          }
          .countdown-timer .countdown-days { font-size: 38px !important; padding-top: 0px; }
          .countdown-timer .countdown-label { font-size: 13px !important; margin-top: -2.5px; }
        }
      `}</style>
      {/* Content */}
      <div
        className="flex flex-col items-center leading-none select-none"
        style={{ gap: 2, zIndex: 2, position: 'relative' }}
      >
        <div
          className="countdown-days"
          style={{
            fontSize: 64,
            fontWeight: 700,
            lineHeight: 1,
          }}
        >
          {daysText}
        </div>
        <div
          className="countdown-label"
          style={{
            fontSize: 18,
            fontWeight: 700,
            lineHeight: 1.1,
            opacity: 0.95,
          }}
        >
          Days remaining
        </div>
      </div>

      {/* Dynamic left+bottom progress outline using SVG stroke */}
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${W} ${H}`}
        className="absolute inset-0"
        aria-hidden="true"
        style={{ zIndex: 1, pointerEvents: 'none' }}
      >
        {/* Track (faint) */}
        <path
          d={`M ${W - R - SW/2},${SW/2}
              L ${R + SW/2},${SW/2}
              A ${R} ${R} 0 0 0 ${SW/2},${R + SW/2}
              L ${SW/2},${H - R - SW/2}
              A ${R} ${R} 0 0 0 ${R + SW/2},${H - SW/2}
              L ${W - R - SW/2},${H - SW/2}
              A ${R} ${R} 0 0 0 ${W - SW/2},${H - R - SW/2}
              L ${W - SW/2},${R + SW/2}
              A ${R} ${R} 0 0 0 ${W - R - SW/2},${SW/2} Z`}
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth={SW}
          strokeLinecap="round"
        />
        {/* Progress */}
        <path
          ref={pathRef}
          d={`M ${W - R - SW/2},${SW/2}
              L ${R + SW/2},${SW/2}
              A ${R} ${R} 0 0 0 ${SW/2},${R + SW/2}
              L ${SW/2},${H - R - SW/2}
              A ${R} ${R} 0 0 0 ${R + SW/2},${H - SW/2}
              L ${W - R - SW/2},${H - SW/2}
              A ${R} ${R} 0 0 0 ${W - SW/2},${H - R - SW/2}
              L ${W - SW/2},${R + SW/2}
              A ${R} ${R} 0 0 0 ${W - R - SW/2},${SW/2} Z`}
          fill="none"
          stroke="#FFFFFF"
          strokeWidth={SW}
          strokeLinecap="round"
          style={{
            strokeDasharray: isFull ? 'none' : `${visibleLen} ${pathLen}`,
            strokeDashoffset: 0,
            transition: pathLen > 1 ? 'stroke-dasharray 1s linear' : 'none',
          }}
        />
      </svg>
    </div>
  )
}

export default CountdownTimer
