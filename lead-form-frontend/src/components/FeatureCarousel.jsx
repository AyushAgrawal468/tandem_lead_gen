import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import feature1 from '../assets/features/feature1.png'
import feature2 from '../assets/features/feature2.png'
import feature3 from '../assets/features/feature3.png'
import feature4 from '../assets/features/feature4.png'
import feature5 from '../assets/features/feature5.png'
import feature6 from '../assets/features/feature6.png'

const sampleItems = [
  { id: 1, image: feature1 },
  { id: 2, image: feature2 },
  { id: 3, image: feature3 },
  { id: 4, image: feature4 },
  { id: 5, image: feature5 },
  { id: 6, image: feature6 }
]

const useMeasure = (ref) => {
  const [rect, setRect] = useState({ width: 0, height: 0 })
  useEffect(() => {
    if (!ref.current) return
    const ro = new ResizeObserver(() => {
      const r = ref.current.getBoundingClientRect()
      setRect({ width: r.width, height: r.height })
    })
    ro.observe(ref.current)
    const r = ref.current.getBoundingClientRect()
    setRect({ width: r.width, height: r.height })
    return () => ro.disconnect()
  }, [ref])
  return rect
}

const clamp = (n, min, max) => Math.max(min, Math.min(max, n))

const FeatureCarousel = ({ items = sampleItems, belowLeft = null }) => {
  const [index, setIndex] = useState(0)
  const [sliderValue, setSliderValue] = useState(0)
  const [animatedValue, setAnimatedValue] = useState(0)
  const viewportRef = useRef(null)
  const { width: viewportW } = useMeasure(viewportRef)

  // Layout variables
  // Match CSS --gap (32px) for accurate spacing calculations
  const gap = 32
  // Derive CSS clamp values numerically from viewport width to avoid DOM reflow
  const vw = viewportW || (typeof window !== 'undefined' ? window.innerWidth : 1024)
  const clampNum = (minPx, vwPercent, maxPx) => Math.max(minPx, Math.min(maxPx, (vwPercent / 100) * vw))
  const cardW = clampNum(280, 28.5, 583)
  const cardH = clampNum(220, 33, 678)
  const previewH = cardH / 2
  const isMd = vw >= 768 && vw < 1024
  // Ensure extra breathing room under the active card on desktop/tablet
  const bottomPad = vw >= 640 ? Math.min(120, Math.max(64, vw * 0.08)) : 12
  // Offset right-side preview cards downward on desktop/tablet
  const rightPreviewOffset = vw >= 1024 ? Math.min(96, Math.max(48, vw * 0.06))
                          : vw >= 640  ? Math.min(72, Math.max(32, vw * 0.07))
                                         : 0

  // We want to show 1 main + 1.5 cards each side ≈ total of 4 cards in view
  // Precisely center the active card using the measured viewport width
  // Animate the slider value for smooth movement
  // Smooth animation loop (single rAF). Previous implementation recreated the loop on every
  // sliderValue change which could spawn overlapping rAF handlers in StrictMode and trigger
  // deep nested state updates (Maximum update depth exceeded). We keep one loop and just update
  // the target via a ref so only one setState occurs per frame.
  const sliderTargetRef = useRef(sliderValue)
  useEffect(() => { sliderTargetRef.current = sliderValue }, [sliderValue])
  useEffect(() => {
    let frame
    const animate = () => {
      setAnimatedValue(prev => {
        const diff = sliderTargetRef.current - prev
        if (Math.abs(diff) < 0.001) return sliderTargetRef.current
        return prev + diff * 0.15
      })
      frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [])

  // Preload images to get aspect ratios and compute deterministic widths
  const [ratios, setRatios] = useState(items.map(() => 1))
  useEffect(() => {
    let alive = true
    const load = (src, idx) => new Promise((resolve) => {
      const img = new Image()
      img.onload = () => resolve({ idx, r: img.naturalWidth && img.naturalHeight ? (img.naturalWidth / img.naturalHeight) : 1 })
      img.onerror = () => resolve({ idx, r: 1 })
      img.src = src
    })
    Promise.all(items.map((it, i) => load(it.image, i))).then((arr) => {
      if (!alive) return
      const next = [...ratios]
      arr.forEach(({ idx, r }) => { next[idx] = r || 1 })
      setRatios(next)
    })
    return () => { alive = false }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.map((it) => it.image).join('|')])

  const previewWidths = useMemo(() => {
    return items.map((_, i) => Math.min(cardW, Math.max(1, ratios[i] * previewH)))
  }, [items.length, ratios, cardW, previewH])

  const previewPrefix = useMemo(() => {
    const pref = [0]
    for (let i = 0; i < previewWidths.length; i++) pref.push(pref[i] + previewWidths[i])
    return pref
  }, [previewWidths])

  // Active widths: on md use image width at full height; on lg+ keep fixed cardW
  const activeWidths = useMemo(() => {
    if (!items.length) return []
    return items.map((_, i) => isMd ? Math.min(cardW, Math.max(1, ratios[i] * cardH)) : cardW)
  }, [items.length, ratios, cardW, cardH, isMd])

  // Compute center of current view analytically to avoid layout-based jumps
  const translate = useMemo(() => {
    const viewportCenterX = (viewportW || 0) / 2
    if (!viewportCenterX || items.length === 0) return 0
    const i0 = Math.floor(animatedValue)
    const i1 = Math.min(items.length - 1, i0 + 1)
    const t = animatedValue - i0
    const prevSum = previewPrefix[i0] + i0 * gap
    const w0 = (1 - t) * (activeWidths[i0] ?? cardW) + t * (previewWidths[i0] ?? cardW)
    const w1 = (1 - t) * (previewWidths[i1] ?? cardW) + t * (activeWidths[i1] ?? cardW)
    const center0 = prevSum + w0 / 2
    const shift = gap + w0 / 2 + w1 / 2
    const center = center0 + t * shift
    return viewportCenterX - center
  }, [animatedValue, cardW, gap, items.length, previewPrefix, previewWidths, viewportW, activeWidths])

  // Swipe handling
  useEffect(() => {
    const el = viewportRef.current
    if (!el) return
    let startX = 0
    let startY = 0
    let isDown = false
    let dx = 0
    let dy = 0
  // Effective step from index i to i+1 (average over transition)
    let indexAtStart = index

    const onDown = (e) => {
      isDown = true
      const t = 'touches' in e ? e.touches[0] : e
      startX = t.clientX
      startY = t.clientY
      dx = 0
      dy = 0
      indexAtStart = index
    }
    const onMove = (e) => {
      if (!isDown) return
      const t = 'touches' in e ? e.touches[0] : e
      dx = t.clientX - startX
      dy = t.clientY - startY
      // If horizontal gesture dominates, prevent page scroll
      if ('preventDefault' in e && Math.abs(dx) > Math.abs(dy) + 6) {
        e.preventDefault()
      }
      // Provide live drag feedback using analytic effective step
      const a0 = activeWidths[indexAtStart] ?? cardW
      const a1 = activeWidths[indexAtStart + 1] ?? a0
      const effectiveStep = Math.max(1, gap + a0 / 2 + a1 / 2)
      const delta = -dx / effectiveStep
      const live = clamp(indexAtStart + delta, 0, items.length - 1)
      setSliderValue(live)
    }
    const onUp = () => {
      if (!isDown) return
      isDown = false
      const a0 = activeWidths[indexAtStart] ?? cardW
      const threshold = Math.max(40, a0 * 0.15)
      if (dx < -threshold) setIndex((i) => (i + 1) % items.length)
      else if (dx > threshold) setIndex((i) => (i - 1 + items.length) % items.length)
      else setIndex(indexAtStart)
    }

    // Pointer events
    el.addEventListener('pointerdown', onDown)
    el.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    // Touch events for iOS/Safari (non-passive so we can preventDefault when needed)
    el.addEventListener('touchstart', onDown, { passive: false })
    el.addEventListener('touchmove', onMove, { passive: false })
    window.addEventListener('touchend', onUp)
    return () => {
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      el.removeEventListener('touchstart', onDown)
      el.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onUp)
    }
  }, [cardW, items.length, index, gap, previewWidths, activeWidths])

  // Slider bar (range input) mapping 0..items-1
  useEffect(() => {
    setSliderValue(index);
  }, [index]);

  const onSliderChange = useCallback((e) => {
    const v = parseFloat(e.target.value);
    setSliderValue(v);
    setIndex(clamp(Math.round(v), 0, items.length - 1));
  }, [items.length]);

  return (
    <div className="w-full" style={{ position: 'relative' }}>
      {/* Slide Numbering Top-Right */}
      <div
        className="fc-slide-number"
        style={{
          position: 'absolute',
          top: '-52px', // move upwards
          right: 10,
          zIndex: 10,
          padding: '0 24px 0 0', // reduce right padding to shift left slightly
          pointerEvents: 'none',
        }}
      >
        <span
          style={{
            WebkitTextStrokeWidth: '1px',
            WebkitTextStrokeColor: '#FFF',
            color: 'transparent', // no fill, only stroke
            fontFamily: 'Anek Latin, sans-serif',
            fontSize: '100px', // decreased from 128px
            fontStyle: 'normal',
            fontWeight: 700,
            lineHeight: '150%',
            letterSpacing: '0.02em',
            userSelect: 'none',
            opacity: 1,
            transition: 'opacity 0.3s',
          }}
        >
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <style>{`
        /* Move slide number down by 5px on xxs/xs/sm only */
        @media (min-width: 320px) and (max-width: 399.98px) {
          .fc-slide-number { top: -47px !important; right: 20px; }
        }
        @media (min-width: 400px) and (max-width: 639.98px) {
          .fc-slide-number { top: -47px !important; right: 20px; }
        }
        @media (min-width: 640px) and (max-width: 767.98px) {
          .fc-slide-number { top: -47px !important; right: 20px; }
        }
        /* Keep md behavior as previously specified */
        @media (min-width: 768px) and (max-width: 1023.98px) {
          .fc-slide-number { right: 0px; }
        }
      `}</style>
      {/* Viewport */}
      <div
        ref={viewportRef}
        className="relative overflow-hidden"
        style={{
          ['--card-w']: 'clamp(280px, 28.5vw, 583px)',
          ['--card-h']: 'clamp(220px, 33vw, 678px)',
          ['--gap']: '32px',
          width: '100vw',
          paddingTop: 8,
          paddingBottom: bottomPad,
          height: vw >= 640 ? 'calc(clamp(220px, 33vw, 678px) + 16px)' : 'auto',
          touchAction: 'pan-y'
        }}
      >
        {/* Track */}
        <div
          className="flex items-stretch will-change-transform h-full"
          style={{ transform: `translateX(${translate}px)`, gap: 'var(--gap)' }}
        >
          {items.map((it, i) => {
            const isActive = i === index;
            const preview = !isActive;
            return (
              <img
                key={it.id}
                src={it.image}
                alt={`Feature ${it.id}`}
                className="shrink-0 rounded-2xl"
                style={{
                  boxSizing: 'border-box',
                  width: isActive ? (isMd ? `${activeWidths[i] ?? cardW}px` : 'var(--card-w)') : 'auto',
                  maxWidth: isActive ? undefined : 'var(--card-w)',
                  height: isActive ? 'var(--card-h)' : 'calc(var(--card-h) / 2)',
                  alignSelf: preview ? (i < index ? 'flex-start' : 'flex-end') : 'stretch',
                  // Removed white border per request
                  border: 'none',
                  // Removed drop shadow per request
                  boxShadow: 'none',
                  transform: `${isActive ? 'scale(1.02)' : 'scale(0.96)'}${(preview && i > index && vw >= 640) ? ` translateY(${rightPreviewOffset}px)` : ''}`,
                  transition: 'transform 400ms, box-shadow 400ms, border-color 400ms, height 400ms, width 400ms',
                  objectFit: 'contain',
                  objectPosition: 'center center',
                  display: 'block',
                  margin: 0,
                  padding: 0,
                }}
                draggable={false}
                loading="lazy"
              />
            );
          })}
        </div>

        {/* Below-left content (e.g., section heading) anchored to the bottom of the viewport/track */}
        {belowLeft && (
          <div
            className="absolute"
            style={{
              left: 'calc(var(--gap) / 2)',
              bottom: 0,
              width: 'var(--card-w)',
              zIndex: 3,
              pointerEvents: 'none'
            }}
          >
            {belowLeft}
          </div>
        )}
      </div>
      {/* Slider bar (outside viewport to keep bottom baseline aligned) */}
      <div className="mt-12 sm:mt-16 md:mt-20 lg:mt-24 flex items-center justify-center select-none">
        <div style={{ width: cardW }}>
          <input
            type="range"
            min={0}
            max={items.length - 1}
            step={0.001} // finer step for smooth movement
            value={sliderValue}
            onInput={onSliderChange}
            onChange={onSliderChange}
            className="w-full"
            style={{
              WebkitAppearance: 'none',
              height: 4,
              background: 'rgba(255,255,255,0.25)',
              borderRadius: 9999,
              outline: 'none',
              transition: 'background 0.2s',
            }}
          />
        </div>
      </div>
      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 32px; height: 16px;
          background: #FFF;
          border-radius: 8px;
          box-shadow: none;
          margin-top: -6px; /* align with track */
          cursor: pointer;
        }
        input[type="range"]::-moz-range-thumb {
          width: 32px; height: 16px; border: 0;
          background: #FFF;
          border-radius: 8px;
          box-shadow: none;
          cursor: pointer;
        }
      `}</style>
    </div>
  )
}

export default FeatureCarousel
