import React, { useEffect, useRef, useState } from 'react'


const Blog = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [expandedId, setExpandedId] = useState(null)
  const [isExiting, setIsExiting] = useState(false)
  const closeTimeoutRef = useRef(null)
  
  const blogPosts = [
    {
      id: 1,
      title: "The Loneliness Pandemic— How the World Became Lonely",
      excerpt: "Introduction In 2024, the World Health Organisation (WHO) recognised loneliness as a global public health concern, highlighting its significant impact on individuals across all...",
      content: "Introduction In 2024, the World Health Organisation (WHO) recognised loneliness as a global public health concern, highlighting its significant impact on individuals across all ages and backgrounds. The rise of remote work, digital communication, and urbanization has contributed to a sense of isolation for many. Experts warn that chronic loneliness can lead to serious health issues, including depression, anxiety, and even cardiovascular disease. Addressing this pandemic requires a multifaceted approach, including community-building initiatives, mental health support, and policy changes.",
      readMore: "Read more"
    },
    {
      id: 2,
      title: "Building Authentic Connections in the Digital Age", 
      excerpt: "As technology continues to reshape how we interact, finding genuine connections becomes both easier and more challenging. Discover strategies for meaningful relationships in our hyperconnected world...",
      content: "As technology continues to reshape how we interact, finding genuine connections becomes both easier and more challenging. Social media platforms offer opportunities to meet new people, but they can also foster superficial relationships. To build authentic connections, prioritize face-to-face interactions, practice active listening, and be vulnerable. Join interest-based groups, attend local events, and make time for meaningful conversations. Remember, quality matters more than quantity when it comes to relationships.",
      readMore: "Read more"
    },
    {
      id: 3,
      title: "The Science Behind Social Chemistry",
      excerpt: "What makes some friendships click instantly while others never quite gel? Recent research reveals the fascinating psychology and neuroscience behind human social bonds and compatibility...",
      content: "What makes some friendships click instantly while others never quite gel? Recent research reveals the fascinating psychology and neuroscience behind human social bonds and compatibility. Factors such as shared values, mutual interests, and emotional intelligence play a crucial role. Oxytocin, the 'bonding hormone,' is released during positive social interactions, strengthening connections. Understanding these dynamics can help you cultivate deeper, more fulfilling relationships.",
      readMore: "Read more"
    },
    {
      id: 4,
      title: "From Strangers to Squad: Building Your Tribe",
      excerpt: "Moving to a new city or life phase? Learn practical strategies for finding your people and building a supportive social network from scratch, no matter your age or circumstances...",
      content: "Moving to a new city or life phase? Learn practical strategies for finding your people and building a supportive social network from scratch, no matter your age or circumstances. Start by attending community events, volunteering, or joining clubs. Be proactive in reaching out and following up with new acquaintances. Building a tribe takes time and effort, but the rewards of belonging and support are invaluable.",
      readMore: "Read more"
    },
    {
      id: 5,
      title: "The Art of Spontaneous Adventures",
      excerpt: "Why planned hangouts sometimes fall flat while spontaneous meetups create the best memories. Explore how embracing uncertainty can lead to deeper friendships and unforgettable experiences...",
      content: "Why planned hangouts sometimes fall flat while spontaneous meetups create the best memories. Explore how embracing uncertainty can lead to deeper friendships and unforgettable experiences. Spontaneity encourages creativity, breaks routine, and fosters genuine connections. Next time you feel bored or disconnected, invite a friend for an impromptu adventure—you might be surprised by the results.",
      readMore: "Read more"
    }
  ]

  const handleCloseOverlay = () => {
    if (!expandedId) return
    setIsExiting(true)
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
    // Match CSS exit duration (~600ms)
    closeTimeoutRef.current = setTimeout(() => {
      setIsExiting(false)
      setExpandedId(null)
      closeTimeoutRef.current = null
    }, 640)
  }

  const openOverlay = (id) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
    setIsExiting(false)
    setExpandedId(id)
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, blogPosts.length - 1));
    if (expandedId) handleCloseOverlay()
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.max(1, blogPosts.length - 1)) % Math.max(1, blogPosts.length - 1));
    if (expandedId) handleCloseOverlay()
  }

  const visiblePosts = blogPosts.slice(currentIndex, currentIndex + 2)
  const mobilePost = blogPosts[currentIndex % blogPosts.length]
  const expandedPost = expandedId ? blogPosts.find(p => p.id === expandedId) : null

  // Close overlay on ESC
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') handleCloseOverlay() }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
    }
  }, [expandedId])

  return (
    <>
      {/* Mobile-only layout */}
  <section id="blogs" className="block sm:hidden py-10 xxs:py-12 xs:py-14 px-4 xxs:px-5 xs:px-6 relative">
        <h2 className="text-[34px] xxs:text-[38px] xs:text-[42px] font-bold text-texthigh mb-5">Blogs</h2>
        <div
          className="rounded-2xl p-6"
          style={{
            background: 'rgba(255, 255, 255, 0.10)',
            backdropFilter: 'blur(50px)',
            WebkitBackdropFilter: 'blur(50px)'
          }}
        >
          <div className="mb-6" style={{ width: '32px', height: '49px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="49" viewBox="0 0 32 49" fill="none">
              <path d="M18.1064 0.500002C20.0167 0.49678 19.1154 4.80352 18.5043 7.49641C19.6536 7.08467 20.7999 6.68403 21.969 6.28391C23.173 5.9004 24.3768 5.45281 25.5099 5.06943C26.3598 4.75012 27.2812 4.49422 28.2734 4.55589C29.9743 4.61646 31.3942 5.88483 31.468 7.47316C31.541 8.6802 30.6924 9.88937 29.3471 10.4637C26.1604 11.7407 22.9731 12.827 19.7862 13.9768C19.078 14.2322 18.4407 14.5515 17.7324 14.7434C17.4491 14.871 17.3079 15.0618 17.2375 15.316C16.5864 17.2739 15.9774 19.2319 15.4427 21.1898C12.2491 30.9172 9.08493 44.3348 16.0588 42.9441C16.3047 42.925 16.5496 42.8963 16.7921 42.8563C17.5449 42.8389 19.2399 42.0547 19.7648 41.7932C19.917 41.9697 19.8378 42.4035 19.8418 42.6241C19.8563 43.5757 19.7646 44.5259 19.6447 45.471L19.6418 45.4948C19.5987 45.8414 19.5458 46.257 19.3514 46.5832L19.3284 46.5948C15.1854 48.5883 11.8409 48.2232 9.68895 47.464C8.19845 46.9381 7.07609 45.6803 6.74309 44.125C6.01316 40.7145 6.54154 35.7156 7.5476 30.7294C8.14797 27.7541 8.91883 24.7845 9.69204 22.1612C10.1476 20.7096 10.6643 19.2575 11.2178 17.8056C11.2882 17.615 11.2883 17.4244 11.3587 17.2337C11.146 17.1707 10.9333 17.2983 10.7916 17.362C10.0129 17.7448 9.16294 18.1275 8.31339 18.5739C7.39295 19.0205 6.54321 19.5302 5.62282 19.9767C5.33963 20.1044 5.12719 20.2954 4.98582 20.4863C3.99596 21.8224 -0.4688 21.3861 0.730252 18.461C1.22468 17.5706 2.07385 17.0603 2.92317 16.4869C3.34776 16.232 3.63116 15.9771 3.70107 15.4055C3.77028 14.5158 4.33579 13.8156 5.185 13.2421C6.95459 12.0951 8.79597 11.2651 10.7789 10.4988C11.5733 10.1706 12.3678 9.85627 13.1622 9.54283C14.2287 2.85551 15.7993 0.504393 18.1064 0.500002Z" fill="#925FFF"/>
              <path d="M5.30089 38.7249C5.37553 30.2887 8.50906 21.2121 10.0665 17.7284L12.4955 15.4688L8.57123 44.7507H16.5132L20.3441 41.6437L19.69 45.8806C17.8961 47.6883 13.461 47.952 11.4678 47.8578C5.78689 47.8578 4.98948 41.7692 5.30089 38.7249Z" fill="#925FFF"/>
              <path d="M20.0127 40.0309C15.1369 41.9996 13.0537 39.8725 13.0537 37.0736L9.33184 36.7656L8.93066 44.1324L9.48284 47.5461C12.3818 48.7808 16.9058 48.1627 19.3446 47.5512C19.7511 47.4493 20.0401 47.0945 20.0821 46.6744L20.7274 40.2196C20.7525 39.9689 20.4933 39.7888 20.2696 39.9015L20.0127 40.0309Z" fill="#925FFF"/>
              <path d="M17.5742 0.544071C13.8902 1.26899 12.3285 7.00412 11.8691 10.1516L17.1701 8.79409L18.4013 2.14096C18.6769 0.752393 17.9647 0.497798 17.5742 0.544071Z" fill="#925FFF"/>
              <path d="M19.6597 41.5366C18.9618 42.1335 17.0983 42.7425 15.6855 43.033L16.0831 47.7511C16.7346 47.6914 18.0077 47.2872 18.912 46.9603C19.3834 46.7898 19.7061 46.3594 19.7657 45.8582L20.0349 43.593C20.3277 41.3198 19.9068 41.2749 19.6597 41.5366Z" fill="#925FFF"/>
            </svg>
          </div>

          <h3 className="text-2xl font-bold text-texthigh mb-4 leading-tight">
            {mobilePost.title}
          </h3>

          <p className="text-textmid mb-6 leading-relaxed">
            {mobilePost.excerpt}
          </p>

          <button
            className="font-bold hover:opacity-80 transition-opacity cursor-pointer"
            style={{
              color: '#00FFC8',
              fontFamily: '"Anek Latin", sans-serif',
              fontSize: '18px',
              fontWeight: 700,
              lineHeight: '150%',
              background: 'none',
              border: 'none',
              padding: 0,
              outline: 'none'
            }}
            onClick={() => openOverlay(mobilePost.id)}
          >
            {mobilePost.readMore}
          </button>
        </div>

        {/* Centered navigation buttons under the card */}
        <div className="flex items-center justify-center space-x-6 mt-6">
          <button
            onClick={prevSlide}
            className="relative flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white active:ring-2 active:ring-white active:outline-none"
            style={{
              width: '48px',
              height: '48px',
              flexShrink: 0,
              aspectRatio: '1/1',
              backgroundColor: 'rgba(60, 60, 60, 1)',
              borderRadius: '50%',
              outline: 'none',
              WebkitTapHighlightColor: 'transparent',
              appearance: 'none',
              border: 'none'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 48 48" fill="none">
              <path d="M31.0605 37.9386C31.1998 38.078 31.3104 38.2434 31.3858 38.4255C31.4612 38.6076 31.5001 38.8028 31.5001 38.9999C31.5001 39.197 31.4612 39.3921 31.3858 39.5742C31.3104 39.7563 31.1998 39.9217 31.0605 40.0611C30.9211 40.2005 30.7557 40.311 30.5736 40.3865C30.3915 40.4619 30.1963 40.5007 29.9992 40.5007C29.8021 40.5007 29.607 40.4619 29.4249 40.3865C29.2428 40.311 29.0773 40.2005 28.938 40.0611L13.938 25.0611C13.7985 24.9218 13.6879 24.7564 13.6124 24.5743C13.5369 24.3922 13.498 24.197 13.498 23.9999C13.498 23.8027 13.5369 23.6075 13.6124 23.4255C13.6879 23.2434 13.7985 23.0779 13.938 22.9386L28.938 7.9386C29.2194 7.65714 29.6012 7.49902 29.9992 7.49902C30.3973 7.49902 30.779 7.65714 31.0605 7.9386C31.3419 8.22007 31.5001 8.60181 31.5001 8.99985C31.5001 9.3979 31.3419 9.77964 31.0605 10.0611L17.1199 23.9999L31.0605 37.9386Z" fill="white"/>
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="relative flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white active:ring-2 active:ring-white active:outline-none"
            style={{
              width: '48px',
              height: '48px',
              flexShrink: 0,
              aspectRatio: '1/1',
              backgroundColor: 'rgba(60, 60, 60, 1)',
              borderRadius: '50%',
              outline: 'none',
              WebkitTapHighlightColor: 'transparent',
              appearance: 'none',
              border: 'none'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 48 48" fill="none">
              <path d="M16.9395 10.0614C16.8002 9.92203 16.6896 9.75657 16.6142 9.57449C16.5388 9.39239 16.4999 9.19723 16.4999 9.00014C16.4999 8.80305 16.5388 8.60789 16.6142 8.42579C16.6896 8.24371 16.8002 8.07826 16.9395 7.93889C17.0789 7.79952 17.2443 7.68897 17.4264 7.61355C17.6085 7.53813 17.8037 7.4993 18.0008 7.4993C18.1979 7.4993 18.393 7.53813 18.5751 7.61355C18.7572 7.68897 18.9227 7.79952 19.062 7.93889L34.062 22.9389C34.2015 23.0782 34.3121 23.2436 34.3876 23.4257C34.4631 23.6078 34.502 23.803 34.502 24.0001C34.502 24.1973 34.4631 24.3925 34.3876 24.5746C34.3121 24.7566 34.2015 24.9221 34.062 25.0614L19.062 40.0614C18.7806 40.3429 18.3988 40.501 18.0008 40.501C17.6027 40.501 17.221 40.3429 16.9395 40.0614C16.6581 39.7799 16.4999 39.3982 16.4999 39.0001C16.4999 38.6021 16.6581 38.2204 16.9395 37.9389L30.8801 24.0001L16.9395 10.0614Z" fill="white"/>
            </svg>
          </button>
        </div>
        {/* Mobile overlay within blogs section */}
        {expandedPost && (
          <div className={`absolute inset-0 z-50 px-4 xxs:px-5 xs:px-6 py-4 xxs:py-5 xs:py-6 blog-overlay ${isExiting ? 'is-exiting' : ''}`} style={{ background: 'rgba(0,0,0,0.0)' }}>
            <div
              className="relative h-full w-full rounded-2xl p-6 overflow-y-auto blog-overlay-card"
              style={{
                background: 'rgba(255, 255, 255, 0.10)',
                backdropFilter: 'blur(50px)',
                WebkitBackdropFilter: 'blur(50px)'
              }}
            >
              <button
                aria-label="Close"
                onClick={handleCloseOverlay}
                className="absolute top-3 right-3 w-12 h-12 rounded-full flex items-center justify-center hover:opacity-80"
                style={{ backgroundColor: 'rgba(60,60,60,1)', border: 'none' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
              <h3 className="text-2xl font-bold text-texthigh mb-4 leading-tight" style={{ paddingRight: '72px' }}>{expandedPost.title}</h3>
              <p className="text-textmid leading-relaxed whitespace-pre-line">{expandedPost.content}</p>
            </div>
          </div>
        )}
      </section>

      {/* Desktop & tablet layout — unchanged, visible from sm and up */}
  <section id="blogs" className="hidden sm:block py-20 px-6 md:px-20 lg:px-40 relative">
        <div className="w-full">
          <div className="flex justify-between items-stretch">
            {/* Left side - Blogs heading and navigation buttons */}
            <div className="flex flex-col justify-between">
              <h2 className="text-4xl md:text-5xl font-bold text-texthigh mb-8">Blogs</h2>
              {/* Navigation buttons at the bottom */}
              <div className="flex space-x-4 mt-auto">
                {/* Left arrow button */}
                <button 
                  onClick={prevSlide}
                  className="relative flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white active:ring-2 active:ring-white active:outline-none"
                  style={{
                    width: '64px',
                    height: '64px',
                    flexShrink: 0,
                    aspectRatio: '1/1',
                    backgroundColor: 'rgba(60, 60, 60, 1)',
                    borderRadius: '50%',
                    outline: 'none',
                    WebkitTapHighlightColor: 'transparent',
                    appearance: 'none',
                    border: 'none'
                  }}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="32" 
                    height="32" 
                    viewBox="0 0 48 48" 
                    fill="none"
                    style={{
                      width: '32px',
                      height: '32px'
                    }}
                  >
                    <path d="M31.0605 37.9386C31.1998 38.078 31.3104 38.2434 31.3858 38.4255C31.4612 38.6076 31.5001 38.8028 31.5001 38.9999C31.5001 39.197 31.4612 39.3921 31.3858 39.5742C31.3104 39.7563 31.1998 39.9217 31.0605 40.0611C30.9211 40.2005 30.7557 40.311 30.5736 40.3865C30.3915 40.4619 30.1963 40.5007 29.9992 40.5007C29.8021 40.5007 29.607 40.4619 29.4249 40.3865C29.2428 40.311 29.0773 40.2005 28.938 40.0611L13.938 25.0611C13.7985 24.9218 13.6879 24.7564 13.6124 24.5743C13.5369 24.3922 13.498 24.197 13.498 23.9999C13.498 23.8027 13.5369 23.6075 13.6124 23.4255C13.6879 23.2434 13.7985 23.0779 13.938 22.9386L28.938 7.9386C29.2194 7.65714 29.6012 7.49902 29.9992 7.49902C30.3973 7.49902 30.779 7.65714 31.0605 7.9386C31.3419 8.22007 31.5001 8.60181 31.5001 8.99985C31.5001 9.3979 31.3419 9.77964 31.0605 10.0611L17.1199 23.9999L31.0605 37.9386Z" fill="white"/>
                  </svg>
                </button>

                {/* Right arrow button */}
                <button 
                  onClick={nextSlide}
                  className="relative flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white active:ring-2 active:ring-white active:outline-none"
                  style={{
                    width: '64px',
                    height: '64px',
                    flexShrink: 0,
                    aspectRatio: '1/1',
                    backgroundColor: 'rgba(60, 60, 60, 1)',
                    borderRadius: '50%',
                    outline: 'none',
                    WebkitTapHighlightColor: 'transparent',
                    appearance: 'none',
                    border: 'none'
                  }}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="32" 
                    height="32" 
                    viewBox="0 0 48 48" 
                    fill="none"
                    style={{
                      width: '32px',
                      height: '32px'
                    }}
                  >
                    <path d="M16.9395 10.0614C16.8002 9.92203 16.6896 9.75657 16.6142 9.57449C16.5388 9.39239 16.4999 9.19723 16.4999 9.00014C16.4999 8.80305 16.5388 8.60789 16.6142 8.42579C16.6896 8.24371 16.8002 8.07826 16.9395 7.93889C17.0789 7.79952 17.2443 7.68897 17.4264 7.61355C17.6085 7.53813 17.8037 7.4993 18.0008 7.4993C18.1979 7.4993 18.393 7.53813 18.5751 7.61355C18.7572 7.68897 18.9227 7.79952 19.062 7.93889L34.062 22.9389C34.2015 23.0782 34.3121 23.2436 34.3876 23.4257C34.4631 23.6078 34.502 23.803 34.502 24.0001C34.502 24.1973 34.4631 24.3925 34.3876 24.5746C34.3121 24.7566 34.2015 24.9221 34.062 25.0614L19.062 40.0614C18.7806 40.3429 18.3988 40.501 18.0008 40.501C17.6027 40.501 17.221 40.3429 16.9395 40.0614C16.6581 39.7799 16.4999 39.3982 16.4999 39.0001C16.4999 38.6021 16.6581 38.2204 16.9395 37.9389L30.8801 24.0001L16.9395 10.0614Z" fill="white"/>
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Right side - Blog cards */}
            <div className="flex-1 ml-12 md:ml-8 lg:ml-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[32px] md:gap-[24px] lg:gap-[32px]">
                {visiblePosts.map((post) => (
                  <div
                    key={post.id}
                    className="rounded-3xl p-8 md:p-6 lg:p-8 transition-colors"
                    style={{
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.10)',
                      backdropFilter: 'blur(50px)',
                      WebkitBackdropFilter: 'blur(50px)'
                    }}
                  >
                    {/* T logo (inline SVG as provided) */}
                    <div className="mb-6" style={{width: '32px', height: '49px'}}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="49" viewBox="0 0 32 49" fill="none">
                        <path d="M18.1064 0.500002C20.0167 0.49678 19.1154 4.80352 18.5043 7.49641C19.6536 7.08467 20.7999 6.68403 21.969 6.28391C23.173 5.9004 24.3768 5.45281 25.5099 5.06943C26.3598 4.75012 27.2812 4.49422 28.2734 4.55589C29.9743 4.61646 31.3942 5.88483 31.468 7.47316C31.541 8.6802 30.6924 9.88937 29.3471 10.4637C26.1604 11.7407 22.9731 12.827 19.7862 13.9768C19.078 14.2322 18.4407 14.5515 17.7324 14.7434C17.4491 14.871 17.3079 15.0618 17.2375 15.316C16.5864 17.2739 15.9774 19.2319 15.4427 21.1898C12.2491 30.9172 9.08493 44.3348 16.0588 42.9441C16.3047 42.925 16.5496 42.8963 16.7921 42.8563C17.5449 42.8389 19.2399 42.0547 19.7648 41.7932C19.917 41.9697 19.8378 42.4035 19.8418 42.6241C19.8563 43.5757 19.7646 44.5259 19.6447 45.471L19.6418 45.4948C19.5987 45.8414 19.5458 46.257 19.3514 46.5832L19.3284 46.5948C15.1854 48.5883 11.8409 48.2232 9.68895 47.464C8.19845 46.9381 7.07609 45.6803 6.74309 44.125C6.01316 40.7145 6.54154 35.7156 7.5476 30.7294C8.14797 27.7541 8.91883 24.7845 9.69204 22.1612C10.1476 20.7096 10.6643 19.2575 11.2178 17.8056C11.2882 17.615 11.2883 17.4244 11.3587 17.2337C11.146 17.1707 10.9333 17.2983 10.7916 17.362C10.0129 17.7448 9.16294 18.1275 8.31339 18.5739C7.39295 19.0205 6.54321 19.5302 5.62282 19.9767C5.33963 20.1044 5.12719 20.2954 4.98582 20.4863C3.99596 21.8224 -0.4688 21.3861 0.730252 18.461C1.22468 17.5706 2.07385 17.0603 2.92317 16.4869C3.34776 16.232 3.63116 15.9771 3.70107 15.4055C3.77028 14.5158 4.33579 13.8156 5.185 13.2421C6.95459 12.0951 8.79597 11.2651 10.7789 10.4988C11.5733 10.1706 12.3678 9.85627 13.1622 9.54283C14.2287 2.85551 15.7993 0.504393 18.1064 0.500002Z" fill="#925FFF"/>
                        <path d="M5.30089 38.7249C5.37553 30.2887 8.50906 21.2121 10.0665 17.7284L12.4955 15.4688L8.57123 44.7507H16.5132L20.3441 41.6437L19.69 45.8806C17.8961 47.6883 13.461 47.952 11.4678 47.8578C5.78689 47.8578 4.98948 41.7692 5.30089 38.7249Z" fill="#925FFF"/>
                        <path d="M20.0127 40.0309C15.1369 41.9996 13.0537 39.8725 13.0537 37.0736L9.33184 36.7656L8.93066 44.1324L9.48284 47.5461C12.3818 48.7808 16.9058 48.1627 19.3446 47.5512C19.7511 47.4493 20.0401 47.0945 20.0821 46.6744L20.7274 40.2196C20.7525 39.9689 20.4933 39.7888 20.2696 39.9015L20.0127 40.0309Z" fill="#925FFF"/>
                        <path d="M17.5742 0.544071C13.8902 1.26899 12.3285 7.00412 11.8691 10.1516L17.1701 8.79409L18.4013 2.14096C18.6769 0.752393 17.9647 0.497798 17.5742 0.544071Z" fill="#925FFF"/>
                        <path d="M19.6597 41.5366C18.9618 42.1335 17.0983 42.7425 15.6855 43.033L16.0831 47.7511C16.7346 47.6914 18.0077 47.2872 18.912 46.9603C19.3834 46.7898 19.7061 46.3594 19.7657 45.8582L20.0349 43.593C20.3277 41.3198 19.9068 41.2749 19.6597 41.5366Z" fill="#925FFF"/>
                      </svg>
                    </div>

                    <h3 className="text-2xl font-bold text-texthigh mb-4 md:mb-2 lg:mb-4 leading-tight blog-title-md">
                      {post.title}
                    </h3>

                    <p className="text-textmid mb-6 md:mb-4 leading-relaxed blog-text-md">
                      {post.excerpt}
                    </p>

                    <button
                      className="font-bold hover:opacity-80 transition-opacity cursor-pointer"
                      style={{
                        color: '#00FFC8',
                        fontFamily: '"Anek Latin", sans-serif',
                        fontSize: '18px',
                        fontWeight: 700,
                        lineHeight: '150%',
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        outline: 'none'
                      }}
                      onClick={() => openOverlay(post.id)}
                    >
                      {post.readMore}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Desktop/tablet overlay within blogs section */}
        {expandedPost && (
          <div className={`absolute inset-0 z-50 p-6 md:p-10 blog-overlay ${isExiting ? 'is-exiting' : ''}`} style={{ background: 'rgba(0,0,0,0.0)' }}>
            <div
              className="relative h-full w-full rounded-2xl p-8 md:p-10 overflow-y-auto blog-overlay-card"
              style={{
                background: 'rgba(255, 255, 255, 0.10)',
                backdropFilter: 'blur(50px)',
                WebkitBackdropFilter: 'blur(50px)'
              }}
            >
              <button
                aria-label="Close"
                onClick={handleCloseOverlay}
                className="absolute top-4 right-4 w-14 h-14 rounded-full flex items-center justify-center hover:opacity-80"
                style={{ backgroundColor: 'rgba(60,60,60,1)', border: 'none' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
              <h3 className="text-3xl md:text-4xl font-bold text-texthigh mb-6 leading-tight">{expandedPost.title}</h3>
              <p className="text-textmid text-lg md:text-xl leading-relaxed whitespace-pre-line">{expandedPost.content}</p>
            </div>
          </div>
        )}
      </section>
      {/* md-only text clamp to reduce card height without affecting lg */}
      <style>{`
        /* Overlay/card animations without changing opacity */
        .blog-overlay { 
          /* No opacity animation to keep same visual density */
        }
        .blog-overlay.is-exiting { 
          pointer-events: none;
        }
        .blog-overlay-card { 
          transform-origin: center center;
          animation: blogCardIn 450ms cubic-bezier(0.22, 1, 0.36, 1) forwards; 
        }
        .blog-overlay.is-exiting .blog-overlay-card { 
          animation: blogCardOut 600ms cubic-bezier(0.33, 1, 0.68, 1) forwards; 
        }
        @keyframes blogCardIn { from { transform: translateY(12px) scale(0.98) } to { transform: translateY(0) scale(1) } }
        @keyframes blogCardOut { from { transform: translateY(0) scale(1) } to { transform: translateY(10px) scale(0.86) } }
        @media (min-width: 768px) and (max-width: 1023.98px) {
          .blog-text-md {
            display: -webkit-box;
            -webkit-line-clamp: 4;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .blog-title-md {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        }
      `}</style>
    </>
  )
}

export default Blog
