import React, { useState } from 'react'

const Waitlist = () => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    location: ''
  });

  // Show the first available SVG; otherwise use the fallback photo
  const [displayedSrc, setDisplayedSrc] = useState(null);
  const [showConsole, setShowConsole] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData, sessionId: getSessionId() };
    try {
      const res = await fetch("http://localhost:8080/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to submit");
      const data = await res.json();
      console.log("✅ Lead saved:", data);
      setShowConsole(true);
      setTimeout(() => setShowConsole(false), 3500);
      // Optionally clear form
      setFormData({ name: '', mobile: '', email: '', location: '' });
    } catch (err) {
      console.error("❌ Error submitting lead:", err);
      // Optionally show error message
    }
  }

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
      <section id="waitlist" className="py-20 px-6" style={{ scrollMarginTop: 'clamp(140px, 18vw, 260px)' }}>
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Circular media container */}
          <div className="relative flex items-center justify-center">
            <div
              className="mx-auto"
              style={{
                width: 'clamp(300px, 45vw, 560px)',
                height: 'clamp(300px, 45vw, 560px)',
                backgroundColor: 'var(--bg-color)'
              }}
            >
              <img
                src={displayedSrc || '/images/group-photo.jpg'}
                alt="Waitlist visual"
                className="w-full h-full object-cover block"
                style={{
                  WebkitMaskImage: 'radial-gradient(circle at 50% 50%, black 60%, rgba(0,0,0,0.7) 78%, transparent 92%)',
                  maskImage: 'radial-gradient(circle at 50% 50%, black 60%, rgba(0,0,0,0.7) 78%, transparent 92%)',
                  WebkitMaskRepeat: 'no-repeat',
                  maskRepeat: 'no-repeat',
                  WebkitMaskSize: '100% 100%',
                  maskSize: '100% 100%',
                  transform: 'scale(1.08)'
                }}
                onError={(e) => {
                  console.log('Image failed to load:', e.currentTarget.src)
                  // keep fallback attempts silent; if fallback fails, just hide
                  if (!displayedSrc) e.currentTarget.style.display = 'none'
                }}
              />
            </div>

            {/* Preload candidates and pick the first that loads */}
            <img
              src="/images/waitlist-1.svg"
              alt="preload 1"
              style={{ display: 'none' }}
              onLoad={(e) => {
                if (!displayedSrc) setDisplayedSrc(e.currentTarget.src)
              }}
            />
            <img
              src="/images/waitlist-2.svg"
              alt="preload 2"
              style={{ display: 'none' }}
              onLoad={(e) => {
                if (!displayedSrc) setDisplayedSrc(e.currentTarget.src)
              }}
            />
            <img
              src="/images/waitlist-3.svg"
              alt="preload 3"
              style={{ display: 'none' }}
              onLoad={(e) => {
                if (!displayedSrc) setDisplayedSrc(e.currentTarget.src)
              }}
            />
          </div>

          {/* Right side - Waitlist form */}
          <div>
            <div className="mb-8">
              <h2 
                className="mb-4 text-white font-bold"
                style={{
                  alignSelf: 'stretch',
                  fontFamily: '"Anek Latin", sans-serif',
                  fontSize: '64px',
                  fontWeight: 700,
                  lineHeight: '120%',
                  color: '#FFF'
                }}
              >
                Waitlist
              </h2>
              <div 
                className="text-textmid flex items-center"
                style={{
                  display: 'flex',
                  height: '48px',
                  padding: '8px 16px',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  alignSelf: 'stretch',
                  borderRadius: '8px',
                  border: '1px solid #8349FF'
                }}
              >
                <span>What you get by signing up for the waitlist</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none"
                  style={{
                    width: '24px',
                    height: '24px',
                    aspectRatio: '1/1'
                  }}
                >
                  <path d="M8.46976 5.03118C8.40008 4.9615 8.3448 4.87878 8.30709 4.78773C8.26938 4.69669 8.24997 4.5991 8.24997 4.50056C8.24997 4.40201 8.26938 4.30443 8.30709 4.21339C8.3448 4.12234 8.40008 4.03962 8.46976 3.96993C8.53944 3.90025 8.62217 3.84498 8.71321 3.80726C8.80426 3.76955 8.90184 3.75014 9.00039 3.75014C9.09893 3.75014 9.19651 3.76955 9.28756 3.80726C9.3786 3.84498 9.46133 3.90025 9.53101 3.96993L17.031 11.4699C17.1007 11.5396 17.1561 11.6223 17.1938 11.7134C17.2315 11.8044 17.251 11.902 17.251 12.0006C17.251 12.0991 17.2315 12.1967 17.1938 12.2878C17.1561 12.3788 17.1007 12.4615 17.031 12.5312L9.53101 20.0312C9.39028 20.1719 9.19941 20.251 9.00039 20.251C8.80136 20.251 8.61049 20.1719 8.46976 20.0312C8.32903 19.8905 8.24997 19.6996 8.24997 19.5006C8.24997 19.3015 8.32903 19.1107 8.46976 18.9699L15.4401 12.0006L8.46976 5.03118Z" fill="white"/>
                </svg>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
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
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter..."
                  className="w-full rounded-lg px-4 py-3 text-texthigh placeholder-textlow focus:outline-none focus:ring-2 focus:ring-primgreen/60"
                  style={{
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.20)',
                    backdropFilter: 'blur(50px)',
                    WebkitBackdropFilter: 'blur(50px)'
                  }}
                />
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
                  value={formData.mobile}
                  onChange={handleInputChange}
                  placeholder="Enter..."
                  className="w-full rounded-lg px-4 py-3 text-texthigh placeholder-textlow focus:outline-none focus:ring-2 focus:ring-primgreen/60"
                  style={{
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.20)',
                    backdropFilter: 'blur(50px)',
                    WebkitBackdropFilter: 'blur(50px)'
                  }}
                />
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
                <label className="block text-texthigh mb-2">Email address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter..."
                  className="w-full rounded-lg px-4 py-3 text-texthigh placeholder-textlow focus:outline-none focus:ring-2 focus:ring-primgreen/60"
                  style={{
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.20)',
                    backdropFilter: 'blur(50px)',
                    WebkitBackdropFilter: 'blur(50px)'
                  }}
                />
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
                <label className="block text-texthigh mb-2">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Enter..."
                  className="w-full rounded-lg px-4 py-3 text-texthigh placeholder-textlow focus:outline-none focus:ring-2 focus:ring-primgreen/60"
                  style={{
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.20)',
                    backdropFilter: 'blur(50px)',
                    WebkitBackdropFilter: 'blur(50px)'
                  }}
                />
              </div>

              <button
                type="submit"
                className="w-full text-black font-semibold hover:bg-gray-200 transition-colors"
                style={{
                  display: 'flex',
                  padding: '8px 16px',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '10px',
                  flex: '1 0 0',
                  borderRadius: '24px',
                  borderBottom: '2px solid #C1F546',
                  background: '#FFF'
                }}
              >
                Join now
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}

export default Waitlist
