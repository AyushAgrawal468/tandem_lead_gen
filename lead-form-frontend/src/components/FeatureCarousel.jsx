import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

const sampleItems = [
  {
    id: 1,
    title: 'Wall of Moments',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1200&q=60',
    caption: 'Showcase and relive your favorite shared stories.'
  },
  {
    id: 2,
    title: 'Plan Together',
    image: 'https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?auto=format&fit=crop&w=1200&q=60', // People collaborating at a table
    caption: 'Coordinate quickly, make it happen fast.'
  },
  {
    id: 3,
    title: 'Discover Nearby',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=60',
    caption: 'Find things to do around you with friends.'
  },
  {
    id: 4,
    title: 'Build Community',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=60',
    caption: 'Connect with people who love doing more.'
  },
  {
    id: 5,
    title: 'Moments Gallery',
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=60',
    caption: 'Your shared memories, beautifully displayed.'
  }
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
          // Responsive card size variables (used by children)
      ['--card-w']: 'clamp(260px, 32vw, 420px)',
      ['--card-h']: 'clamp(320px, 48vw, 480px)',
      ['--gap']: '24px',
          // Use the section's full bleed width
          width: '100vw',
      paddingTop: 8,
      // Add bottom padding so scaled active card doesn't get clipped at the viewport edge
      paddingBottom: 'clamp(12px, 1.5vw, 20px)',
        }}
  >
        {/* Track */}
        <div
      className="flex items-stretch will-change-transform transition-transform duration-500 ease-out"
      style={{ transform: `translateX(${translate}px)`, gap: 'var(--gap)', height: 'var(--card-h)' }}
        >
          {items.map((it, i) => {
            const isActive = i === index
            const isLeft = i < index
            const isRight = i > index
            const preview = !isActive
            return (
              <div
                key={it.id}
                ref={i === 0 ? cardRef : undefined}
                className="relative shrink-0 rounded-2xl overflow-hidden bg-gray-800/40"
                style={{
                  width: 'var(--card-w)',
                  height: isActive ? 'var(--card-h)' : 'calc(var(--card-h) / 2)',
                  alignSelf: preview ? (isLeft ? 'flex-start' : 'flex-end') : 'stretch',
                  border: isActive ? '2px solid rgba(255,255,255,0.6)' : '1px solid rgba(255,255,255,0.15)',
                  boxShadow: isActive ? '0 8px 24px rgba(0,0,0,0.35)' : 'none',
                  transform: isActive ? 'scale(1.02)' : 'scale(0.96)',
                  transition: 'transform 400ms, box-shadow 400ms, border-color 400ms, height 400ms',
                }}
              >
                <div
                  className="absolute inset-0 bg-cover"
                  style={{
                    backgroundImage: `url(${it.image})`,
                    backgroundPosition: isActive ? 'center' : (isLeft ? 'top center' : 'bottom center')
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/60" />
                <div className="relative z-10 h-full p-4 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white drop-shadow">{it.title}</h3>
                    {isActive && (
                      <p className="text-textmid text-sm mt-1 pr-2">{it.caption}</p>
                    )}
                  </div>
                  <div className="text-xs text-textlow">#{String(it.id).padStart(2,'0')}</div>
                </div>
              </div>
            )
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
