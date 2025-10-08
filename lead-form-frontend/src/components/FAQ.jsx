import React, { useState } from 'react'

// Import FAQ icons (numbered 1-5)
import icon1 from '../assets/icons/1.svg'
import icon2 from '../assets/icons/2.svg'
import icon3 from '../assets/icons/3.svg'
import icon4 from '../assets/icons/4.svg'
import icon5 from '../assets/icons/5.svg'

const FAQ = () => {
  const [openFAQ, setOpenFAQ] = useState(0)

  // Simple renderer: splits multiline answers, bolds any line ending with '?' (treat as sub-heading),
  // preserves bullet lines starting with '•', and keeps blank line spacing.
  const renderAnswer = (text) => {
    if (typeof text !== 'string') return <p className="text-textmid leading-relaxed">{String(text)}</p>
    const lines = text.split(/\n+/)
    return (
      <div className="text-textmid leading-relaxed">
        {lines.map((raw, i) => {
          const line = raw.trim()
          if (!line) return <div key={i} className="h-3" />
          const isHeading = /\?$/.test(line) && line.length < 120 // basic heuristic
          const isBullet = line.startsWith('•')
          if (isHeading) {
            return (
              <p key={i} className="font-semibold text-texthigh mt-4 first:mt-0">{line}</p>
            )
          }
            return (
              <p key={i} className={`mt-1 ${isBullet ? 'pl-1' : ''}`}>{line}</p>
            )
        })}
      </div>
    )
  }

  const faqs = [
    {
      question: "About Tandem",
      icon: icon1,
      answer: `What is Tandem?\n Tandem is a social planning app that makes coordinating activities with friends effortless and fun. Instead of swiping on people, you swipe together on things to do—finalizing plans in just a few taps instead of endless group chat debates.\n\n Who is Tandem for?\n Tandem is designed for urban young adults aged 18–35, including students and early-career professionals. It also works perfectly for families, close friend groups, and coworker outings—anyone who wants easy, engaging group planning.\n\n Who created Tandem?\n Tandem is developed by Orbitandem Technologies Pvt Ltd, a Bengaluru-based company led by a team passionate about using AI and gamification to make social planning smarter.`},
    {
      question: "How It Works",
      icon: icon2,
      answer: `How does Tandem solve group planning problems?
Instead of chaotic group chats, Tandem enables synchronized real-time voting on AI-curated activities. What usually takes 23 back-and-forth messages gets resolved in just 3–5 swipes—saving time, reducing decision fatigue, and boosting turnout.

How do I use Tandem to plan an event?
Browse AI-curated activity cards with your group in real time, swipe to vote, and lock in a plan with one final confirmation swipe. Tandem also syncs with calendars, maps, and reminders to keep everyone on track.

What unique features does Tandem offer?

• Synchronized group swiping to vote together in real-time

• AI-powered activity suggestions personalized to your group

• Instant RSVP tallies and reminders for better attendance

• A Memory Wall that compiles photos and videos after events

• Gamification features like streaks and badges

Can Tandem help me discover new activities?
Yes! Tandem learns your group’s preferences and curates personalized activity suggestions, helping you discover fun, relevant things to do without endless scrolling.

How does the Memory Wall work?
After each event, attendees can upload photos and videos, and Tandem automatically creates a beautiful, shareable collage—helping you relive memories and strengthen bonds long after the event.
`
    },
    {
      question: "Planning with Groups",
      icon: icon3,
      answer: `Is Tandem only for friends or can it be used for wider social groups?
Tandem works best within friend circles but is flexible enough for family gatherings, college groups, or coworker outings. It adapts to different group dynamics for meaningful shared experiences.

Does Tandem replace other apps like WhatsApp, Google Calendar, or Instagram?
Yes—Tandem combines discovery, coordination, chat, calendar syncing, and maps into one app. No more switching between multiple apps just to plan a simple outing.

How does Tandem enhance attendance at group events?
With real-time voting, instant RSVP counts, reminders, and gamification rewards, Tandem significantly improves actual turnout compared to traditional planning where plans often fizzle out.
`
    },
    {
      question: "Plans & Availability",
      icon: icon4,
      answer: `What are the subscription options and costs?
Tandem offers a freemium model with basic features free for everyone. Upgrade to Tandem Plus or Tandem Premium to unlock unlimited swipes, no ads, and exclusive Memory Wall features. Plans are affordable—starting at ₹99 per month and going up to ₹149.

Is Tandem available globally?
Tandem is currently available in major Tier 1 Indian cities and popular tourist destinations, with expansion planned for global hubs like New York, London, and Singapore.
`
    },
    {
      question: "Privacy & Support",
      icon: icon5,
      answer: `How secure is my data on Tandem?
Tandem prioritizes your privacy with industry-standard security infrastructure. Your personal and group data is safe and used only to enhance your experience.

What support channels are available if I need help?
We’re here to help! You can reach us through in-app support, email, or via our active social media community for quick assistance.`
    }
   ]

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? -1 : index)
  }

  return (
  <section id="faq" className="pt-8 pb-16 xxs:pt-8 xxs:pb-[72px] xs:pt-8 xs:pb-20 sm:pt-8 sm:pb-20 md:py-16 px-4 xxs:px-4 xs:px-4 sm:px-4 md:px-8" style={{ background: '#232323' }}>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-[34px] xxs:text-[38px] xs:text-[42px] md:text-5xl font-bold text-texthigh text-center mb-8 md:mb-12">FAQ</h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-700 rounded-lg overflow-hidden"
              style={{ background: 'rgba(255, 255, 255, 0.10)', backdropFilter: 'blur(50px)' }}
            >
              <button
                className="w-full px-4 xxs:px-4 xs:px-4 sm:px-4 md:px-6 py-3 xxs:py-3.5 xs:py-4 text-left flex justify-between items-center bg-transparent hover:bg-white/10 transition-colors rounded-lg focus:outline-none active:outline-none ring-0 focus:ring-0 active:ring-0"
                style={{ WebkitTapHighlightColor: 'transparent', outline: 'none', appearance: 'none', border: 'none' }}
                onClick={() => toggleFAQ(index)}
              >
                <div className="flex items-center gap-3">
                  <img 
                    src={faq.icon} 
                    alt={`FAQ ${index + 1} icon`}
                    className="w-6 h-6"
                    style={{ filter: 'brightness(0) invert(1)' }}
                  />
                  <span className="text-texthigh font-semibold">{faq.question}</span>
                </div>
                <svg
                  className={`w-6 h-6 text-texthigh transform transition-transform ${
                    openFAQ === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {openFAQ === index && (
                <div className="px-4 xxs:px-4 xs:px-4 sm:px-4 md:px-6 py-3 xxs:py-3.5 xs:py-4 bg-transparent">
                  {renderAnswer(faq.answer)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FAQ
