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
  const viewportRef = useRef(null)
  const cardRef = useRef(null)
  const { width: viewportW } = useMeasure(viewportRef)
  const { width: cardWMeasured } = useMeasure(cardRef)

  // Layout variables
  const gap = 24
  // Base card width responsive; the measured width will follow CSS below
  const cardW = cardWMeasured || 280

  // We want to show 1 main + 1.5 cards each side ≈ total of 4 cards in view
  // Precisely center the active card using the measured viewport width
  const translate = useMemo(() => {
    const step = cardW + gap
    if (!viewportW) {
      // Fallback to approximate offset until we measure
      const approxVisibleCenterOffset = 1.5
      return -(index * step - approxVisibleCenterOffset * step)
    }
    const cardCenterX = index * step + cardW / 2
    const viewportCenterX = viewportW / 2
    return viewportCenterX - cardCenterX
  }, [index, cardW, gap, viewportW])

  // Swipe handling
  useEffect(() => {
    const el = viewportRef.current
    if (!el) return
    let startX = 0
    let isDown = false
    let dx = 0

    const onDown = (e) => {
      isDown = true
      startX = 'touches' in e ? e.touches[0].clientX : e.clientX
      dx = 0
    }
    const onMove = (e) => {
      if (!isDown) return
      const x = 'touches' in e ? e.touches[0].clientX : e.clientX
      dx = x - startX
    }
    const onUp = () => {
      if (!isDown) return
      isDown = false
      const threshold = Math.max(40, cardW * 0.15)
      if (dx < -threshold) setIndex((i) => (i + 1) % items.length)
      else if (dx > threshold) setIndex((i) => (i - 1 + items.length) % items.length)
    }

    el.addEventListener('pointerdown', onDown)
    el.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    // Touch events for iOS/Safari
    el.addEventListener('touchstart', onDown, { passive: true })
    el.addEventListener('touchmove', onMove, { passive: true })
    window.addEventListener('touchend', onUp)
    return () => {
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      el.removeEventListener('touchstart', onDown)
      el.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onUp)
    }
  }, [cardW, items.length])

  // Slider bar (range input) mapping 0..items-1
  const onSliderChange = useCallback((e) => {
    const v = parseFloat(e.target.value)
    setIndex(clamp(Math.round(v), 0, items.length - 1))
  }, [items.length])

  return (
    <div className="w-full">
      {/* Viewport */}
    <div
        ref={viewportRef}
        className="relative overflow-hidden"
        style={{
          // Responsive: fixed size for desktop, clamp for mobile/tablet
          ['--card-w']: 'clamp(280px, 28.5vw, 583px)',
          ['--card-h']: 'clamp(220px, 33vw, 678px)',
          ['--gap']: '32px',
          width: '100vw',
          paddingTop: 8,
          paddingBottom: 'clamp(12px, 1.5vw, 32px)',
        }}
  >
        {/* Track */}
        <div
      className="flex items-stretch will-change-transform transition-transform duration-500 ease-out"
      style={{ transform: `translateX(${translate}px)`, gap: 'var(--gap)', height: 'var(--card-h)' }}
        >
          {items.map((it, i) => {
            const isActive = i === index;
            const preview = !isActive;
            return (
              <div
                key={it.id}
                ref={i === 0 ? cardRef : undefined}
                className="relative shrink-0 rounded-2xl overflow-hidden bg-gray-800/40 flex items-center justify-center"
                style={{
                  width: 'var(--card-w)',
                  height: isActive ? 'var(--card-h)' : 'calc(var(--card-h) / 2)',
                  alignSelf: preview ? (i < index ? 'flex-start' : 'flex-end') : 'stretch',
                  border: isActive ? '2px solid rgba(255,255,255,0.6)' : '1px solid rgba(255,255,255,0.15)',
                  boxShadow: isActive ? '0 8px 24px rgba(0,0,0,0.35)' : 'none',
                  transform: isActive ? 'scale(1.02)' : 'scale(0.96)',
                  transition: 'transform 400ms, box-shadow 400ms, border-color 400ms, height 400ms',
                  background: '#23243a',
                }}
              >
                <img
                  src={it.image}
                  alt={`Feature ${it.id}`}
                  className={isActive ? "w-full h-full object-contain" : "w-full h-full object-cover"}
                  style={{ display: 'block', margin: 0, padding: 0, background: '#23243a' }}
                  draggable={false}
                />
              </div>
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
      <div className="mt-12 flex items-center justify-center select-none">
        <div style={{ width: cardW }}>
          <input
            type="range"
            min={0}
            max={items.length - 1}
            step={0.01}
            value={index}
            onInput={onSliderChange}
            onChange={onSliderChange}
            className="w-full"
            style={{
              WebkitAppearance: 'none',
              height: 4,
              background: 'rgba(255,255,255,0.25)',
              borderRadius: 9999,
              outline: 'none',
            }}
          />
        </div>
      </div>
      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 22px; height: 22px;
          background: white; border-radius: 9999px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.35);
          margin-top: -9px; /* align with track */
          cursor: pointer;
        }
        input[type="range"]::-moz-range-thumb {
          width: 22px; height: 22px; border: 0;
          background: white; border-radius: 9999px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.35);
          cursor: pointer;
        }
      `}</style>
    </div>
  )
}

export default FeatureCarousel
