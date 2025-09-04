import React, { useState, useEffect } from 'react'
import CountdownTimer from './CountdownTimer'

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  // Track the last navigation direction: 'next' (slides move left) or 'prev' (slides move right)
  const [navDir, setNavDir] = useState('next')
  // Autoplay control; will stop on any user interaction, and resume after 20s inactivity
  const [autoPlay, setAutoPlay] = useState(true)
  const autoRef = React.useRef(null)
  const resumeRef = React.useRef(null)
  // Side offset so the image width equals the visible screen between the semicircle's side curves
  // Responsive: min 24px, scale with viewport, cap at 180px to match the curve
  // Height of each semicircle overlap into the hero (top from navbar, bottom in hero)
  const curveOverlap = 150; // px
  const screenSideOffset = 'clamp(24px, 7vw, 180px)';
  // Vertical shift to align hero with the bottom edge of the navbar/logo
  const heroShift = 0; // start hero flush under navbar; adjust only if needed
  // Extra height added only to the bottom of the hero so the lower semicircle overlaps more
  const heroBottomExtend = 240; // px (default upper bound; responsive var used below)
  // Bottom curve overlap (inside the hero) in pixels; top remains at curveOverlap
  const bottomCurveOverlap = 240; // px (default upper bound; responsive var used below)
  
  // Hero slides with 360-degree experience content
  const heroSlides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80",
      title: "Swipe on fun things to do, match with friends,",
      subtitle: "and make it happen — that's Tandem.",
      position: "center",
      isMain: true
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80",
      title: "Discover Together",
      subtitle: "Explore new experiences with friends",
      description: "Turn your matches into real-world adventures. Plan activities, coordinate schedules, and create unforgettable memories together.",
      position: "center"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80",
      title: "Make It Happen",
      subtitle: "From idea to reality in minutes",
      description: "Our smart coordination tools help you turn spontaneous ideas into organized meetups. No more endless group chats!",
      position: "center"
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2662&q=80",
      title: "Build Community",
      subtitle: "Join a network of active explorers",
      description: "Connect with a vibrant community of people who believe life is better when shared. Every swipe brings new possibilities.",
      position: "center"
    }
  ]

  // Auto-slide functionality (stops when autoPlay is false)
  useEffect(() => {
    if (!autoPlay) return
    autoRef.current = setInterval(() => {
      setNavDir('next')
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000) // Change slide every 5 seconds
    return () => {
      if (autoRef.current) clearInterval(autoRef.current)
    }
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

  const nextSlide = () => {
    stopAuto()
    setNavDir('next')
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }

  const prevSlide = () => {
    stopAuto()
    setNavDir('prev')
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

  const goToSlide = (index) => {
    stopAuto()
    setCurrentSlide(index)
  }

  // Fetch launch time from server
  const [launchTime, setLaunchTime] = useState(null)
  const [loadingLaunch, setLoadingLaunch] = useState(true)
  useEffect(() => {
    let cancelled = false
    setLoadingLaunch(true)
    fetch('/api/launch-time')
      .then(res => res.ok ? res.text() : Promise.reject('API error'))
      .then(dt => {
        if (!cancelled) {
          setLaunchTime(dt)
          setLoadingLaunch(false)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLaunchTime(Date.now()) // fallback to local time
          setLoadingLaunch(false)
        }
      })
    return () => { cancelled = true }
  }, [])

  // Timer end is always 9 days after launch
  const timerEnd = React.useMemo(() => launchTime ? new Date(new Date(launchTime).getTime() + 9 * 24 * 60 * 60 * 1000) : null, [launchTime])
  // Timer sizing and offsets (easy to tweak)
  // Responsive sizing using clamp: smaller on phones, original on desktop
  const TIMER_W = 200
  const TIMER_H = 100
  const TIMER_R = 16
  const TIMER_SW = 6
  const TIMER_DISPLAY_W = 'clamp(150px, 24vw, 200px)'
  const TIMER_DISPLAY_H = 'clamp(80px, 12vw, 100px)'
  const TIMER_RIGHT_INSET = 'calc(2px + var(--content-right-pad) + 8px)'
  const TIMER_BOTTOM_INSET = 'calc(var(--bottom-overlap) - 72px)'

  return (
  <section className="relative overflow-hidden" style={{ zIndex: 10, minHeight: 'calc(100vh - 80px)' }}>
      {/* Theater overlay consideration - content positioned to work with navbar curve */}
  <div className="relative w-full" onPointerDown={stopAuto} onTouchStart={stopAuto} onWheel={stopAuto} style={{ 
        // Use dynamic viewport height to avoid mobile browser UI jumps
        top: `-${heroShift}px`, 
        height: `min(calc(100vh + ${heroShift}px + var(--hero-bottom-extend)), var(--hero-max-h))`,
        // Responsive curve height: scales with viewport width but caps for desktop
        ['--curve-h']: 'clamp(200px, 45vw, 300px)',
        // Bottom overlap amount: smaller on mobile, larger on desktop
  ['--bottom-overlap']: 'clamp(24px, 8vw, 96px)',
        // Extra height added only at the bottom: keep compact on mobile
        ['--hero-bottom-extend']: 'clamp(32px, 5vw, 80px)',
        // Mobile hero max height: cap hero so it occupies only top portion on phones
  ['--hero-max-h']: 'clamp(360px, 100vh, 100vh)',
  // Bottom semicircle can be less curved than top for a more open view
  ['--bottom-curve-h']: 'clamp(100px, 24vw, 200px)'
      }}>
        
        {/* Sliding Images Container */}
        <div 
          className="absolute"
          style={{
            // Match the navbar semicircle exact horizontal bounds
            left: '2px',
            right: 'calc(2px + var(--content-right-pad))',
            top: 0,
            bottom: 0,
            // Define the inner visible screen offset once
            ['--screen-offset']: 'clamp(24px, 7vw, 180px)',
            // Unify side preview width and center gap for consistent proportions across devices
            ['--side-width']: 'clamp(60px, 16vw, 150px)',
            ['--center-gap']: 'clamp(16px, 4.5vw, 32px)',
            ['--side-margin']: '12px'
          }}
        >
          {/* Solid base background so side areas don't show any image through */}
          <div
            className="absolute inset-0"
            style={{ background: 'rgba(17, 17, 17, 1)', zIndex: 0 }}
          />
          {/* Previous Image Preview - Left Side */}
          <div
            className="absolute transition-all duration-1000 ease-in-out transform"
            style={{
              top: 'calc(var(--curve-h) / -2)', // Match the top curve depth responsively
              bottom: 0,
              left: 'var(--side-margin)',
              width: 'var(--side-width)',
              opacity: 0.9,
              transform: 'scale(1)',
              zIndex: 5
            }}
          >
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat rounded-lg shadow-xl"
              style={{ backgroundImage: `url(${heroSlides[(currentSlide - 1 + heroSlides.length) % heroSlides.length].image})` }}
            >
              <div className="absolute inset-0 bg-black/30 rounded-lg"></div>
            </div>
          </div>

          {/* Next Image Preview - Right Side */}
          <div
            className="absolute transition-all duration-1000 ease-in-out transform"
            style={{
              top: 'calc(var(--curve-h) / -2)', // Match the top curve depth responsively
              bottom: 0,
              // Pull into the reserved right pad so it visually fills the remaining space
              right: 'calc(var(--side-margin) - var(--content-right-pad))',
              width: 'var(--side-width)',
              opacity: 0.9,
              transform: 'scale(1)',
              zIndex: 5
            }}
          >
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat rounded-lg shadow-xl"
              style={{ backgroundImage: `url(${heroSlides[(currentSlide + 1) % heroSlides.length].image})` }}
            >
              <div className="absolute inset-0 bg-black/30 rounded-lg"></div>
            </div>
          </div>

          {/* Main Center Images */}
          {heroSlides.map((slide, index) => {
            const total = heroSlides.length
            // Base delta mod N from current
            const delta = (index - currentSlide + total) % total
            // Direction-aware positioning
            // - next: immediate next (delta=1) sits right; others left
            // - prev: immediate previous (delta=total-1) sits left; others right
            const position = delta === 0
              ? 'center'
              : navDir === 'prev'
                ? (delta === total - 1 ? 'left' : 'right')
                : (delta === 1 ? 'right' : 'left')
            const z = position === 'center' ? 12 : position === 'right' ? 11 : 9
            useEffect(() => {
              return () => {
                if (resumeRef.current) clearTimeout(resumeRef.current)
              }
            }, [])

            return (
              <div
                key={slide.id}
                className={`absolute transition-all duration-1000 ease-out transform ${
                  position === 'center'
                    ? 'translate-x-0 opacity-100 scale-100'
                    : position === 'left'
                      ? '-translate-x-full opacity-0 scale-95'
                      : 'translate-x-full opacity-0 scale-95'
                }`}
                style={{
                  top: 0,
                  bottom: 0,
                  left: 'calc(var(--side-width) + var(--center-gap) + var(--side-margin))',
                  // Compensate for extra right padding reserved for timer so gaps match
                  right: 'calc(var(--side-width) + var(--center-gap) + var(--side-margin) - var(--content-right-pad))',
                  zIndex: z
                }}
              >
              {/* Background Image - Width matches theater curve exactly */}
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                {/* Vertical overlay to emphasize horizontal stage, not a vertical stripe */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/70"></div>
              </div>

              {/* Content positioned to stay inside the non-overlapping screen area */}
              <div
                className="relative z-10 flex items-center justify-center h-full px-4 md:px-6"
                style={{ paddingTop: `${curveOverlap + 40}px`, paddingBottom: 'var(--bottom-overlap)' }}
              >
                <div className="max-w-5xl text-center">
                  {/* Two-line headline only, both in H2 size */}
                  <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight max-w-4xl mx-auto mb-2">
                    {slide.title}
                  </h2>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight">
                    {slide.subtitle}
                  </h2>
                </div>
              </div>

              {/* No per-slide timer */}
              </div>
            )
          })}
        </div>

        {/* Navigation Controls */}
        <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-20">
          <button 
            onClick={prevSlide}
            className="p-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-full text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-20">
          <button 
            onClick={nextSlide}
            className="p-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-full text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
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

        {/* Bottom Semicircle overlay - mirrors the top navbar curve to complete theater view */}
    <div className="absolute w-full pointer-events-none" style={{ zIndex: 45, height: '0px', bottom: '0px' }}>
          <div 
            className="absolute"
            style={{
      width: 'calc(100% - 4px)', // Match exact dimensions with top semicircle
              height: 'var(--bottom-curve-h)', // Slightly shallower curve at bottom for openness
              borderRadius: '50% 50% 0px 0px', // Create upward facing curve (opposite of navbar)
      background: 'rgba(17, 17, 17, 1)', // Dark background
              bottom: 'calc(var(--bottom-overlap) - var(--bottom-curve-h))', // Use bottom curve height for positioning
              left: '2px', // Exact same left alignment as navbar semicircle
            }}
          >
          </div>
        </div>

        {/* Global timer above the bottom semicircle, anchored to the inner right edge */}
        <div
          className="absolute pointer-events-auto"
          style={{
            zIndex: 1000,
            right: TIMER_RIGHT_INSET,
            bottom: TIMER_BOTTOM_INSET,
          }}
        >
          {loadingLaunch ? (
            <div className="flex items-center justify-center w-full h-full">
              <span className="animate-pulse text-white text-lg">Loading timer…</span>
            </div>
          ) : (
            <CountdownTimer
              endTime={timerEnd}
              startTime={launchTime}
              width={TIMER_W}
              height={TIMER_H}
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
