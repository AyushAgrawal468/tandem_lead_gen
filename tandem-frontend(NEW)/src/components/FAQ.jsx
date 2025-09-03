import React, { useState } from 'react'

const FAQ = () => {
  const [openFAQ, setOpenFAQ] = useState(0)

  const faqs = [
    {
      question: "The Loneliness Pandemic— How the World Became Lonely",
      answer: "Introduction In 2024, the World Health Organisation (WHO) recognised loneliness as a global public health concern, highlighting its significant impact on individuals across all age groups. The Skin Speaks Since In teens."
    },
    {
      question: "The Loneliness Pandemic— How the World Became Lonely",
      answer: "Introduction In 2024, the World Health Organisation (WHO) recognised loneliness as a global public health concern, highlighting its significant impact on individuals across all age groups."
    },
    {
      question: "The Loneliness Pandemic— How the World Became Lonely",
      answer: "Introduction In 2024, the World Health Organisation (WHO) recognised loneliness as a global public health concern, highlighting its significant impact on individuals across all age groups."
    }
  ]

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? -1 : index)
  }

  return (
    <section id="faq" className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-texthigh text-center mb-16">FAQ</h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-700 rounded-lg overflow-hidden"
              style={{ background: 'rgba(255, 255, 255, 0.10)', backdropFilter: 'blur(50px)' }}
            >
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center bg-transparent hover:bg-white/10 transition-colors"
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
                <div className="px-6 py-4 bg-transparent">
                  <p className="text-textmid leading-relaxed">{faq.answer}</p>
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
