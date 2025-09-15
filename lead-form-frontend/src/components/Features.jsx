import React from 'react'
import FeatureCarousel from './FeatureCarousel'
import feature1 from '../assets/features/feature1.svg'
import feature2 from '../assets/features/feature2.svg'
import feature3 from '../assets/features/feature3.svg'
import feature4 from '../assets/features/feature4.svg'
import feature5 from '../assets/features/feature5.svg'
import feature6 from '../assets/features/feature6.svg'

const Features = () => {
  // Mobile carousel state (one SVG per slide)
  const mobileImages = [feature1, feature2, feature3, feature4, feature5, feature6]
  const [mobileIndex, setMobileIndex] = React.useState(0)
  const touchStartXRef = React.useRef(0)
  const touchStartYRef = React.useRef(0)
  const touchActiveRef = React.useRef(false)
  const horizontalLockRef = React.useRef(false)
  const frameRef = React.useRef(null)
  const [frameW, setFrameW] = React.useState(343)
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

  // Measure frame width for accurate slide distance
  React.useEffect(() => {
    const update = () => {
      if (frameRef.current) setFrameW(frameRef.current.clientWidth || 343)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return (
    <section id="features" className="pt-2 pb-8 sm:pb-16 lg:pb-24" style={{ zIndex: 50, position: 'relative', marginTop: '-45px', scrollMarginTop: '40px' }}>
      {/* Mobile-only layout (do not affect desktop) */}
  <div className="block sm:hidden" style={{ marginTop: '-400px' }}>
        {/* Heading */}
        <div className="relative px-6" style={{ marginBottom: '16px' }}>
          <h2
            className="text-left font-bold text-white"
            style={{
              fontFamily: '"Anek Latin", sans-serif',
              fontSize: '40px',
              lineHeight: '120%',
              color: '#FFF'
            }}
          >
            Why be on
            <br />
            Tandem?
          </h2>
          {/* Top-right slide number (dynamic) - disable pointer events so it won't block swipes */}
          <div style={{ position: 'absolute', right: '18px', top: '-6px', pointerEvents: 'none' }}>
            <span
              style={{
                WebkitTextStrokeWidth: '1px',
                WebkitTextStrokeColor: '#FFFFFF',
                color: 'transparent',
                fontFamily: '"Anek Latin", sans-serif',
                fontSize: '72px',
                fontWeight: 700,
                lineHeight: '100%'
              }}
            >
              {String(mobileIndex + 1).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Feature card frame-only (one SVG per slide) */}
        <div
          className="overflow-hidden"
          style={{
            background: '#23243a',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '16px',
            padding: 0,
            width: '343px',
            height: '394px',
            flexShrink: 0,
            margin: '0 auto',
            boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
            touchAction: 'pan-y'
          }}
          ref={frameRef}
        >
          {/* Sliding track with one image per slide */}
          <div
            className="h-full flex will-change-transform sliding-track"
            style={{
              width: `${mobileImages.length * 100}%`,
              transform: `translateX(${-(mobileIndex * (frameW || 343)) + (isDragging ? dragDx : 0)}px)`,
              transition: isDragging ? 'none' : 'transform 400ms ease',
              position: 'relative',
              zIndex: 1
            }}
          >
            {mobileImages.map((src, i) => (
              <div key={i} className="h-full" style={{ width: frameW, minWidth: frameW, position: 'relative' }}>
                <img
                  src={src}
                  alt={`Feature ${i + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center center', background: '#23243a', pointerEvents: 'none' }}
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Slider under card */}
        <div className="px-6" style={{ marginTop: '22px', paddingBottom: '40px' }}>
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
              width: 32px; height: 16px;
              background: #FFF;
              border-radius: 8px;
              box-shadow: none;
              margin-top: -6px;
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
      </div>

      {/* Desktop & tablet (unchanged) */}
      <div className="hidden sm:block pt-32">
        {/* Full-bleed container spanning the full viewport width */}
        <div className="relative" style={{ width: '100vw', marginLeft: 'calc(50% - 50vw)', marginRight: 'calc(50% - 50vw)' }}>
          <div className="px-6 md:px-10">
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
                      color: 'rgba(255, 255, 255, 1)'
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
          </div>
        </div>
      </div>
    </section>
  )
}

export default Features
