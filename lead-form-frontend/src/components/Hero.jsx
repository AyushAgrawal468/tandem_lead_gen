import React, { useState, useEffect } from 'react'
import Ellipse5 from '../assets/Ellipse 5.svg'
import Ellipse6 from '../assets/Ellipse 6.svg'
import CountdownTimer from './CountdownTimer'

// Dynamically import up to 5 hero images from assets/hero-images
// Users should place their images there; we sort by filename for stable order.
const heroImageModules = import.meta.glob('../assets/hero-images/*.{jpg,jpeg,png,webp}', { eager: true })
const heroImageEntries = Object.entries(heroImageModules)
  .sort((a, b) => a[0].localeCompare(b[0]))
  .slice(0, 5)
const heroImages = heroImageEntries.map(([_, mod]) => mod.default || mod)

const Hero = ({ timerData }) => {
  // Touch swipe state
  const touchStartX = React.useRef(null)
  const touchEndX = React.useRef(null)

  // Handle touch start
  const handleTouchStart = (e) => {
    if (e.touches && e.touches.length === 1) {
      touchStartX.current = e.touches[0].clientX
      touchEndX.current = null
    }
  }
  // Handle touch move
  const handleTouchMove = (e) => {
    if (e.touches && e.touches.length === 1) {
      touchEndX.current = e.touches[0].clientX
    }
  }
  // Handle touch end
  const handleTouchEnd = () => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const delta = touchEndX.current - touchStartX.current
      if (Math.abs(delta) > 40) {
        if (delta < 0) nextSlide()
        else prevSlide()
      }
    }
    touchStartX.current = null
    touchEndX.current = null
  }

  const [currentSlide, setCurrentSlide] = useState(0)
  const [navDir, setNavDir] = useState('next')
  const [autoPlay, setAutoPlay] = useState(true)
  const autoRef = React.useRef(null)
  const resumeRef = React.useRef(null)

  // Layout tuning
  const curveOverlap = 150
  const screenSideOffset = 'clamp(24px, 7vw, 180px)'
  const heroShift = 0
  const heroBottomExtend = 240
  const bottomCurveOverlap = 240

  // Slides
  // Build slides from discovered images or provide a fallback single slide
  const heroSlides = (heroImages.length ? heroImages : [null]).map((img, idx) => ({
    id: idx + 1,
    image: img || '',
    position: 'center',
    alt: img ? `Hero slide ${idx + 1}` : 'Add images to assets/hero-images'
  }))

  // Preload & decode images to avoid late paint when slides shift.
  const [loadedMap, setLoadedMap] = useState(() => new Map())
  const [allDecoded, setAllDecoded] = useState(false)
  useEffect(() => {
    let cancelled = false
    const entries = heroSlides.filter(s => s.image)
    if (!entries.length) return
    const loaders = entries.map(slide => {
      return new Promise(resolve => {
        // If already cached by browser, onload may fire synchronously.
        const imgEl = new Image()
        imgEl.src = slide.image
        const markLoaded = () => {
          if (cancelled) return
            setLoadedMap(prev => {
              if (prev.get(slide.image)) return prev
              const next = new Map(prev)
              next.set(slide.image, true)
              return next
            })
            resolve()
        }
        if (imgEl.decode) {
          imgEl.decode().then(markLoaded).catch(() => markLoaded())
        } else {
          imgEl.onload = markLoaded
          imgEl.onerror = markLoaded
        }
      })
    })
    Promise.all(loaders).then(() => { if (!cancelled) setAllDecoded(true) })
    return () => { cancelled = true }
  }, [heroSlides.length])

  // Auto-slide functionality (stops when autoPlay is false)
  useEffect(() => {
    if (!autoPlay) return
    autoRef.current = setInterval(() => {
      setNavDir('next')
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => { if (autoRef.current) clearInterval(autoRef.current) }
  }, [autoPlay, heroSlides.length])

  // Stop auto and start resume timer
  const stopAuto = () => {
    if (autoRef.current) {
      clearInterval(autoRef.current)
      autoRef.current = null
    }
    setAutoPlay(false)
    // Reset resume timer
    if (resumeRef.current) {
      clearTimeout(resumeRef.current)
      resumeRef.current = null
    }
    resumeRef.current = setTimeout(() => {
      setAutoPlay(true)
      resumeRef.current = null
    }, 10000)
  }

  const isSmall = () => (typeof window !== 'undefined' ? window.innerWidth < 768 : true)

  const nextSlide = () => {
    stopAuto()
    setNavDir('next')
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }

  const prevSlide = () => {
    stopAuto()
    // For xxs, xs, sm: force left-only flow by treating prev as next
    if (isSmall()) {
      setNavDir('next')
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    } else {
      setNavDir('prev')
      setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
    }
  }

  const goToSlide = (index) => {
    stopAuto()
    setCurrentSlide(index)
  }

  // Timer sizing and offsets (easy to tweak)
  // Responsive sizing using clamp: smaller on phones, original on desktop
  const TIMER_W = 200
  const TIMER_H = 100
  const TIMER_R = 16
  const TIMER_SW = 6
  const TIMER_DISPLAY_W = 'clamp(150px, 24vw, 200px)'
  const TIMER_DISPLAY_H = 'clamp(80px, 12vw, 100px)'
  const TIMER_RIGHT_INSET = 'calc(2px + var(--content-right-pad, 0px) + 8px)'
  const TIMER_BOTTOM_INSET = 'calc(var(--bottom-overlap) - 72px)'

  // Normalize bottom ellipse in md only (e.g., iPad Mini/Air/Pro portrait)
  const [vw, setVw] = useState(typeof window !== 'undefined' ? window.innerWidth : 0)
  const [vh, setVh] = useState(typeof window !== 'undefined' ? window.innerHeight : 0)
  useEffect(() => {
    const onResize = () => { setVw(window.innerWidth); setVh(window.innerHeight) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  const isTablet = vw >= 768 && vw < 1024
  // iPad Pro 11" portrait typically reports ~834x1194. Allow small ranges for robustness.
  const isIpadPro11Portrait = isTablet && vw >= 830 && vw <= 838 && vh >= 1180
  // iPad Pro 12.9" portrait typically reports ~1024x1366 CSS px
  const isIpadPro129Portrait = vw >= 1020 && vw <= 1030 && vh >= 1340

  let BOTTOM_CURVE_H_VAR
  let BOTTOM_OVERLAP_VAR
  if (isIpadPro11Portrait) {
    // Tighter clamps on iPad Pro 11" so it matches other tablets visually
    BOTTOM_CURVE_H_VAR = 'clamp(180px, 17vh, 240px)'
    BOTTOM_OVERLAP_VAR = 'clamp(60px, 8vh, 120px)'
  } else if (isIpadPro129Portrait) {
    // Treat 12.9" as tablet with slightly reduced vh scaling to align with others
    BOTTOM_CURVE_H_VAR = 'clamp(180px, 20vh, 280px)'
    BOTTOM_OVERLAP_VAR = 'clamp(90px, 12vh, 160px)'
  } else if (isTablet) {
    BOTTOM_CURVE_H_VAR = 'clamp(180px, 22vh, 280px)'
    BOTTOM_OVERLAP_VAR = 'clamp(60px, 10vh, 140px)'
  } else {
    BOTTOM_CURVE_H_VAR = 'clamp(40px, 24vw, 200px)'
    BOTTOM_OVERLAP_VAR = 'clamp(6px, 8vw, 96px)'
  }

  return (
  <section
    className="relative overflow-hidden hero-section-responsive"
    style={{
      zIndex: 10,
      minHeight: 'calc(100vh - 80px)',
      height: 'auto',
      backgroundColor: 'transparent',
      isolation: 'isolate'
    }}
  >
      {/* Mobile IMAX top curve using provided Ellipse 5 */}
      <div className="absolute block sm:hidden w-full pointer-events-none" style={{ top: '-14px', left: 0, right: 0, zIndex: 44 }}>
        <img
          src={Ellipse5}
          alt="imax top curve"
          className="block w-full"
          style={{ height: 'auto', transform: 'scaleX(1.012)', transformOrigin: 'center top' }}
        />
      </div>
      {/* Theater overlay consideration - content positioned to work with navbar curve */}
  <div
    className="relative w-full md:-mt-6 lg:mt-0"
    onPointerDown={stopAuto}
    onTouchStart={stopAuto}
    onWheel={stopAuto}
    style={{
      top: `-${heroShift}px`,
      // Use a shorter height for mobile, keep desktop as is
      height: 'min(calc(100vh + ' + heroShift + 'px + var(--hero-bottom-extend) - 100px), var(--hero-max-h))',
  ['--curve-h']: 'clamp(100px, 45vw, 300px)',
  ['--bottom-overlap']: BOTTOM_OVERLAP_VAR,
  ['--hero-bottom-extend']: 'clamp(8px, 5vw, 80px)',
  ['--hero-max-h']: 'clamp(220px, 100vh, 100vh)',
  ['--bottom-curve-h']: BOTTOM_CURVE_H_VAR,
      backgroundColor: 'transparent'
    }}
  >
        
        {/* Sliding Images Container - Desktop/Tablets */}
        <div 
          className="absolute hidden sm:block"
          style={{
            // Match the navbar semicircle exact horizontal bounds
            left: '2px',
            right: 'calc(2px + var(--content-right-pad, 0px))',
            top: 0,
            bottom: 0,
            // Define the inner visible screen offset once
            ['--screen-offset']: 'clamp(24px, 7vw, 180px)',
            // Unify side preview width and center gap for consistent proportions across devices
            ['--side-width']: 'clamp(75px, 21vw, 205px)', // decreased side image width by 15px
            ['--center-gap']: 'clamp(17px, 4vw, 49px)', // decreased gap by 10px more
            ['--side-margin']: '12px'
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Solid base background so side areas don't show any image through */}
          <div
            className="absolute inset-0"
            style={{ background: 'transparent', zIndex: 0 }}
          />
          {/* Unified slide system (desktop/tablet): center slide moves into left slot; new slides enter from right slot */}
          {heroSlides.map((slide, index) => {
            const total = heroSlides.length
            const leftIndex = (currentSlide - 1 + total) % total
            const rightIndex = (currentSlide + 1) % total
            // Preload the next-right (for 'next' flow) or next-left (for 'prev' flow) so it is already in place
            // when it transitions into visibility. This removes the "late load" pop-in effect.
            let preloadRightIndex = null
            let preloadLeftIndex = null
            if (total > 3) {
              if (navDir === 'next') {
                preloadRightIndex = (currentSlide + 2) % total
              } else if (navDir === 'prev') {
                preloadLeftIndex = (currentSlide - 2 + total) % total
              }
            }

            let role
            if (index === currentSlide) role = 'center'
            else if (index === leftIndex) role = 'left'
            else if (index === rightIndex) role = 'right'
            else if (preloadRightIndex !== null && index === preloadRightIndex) role = 'preload-right'
            else if (preloadLeftIndex !== null && index === preloadLeftIndex) role = 'preload-left'
            else role = 'hidden'

            // Shared base styles
            const baseStyle = {
              position: 'absolute',
              top: 'calc(var(--curve-h) / -2)',
              bottom: 0,
              transition: 'left 900ms cubic-bezier(0.22,1,0.36,1), right 900ms cubic-bezier(0.22,1,0.36,1), width 900ms cubic-bezier(0.22,1,0.36,1), opacity 700ms ease, transform 900ms cubic-bezier(0.22,1,0.36,1)',
              overflow: 'hidden',
              borderRadius: '14px',
              willChange: 'left, right, width, opacity, transform',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transformStyle: 'preserve-3d',
              contain: 'layout paint style'
            }

            let positionalStyle = {}
            if (role === 'center') {
              positionalStyle = {
                left: 'calc(var(--side-width) + var(--center-gap) + var(--side-margin) - 15px)',
                right: 'calc(var(--side-width) + var(--center-gap) + var(--side-margin) - var(--content-right-pad, 0px) - 15px)',
                width: 'auto',
                opacity: 1,
                zIndex: 12,
                transform: 'scale(1) translateZ(0)'
              }
            } else if (role === 'left') {
              positionalStyle = {
                left: 'var(--side-margin)',
                width: 'var(--side-width)',
                right: 'auto',
                opacity: 1,
                zIndex: 10,
                transform: 'scale(0.98) translateZ(0)'
              }
            } else if (role === 'right') {
              positionalStyle = {
                right: 'calc(var(--side-margin) - var(--content-right-pad, 0px))',
                width: 'var(--side-width)',
                left: 'auto',
                opacity: 1,
                zIndex: 10,
                transform: 'scale(0.98) translateZ(0)'
              }
            } else if (role === 'preload-right') {
              // Already placed in right slot but invisible; will fade in next cycle becoming 'right'
              positionalStyle = {
                right: 'calc(var(--side-margin) - var(--content-right-pad, 0px))',
                width: 'var(--side-width)',
                left: 'auto',
                opacity: 0,
                zIndex: 5,
                transform: 'scale(0.95) translateZ(0)'
              }
            } else if (role === 'preload-left') {
              positionalStyle = {
                left: 'var(--side-margin)',
                width: 'var(--side-width)',
                right: 'auto',
                opacity: 0,
                zIndex: 5,
                transform: 'scale(0.95) translateZ(0)'
              }
            } else {
              positionalStyle = {
                left: '50%',
                // Keep width collapsed to avoid layout / overlapping; hidden slides will be reassigned later.
                width: '0px',
                opacity: 0,
                zIndex: 1,
                transform: 'scale(0.9) translateZ(0)'
              }
            }

            const isLoaded = slide.image ? loadedMap.get(slide.image) : true
            const finalOpacity = positionalStyle.opacity
            // If not yet loaded and it's about to be needed (right or preload-right), keep it transparent until ready.
            const delayOpacity = !isLoaded && (role === 'right' || role === 'preload-right' || role === 'center')
            return (
              <div key={slide.id} style={{ ...baseStyle, ...positionalStyle, opacity: delayOpacity ? 0 : finalOpacity }}>
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat will-change-transform"
                  style={{ 
                    backgroundImage: slide.image ? `url(${slide.image})` : 'none',
                    backgroundColor: 'transparent',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    willChange: 'opacity, transform',
                    filter: 'brightness(1.1) contrast(1.05) saturate(1.1)'
                  }}
                >
                </div>
                {/* Text removed as per request (plain image only) */}
              </div>
            )
          })}
        </div>

        {/* Sliding Images Container - Mobile-only (smooth sliding between images) */}
        <div
          className="absolute block sm:hidden"
          style={{
            left: '50%',
            transform: 'translateX(-50%)',
            top: 0,
            width: 'min(90vw, 360px)',
            height: '326px',
            flexShrink: 0,
            backgroundColor: 'transparent'
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Solid base background */}
          <div className="absolute inset-0" style={{ background: 'transparent', zIndex: 0 }} />

          {/* Sliding stack of slides with slow flowing transition */}
          <div className="absolute inset-0 overflow-hidden">
            {heroSlides.map((slide, index) => {
              const total = heroSlides.length
              const delta = (index - currentSlide + total) % total
              // Force left-only flow on mobile stack
              let position
              if (isSmall()) {
                if (delta === 0) position = 'center'
                else if (delta === 1) position = 'right'
                else position = 'left'
              } else {
                position = delta === 0
                  ? 'center'
                  : navDir === 'prev'
                    ? (delta === total - 1 ? 'left' : 'right')
                    : (delta === 1 ? 'right' : 'left')
              }
              const small = isSmall()
              const baseTransforms = small
                ? {
                    center: 'translate3d(0%, 0, 0) scale(1)',
                    left: 'translate3d(-110%, 0, 0) scale(0.98)',
                    right: 'translate3d(110%, 0, 0) scale(0.98)'
                  }
                : {
                    center: 'translateX(0%) scale(1)',
                    left: 'translateX(-100%) scale(0.98)',
                    right: 'translateX(100%) scale(0.98)'
                  }
              const z = position === 'center' ? 12 : position === 'right' ? 11 : 9
              return (
                <div
                  key={slide.id}
                  className="absolute inset-0 will-change-transform"
                  style={{
                    transform: baseTransforms[position],
                    transition: 'transform 900ms cubic-bezier(0.22, 1, 0.36, 1), opacity 700ms ease',
                    // On mobile, hide non-center slides completely to avoid any faded preview
                    opacity: isSmall() ? (position === 'center' ? 1 : 0) : (position === 'center' ? 1 : 1),
                    zIndex: z,
                    willChange: 'transform, opacity',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden'
                  }}
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ 
                      backgroundImage: `url(${slide.image})`, 
                      backgroundColor: 'transparent', 
                      backfaceVisibility: 'hidden', 
                      WebkitBackfaceVisibility: 'hidden', 
                      willChange: 'transform, opacity',
                      filter: 'brightness(1.1) contrast(1.05) saturate(1.1)'
                    }}
                  >
                  </div>
                  {/* Text content centered */}
                  {/* Text removed for mobile as well */}
                </div>
              )
            })}
          </div>
        </div>

        {/* Mobile IMAX lower curve using Ellipse 6 */}
        <div className="absolute block sm:hidden w-full pointer-events-none" style={{ top: '300px', left: 0, right: 0, zIndex: 44 }}>
          <img
            src={Ellipse6}
            alt="imax lower curve"
            className="block w-full"
            style={{ 
              height: 'auto', 
              transform: 'scaleX(1.012)', 
              transformOrigin: 'center bottom'
            }}
          />
        </div>

        {/* Navigation Controls */}
  <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-20 hidden sm:block">
          <button 
            onClick={prevSlide}
            className="p-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-full text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

  <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-20 hidden sm:block">
          <button 
            onClick={nextSlide}
            className="p-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-full text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Slide Indicators - desktop/tablet only (hidden on mobile) */}
  <div className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-20 hidden sm:block">
          <div className="flex space-x-3">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-white scale-125' 
                    : 'bg-white/40 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Bottom Semicircle overlay - desktop only (removed from mobile) */}
        {/* Mobile: no bottom semicircle to avoid overlap with features */}
        
        {/* Desktop/Tablet: preserve original responsive curve */}
        <div className="absolute w-full pointer-events-none hidden sm:block" style={{ zIndex: 45, height: '0px', bottom: '0px' }}>
          <div
            className="absolute"
            style={{
              width: 'calc(100% - 4px)',
              height: 'var(--bottom-curve-h)',
              borderRadius: '50% 50% 0px 0px',
              background: 'rgba(17, 17, 17, 1)',
              bottom: 'calc(var(--bottom-overlap) - var(--bottom-curve-h))',
              left: '2px',
            }}
          />
        </div>

        {/* Global timer above the bottom semicircle, anchored to the inner right edge */}
        {/* Desktop/Tablet timer only (removed mobile timer) */}
        <div
          className="absolute pointer-events-auto hidden sm:block"
          style={{
            zIndex: 1000,
            right: TIMER_RIGHT_INSET,
            bottom: TIMER_BOTTOM_INSET,
          }}
        >
          {!timerData ? (
            <div className="flex items-center justify-center w-full h-full">
              <span className="animate-pulse text-white text-lg">Loading timer…</span>
            </div>
          ) : (
            <CountdownTimer
              remainingSeconds={timerData.remainingSeconds}
              endTime={timerData.endTime}
              startTime={timerData.startTime}
              width={TIMER_W}
              height={TIMER_H}
              radius={TIMER_R}
              strokeWidth={TIMER_SW}
              displayWidth={TIMER_DISPLAY_W}
              displayHeight={TIMER_DISPLAY_H}
            />
          )}
        </div>

        {/* Mobile timer: moved further down and slightly reduced to avoid overlap with Features heading */}
        <div
          className="absolute pointer-events-none block sm:hidden"
          style={{
            zIndex: 1001,
            right: '12px',
            top: 'calc(300px + 36px)'
          }}
        >
          {!timerData ? (
            <div className="flex items-center justify-center w-full h-full">
              <span className="animate-pulse text-white text-sm">Loading…</span>
            </div>
          ) : (
            <CountdownTimer
              remainingSeconds={timerData.remainingSeconds}
              endTime={timerData.endTime}
              startTime={timerData.startTime}
              width={TIMER_W - 30}
              height={TIMER_H - 20}
              radius={TIMER_R}
              strokeWidth={TIMER_SW}
              displayWidth={TIMER_DISPLAY_W}
              displayHeight={TIMER_DISPLAY_H}
            />
          )}
        </div>
      </div>
    </section>
  )
}

export default Hero
