import React, { useState } from 'react'

const Blog = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  
  const blogPosts = [
    {
      id: 1,
      title: "The Loneliness Pandemic— How the World Became Lonely",
      excerpt: "Introduction In 2024, the World Health Organisation (WHO) recognised loneliness as a global public health concern, highlighting its significant impact on individuals across all...",
      readMore: "Read more"
    },
    {
      id: 2,
      title: "Building Authentic Connections in the Digital Age", 
      excerpt: "As technology continues to reshape how we interact, finding genuine connections becomes both easier and more challenging. Discover strategies for meaningful relationships in our hyperconnected world...",
      readMore: "Read more"
    },
    {
      id: 3,
      title: "The Science Behind Social Chemistry",
      excerpt: "What makes some friendships click instantly while others never quite gel? Recent research reveals the fascinating psychology and neuroscience behind human social bonds and compatibility...",
      readMore: "Read more"
    },
    {
      id: 4,
      title: "From Strangers to Squad: Building Your Tribe",
      excerpt: "Moving to a new city or life phase? Learn practical strategies for finding your people and building a supportive social network from scratch, no matter your age or circumstances...",
      readMore: "Read more"
    },
    {
      id: 5,
      title: "The Art of Spontaneous Adventures",
      excerpt: "Why planned hangouts sometimes fall flat while spontaneous meetups create the best memories. Explore how embracing uncertainty can lead to deeper friendships and unforgettable experiences...",
      readMore: "Read more"
    }
  ]

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, blogPosts.length - 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.max(1, blogPosts.length - 1)) % Math.max(1, blogPosts.length - 1))
  }

  const visiblePosts = blogPosts.slice(currentIndex, currentIndex + 2)

  return (
    <section id="blogs" className="py-20 px-6">
      <div className="w-full">
        <div className="flex justify-between items-start">
          {/* Left side - Blogs heading and navigation buttons */}
          <div className="flex flex-col justify-between h-full">
            <h2 className="text-4xl md:text-5xl font-bold text-texthigh mb-8">Blogs</h2>
            
            {/* Navigation buttons at the bottom */}
            <div className="flex space-x-4 mt-auto pt-36">
              {/* Left arrow button */}
              <button 
                onClick={prevSlide}
                className="relative flex items-center justify-center"
                style={{
                  width: '64px',
                  height: '64px',
                  flexShrink: 0,
                  aspectRatio: '1/1',
                  backgroundColor: 'rgba(60, 60, 60, 1)',
                  borderRadius: '50%'
                }}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 48 48" 
                  fill="none"
                  style={{
                    width: '24px',
                    height: '24px'
                  }}
                >
                  <path d="M31.0605 37.9386C31.1998 38.078 31.3104 38.2434 31.3858 38.4255C31.4612 38.6076 31.5001 38.8028 31.5001 38.9999C31.5001 39.197 31.4612 39.3921 31.3858 39.5742C31.3104 39.7563 31.1998 39.9217 31.0605 40.0611C30.9211 40.2005 30.7557 40.311 30.5736 40.3865C30.3915 40.4619 30.1963 40.5007 29.9992 40.5007C29.8021 40.5007 29.607 40.4619 29.4249 40.3865C29.2428 40.311 29.0773 40.2005 28.938 40.0611L13.938 25.0611C13.7985 24.9218 13.6879 24.7564 13.6124 24.5743C13.5369 24.3922 13.498 24.197 13.498 23.9999C13.498 23.8027 13.5369 23.6075 13.6124 23.4255C13.6879 23.2434 13.7985 23.0779 13.938 22.9386L28.938 7.9386C29.2194 7.65714 29.6012 7.49902 29.9992 7.49902C30.3973 7.49902 30.779 7.65714 31.0605 7.9386C31.3419 8.22007 31.5001 8.60181 31.5001 8.99985C31.5001 9.3979 31.3419 9.77964 31.0605 10.0611L17.1199 23.9999L31.0605 37.9386Z" fill="white"/>
                </svg>
              </button>

              {/* Right arrow button */}
              <button 
                onClick={nextSlide}
                className="relative flex items-center justify-center"
                style={{
                  width: '64px',
                  height: '64px',
                  flexShrink: 0,
                  aspectRatio: '1/1',
                  backgroundColor: 'rgba(60, 60, 60, 1)',
                  borderRadius: '50%'
                }}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 48 48" 
                  fill="none"
                  style={{
                    width: '24px',
                    height: '24px'
                  }}
                >
                  <path d="M16.9395 10.0614C16.8002 9.92203 16.6896 9.75657 16.6142 9.57449C16.5388 9.39239 16.4999 9.19723 16.4999 9.00014C16.4999 8.80305 16.5388 8.60789 16.6142 8.42579C16.6896 8.24371 16.8002 8.07826 16.9395 7.93889C17.0789 7.79952 17.2443 7.68897 17.4264 7.61355C17.6085 7.53813 17.8037 7.4993 18.0008 7.4993C18.1979 7.4993 18.393 7.53813 18.5751 7.61355C18.7572 7.68897 18.9227 7.79952 19.062 7.93889L34.062 22.9389C34.2015 23.0782 34.3121 23.2436 34.3876 23.4257C34.4631 23.6078 34.502 23.803 34.502 24.0001C34.502 24.1973 34.4631 24.3925 34.3876 24.5746C34.3121 24.7566 34.2015 24.9221 34.062 25.0614L19.062 40.0614C18.7806 40.3429 18.3988 40.501 18.0008 40.501C17.6027 40.501 17.221 40.3429 16.9395 40.0614C16.6581 39.7799 16.4999 39.3982 16.4999 39.0001C16.4999 38.6021 16.6581 38.2204 16.9395 37.9389L30.8801 24.0001L16.9395 10.0614Z" fill="white"/>
                </svg>
              </button>
            </div>
          </div>
          
          {/* Right side - Blog cards */}
          <div className="flex-1 ml-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[32px]">
              {visiblePosts.map((post) => (
                <div
                  key={post.id}
                  className="rounded-3xl p-8 transition-colors"
                  style={{
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.10)',
                    backdropFilter: 'blur(50px)',
                    WebkitBackdropFilter: 'blur(50px)'
                  }}
                >
                  {/* T logo */}
                  <div className="mb-6">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="31" 
                      height="48" 
                      viewBox="0 0 31 48" 
                      fill="none"
                      style={{
                        width: '30.945px',
                        height: '47.571px',
                        flexShrink: 0
                      }}
                    >
                      <path d="M17.5791 1.80707e-06C19.4894 -0.00322043 18.5881 4.30352 17.9769 6.99641C19.1263 6.58467 20.2726 6.18403 21.4417 5.78391C22.6456 5.4004 23.8495 4.95281 24.9826 4.56943C25.8324 4.25012 26.7538 3.99422 27.7461 4.05589C29.4469 4.11646 30.8668 5.38483 30.9407 6.97316C31.0136 8.1802 30.165 9.38937 28.8198 9.96375C25.633 11.2407 22.4458 12.327 19.2588 13.4768C18.5506 13.7322 17.9133 14.0515 17.205 14.2434C16.9218 14.371 16.7805 14.5618 16.7101 14.816C16.0591 16.7739 15.45 18.7319 14.9153 20.6898C11.7218 30.4172 8.55759 43.8348 15.5315 42.4441C15.7774 42.425 16.0223 42.3963 16.2647 42.3563C17.0176 42.3389 18.7125 41.5547 19.2374 41.2932C19.3897 41.4697 19.3104 41.9035 19.3145 42.1241C19.3289 43.0757 19.2372 44.0259 19.1174 44.971L19.1144 44.9948C19.0714 45.3414 19.0185 45.757 18.8241 46.0832L18.8011 46.0948C14.6581 48.0883 11.3136 47.7232 9.1616 46.964C7.67111 46.4381 6.54875 45.1803 6.21574 43.625C5.48582 40.2145 6.0142 35.2156 7.02026 30.2294C7.62063 27.2541 8.39149 24.2845 9.1647 21.6612C9.62025 20.2096 10.1369 18.7575 10.6905 17.3056C10.7609 17.115 10.7609 16.9244 10.8313 16.7337C10.6186 16.6707 10.406 16.7983 10.2643 16.862C9.48551 17.2448 8.63559 17.6275 7.78604 18.0739C6.8656 18.5205 6.01587 19.0302 5.09548 19.4767C4.81228 19.6044 4.59985 19.7954 4.45848 19.9863C3.46861 21.3224 -0.996143 20.8861 0.202908 17.961C0.697331 17.0706 1.54651 16.5603 2.39582 15.9869C2.82041 15.732 3.10381 15.4771 3.17373 14.9055C3.24294 14.0158 3.80844 13.3156 4.65765 12.7421C6.42725 11.5951 8.26863 10.7651 10.2515 9.99884C11.0459 9.67064 11.8405 9.35627 12.6348 9.04283C13.7013 2.35551 15.2719 0.00439287 17.5791 1.80707e-06Z" fill="rgba(146, 95, 255, 1)"/>
                    </svg>
                  </div>

                  <h3 className="text-2xl font-bold text-texthigh mb-4 leading-tight">
                    {post.title}
                  </h3>

                  <p className="text-textmid mb-6 leading-relaxed">
                    {post.excerpt}
                  </p>

                  <span 
                    className="font-bold hover:opacity-80 transition-opacity cursor-pointer"
                    style={{
                      color: '#00FFC8',
                      fontFamily: '"Anek Latin", sans-serif',
                      fontSize: '18px',
                      fontWeight: 700,
                      lineHeight: '150%'
                    }}
                  >
                    {post.readMore}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Blog
