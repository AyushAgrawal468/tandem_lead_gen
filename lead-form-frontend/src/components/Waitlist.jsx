import React, { useState } from 'react'
import { apiUrl } from '../lib/api'
import WaitlistBg from '../assets/waitlist-background.svg'

const Waitlist = () => {

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: ''
  });
  const [errors, setErrors] = useState({});
  const [backendError, setBackendError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Show the first available SVG; otherwise use the fallback photo
  const [displayedSrc, setDisplayedSrc] = useState(null);
  const [showConsole, setShowConsole] = useState(false);
  // Duration (ms) for success banner visibility
  const SUCCESS_BANNER_MS = 4500;
  const [showBenefits, setShowBenefits] = useState(false);

  // Rewards data for carousel
  const rewards = [
    {
      title: 'Priority access',
      description: 'Early beta invites before the public launch',
    },
    {
      title: 'Invite credits',
      description: 'Extra invites so your whole crew can join instantly.',
    },
    {
      title: 'Exclusive badge',
      description: 'Get a special badge in the community.',
    },
    {
      title: 'Beta feedback',
      description: 'Help shape the product with direct feedback.',
    },
    {
      title: 'Priority support',
      description: 'Get faster responses from our support team.',
    },
    {
      title: 'Event invites',
      description: 'Access to exclusive beta events and webinars.',
    },
  ];

  // Carousel state
  const [carouselPage, setCarouselPage] = useState(0); // 0, 1, 2
  const [carouselPaused, setCarouselPaused] = useState(false);
  const autoIntervalRef = React.useRef(null);
  const resumeTimeoutRef = React.useRef(null);
  const touchStartXRef = React.useRef(0);
  const touchStartYRef = React.useRef(0);
  const touchActiveRef = React.useRef(false);

  // Auto-scroll effect with pause/resume support
  React.useEffect(() => {
    if (carouselPaused) {
      if (autoIntervalRef.current) clearInterval(autoIntervalRef.current);
      return;
    }
    autoIntervalRef.current = setInterval(() => {
      setCarouselPage((prev) => (prev + 1) % 3);
    }, 4000);
    return () => {
      if (autoIntervalRef.current) clearInterval(autoIntervalRef.current);
    };
  }, [carouselPaused]);

  // Cleanup timers on unmount
  React.useEffect(() => {
    return () => {
      if (autoIntervalRef.current) clearInterval(autoIntervalRef.current);
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    };
  }, []);

  const scheduleResume = (delay = 5000) => {
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => setCarouselPaused(false), delay);
  };

  const handleRewardsTouchStart = (e) => {
    if (e.touches && e.touches.length > 0) {
      touchStartXRef.current = e.touches[0].clientX;
      touchStartYRef.current = e.touches[0].clientY;
      touchActiveRef.current = true;
      setCarouselPaused(true);
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    }
  };

  const handleRewardsTouchEnd = (e) => {
    if (!touchActiveRef.current) {
      scheduleResume(2000);
      return;
    }
    const touch = e.changedTouches && e.changedTouches[0];
    if (touch) {
      const dx = touch.clientX - touchStartXRef.current;
      const dy = touch.clientY - touchStartYRef.current;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
        if (dx < 0) {
          // swipe left -> next
          setCarouselPage((prev) => (prev + 1) % 3);
        } else {
          // swipe right -> prev
          setCarouselPage((prev) => (prev + 2) % 3);
        }
      }
    }
    touchActiveRef.current = false;
    scheduleResume(2000);
  };

  const handleRewardsTouchCancel = () => {
    touchActiveRef.current = false;
    scheduleResume(2000);
  };

  const validate = () => {
    const newErrors = {};
    const alphaSpace = /^[A-Za-z ]+$/;
    
    // Name: required + alphabets and spaces only
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (!alphaSpace.test(formData.name.trim())) {
      newErrors.name = 'Name must contain only alphabets and spaces';
    }
    
    // Mobile validation: 10 digits or +91 followed by 10 digits
    const rawMobile = (formData.mobile || '').trim();
    if (!rawMobile) {
      newErrors.mobile = 'Mobile number is required';
    } else {
      const mobilePattern = /^(\+91[0-9]{10}|[0-9]{10})$/;
      if (!mobilePattern.test(rawMobile)) {
        newErrors.mobile = 'Mobile number must be 10 digits or start with +91 followed by 10 digits';
      }
    }
    
    // Email: required, valid format
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,})$/.test(formData.email)) {
      newErrors.email = 'Email should be valid (e.g. user@example.com)';
    }
    // Location removed
    return newErrors;
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setErrors({ ...errors, [e.target.name]: undefined });
    setBackendError('');
  }

  const getSessionId = () => {
    // Try to get sessionId from localStorage, or generate a new one
    let sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
      localStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
  };

  const submitLead = async (payload) => {
    setSubmitting(true);
    try {
      const res = await fetch(apiUrl('/api/leads'), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        // Read response safely, but never show to user
        const ct = res.headers.get('content-type') || '';
        let serverBody = '';
        try {
          if (ct.includes('application/json')) {
            const j = await res.json();
            serverBody = JSON.stringify(j);
          } else {
            serverBody = await res.text();
          }
        } catch (_) {}
        console.error("/api/leads failed:", res.status, serverBody);
        const friendly = res.status >= 500
          ? 'Something went wrong on our side. Please try again in a moment.'
          : 'We could not submit your signup. Please check your details and try again.';
        setBackendError(friendly);
        return;
      }
      const data = await res.json();
      console.log("✅ Lead saved:", data);
  setShowConsole(true);
  setTimeout(() => setShowConsole(false), SUCCESS_BANNER_MS);
  setFormData({ name: '', mobile: '', email: '' });
      setErrors({});
      setBackendError('');
    } catch (err) {
      setBackendError("Network error. Please try again in a moment.");
      console.error("❌ Error submitting lead:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBackendError('');
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    const payload = { 
      ...formData, 
      mobile: formData.mobile.trim(), // Keep the mobile number as entered (with or without +91)
      sessionId: getSessionId() 
    };
    await submitLead(payload);
  }

  const handleRetry = async () => {
    setBackendError('');
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    const payload = { 
      ...formData, 
      mobile: formData.mobile.trim(), // Keep the mobile number as entered (with or without +91)
      sessionId: getSessionId() 
    };
    await submitLead(payload);
  };

  return (
    <>
      {showConsole && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 9999,
          background: '#23243a',
          color: '#fff',
          textAlign: 'center',
          padding: '16px',
          fontWeight: 'bold',
          fontSize: '1.1rem',
          boxShadow: '0 2px 12px rgba(0,0,0,0.15)'
        }}>
          Thanks for registering!
        </div>
      )}

      {/* Mobile-only layout: stacked rewards + form */}
  <section
    id="waitlist"
    className="block md:hidden py-10 xxs:py-12 xs:py-14 px-4"
        style={{
          scrollMarginTop: '-13vh',
          borderRadius: '0px',
          backgroundColor: '#191919',
          position: 'relative',
        }}
      >
        {/* Removed mobile SVG image to eliminate previous top-only gradient; now using pure CSS gradient below */}
        <div aria-hidden className="absolute inset-0" style={{ zIndex: 0, background: '#191919' }} />
        {/* Full-height mobile gradient overlay to replicate Figma green (top) -> purple (bottom) glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            zIndex: 1,
            background: `linear-gradient(180deg, rgba(202,255,77,0.18) 0%, rgba(202,255,77,0.12) 8%, rgba(25,25,25,0) 38%, rgba(131,73,255,0.06) 62%, rgba(131,73,255,0.12) 80%, rgba(131,73,255,0.16) 100%)`
          }}
        />
        {/* SVG background shows naturally without overlay */}
        <div className="w-full max-w-xl mx-auto" style={{ position: 'relative', zIndex: 2 }}>
          <h2 className="text-white font-bold text-[34px] xxs:text-[38px] xs:text-4xl text-center" style={{ fontFamily: 'Anek Latin, sans-serif', lineHeight: '120%' }}>Waitlist</h2>
          <div className="mt-1 xxs:mt-2 text-center text-white/90 text-base xxs:text-lg">Signup to get exclusive rewards</div>

          {/* Rewards (two cards stacked) with swipe support */}
          <div
            className="mt-6 space-y-4"
            onTouchStart={handleRewardsTouchStart}
            onTouchEnd={handleRewardsTouchEnd}
            onTouchCancel={handleRewardsTouchCancel}
          >
            {rewards.slice(carouselPage * 2, carouselPage * 2 + 2).map((reward) => (
              <div
                key={reward.title}
                className="p-5"
                style={{
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.18)',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  boxSizing: 'border-box',
                  paddingRight: '60px',
                }}
              >
                <div style={{ color: 'rgba(146, 95, 255, 1)', fontWeight: 700, fontSize: '1rem', lineHeight: '1.3', marginBottom: '4px' }}>{reward.title}</div>
                <div style={{ color: '#fff', fontSize: '0.95rem', lineHeight: '1.4', fontWeight: 400 }}>{reward.description}</div>
              </div>
            ))}
            {/* Dots */}
            <div className="flex items-center justify-center space-x-2 pt-1">
              {[0,1,2].map(i => (
                <span key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: carouselPage === i ? '#fff' : 'rgba(255,255,255,0.3)' }} />
              ))}
            </div>
          </div>

          {/* Signup card */}
          <div className="mt-6" style={{ border: '1.5px solid rgba(255,255,255,0.18)', borderRadius: '12px', background: 'rgba(255,255,255,0.04)', boxShadow: '0 2px 8px rgba(193,245,70,0.08)', padding: '20px' }}>
            <form onSubmit={handleSubmit} className="space-y-5" autoComplete="on" noValidate>
              <h3
                style={{
                  color: '#FFF',
                  fontFamily: '"Anek Latin"',
                  fontSize: '28px',
                  fontStyle: 'normal',
                  fontWeight: 700,
                  lineHeight: '150%',
                  marginBottom: '8px'
                }}
              >
                Signup
              </h3>
              {backendError && (
                <div style={{ color: '#FF4D4F', marginBottom: '12px', fontWeight: 500, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <span>{backendError}</span>
                  <button
                    type="button"
                    onClick={handleRetry}
                    disabled={submitting}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#fff',
                      textDecoration: 'underline',
                      cursor: submitting ? 'not-allowed' : 'pointer',
                      opacity: submitting ? 0.7 : 1
                    }}
                  >
                    {submitting ? 'Retrying…' : 'Try again'}
                  </button>
                </div>
              )}
              <div>
                <label className="block text-texthigh mb-2">Name</label>
                <input type="text" name="name" autoComplete="name" value={formData.name} onChange={handleInputChange} placeholder="Enter your name" className="w-full rounded-lg px-4 py-3 text-texthigh placeholder-textlow focus:outline-none focus:ring-2 focus:ring-primgreen/60" style={{ background: 'rgba(255,255,255,0.20)', borderRadius: '8px', backdropFilter: 'blur(50px)', WebkitBackdropFilter: 'blur(50px)' }} />
                {errors.name && (<span style={{ color: '#FF4D4F', fontSize: '0.95rem' }}>{errors.name}</span>)}
              </div>
              <div>
                <label className="block text-texthigh mb-2">Mobile number</label>
                <input type="tel" name="mobile" autoComplete="tel" inputMode="tel" value={formData.mobile} onChange={handleInputChange} placeholder="Enter mobile number" className="w-full rounded-lg px-4 py-3 text-texthigh placeholder-textlow focus:outline-none focus:ring-2 focus:ring-primgreen/60" style={{ background: 'rgba(255,255,255,0.20)', borderRadius: '8px', backdropFilter: 'blur(50px)', WebkitBackdropFilter: 'blur(50px)' }} />
                {errors.mobile && (<span style={{ color: '#FF4D4F', fontSize: '0.95rem' }}>{errors.mobile}</span>)}
              </div>
              <div>
                <label htmlFor="waitlist-email-mobile" className="block text-texthigh mb-2">Email address</label>
                <input
                  id="waitlist-email-mobile"
                  type="email"
                  name="email"
                  autoComplete="email"
                  inputMode="email"
                  autoCapitalize="off"
                  autoCorrect="off"
                  spellCheck={false}
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                  className="w-full rounded-lg px-4 py-3 text-texthigh placeholder-textlow focus:outline-none focus:ring-2 focus:ring-primgreen/60"
                  style={{ background: 'rgba(255,255,255,0.20)', borderRadius: '8px', backdropFilter: 'blur(50px)', WebkitBackdropFilter: 'blur(50px)' }}
                />
                {errors.email && (<span style={{ color: '#FF4D4F', fontSize: '0.95rem' }}>{errors.email}</span>)}
              </div>
              
              <button
                type="submit"
                className="w-full font-bold waitlist-join-btn flex justify-center items-center text-black hover:bg-gray-50 hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer shadow-lg hover:shadow-xl bg-white relative overflow-hidden whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ padding: '10px 16px', borderRadius: '24px' }}
                disabled={submitting}
                onTouchStart={(e) => e.currentTarget.classList.add('is-pressed')}
                onTouchEnd={(e) => e.currentTarget.classList.remove('is-pressed')}
                onTouchCancel={(e) => e.currentTarget.classList.remove('is-pressed')}
                onMouseDown={(e) => e.currentTarget.classList.add('is-pressed')}
                onMouseUp={(e) => e.currentTarget.classList.remove('is-pressed')}
                onMouseLeave={(e) => e.currentTarget.classList.remove('is-pressed')}
              >
                <span className="font-bold tracking-[0]" style={{ fontSize: '16px', lineHeight: 1.6 }}>Join now</span>
                <div
                  className="absolute bottom-0 left-0 right-0 h-[3px]"
                  style={{
                    background: 'linear-gradient(90deg, rgba(193, 245, 70, 1) 0%, rgba(0, 255, 200, 1) 50%, rgba(131, 73, 255, 1) 100%)',
                    borderRadius: '0 0 24px 24px'
                  }}
                ></div>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Desktop & tablet layout (md and up) */}
      <section
        id="waitlist"
        className="hidden md:block px-6 pt-20 md:pt-12 lg:pt-20 pb-20 md:-mt-40 lg:-mt-[180px]"
        style={{
          scrollMarginTop: '-13vh',
          borderRadius: '0px',
          backgroundColor: '#191919',
          position: 'relative',
        }}
      >
        {/* Exact SVG as contained background via img */}
        <img
          src={WaitlistBg}
          alt=""
          aria-hidden
          // For small screens (sm) use object-cover to fill full height; md+ already uses object-cover, so desktop unchanged.
          className="pointer-events-none absolute inset-0 w-full h-full sm:object-cover sm:object-top md:object-cover md:object-top sm:waitlist-bg-sm"
          style={{ zIndex: 0, objectPosition: 'top center' }}
        />
        {/* SVG background shows naturally on sm without overlay */}
        <div className="w-full flex justify-center" style={{ position: 'relative', zIndex: 2 }}>
          {/* Waitlist form only, image removed */}
          <div>
            <div className="mb-8">
              <h2 
                className="mb-2 text-white font-bold"
                style={{
                  alignSelf: 'stretch',
                  fontFamily: '"Anek Latin", sans-serif',
                  fontSize: '64px',
                  fontWeight: 700,
                  lineHeight: '120%',
                  color: '#FFF',
                  textAlign: 'center'
                }}
              >
                Waitlist
              </h2>
              <div
                style={{
                  color: '#fff',
                  fontSize: '2rem',
                  fontWeight: 500,
                  textAlign: 'center',
                  marginBottom: '32px',
                  fontFamily: 'inherit'
                }}
              >
                Signup to get exclusive rewards
              </div>
              {/* Rewards carousel section */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginBottom: '40px',
              }}>
                <div 
                  onTouchStart={handleRewardsTouchStart}
                  onTouchEnd={handleRewardsTouchEnd}
                  onTouchCancel={handleRewardsTouchCancel}
                  style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '32px',
                  width: '100%',
                  // Match outer width of signup box (480px) for aligned left/right edges
                  maxWidth: '480px',
                  minHeight: '120px',
                  transition: 'all 0.5s',
                }}>
                  {rewards.slice(carouselPage * 2, carouselPage * 2 + 2).map((reward) => (
                    <div
                      key={reward.title}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        background: 'rgba(255,255,255,0.07)',
                        borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.18)',
                        // Horizontal padding aligned to signup box (24px)
                        padding: '24px 24px',
                        // Each card occupies half of container minus gap for perfect edge alignment
                        width: 'calc((100% - 32px)/2)',
                        minWidth: 'calc((100% - 32px)/2)',
                        maxWidth: 'calc((100% - 32px)/2)',
                        boxSizing: 'border-box',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                      }}
                    >
                      <div style={{
                        color: '#8349FF',
                        fontWeight: 700,
                        fontSize: '1rem',
                        lineHeight: '1.3',
                        marginBottom: '6px'
                      }}>
                        {reward.title}
                      </div>
                      <div style={{
                        color: '#fff',
                        fontSize: '0.95rem',
                        lineHeight: '1.4',
                        fontWeight: 400
                      }}>
                        {reward.description}
                      </div>
                    </div>
                  ))}
                </div>
                {/* Carousel dots */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '8px',
                  marginTop: '18px',
                }}>
                  {[0,1,2].map((i) => (
                    <span key={i} style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: carouselPage === i ? '#fff' : 'rgba(255,255,255,0.3)',
                      display: 'inline-block',
                      transition: 'background 0.3s',
                    }} />
                  ))}
                </div>
              </div>
            </div>

            <div style={{ border: '1.5px solid rgba(255,255,255,0.18)', borderRadius: '12px', background: 'rgba(255,255,255,0.04)', boxShadow: '0 2px 8px rgba(193,245,70,0.08)', padding: '32px 24px', maxWidth: '480px', margin: '0 auto' }}>
              <form onSubmit={handleSubmit} className="space-y-6" autoComplete="on" noValidate>
                {/* Signup heading */}
                <h2 style={{
                  color: '#FFF',
                  fontFamily: '"Anek Latin"',
                  fontSize: '32px',
                  fontStyle: 'normal',
                  fontWeight: 700,
                  lineHeight: '150%',
                  marginBottom: '12px',
                  textAlign: 'left'
                }}>Signup</h2>
                {backendError && (
                  <div style={{ color: '#FF4D4F', marginBottom: '12px', fontWeight: 500, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <span>{backendError}</span>
                    <button
                      type="button"
                      onClick={handleRetry}
                      disabled={submitting}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#fff',
                        textDecoration: 'underline',
                        cursor: submitting ? 'not-allowed' : 'pointer',
                        opacity: submitting ? 0.7 : 1
                      }}
                    >
                      {submitting ? 'Retrying…' : 'Try again'}
                    </button>
                  </div>
                )}
                <div 
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '8px',
                    alignSelf: 'stretch'
                  }}
                >
                  <label className="block text-texthigh mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    autoComplete="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                    className="w-full rounded-lg px-4 py-3 text-texthigh placeholder-textlow focus:outline-none focus:ring-2 focus:ring-primgreen/60"
                    style={{
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.20)',
                      backdropFilter: 'blur(50px)',
                      WebkitBackdropFilter: 'blur(50px)'
                    }}
                  />
                  {errors.name && (
                    <span style={{ color: '#FF4D4F', fontSize: '0.95rem', marginTop: '2px' }}>{errors.name}</span>
                  )}
                </div>

                <div 
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '8px',
                    alignSelf: 'stretch'
                  }}
                >
                  <label className="block text-texthigh mb-2">Mobile number</label>
                  <input
                    type="tel"
                    name="mobile"
                    autoComplete="tel"
                    inputMode="tel"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    placeholder="Enter mobile number"
                    className="w-full rounded-lg px-4 py-3 text-texthigh placeholder-textlow focus:outline-none focus:ring-2 focus:ring-primgreen/60"
                    style={{
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.20)',
                      backdropFilter: 'blur(50px)',
                      WebkitBackdropFilter: 'blur(50px)'
                    }}
                  />
                  {errors.mobile && (
                    <span style={{ color: '#FF4D4F', fontSize: '0.95rem', marginTop: '2px' }}>{errors.mobile}</span>
                  )}
                </div>

                <div 
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '8px',
                    alignSelf: 'stretch'
                  }}
                >
                  <label htmlFor="waitlist-email-desktop" className="block text-texthigh mb-2">Email address</label>
                  <input
                    id="waitlist-email-desktop"
                    type="email"
                    name="email"
                    autoComplete="email"
                    inputMode="email"
                    autoCapitalize="off"
                    autoCorrect="off"
                    spellCheck={false}
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email address"
                    className="w-full rounded-lg px-4 py-3 text-texthigh placeholder-textlow focus:outline-none focus:ring-2 focus:ring-primgreen/60"
                    style={{
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.20)',
                      backdropFilter: 'blur(50px)',
                      WebkitBackdropFilter: 'blur(50px)'
                    }}
                  />
                  {errors.email && (
                    <span style={{ color: '#FF4D4F', fontSize: '0.95rem', marginTop: '2px' }}>{errors.email}</span>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full font-bold waitlist-join-btn flex justify-center items-center text-black hover:bg-gray-50 hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer shadow-lg hover:shadow-xl bg-white relative overflow-hidden whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{
                    padding: '8px 16px',
                    borderRadius: '24px',
                    flex: '1 0 0'
                  }}
                  disabled={submitting}
                  onTouchStart={(e) => e.currentTarget.classList.add('is-pressed')}
                  onTouchEnd={(e) => e.currentTarget.classList.remove('is-pressed')}
                  onTouchCancel={(e) => e.currentTarget.classList.remove('is-pressed')}
                  onMouseDown={(e) => e.currentTarget.classList.add('is-pressed')}
                  onMouseUp={(e) => e.currentTarget.classList.remove('is-pressed')}
                  onMouseLeave={(e) => e.currentTarget.classList.remove('is-pressed')}
                >
                  <span className="font-bold tracking-[0]" style={{ fontSize: '16px', lineHeight: 1.6 }}>Join now</span>
                  <div
                    className="absolute bottom-0 left-0 right-0 h-[3px]"
                    style={{
                      background: 'linear-gradient(90deg, rgba(193, 245, 70, 1) 0%, rgba(0, 255, 200, 1) 50%, rgba(131, 73, 255, 1) 100%)',
                      borderRadius: '0 0 24px 24px'
                    }}
                  ></div>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

    </>
  )
}

export default Waitlist
