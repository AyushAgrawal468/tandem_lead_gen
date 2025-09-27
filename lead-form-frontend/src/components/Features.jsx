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
  const [mobileIndex, setMobileIndex] = React.useState(0)
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

  const nextMobile = () => setMobileIndex((i) => (i + 1) % mobileImages.length)
  const prevMobile = () => setMobileIndex((i) => (i - 1 + mobileImages.length) % mobileImages.length)

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
      if (dx < -threshold) setMobileIndex((i) => (i + 1) % mobileImages.length)
      else if (dx > threshold) setMobileIndex((i) => (i - 1 + mobileImages.length) % mobileImages.length)
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

  return (
  <section id="features" className="pt-2 xs:pt-4 pb-8 xs:pb-12 sm:pb-32 md:pb-40 lg:pb-48" style={{ zIndex: 50, position: 'relative', marginTop: 'var(--features-mt, -45px)', scrollMarginTop: '40px' }}>
      {/* xxs-only: push section down by 50px (from -45px to +5px) */}
      <style>{`
        @media (min-width: 320px) and (max-width: 399.98px) {
          #features { --features-mt: 120px; }
        }
        @media (min-width: 380px) and (max-width: 639.98px) {
          #features { --features-mt: -30px; }
        }
        @media (min-width: 400px) and (max-width: 639.98px) {
          #features { margin-top: -105px !important; }
        }
        /* Height-based overrides to reduce upward pull on short screens (mobile only) */
        
        @media (max-width: 639.98px) and (max-height: 740px) {
          #features .mobile-features-wrap { margin-top: -330px !important; }
        }
        @media (max-width: 639.98px) and (max-height: 700px) {
          #features .mobile-features-wrap { margin-top: -310px !important; }
        }
        @media (max-width: 639.98px) and (max-height: 660px) {
          #features .mobile-features-wrap { margin-top: -295px !important; }
        }
        @media (max-width: 639.98px) and (max-height: 620px) {
          #features .mobile-features-wrap { margin-top: -280px !important; }
        }
        /* Tall-screen adjustments (e.g., iPhone 14 Pro Max ~932px height) */
        @media (max-width: 639.98px) and (min-height: 800px) {
          #features .mobile-features-wrap { margin-top: -350px !important; }
        }
        @media (max-width: 639.98px) and (min-height: 860px) {
          #features .mobile-features-wrap { margin-top: -340px !important; }
        }
        @media (max-width: 639.98px) and (min-height: 900px) {
          #features .mobile-features-wrap { margin-top: -330px !important; }
        }
        @media (max-width: 639.98px) and (min-height: 940px) {
          #features .mobile-features-wrap { margin-top: -320px !important; }
        }
      `}</style>
      {/* Mobile-only layout (do not affect desktop) */}
      <div className="block sm:hidden mobile-features-wrap" style={{ marginTop: '-360px' }}>
        {/* Heading */}
        <div className="relative px-4 xxs:px-5 xs:px-6 mobile-features-heading" style={{ marginBottom: '16px' }}>
          {/* Extra top padding added to avoid overlap with mobile countdown timer */}
          <style>{`
            @media (max-width: 639.98px) {
              /* Base extra spacing */
              #features .mobile-features-heading { padding-top: 80px; }
              /* Very short heights: reduce so content not pushed too far */
              @media (max-height: 760px) { #features .mobile-features-heading { padding-top: 70px; } }
              @media (max-height: 700px) { #features .mobile-features-heading { padding-top: 60px; } }
              @media (max-height: 640px) { #features .mobile-features-heading { padding-top: 52px; } }
              @media (max-height: 600px) { #features .mobile-features-heading { padding-top: 46px; } }
            }
          `}</style>
          <h2
            className="text-left font-bold text-white"
            style={{
              fontFamily: '"Anek Latin", sans-serif',
              fontSize: '32px',
              marginLeft: '24px',
              lineHeight: '120%',
              color: '#FFF'
            }}
          >
            Why be on
            <br />
            Tandem?
          </h2>
          {/* Top-right slide number (dynamic) - disable pointer events so it won't block swipes */}
          <div style={{ position: 'absolute', right: '50px', top: '10px', pointerEvents: 'none' }}>
            <span
              style={{
                WebkitTextStrokeWidth: '1px',
                WebkitTextStrokeColor: '#FFFFFF',
                color: 'transparent',
                fontFamily: '"Anek Latin", sans-serif',
                fontSize: '60px',
                fontWeight: 700,
                lineHeight: '100%'
              }}
            >
              {String(mobileIndex + 1).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Mobile viewport: whole frames slide out/in like desktop */}
        <div
          ref={frameRef}
          className="overflow-hidden"
          style={{
            width: '100%',
            height: 'min(90vw, 394px)',
            touchAction: 'pan-y'
          }}
        >
          <div
            className="h-full flex will-change-transform"
            style={{
              transform: `translateX(${-(mobileIndex * (frameW || 360)) + (isDragging ? dragDx : 0)}px)`,
              transition: isDragging ? 'none' : 'transform 400ms ease',
              position: 'relative',
              zIndex: 1
            }}
          >
            {mobileImages.map((src, i) => {
              const r = ratios[i] || 1
              const exactW = Math.min(frameW, Math.max(1, Math.round(r * (frameH || 394))))
              return (
              <div
                key={i}
                className="h-full flex items-center justify-center"
                style={{ width: frameW, minWidth: frameW }}
              >
                {/* Framed container that moves fully on/off screen */}
                <div
                  className="overflow-hidden"
                  style={{
                    background: '#23243a',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '16px',
                    width: `${exactW}px`,
                    height: `${frameH}px`,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.35)'
                  }}
                >
                  <img
                    src={src}
                    alt={`Feature ${i + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center center', background: '#23243a', pointerEvents: 'none' }}
                    draggable={false}
                  />
                </div>
              </div>
            )})}
          </div>
        </div>

        {/* Slider under card */}
        <div className="px-4 xxs:px-5 xs:px-6" style={{ marginTop: '18px', paddingBottom: '36px' }}>
          <input
            type="range"
            min={0}
            max={mobileImages.length - 1}
            step={1}
            value={mobileIndex}
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
      <div className="hidden sm:block pt-32">
        {/* Full-bleed container spanning the full viewport width */}
        <div className="relative" style={{ width: '100vw', marginLeft: 'calc(50% - 50vw)', marginRight: 'calc(50% - 50vw)' }}>
          {/* Carousel with heading slotted just under the left previews */}
          <FeatureCarousel
              belowLeft={(
                <>
                  {/* sm-only (640-767px): keep desktop size */}
                  <h2 
                    className="hidden sm:block md:hidden text-left font-bold text-white"
                    style={{
                      fontFamily: '"Anek Latin", sans-serif',
                      fontSize: '60px',
                      fontWeight: 700,
                      lineHeight: '120%',
                      color: 'rgba(255, 255, 255, 1)',
                      marginLeft: '10px'
                    }}
                  >
                    Why be on
                    <br />
                    Tandem?
                  </h2>

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
                    Why be on
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
                    Why be on
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
