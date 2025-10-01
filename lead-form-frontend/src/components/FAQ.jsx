import React, { useState } from 'react'

const FAQ = () => {
  const [openFAQ, setOpenFAQ] = useState(0)

  const faqs = [
    {
      question: "What is Tandem?",
      answer: "Tandem is a social planning app designed to make coordinating activities with friends effortless and fun. It lets users swipe together on things to do — not people — enabling groups to finalize plans in just a few swipes rather than endless group chat messages."
    },
    {
      question: "How does Tandem solve group planning problems?",
      answer: "Tandem eliminates the chaos of fragmented group chats by enabling synchronized real-time voting on activities curated by AI. This reduces the average 23-message conversation down to about 3 to 5 swipes, saving time and decision fatigue while boosting actual attendance at events."
    },
    {
      question: "Who is Tandem for?",
      answer: "Tandem primarily targets urban young adults aged 18-35, including students and early-career professionals. It is ideal for close-knit friend groups, families, and coworker meetups who want seamless, personalized social planning with strong group engagement."
    },
    {
      question: "How do I use Tandem to plan an event?",
      answer: "Users browse AI-curated activity cards together in real time, swipe to vote within a few minutes, and lock in a plan with one final confirmation swipe. The app syncs with calendars, map locations, and reminds participants to boost turnout."
    },
    {
      question: "What unique features does Tandem offer?",
      answer: `• Synchronized group swiping to vote together in real-time\n• AI-powered activity suggestions personalized to the group\n• Instant RSVP tallies and reminders to ensure attendance\n• A Memory Wall that automatically compiles photos and videos from events\n• Gamification elements like streaks and badges to encourage regular use `
    },
    {
      question: "Is Tandem only for friends or can it be used for wider social groups?",
      answer: "Tandem is designed to work best within existing friend circles but is inclusive enough for various social groups including family gatherings, college crews, or coworker outings. It’s built to accommodate different group dynamics for meaningful shared experiences."
    },
    {
      question: "Does Tandem replace other apps like WhatsApp, Google Calendar, or Instagram?",
      answer: "Tandem brings together discovery, group coordination, chat, calendar syncing, and maps, all in a single app. This means you don’t need to constantly switch between WhatsApp, Google Calendar, or Instagram just to plan and attend events."
    },
    {
      question: "How does Tandem enhance attendance at group events?",
      answer: "By enabling real-time voting, instant RSVP counts, push notifications, and fun gamification rewards, Tandem significantly boosts actual turnout compared to traditional planning methods where many plans get canceled or ignored"
    },
    {
      question: "What are the subscription options and costs?",
      answer: "Getting started with Tandem is free! Upgrade to Tandem Plus or Tandem Premium to unlock unlimited swipes, no ads, and exclusive Memory Wall features. Plans are super affordable, starting at ₹99 per month and topping out at ₹149."
    },
    {
      question: "Is Tandem available globally?",
      answer: "Currently, Tandem is launched across major Tier 1 Indian cities and popular tourist destinations, with plans for expansion into global urban centers such as New York, London, and Singapore.."
    },
    {
      question: "How secure is my data on Tandem?",
      answer: "Tandem emphasizes user privacy and data security with industry-standard backend infrastructure and practices ensuring personal and group data is safe and used only to enhance the social planning experience."
    },
    {
      question: "Can Tandem help me discover new activities?",
      answer: "Yes, using AI that learns your group’s preferences, Tandem curates personalized activity suggestions that minimize endless scrolling and decision fatigue, making it easy to discover fun, relevant things to do together."
    },
    {
      question: "How does the Memory Wall work?",
      answer: "After an event, Tandem’s Memory Wall enables users to upload photos and videos shared by attendees and Tandem automatically creates a beautiful, shareable collage, helping create lasting social memories and encouraging group bonding beyond the event itself."
    },
    {
      question: "Who created Tandem?",
      answer: "Tandem is developed by Orbitandem Technologies Pvt Ltd, a Bengaluru-based company with a strong leadership team focused on building innovative social planning technology leveraging AI and gamification."
    },
    {
      question: "What support channels are available if I need help?",
      answer: "Tandem provides customer support through email contacts, and regular community engagement via social media to ensure users have assistance whenever needed."
    }
  ]

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? -1 : index)
  }

  return (
  <section id="faq" className="py-16 xxs:py-[72px] xs:py-20 px-4 xxs:px-5 xs:px-8" style={{ background: '#232323' }}>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-[34px] xxs:text-[38px] xs:text-[42px] md:text-5xl font-bold text-texthigh text-center mb-12">FAQ</h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-700 rounded-lg overflow-hidden"
              style={{ background: 'rgba(255, 255, 255, 0.10)', backdropFilter: 'blur(50px)' }}
            >
              <button
                className="w-full px-4 xxs:px-5 xs:px-6 py-3 xxs:py-3.5 xs:py-4 text-left flex justify-between items-center bg-transparent hover:bg-white/10 transition-colors rounded-lg focus:outline-none active:outline-none ring-0 focus:ring-0 active:ring-0"
                style={{ WebkitTapHighlightColor: 'transparent', outline: 'none', appearance: 'none', border: 'none' }}
                onClick={() => toggleFAQ(index)}
              >
                <span className="text-texthigh font-semibold">{faq.question}</span>
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
                <div className="px-4 xxs:px-5 xs:px-6 py-3 xxs:py-3.5 xs:py-4 bg-transparent">
                  <p className="text-textmid leading-relaxed whitespace-pre-line">{faq.answer}</p>
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
