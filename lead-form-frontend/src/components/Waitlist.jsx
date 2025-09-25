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
    const cleanedMobile = (formData.mobile || '').replace(/\D/g, '');
    // Name: required + alphabets and spaces only
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (!alphaSpace.test(formData.name.trim())) {
      newErrors.name = 'Name must contain only alphabets and spaces';
    }
    // Mobile: required, 10 digits, numeric
    if (!cleanedMobile) {
      newErrors.mobile = 'Mobile number is required';
    } else if (cleanedMobile.length !== 10) {
      newErrors.mobile = 'Mobile number must be exactly 10 digits';
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
      const res = await fetch(apiUrl('https://tandem.it.com/api/leads'), {
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
      setTimeout(() => setShowConsole(false), 3500);
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
      mobile: (formData.mobile || '').replace(/\D/g, '').slice(-10),
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
      mobile: (formData.mobile || '').replace(/\D/g, '').slice(-10),
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
        className="block sm:hidden py-10 xxs:py-12 xs:py-14 px-4 xxs:px-5 xs:px-6"
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
          className="pointer-events-none absolute inset-0 w-full h-full object-contain waitlist-bg-mobile"
          style={{ zIndex: 0 }}
        />
        {/* Gradient overlay for mobile */}
        <div 
          className="pointer-events-none absolute inset-0 w-full h-full"
          style={{ 
            zIndex: 1,
            background: 'linear-gradient(180deg, rgba(25,25,25,0.1) 0%, rgba(25,25,25,0.3) 40%, rgba(25,25,25,0.6) 80%, rgba(25,25,25,0.8) 100%)'
          }}
        />
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
              <div key={reward.title} className="flex items-start p-5" style={{
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.18)',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                height: '121px',
                minHeight: '121px',
                maxHeight: '121px',
                boxSizing: 'border-box',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  minWidth: '64px',
                  minHeight: '64px',
                  maxWidth: '64px',
                  maxHeight: '64px',
                  flex: '0 0 64px',
                  flexShrink: 0,
                  background: '#D9D9D9',
                  borderRadius: '8px',
                  marginRight: '24px'
                }} />
                <div>
                  <div style={{ color: '#8349FF', fontWeight: 700, fontSize: '1rem', lineHeight: '1.25', marginBottom: '2px' }}>{reward.title}</div>
                  <div style={{ color: '#fff', fontSize: '0.95rem', lineHeight: '1.35' }}>{reward.description}</div>
                </div>
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
            <form onSubmit={handleSubmit} className="space-y-5" autoComplete="on">
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
                className="w-full font-semibold waitlist-join-btn"
                style={{ display: 'flex', padding: '10px 16px', justifyContent: 'center', alignItems: 'center', gap: '10px', borderRadius: '24px', borderBottom: '2px solid #C1F546' }}
                disabled={submitting}
                onTouchStart={(e) => e.currentTarget.classList.add('is-pressed')}
                onTouchEnd={(e) => e.currentTarget.classList.remove('is-pressed')}
                onTouchCancel={(e) => e.currentTarget.classList.remove('is-pressed')}
                onMouseDown={(e) => e.currentTarget.classList.add('is-pressed')}
                onMouseUp={(e) => e.currentTarget.classList.remove('is-pressed')}
                onMouseLeave={(e) => e.currentTarget.classList.remove('is-pressed')}
              >
                Join now
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Desktop & tablet layout — unchanged */}
  <section
        id="waitlist"
        className="hidden sm:block px-6 pt-20 md:pt-12 lg:pt-20 pb-20 md:-mt-40 lg:-mt-[180px]"
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
          className="pointer-events-none absolute inset-0 w-full h-full sm:object-contain sm:object-top md:object-cover md:object-top sm:waitlist-bg-sm"
          style={{ zIndex: 0 }}
        />
        {/* sm-only gradient overlay covering full height; hidden on md+ to avoid desktop tamper */}
        <div
          className="pointer-events-none hidden sm:block md:hidden absolute inset-0 w-full h-full"
          style={{
            zIndex: 1,
            background: 'linear-gradient(180deg, rgba(25,25,25,0.1) 0%, rgba(25,25,25,0.3) 40%, rgba(25,25,25,0.6) 80%, rgba(25,25,25,0.8) 100%)'
          }}
        />
        <div className="w-full flex justify-center" style={{ position: 'relative', zIndex: 1 }}>
          {/* Waitlist form only, image removed */}
          <div>
            {/* ...existing code... duplicated from original desktop view ... */}
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
                  maxWidth: '800px',
                  minHeight: '120px',
                  transition: 'all 0.5s',
                }}>
                  {rewards.slice(carouselPage * 2, carouselPage * 2 + 2).map((reward, idx) => (
                    <div key={reward.title} style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'flex-start',
                      background: 'rgba(255,255,255,0.07)',
                      borderRadius: '12px',
                      border: '1px solid rgba(255,255,255,0.18)',
                      padding: '24px 32px',
                      width: '328px',
                      height: '121px',
                      minWidth: '328px',
                      maxWidth: '328px',
                      minHeight: '121px',
                      maxHeight: '121px',
                      boxSizing: 'border-box',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: '64px',
                        height: '64px',
                        minWidth: '64px',
                        minHeight: '64px',
                        maxWidth: '64px',
                        maxHeight: '64px',
                        flex: '0 0 64px',
                        flexShrink: 0,
                        background: '#D9D9D9',
                        borderRadius: '8px',
                        marginRight: '24px',
                      }} />
                      <div>
                        <div style={{
                          color: '#8349FF',
                          fontWeight: 700,
                          fontSize: '1rem',
                          lineHeight: '1.25',
                          marginBottom: '2px',
                        }}>
                          {reward.title}
                        </div>
                        <div style={{
                          color: '#fff',
                          fontSize: '0.95rem',
                          lineHeight: '1.35',
                          fontWeight: 400,
                        }}>
                          {reward.description}
                        </div>
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
              <form onSubmit={handleSubmit} className="space-y-6" autoComplete="on">
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
                  className="w-full font-semibold waitlist-join-btn"
                  style={{
                    display: 'flex',
                    padding: '8px 16px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '10px',
                    flex: '1 0 0',
                    borderRadius: '24px',
                    borderBottom: '2px solid #C1F546',
                    transition: 'background 0.3s, color 0.3s'
                  }}
                  disabled={submitting}
                  onTouchStart={(e) => e.currentTarget.classList.add('is-pressed')}
                  onTouchEnd={(e) => e.currentTarget.classList.remove('is-pressed')}
                  onTouchCancel={(e) => e.currentTarget.classList.remove('is-pressed')}
                  onMouseDown={(e) => e.currentTarget.classList.add('is-pressed')}
                  onMouseUp={(e) => e.currentTarget.classList.remove('is-pressed')}
                  onMouseLeave={(e) => e.currentTarget.classList.remove('is-pressed')}
                >
                  Join now
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
