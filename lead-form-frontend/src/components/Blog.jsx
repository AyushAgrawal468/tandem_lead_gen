import React, { useEffect, useRef, useState } from 'react'


const Blog = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [expandedId, setExpandedId] = useState(null)
  const [isExiting, setIsExiting] = useState(false)
  const closeTimeoutRef = useRef(null)
  const mobileScrollRef = useRef(null)
  const desktopScrollRef = useRef(null)
  // Swipe refs for mobile & tablet (<= md breakpoint). We intentionally do NOT enable swipe on large desktop.
  const mobileSectionRef = useRef(null)
  const tabletSectionRef = useRef(null)
    const [activeSectionIdx, setActiveSectionIdx] = useState(0)
  
  const blogPosts = [
    {
      id: 1,
      title: "Swipe Your Way to Real Hangouts—Tandem Makes Planning Effortless",

      excerpt: `Dating apps changed how people meet, but why stop there? Tandem uses easy swipe gestures to make planning real-life fun with friends simpler and more exciting.`,

      content: `Dating apps changed how people meet, but why stop there? Tandem uses easy swipe gestures to make planning real-life fun with friends simpler and more exciting.

Swiping Isn’t Just for Dating Anymore
   Tandem brings the familiar swipes everyone loves in dating apps - up to super-like, right to like, left to dislike, down to  \n   super-dislike and puts them to work for group activities. No more endless typing or confusion, just a few quick swipes \n   and a real plan for real life.
\nSmart, Spontaneous Plans With AI
  Tandem learns what everyone likes and gives smart suggestions that actually fit the group. It mixes in surprises so plans \n  always feel fresh and spontaneous, not just the same old routine.
\nChoose How Your Group Plans
  Whether starting with the crew and picking what to do together (group-first), or picking the activity first and inviting \n  friends to join (activity-first), Tandem lets everyone plan how they want. It’s flexible for every kind of get-together.
\nEverything Sorted in One Place
  No more jumping between WhatsApp, Instagram, calendars, and maps. Tandem offers instant RSVPs, maps, reminders, \n  and even chat right inside the app, everyone stays in the loop, no switching around.
\nReady for Real Plans, Not Just Chats?
  Swipe right not just for matches, but for friendship and good times. Get in early with Tandem and make every hangout \n  quick, easy, and actually happen.
`,
      readMore: "Read more"
    },
    {
      id: 2,
      title: "The Loneliness Crisis: Why We Feel More Alone Despite Being Connected",

      excerpt: `In 2024, the World Health Organization called loneliness a global health crisis affecting people everywhere, young and old.It’s not just a feeling of sadness,`,

      content: `In 2024, the World Health Organization called loneliness a global health crisis affecting people everywhere, young and old. It’s not just a feeling of sadness, loneliness can hurt our health, increasing risks like heart disease, stroke, and dementia.
\nWhat’s Causing the Lonely World?
• Living Solo: Around 30% of homes in the U.S. have just one person living there. This is similar in many big cities worldwide, \n   including in India.
• Social Media Overload: Endless scrolling on feeds replaces real, face-to-face time, leaving us feeling disconnected even \n   when “connected.”
• City Life Irony: Big cities are full of people, yet we often don’t know our neighbors or hang out much in person.
• Too Many Apps, Too Much Confusion: Trying to plan outings on WhatsApp, Instagram, calendars, and chat apps \n  gets messy. Plans fall through, and the frustration builds.
\nWhy This Matters
  Loneliness is not just emotional pain. It lowers our immunity, leads to depression, and increases healthcare costs. It’s a \n  serious problem that affects how we live every day.
\nHow Tandem Is the Answer
Tandem flips this loneliness script by making social planning simple, fun, and effective.
  • Swipe Together, Decide Together: Instead of confusing back-and-forth messages, friends swipe together on what \n    to do, making group decisions in just a few swipes.
  • Smart Suggestions: AI picks activities your group will actually love leading to a stop to the endless scrolling.
  • Plan Lock-In: Instant RSVPs and reminders mean fewer no-shows and more real meetups.
  • All-In-One App: Chat, vote, schedule, and navigate from one app. No more juggling a dozen apps.
  • Memory Wall: After events, photos and videos automatically create fun collages to relive good times and keep \n    the bond strong.
\nTake the First Step to Beat Loneliness
  Loneliness won’t disappear with random meetups. It needs a way to make planning easy, joyful, and hassle-free.\n  That’s exactly what Tandem does. Join the waitlist today and start turning social plans into meaningful moments\n  with friends.
`,
      readMore: "Read more"
    },
    {
      id: 3,
      title: " Why Group Chats Are Actually Making Us Feel More Alone",

      excerpt: `Group chats were supposed to bring us closer, but often they just create confusion and frustration. Instead of easy plans, we get long message threads `,

      content: `Group chats were supposed to bring us closer, but often they just create confusion and frustration. Instead of easy plans, we get long message threads full of unanswered questions and people disappearing into silence.
\nThe Group-Chat Problem
• Too Many Messages: It often takes around 23 messages just to decide where to eat or what movie to watch. This leads to tiredness and many people giving up on plans.
• Decision Overload: With so many chats and unread messages, people avoid responding, causing plans to fall apart at the last minute.
\nToo Many Choices, Too Many Voices
 When there are too many options and lots of participants, making a decision becomes almost impossible. This leads to \n postponed outings or none at all.
\nHow Tandem Fixes This Chaos
 Tandem makes group planning quick and smooth. Friends swipe together in real-time, vote instantly, and arrive at \n a decision within minutes. No flooding chats, no confusion—just fun and easy planning.
\nReal People, Real Wins
 Anisha, 28 from Bengaluru, says, "We used to keep asking each other  'Where do you want to go?' Now, it’s decided in \n just 5 swipes!"
\nReady to End Group Chat Madness?
 Stop wasting time on endless chats that go nowhere. Join the Tandem waitlist and start making plans that \n actually happen. Reclaim your social life with ease and joy.
`,
      readMore: "Read more"
    },
    {
      id: 4,
      title: "Why Doing Things Together Bonds Us—and How Tandem Makes It Happen",

      excerpt: `Research shows when people share experiences, their relationships get stronger and happier. Planning things together isn’t just a nice idea, it’s how memories`,

      content: `Research shows when people share experiences, their relationships get stronger and happier. Planning things together isn’t just a nice idea, it’s how memories and deeper friendships are made.
\nThe Magic Chemistry of Hanging Out
• Laugh Together, Connect Better: When friends laugh or do new things together, their brains release oxytocin—the \n “bonding hormone”, making everyone feel closer.
• Anticipation Makes Moments Stick: Planning things as a group builds excitement and ensures the memories last longer.
\nIntentional Plans Create Real Belonging \n Spontaneous meetups are great, but when everyone helps plan, the sense of togetherness starts even before the event.
\nHow Tandem Gamifies Better Bonding
 Tandem makes group planning rewarding. Features like “streaks,” “Tandem Swipe,” and the “Wall of Moments” turn \n organizing into a playful, habit-forming activity, each swipe and vote releases feel-good dopamine and brings \n people closer.
\nSmart Nudges for Maximum Fun
• Quick Swipes, Fast Decisions: A three minute timer ensures nobody procrastinates, where everyone can vote instantly.
• Live Feedback: Real-time likes and group responses help everyone pick what most want, making the process smooth \n  and efficient.
\nReady to Make Every Moment Count?
 Sharing experiences is how real connections are made. With Tandem, every plan becomes a fun shared journey even \n before you step out. Join the Tandem waitlist and get ready to make every outing unforgettable.
`,
      readMore: "Read more"
    },
    {
      id: 5,
      title: `Beat FOMO and Start Living - Tandem Turns “Maybe” Into “See You Tonight” `,
      excerpt: `FOMO (Fear of Missing Out) is everywhere. Scrolling through friends’ stories can leave anyone feeling left out, especially when group chats get stuck in “maybe later”. 
`,
      content: `FOMO (Fear of Missing Out) is everywhere. Scrolling through friends’ stories can leave anyone feeling left out, especially when group chats get stuck in “maybe later.” Planning tools haven’t caught up, but, Tandem changes everything, turning that FOMO into JOMO (Joy of Missing Out) on the things that don’t matter, and saying “yes” to what does.
\nHow FOMO Sneaks In
• Scroll, Regret, Repeat: Watching others have fun online stings, and missed replies in group chats lead to missed\n  chances to join in.
• Procrastination: When plans take forever to decide, invitations get lost or ignored.
\nHow Tandem Makes “See You Tonight” Happen
Tandem’s three-minute sync means quick decisions & no endless waiting. The app uses a visual countdown to pump up \n excitement and help everyone stay on track, so meetups actually happen.
\nRelive Great Moments With Friends
 No more scattered photos. Tandem’s Memory Wall automatically creates shareable collages, so everyone can \n remember (and show off) the best parts of any event. Seeing highlights makes people want to join in next time.
\nTurn Planning Into a Fun Habit
 Tandem sends playful cues, like a morning message: “Your friends are planning brunch—swipe now to join!” Planning \n becomes part of the day, making it easy and natural to connect.

`,
      readMore: "Read more"
    }
  ]

  // Fixed height for mobile blog card - no dynamic measurement needed
  const mobileCardRef = useRef(null)

  const handleCloseOverlay = () => {
    if (!expandedId) return
    setIsExiting(true)
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
    // Reset active section when closing
    setActiveSectionIdx(0)
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
      // Reset active highlight when opening new overlay
      setActiveSectionIdx(0)
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % blogPosts.length);
    if (expandedId) handleCloseOverlay()
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + blogPosts.length) % blogPosts.length);
    if (expandedId) handleCloseOverlay()
  }

  // ================= Swipe Navigation (Mobile + Tablet Only) =================
  useEffect(() => {
    if (expandedId) return // disable swipe when overlay open so scroll works naturally
    // Determine viewport width once per mount & resize for enabling tablet swipe (<1024px)
    let enabled = false
    const updateEnabled = () => { enabled = typeof window !== 'undefined' && window.innerWidth < 1024 }
    updateEnabled()

    let startX = 0, startY = 0, isDown = false, lockedAxis = null, deltaX = 0
    const THRESHOLD = 40

    const onPointerDown = (e) => {
      if (!enabled) return
      isDown = true
      const t = 'touches' in e ? e.touches[0] : e
      startX = t.clientX; startY = t.clientY; deltaX = 0; lockedAxis = null
    }
    const onPointerMove = (e) => {
      if (!isDown || !enabled) return
      const t = 'touches' in e ? e.touches[0] : e
      const dx = t.clientX - startX
      const dy = t.clientY - startY
      if (!lockedAxis) {
        if (Math.abs(dx) > Math.abs(dy) + 6) lockedAxis = 'x'
        else if (Math.abs(dy) > Math.abs(dx) + 6) lockedAxis = 'y'
      }
      if (lockedAxis === 'x') {
        if ('preventDefault' in e) try { e.preventDefault() } catch {}
        deltaX = dx
      }
    }
    const onPointerUp = () => {
      if (!isDown || !enabled) return
      isDown = false
      if (lockedAxis === 'x') {
        if (deltaX < -THRESHOLD) nextSlide()
        else if (deltaX > THRESHOLD) prevSlide()
      }
    }

    const addListeners = (el) => {
      if (!el) return
      el.addEventListener('touchstart', onPointerDown, { passive: false })
      el.addEventListener('touchmove', onPointerMove, { passive: false })
      el.addEventListener('touchend', onPointerUp)
      el.addEventListener('pointerdown', onPointerDown)
      el.addEventListener('pointermove', onPointerMove)
      window.addEventListener('pointerup', onPointerUp)
    }
    const removeListeners = (el) => {
      if (!el) return
      el.removeEventListener('touchstart', onPointerDown)
      el.removeEventListener('touchmove', onPointerMove)
      el.removeEventListener('touchend', onPointerUp)
      el.removeEventListener('pointerdown', onPointerDown)
      el.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
    }

    const mobEl = mobileSectionRef.current
    const tabEl = tabletSectionRef.current
    addListeners(mobEl)
    addListeners(tabEl)
    window.addEventListener('resize', updateEnabled)
    return () => {
      removeListeners(mobEl)
      removeListeners(tabEl)
      window.removeEventListener('resize', updateEnabled)
    }
  }, [expandedId, nextSlide, prevSlide])

  const visiblePosts = (() => {
    // For desktop/tablet: always show 2 cards, with infinite loop
    const posts = []
    for (let i = 0; i < 2; i++) {
      const index = (currentIndex + i) % blogPosts.length
      posts.push(blogPosts[index])
    }
    return posts
  })()
  const mobilePost = blogPosts[currentIndex % blogPosts.length]
  const expandedPost = expandedId ? blogPosts.find(p => p.id === expandedId) : null

  // High-performance scroll-based active section tracking (no IntersectionObserver)
  useEffect(() => {
    if (!expandedPost) return
    const isMobile = window.innerWidth < 640
    const scrollContainer = isMobile ? mobileScrollRef.current : desktopScrollRef.current
    if (!scrollContainer) return

    let paraOffsets = []
    let frame = null

    const measure = () => {
      const nodes = scrollContainer.querySelectorAll('.blog-text-section')
      paraOffsets = Array.from(nodes).map(node => ({
        top: node.offsetTop,
        height: node.offsetHeight
      }))
    }

    const updateActive = () => {
      frame = null
      if (!paraOffsets.length) return
      const scrollTop = scrollContainer.scrollTop
      const viewH = scrollContainer.clientHeight
      const scrollHeight = scrollContainer.scrollHeight
      const viewCenter = scrollTop + viewH * 0.35
      let bestIdx = 0
      let bestDist = Infinity
      for (let i = 0; i < paraOffsets.length; i++) {
        const { top, height } = paraOffsets[i]
        const center = top + height / 2
        const dist = Math.abs(center - viewCenter)
        if (dist < bestDist) { bestDist = dist; bestIdx = i }
      }
      // If user is near the absolute bottom, always force last paragraph active so conclusion highlights
      const nearBottom = scrollTop + viewH >= scrollHeight - 48 // 48px threshold
      if (nearBottom) bestIdx = paraOffsets.length - 1
      setActiveSectionIdx(prev => (prev === bestIdx ? prev : bestIdx))
    }

    const onScroll = () => { if (!frame) frame = requestAnimationFrame(updateActive) }
    const onResize = () => { measure(); updateActive() }

    measure()
    updateActive()

    scrollContainer.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)

    return () => {
      scrollContainer.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [expandedPost])

  // Split content into paragraphs for individual animation
  const formatContentWithSections = (content) => {
    const paragraphs = content.split('\n\n').filter(p => p.trim())
    return paragraphs.map((paragraph, index) => {
      const isLastParagraph = index === paragraphs.length - 1
      const isCallToAction = paragraph.toLowerCase().includes('conclusion') || paragraph.toLowerCase().includes('call to action')
        const active = index === activeSectionIdx
        return (
          <p
            key={index}
            data-section-id={`section-${index}`}
            className={`blog-text-section ${active ? 'text-active' : ''} ${isLastParagraph || isCallToAction ? 'conclusion-text' : ''}`}
          >
            {paragraph}
          </p>
        )
    })
  }

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
  <section ref={mobileSectionRef} id="blogs" className="block sm:hidden py-10 xxs:py-12 xs:py-14 px-4 xxs:px-4 xs:px-4 relative">
        <h2 className="text-[32px] xxs:text-[32px] xs:text-[32px] font-bold text-texthigh mb-5">Blogs</h2>
        <div
          ref={mobileCardRef}
          className="rounded-2xl p-6 mobile-blog-card"
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
            className="font-bold hover:opacity-80 transition-opacity cursor-pointer text-left"
            style={{
              color: '#00FFC8',
              fontFamily: '"Anek Latin", sans-serif',
              fontSize: '18px',
              fontWeight: 700,
              lineHeight: '150%',
              background: 'none',
              border: 'none',
              padding: 0,
              outline: 'none',
              textAlign: 'left'
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
              // Match desktop button diameter so arrow head visual size matches
              width: '56px',
              height: '56px',
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
            {/* Enlarged icon to match desktop arrow head proportion */}
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48" fill="none">
              <path d="M31.0605 37.9386C31.1998 38.078 31.3104 38.2434 31.3858 38.4255C31.4612 38.6076 31.5001 38.8028 31.5001 38.9999C31.5001 39.197 31.4612 39.3921 31.3858 39.5742C31.3104 39.7563 31.1998 39.9217 31.0605 40.0611C30.9211 40.2005 30.7557 40.311 30.5736 40.3865C30.3915 40.4619 30.1963 40.5007 29.9992 40.5007C29.8021 40.5007 29.607 40.4619 29.4249 40.3865C29.2428 40.311 29.0773 40.2005 28.938 40.0611L13.938 25.0611C13.7985 24.9218 13.6879 24.7564 13.6124 24.5743C13.5369 24.3922 13.498 24.197 13.498 23.9999C13.498 23.8027 13.5369 23.6075 13.6124 23.4255C13.6879 23.2434 13.7985 23.0779 13.938 22.9386L28.938 7.9386C29.2194 7.65714 29.6012 7.49902 29.9992 7.49902C30.3973 7.49902 30.779 7.65714 31.0605 7.9386C31.3419 8.22007 31.5001 8.60181 31.5001 8.99985C31.5001 9.3979 31.3419 9.77964 31.0605 10.0611L17.1199 23.9999L31.0605 37.9386Z" fill="white"/>
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="relative flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white active:ring-2 active:ring-white active:outline-none"
            style={{
              // Match desktop button diameter so arrow head visual size matches
              width: '56px',
              height: '56px',
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
            {/* Enlarged icon to match desktop arrow head proportion */}
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48" fill="none">
              <path d="M16.9395 10.0614C16.8002 9.92203 16.6896 9.75657 16.6142 9.57449C16.5388 9.39239 16.4999 9.19723 16.4999 9.00014C16.4999 8.80305 16.5388 8.60789 16.6142 8.42579C16.6896 8.24371 16.8002 8.07826 16.9395 7.93889C17.0789 7.79952 17.2443 7.68897 17.4264 7.61355C17.6085 7.53813 17.8037 7.4993 18.0008 7.4993C18.1979 7.4993 18.393 7.53813 18.5751 7.61355C18.7572 7.68897 18.9227 7.79952 19.062 7.93889L34.062 22.9389C34.2015 23.0782 34.3121 23.2436 34.3876 23.4257C34.4631 23.6078 34.502 23.803 34.502 24.0001C34.502 24.1973 34.4631 24.3925 34.3876 24.5746C34.3121 24.7566 34.2015 24.9221 34.062 25.0614L19.062 40.0614C18.7806 40.3429 18.3988 40.501 18.0008 40.501C17.6027 40.501 17.221 40.3429 16.9395 40.0614C16.6581 39.7799 16.4999 39.3982 16.4999 39.0001C16.4999 38.6021 16.6581 38.2204 16.9395 37.9389L30.8801 24.0001L16.9395 10.0614Z" fill="white"/>
            </svg>
          </button>
        </div>
        {/* Mobile overlay within blogs section */}
        {expandedPost && (
          <div className={`absolute inset-0 z-50 px-4 xxs:px-4 xs:px-4 py-4 xxs:py-5 xs:py-6 blog-overlay ${isExiting ? 'is-exiting' : ''}`} style={{ background: 'rgba(0,0,0,0.0)' }}>
            <div
              className="relative h-full w-full rounded-2xl p-6 blog-overlay-card flex flex-col"
              style={{
                background: 'rgba(255, 255, 255, 0.10)',
                backdropFilter: 'blur(50px)',
                WebkitBackdropFilter: 'blur(50px)'
              }}
            >
              {/* Close button pinned to card corner; content below scrolls */}
              <button
                aria-label="Close"
                onClick={handleCloseOverlay}
                className="blog-close-btn absolute top-3 right-3 w-12 h-12 rounded-full flex items-center justify-center z-20"
                style={{ backgroundColor: 'rgba(60,60,60,1)', border: 'none' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
              <div className="flex-1 overflow-y-auto blog-scroll pr-1" style={{ paddingTop: '4px', paddingBottom: '25vh' }} ref={mobileScrollRef}>
                <h3 className="text-2xl font-bold text-texthigh mb-4 leading-tight" style={{ paddingRight: '72px' }}>{expandedPost.title}</h3>
                <div className="text-textmid">
                  {formatContentWithSections(expandedPost.content)}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Desktop & tablet layout — unchanged, visible from sm and up */}
  <section ref={tabletSectionRef} id="blogs" className="hidden sm:block py-20 px-6 md:px-20 lg:px-40 relative">
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
                      className="font-bold hover:opacity-80 transition-opacity cursor-pointer text-left"
                      style={{
                        color: '#00FFC8',
                        fontFamily: '"Anek Latin", sans-serif',
                        fontSize: '18px',
                        fontWeight: 700,
                        lineHeight: '150%',
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        outline: 'none',
                        textAlign: 'left'
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
              className="relative h-full w-full rounded-2xl p-8 md:p-10 blog-overlay-card flex flex-col"
              style={{
                background: 'rgba(255, 255, 255, 0.10)',
                backdropFilter: 'blur(50px)',
                WebkitBackdropFilter: 'blur(50px)'
              }}
            >
              {/* Close button pinned to card corner; content below scrolls */}
              <button
                aria-label="Close"
                onClick={handleCloseOverlay}
                className="blog-close-btn absolute top-4 right-4 w-14 h-14 rounded-full flex items-center justify-center z-20"
                style={{ backgroundColor: 'rgba(60,60,60,1)', border: 'none' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
              <div className="flex-1 overflow-y-auto blog-scroll pr-2" style={{ paddingTop: '4px', paddingBottom: '25vh' }} ref={desktopScrollRef}>
                <h3 className="text-3xl md:text-4xl font-bold text-texthigh mb-6 leading-tight max-w-full break-words" style={{ paddingRight: '80px' }}>{expandedPost.title}</h3>
                <div className="text-textmid text-lg md:text-xl max-w-full break-words overflow-wrap-anywhere">
                  {formatContentWithSections(expandedPost.content)}
                </div>
              </div>
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
        .blog-scroll { 
          /* Hide scrollbar for all browsers */
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE 10+ */
          scroll-behavior: smooth;
          /* Ensure proper containment */
          contain: layout style paint;
        }
        .blog-scroll::-webkit-scrollbar { display: none; }
        
        /* Desktop overlay text container constraints */
        @media (min-width: 640px) {
          .blog-overlay-card {
            max-width: 100vw;
            overflow: hidden;
          }
          .blog-scroll {
            width: 100%;
            max-width: calc(100vw - 8rem);
          }
        }
        .blog-overlay.is-exiting .blog-overlay-card { 
          animation: blogCardOut 600ms cubic-bezier(0.33, 1, 0.68, 1) forwards; 
        }
        @keyframes blogCardIn { from { transform: translateY(12px) scale(0.98) } to { transform: translateY(0) scale(1) } }
        @keyframes blogCardOut { from { transform: translateY(0) scale(1) } to { transform: translateY(10px) scale(0.86) } }
        
        /* Scroll-based text animation effects */
        .blog-text-section {
          transform-origin: left center;
          /* Limit will-change to only what actually animates for performance */
          will-change: opacity, transform, color;
          /* Faster & leaner transitions */
          transition: opacity .18s ease, transform .28s cubic-bezier(0.25, 0.46, 0.45, 0.94), color .18s ease;
          line-height: 1.7;
          margin-bottom: 1.5rem;
          /* Default faded state */
          opacity: 0.45;
          font-weight: 500; /* keep a stable base weight to avoid reflow */
          color: rgba(255, 255, 255, 0.6);
          transform: translateY(4px) scale(0.99);
          text-shadow: none;
          /* Ensure proper text wrapping */
          word-wrap: break-word;
          overflow-wrap: break-word;
          hyphens: auto;
          max-width: 100%;
          white-space: pre-wrap;
        }
        
        /* Active state - in viewport - using attribute selector for better specificity */
        .blog-text-section.text-active {
          opacity: 1 !important;
          /* Slight scale lift removed to reduce layout thrash; keep transform for GPU */
          font-weight: 600 !important; /* one step difference only */
          color: rgba(255, 255, 255, 0.97) !important;
          transform: translateY(0) scale(1) !important;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }
        
        /* Conclusion/Call-to-Action text styling */
        .blog-text-section.conclusion-text {
          font-weight: 600 !important;
          color: rgba(255, 255, 255, 0.9) !important;
          margin-bottom: 2rem !important;
        }
        .blog-text-section.conclusion-text.text-active {
          font-weight: 700 !important;
          color: rgba(255, 255, 255, 1) !important;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3) !important;
        }
        
        /* Enhanced contrast for mobile */
        @media (max-width: 640px) {
          .blog-text-section {
            opacity: 0.34 !important;
            font-weight: 500 !important;
            color: rgba(255, 255, 255, 0.52) !important;
            transform: translateY(6px) scale(0.985) !important;
          }
          .blog-text-section.text-active {
            opacity: 1 !important;
            font-weight: 600 !important;
            color: rgba(255, 255, 255, 1) !important;
            transform: translateY(0) scale(1) !important;
            text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2) !important;
          }
          .blog-text-section.conclusion-text.text-active {
            font-weight: 700 !important;
            color: rgba(255, 255, 255, 1) !important;
            text-shadow: 0 2px 6px rgba(0, 0, 0, 0.4) !important;
          }
          /* Mobile expanded overlay: ensure uniform line starts by collapsing extra spaces but keeping line breaks */
          .blog-overlay-card .blog-text-section {
            white-space: pre-line !important; /* respect \n but collapse multiple spaces */
            text-indent: 0 !important;
          }
        }
        
        /* Fixed height for mobile blog cards to ensure consistency across all phones */
        @media (max-width: 639px) {
          .mobile-blog-card {
            height: 320px !important;
            display: flex;
            flex-direction: column;
          }
          .mobile-blog-card > div:first-child {
            flex-shrink: 0;
          }
          .mobile-blog-card h3 {
            flex-shrink: 0;
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
          .mobile-blog-card p {
            flex: 1;
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 4;
            -webkit-box-orient: vertical;
          }
          .mobile-blog-card button {
            flex-shrink: 0;
            margin-top: auto;
          }
        }
        
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

        /* Unified close button interaction (white pulse everywhere) */
        .blog-close-btn { 
          position: absolute; 
          cursor: pointer; 
          transition: transform .25s, background-color .25s, opacity .25s; 
          -webkit-tap-highlight-color: transparent !important; 
          -webkit-touch-callout: none !important;
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          user-select: none !important;
          outline: none !important; 
          tap-highlight-color: transparent !important;
        }
        .blog-close-btn:hover { opacity: .85; }
        .blog-close-btn:active { 
          transform: scale(.92); 
          background-color: rgba(255,255,255,0.15) !important;
        }
        .blog-close-btn:focus { outline: none !important; }
        .blog-close-btn:focus-visible { 
          box-shadow: 0 0 0 3px rgba(255,255,255,0.35) !important; 
          outline: none !important;
        }
        .blog-close-btn::before { 
          content: ""; 
          position: absolute; 
          inset: -8px; 
          border-radius: 50%; 
          background: rgba(255,255,255,0.2); 
          opacity: 0; 
          transform: scale(.3); 
          transition: opacity .3s ease, transform .4s cubic-bezier(.22,1,.36,1); 
          pointer-events: none; 
          z-index: -1;
        }
        .blog-close-btn:active::before { 
          opacity: 1; 
          transform: scale(1.2); 
          animation: blogCloseRipple .5s ease-out forwards; 
        }
        @keyframes blogCloseRipple { 
          0% { opacity: .6; transform: scale(.3); background: rgba(255,255,255,0.4); } 
          50% { opacity: .3; transform: scale(1); background: rgba(255,255,255,0.25); } 
          100% { opacity: 0; transform: scale(1.4); background: rgba(255,255,255,0); } 
        }
      `}</style>
    </>
  )
}

export default Blog
