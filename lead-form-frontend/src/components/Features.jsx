import React from 'react'
import FeatureCarousel from './FeatureCarousel'
import feature1 from '../assets/features/feature1.png'
import feature2 from '../assets/features/feature2.png'
import feature3 from '../assets/features/feature3.png'
import feature4 from '../assets/features/feature4.png'
import feature5 from '../assets/features/feature5.png'
import feature6 from '../assets/features/feature6.png'

const Features = () => {
  // Mobile carousel state (one SVG per slide)
  const mobileImages = [feature1, feature2, feature3, feature4, feature5, feature6]
  // internal index can temporarily go to -1 (clone of last) or length (clone of first) for seamless loop
  const [mobileIndex, setMobileIndex] = React.useState(0)
  const [instantJump, setInstantJump] = React.useState(false) // disable transition during clone reset
  const touchStartXRef = React.useRef(0)
  const touchStartYRef = React.useRef(0)
  const touchActiveRef = React.useRef(false)
  const horizontalLockRef = React.useRef(false)
  // Mobile viewport (full-width) used as sliding step
  const frameRef = React.useRef(null)
  const [frameW, setFrameW] = React.useState(360)
  const [frameH, setFrameH] = React.useState(394)
  const [ratios, setRatios] = React.useState(mobileImages.map(() => 1))
  const [dragDx, setDragDx] = React.useState(0)
  const [isDragging, setIsDragging] = React.useState(false)

  const nextMobile = () => setMobileIndex((i) => i + 1) // allow reaching length (clone)
  const prevMobile = () => setMobileIndex((i) => i - 1) // allow reaching -1 (clone)

  // Single native touch handler on the frame (avoid duplicate processing)
  React.useEffect(() => {
    const el = frameRef.current
    if (!el) return
    let startX = 0
    let startY = 0
    let isDown = false
    let horizontalLocked = false
    let handled = false

    const onStart = (e) => {
      const t = e.touches ? e.touches[0] : e
      startX = t.clientX
      startY = t.clientY
      isDown = true
      horizontalLocked = false
      handled = false
      setIsDragging(true)
      setDragDx(0)
    }
    const onMove = (e) => {
      if (!isDown) return
      const t = e.touches ? e.touches[0] : e
      const dx = t.clientX - startX
      const dy = t.clientY - startY
      if (!horizontalLocked && Math.abs(dx) > Math.abs(dy) + 6) horizontalLocked = true
      if (horizontalLocked) e.preventDefault()
      setDragDx(dx)
    }
    const onEnd = (e) => {
      if (!isDown || handled) return
      handled = true
      const t = e.changedTouches ? e.changedTouches[0] : e
      const dx = t.clientX - startX
      const threshold = 35
  if (dx < -threshold) setMobileIndex((i) => i + 1)
  else if (dx > threshold) setMobileIndex((i) => i - 1)
      isDown = false
      horizontalLocked = false
      setIsDragging(false)
      setDragDx(0)
    }

    el.addEventListener('touchstart', onStart, { passive: false })
    el.addEventListener('touchmove', onMove, { passive: false })
    el.addEventListener('touchend', onEnd, { passive: false })
    return () => {
      el.removeEventListener('touchstart', onStart)
      el.removeEventListener('touchmove', onMove)
      el.removeEventListener('touchend', onEnd)
    }
  }, [mobileImages.length])

  // (removed duplicate frame binding block to avoid double-processing)

  // Measure viewport width/height for accurate slide distance and sizing
  React.useEffect(() => {
    const update = () => {
      if (frameRef.current) {
        setFrameW(frameRef.current.clientWidth || 360)
        setFrameH(frameRef.current.clientHeight || 394)
      }
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // Preload images to obtain aspect ratios (w/h) for exact width sizing
  React.useEffect(() => {
    let alive = true
    const load = (src, idx) => new Promise((resolve) => {
      const img = new Image()
      img.onload = () => resolve({ idx, r: img.naturalWidth && img.naturalHeight ? img.naturalWidth / img.naturalHeight : 1 })
      img.onerror = () => resolve({ idx, r: 1 })
      img.src = src
    })
    Promise.all(mobileImages.map((src, i) => load(src, i))).then((arr) => {
      if (!alive) return
      const next = [...ratios]
      arr.forEach(({ idx, r }) => { next[idx] = r || 1 })
      setRatios(next)
    })
    return () => { alive = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mobileImages.join('|')])

  // Dynamically adjust mobile frame height so the entire image fits (no vertical cropping) on mobile only (<768px).
  React.useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.innerWidth >= 768) return // do not affect md+ views
    const total = mobileImages.length
    if (!total || !frameW) return
    const safeIndex = ((mobileIndex % total) + total) % total
    const r = ratios[safeIndex] || 1 // width/height ratio
    // height = width / ratio; add small padding compensation (0) to keep exact fit
    let targetH = Math.round(frameW / r)
    // Guardrails: prevent overly small or extreme heights
    targetH = Math.max(200, Math.min(700, targetH))
    setFrameH(targetH)
  }, [mobileIndex, ratios, frameW, mobileImages.length])

  return (
  <section id="features" className="pt-2 xs:pt-4 md:pt-2 lg:pt-4 pb-8 xs:pb-12 md:pb-40 lg:pb-48" style={{ zIndex: 50, position: 'relative', scrollMarginTop: '40px' }}>
      {/* Simplified mobile spacing: remove negative pull & complex media overrides for consistent timer clearance */}
      <style>{`
      @media (max-width: 767.98px) {
        /* New requirement: provide a consistent 24px vertical gap below the Hero section.
           Remove previous negative margin hack and enforce padding-top:24px only on mobile. */
  #features { margin-top: 0 !important; padding-top: 40px !important; }
        #features .mobile-features-wrap { margin-top: 0 !important; padding-top: 0 !important; }
        #features .mobile-features-heading { padding-top: 0 !important; }
      }
      `}</style>
      {/* Mobile-only layout (do not affect desktop) */}
  <div className="block md:hidden mobile-features-wrap" style={{ marginTop: 0 }}>
        {/* Heading */}
  <div className="relative px-4 mobile-features-heading" style={{ marginBottom: '16px' }}>
          <h2
            className="text-left font-bold text-white"
            style={{
              fontFamily: '"Anek Latin", sans-serif',
              fontSize: '32px',
              // Removed extra left margin to keep uniform 16px (px-4) padding on both sides
              marginLeft: 0,
              lineHeight: '120%',
              color: '#FFF'
            }}
          >
            Why
            <br />
            Tandem?
          </h2>
          {/* Top-right slide number (dynamic) - disable pointer events so it won't block swipes */}
          <div style={{ position: 'absolute', right: '22px', top: '10px', pointerEvents: 'none' }}>
            <span
              style={{
                WebkitTextStrokeWidth: '1px',
                WebkitTextStrokeColor: '#FFFFFF',
                color: 'transparent',
                // Match desktop carousel numbering font
                fontFamily: '"JUST Sans Outline ExBold", "Anek Latin", sans-serif',
                fontSize: '60px',
                fontWeight: 700,
                lineHeight: '100%'
              }}
            >
              {String(((mobileIndex % mobileImages.length) + mobileImages.length) % mobileImages.length + 1).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Mobile viewport: infinite loop with clones */}
        {/* Maintain consistent 16px side gap for viewport */}
        <div className="px-4">
          <div
            ref={frameRef}
            className="overflow-hidden"
            style={{
              width: '100%',
              // Dynamic height computed from current image aspect ratio so full image is visible.
              height: `${frameH}px`,
              touchAction: 'pan-y'
            }}
          >
          {(() => {
            const extended = [mobileImages[mobileImages.length - 1], ...mobileImages, mobileImages[0]]
            const baseTranslateIndex = mobileIndex + 1 // account for leading clone
            return (
              <div
                className="h-full flex will-change-transform"
                onTransitionEnd={() => {
                  if (mobileIndex === mobileImages.length) {
                    // Reached clone after last -> jump to first real
                    setInstantJump(true)
                    requestAnimationFrame(() => {
                      setMobileIndex(0)
                      requestAnimationFrame(() => setInstantJump(false))
                    })
                  } else if (mobileIndex === -1) {
                    // Reached clone before first -> jump to last real
                    setInstantJump(true)
                    requestAnimationFrame(() => {
                      setMobileIndex(mobileImages.length - 1)
                      requestAnimationFrame(() => setInstantJump(false))
                    })
                  }
                }}
                style={{
                  transform: `translateX(${-(baseTranslateIndex * (frameW || 360)) + (isDragging ? dragDx : 0)}px)`,
                  transition: (isDragging || instantJump) ? 'none' : 'transform 400ms ease',
                  position: 'relative',
                  zIndex: 1
                }}
              >
                {extended.map((src, i) => {
                  let realIdx
                  if (i === 0) realIdx = mobileImages.length - 1
                  else if (i === extended.length - 1) realIdx = 0
                  else realIdx = i - 1
                  const r = ratios[realIdx] || 1
                  const exactW = Math.min(frameW, Math.max(1, Math.round(r * (frameH || 394))))
                  return (
                    <div
                      key={`ext-${i}-${realIdx}`}
                      className="h-full flex items-center justify-center"
                      style={{ width: frameW, minWidth: frameW }}
                    >
                      <div
                        className="overflow-hidden"
                        style={{
                          background: '#23243a',
                          border: '1px solid rgba(255,255,255,0.15)',
                          borderRadius: '16px',
                          // Span full width of the mobile container so only the outer px-4 (16px) padding shows as side gap.
                          width: '100%',
                          height: `${frameH}px`,
                          boxShadow: '0 8px 24px rgba(0,0,0,0.35)'
                        }}
                      >
                        <img
                          src={src}
                          alt={`Feature ${realIdx + 1}`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center center', background: '#23243a', pointerEvents: 'none' }}
                          draggable={false}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          })()}
          </div>
        </div>

        {/* Slider under card */}
  <div className="px-4" style={{ marginTop: '18px', paddingBottom: '36px' }}>
          <input
            type="range"
            min={0}
            max={mobileImages.length - 1}
            step={1}
            value={((mobileIndex % mobileImages.length) + mobileImages.length) % mobileImages.length}
            className="w-full"
            style={{
              WebkitAppearance: 'none',
              height: 4,
              background: 'rgba(255,255,255,0.25)',
              borderRadius: 9999,
              outline: 'none'
            }}
            onInput={(e) => setMobileIndex(parseInt(e.target.value))}
            onChange={(e) => setMobileIndex(parseInt(e.target.value))}
          />
          <style>{`
            input[type="range"]::-webkit-slider-thumb {
              -webkit-appearance: none;
              appearance: none;
              width: 28px; height: 14px;
              background: #FFF;
              border-radius: 8px;
              box-shadow: none;
              margin-top: -6px;
              cursor: pointer;
            }
            input[type="range"]::-moz-range-thumb {
              width: 28px; height: 14px; border: 0;
              background: #FFF;
              border-radius: 8px;
              box-shadow: none;
              cursor: pointer;
            }
          `}</style>
        </div>
      </div>

      {/* Desktop & tablet (unchanged) */}
  <div className="hidden md:block pt-32 md:pt-8 lg:pt-32">
        {/* Full-bleed container spanning the full viewport width */}
        <div className="relative" style={{ width: '100vw', marginLeft: 'calc(50% - 50vw)', marginRight: 'calc(50% - 50vw)' }}>
          {/* Carousel with heading slotted just under the left previews */}
          <FeatureCarousel
              belowLeft={(
                <>
                  {/* Removed sm-only heading; mobile layout now covers up to <768px */}

                  {/* md-only (768-1023px): smaller to avoid overlap */}
                  <h2 
                    className="hidden md:block lg:hidden text-left font-bold text-white"
                    style={{
                      fontFamily: '"Anek Latin", sans-serif',
                      fontSize: '40px',
                      fontWeight: 700,
                      lineHeight: '120%',
                      color: 'rgba(255, 255, 255, 1)',
                      marginLeft: '-16px'
                    }}
                  >
                    Why
                    <br />
                    Tandem?
                  </h2>

                  {/* lg+ (>=1024px): original desktop size */}
                  <h2 
                    className="hidden lg:block text-left font-bold text-white"
                    style={{
                      fontFamily: '"Anek Latin", sans-serif',
                      fontSize: '60px',
                      fontWeight: 700,
                      lineHeight: '120%',
                      color: 'rgba(255, 255, 255, 1)'
                    }}
                  >
                    Why
                    <br />
                    Tandem?
                  </h2>
                </>
              )}
            />
          {/* Extra spacer for desktop/tablet to ensure carousel clears next section */}
          <div className="hidden sm:block h-32 md:h-40 lg:h-48"></div>
        </div>
      </div>
    </section>
  )
}

export default Features
