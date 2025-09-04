import React, { useEffect, useMemo, useRef, useState } from 'react'

/**
 * CountdownTimer
 * Props:
 * - endTime: Date | number | string (required) – target time to count down to
 * - startTime?: Date | number | string – optional start for progress reference
 * - className?: string – extra classes
 *
 * Behavior:
 * - Shows zero-padded remaining days as two digits and the label "Days remaining".
 * - Renders a bottom progress bar that shrinks as time passes.
 * - Progress is measured against [startTime, endTime]; if startTime is absent,
 *   it uses the remaining duration at mount as 100%.
 */
const CountdownTimer = ({
  endTime,
  startTime,
  className = '',
  width = 200,
  height = 100,
  radius = 16,
  strokeWidth = 6,
  // Smooth left-to-right dark ocean green (left) to near-black (right)
  background = 'linear-gradient(90deg, rgba(1,77,64,0.95) 0%, rgba(6,51,44,0.9) 35%, rgba(10,24,22,0.9) 70%, rgba(0,0,0,0.96) 100%)',
  displayWidth,
  displayHeight,
}) => {
  const endMs = useMemo(() => new Date(endTime).getTime(), [endTime])
  const startMsProp = useMemo(
    () => (startTime ? new Date(startTime).getTime() : undefined),
    [startTime]
  )
  const [now, setNow] = useState(Date.now())
  // If startTime is not provided, use the mount-time remaining as 100%
  const initialRemainingRef = useRef(null)
  const initialDaysRef = useRef(null)
  const initialFiveRef = useRef(null)

  useEffect(() => {
    const dayMs = 24 * 60 * 60 * 1000
    const fiveMinMs = 5 * 60 * 1000
    if (!startMsProp) {
      const rem = Math.max(0, endMs - Date.now())
      initialRemainingRef.current = rem
      initialDaysRef.current = Math.max(1, Math.ceil(rem / dayMs))
      initialFiveRef.current = Math.max(1, Math.ceil(rem / fiveMinMs))
    } else {
      const total = Math.max(0, endMs - startMsProp)
      initialRemainingRef.current = total
      initialDaysRef.current = Math.max(1, Math.ceil(total / dayMs))
      initialFiveRef.current = Math.max(1, Math.ceil(total / fiveMinMs))
    }
  }, [endMs, startMsProp])

  useEffect(() => {
    const tick = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(tick)
  }, [])

  const remainingMs = Math.max(0, endMs - now)
  const dayMs = 24 * 60 * 60 * 1000

  // ✅ Fix: safe calculation for days
  let remainingDays = Math.ceil(remainingMs / dayMs)
  if (isNaN(remainingDays) || remainingDays < 0) {
    remainingDays = 9
  }
  let daysText = String(remainingDays).padStart(2, '0')

  const fiveMinMs = 5 * 60 * 1000
  // Progress width (0-100%)
  const totalFive = useMemo(() => {
    if (initialFiveRef.current != null) return Math.max(1, initialFiveRef.current)
    if (startMsProp) return Math.max(1, Math.ceil((endMs - startMsProp) / fiveMinMs))
    return Math.max(1, Math.ceil((endMs - now) / fiveMinMs))
  }, [endMs, fiveMinMs, now, startMsProp])

  const remainingFive = Math.max(0, Math.ceil(remainingMs / fiveMinMs))
  const progress = Math.min(100, Math.max(0, (remainingFive / totalFive) * 100))

  // SVG progress path config
  const W = width
  const H = height
  const R = radius
  const SW = strokeWidth
  const pathRef = useRef(null)
  const [pathLen, setPathLen] = useState(1)

  useEffect(() => {
    if (pathRef.current) {
      try {
        setPathLen(pathRef.current.getTotalLength())
      } catch (_) {}
    }
  }, [])

  const visibleLen = pathLen * (progress / 100)
  const isFull = progress >= 99.5

  return (
    <div
      className={`relative flex items-center justify-center rounded-[16px] shadow-xl ${className}`}
      style={{
        width: displayWidth ?? W,
        height: displayHeight ?? H,
        color: 'var(--Text-High, #F2F2F2)',
        fontFamily: 'Anek Latin, sans-serif',
        background,
        overflow: 'hidden',
      }}
    >
      {/* Content */}
      <div
        className="flex flex-col items-center leading-none select-none"
        style={{ gap: 2 }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            lineHeight: 1,
          }}
        >
          {daysText}
        </div>
        <div
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
