import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import feature1 from '../assets/features/feature1.svg'
import feature2 from '../assets/features/feature2.svg'
import feature3 from '../assets/features/feature3.svg'
import feature4 from '../assets/features/feature4.svg'
import feature5 from '../assets/features/feature5.svg'
import feature6 from '../assets/features/feature6.svg'

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
  const cardRef = useRef(null)
  const { width: viewportW } = useMeasure(viewportRef)
  const { width: cardWMeasured } = useMeasure(cardRef)

  // Layout variables
  const gap = 24
  // Base card width responsive; the measured width will follow CSS below
  const cardW = cardWMeasured || 280

  // We want to show 1 main + 1.5 cards each side ≈ total of 4 cards in view
  // Precisely center the active card using the measured viewport width
  // Animate the slider value for smooth movement
  useEffect(() => {
    let frame;
    const animate = () => {
      setAnimatedValue((prev) => {
        const diff = sliderValue - prev;
        // If close enough, snap to target
        if (Math.abs(diff) < 0.001) return sliderValue;
        // Move a fraction towards the target
        return prev + diff * 0.15;
      });
      frame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frame);
  }, [sliderValue]);

  const translate = useMemo(() => {
    const step = cardW + gap;
    const leftShift = 25;
    if (!viewportW) {
      const approxVisibleCenterOffset = 1.5;
      return -(animatedValue * step - approxVisibleCenterOffset * step) - leftShift;
    }
    const cardCenterX = animatedValue * step + cardW / 2;
    const viewportCenterX = viewportW / 2;
    return viewportCenterX - cardCenterX - leftShift;
  }, [animatedValue, cardW, gap, viewportW]);

  // Swipe handling
  useEffect(() => {
    const el = viewportRef.current
    if (!el) return
    let startX = 0
    let startY = 0
    let isDown = false
    let dx = 0
    let dy = 0
    const step = cardW + gap
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
      // Provide live drag feedback by updating sliderValue
      const delta = -dx / step
      const live = clamp(indexAtStart + delta, 0, items.length - 1)
      setSliderValue(live)
    }
    const onUp = () => {
      if (!isDown) return
      isDown = false
      const threshold = Math.max(40, cardW * 0.15)
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
  }, [cardW, items.length, index])

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
          right: -50,
          zIndex: 10,
          padding: '0 48px 0 0', // remove top padding
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
        /* Shift slide number 30px to the right on tablet (md) only */
        @media (min-width: 768px) and (max-width: 1023.98px) {
          .fc-slide-number { right: -30px; }
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
          paddingBottom: 'clamp(12px, 1.5vw, 32px)',
          touchAction: 'pan-y'
        }}
      >
        {/* Track */}
        <div
          className="flex items-stretch will-change-transform transition-transform duration-500 ease-out md:h-auto lg:h-[var(--card-h)]"
          style={{ transform: `translateX(${translate}px)`, gap: 'var(--gap)' }}
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
                <style>{`
                  @media (min-width: 768px) and (max-width: 1023.98px) {
                    .fc-card-active { height: auto !important; }
                  }
                `}</style>
                <img
                  src={it.image}
                  alt={`Feature ${it.id}`}
                  className={isActive 
                    ? "fc-card-active w-full h-full md:h-auto object-contain"
                    : "w-full h-full object-cover"}
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
