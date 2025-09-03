import React from 'react'
import FeatureCarousel from './FeatureCarousel'

const Features = () => {
  return (
    <section id="features" className="pt-16 pb-20" style={{ zIndex: 1, position: 'relative', marginTop: 'clamp(60px, 10vw, 120px)' }}>
      {/* Full-bleed container spanning the full viewport width */}
      <div className="relative" style={{ width: '100vw', marginLeft: 'calc(50% - 50vw)', marginRight: 'calc(50% - 50vw)' }}>
        <div className="px-6 md:px-10">
          {/* Carousel with heading slotted just under the left previews */}
          <FeatureCarousel
            belowLeft={(
              <h2 
                className="text-left font-bold text-white"
                style={{
                  fontFamily: '"Anek Latin", sans-serif',
                  fontSize: '64px',
                  fontWeight: 700,
                  lineHeight: '120%',
                  color: 'rgba(255, 255, 255, 1)'
                }}
              >
                Why be on
                <br />
                Tandem?
              </h2>
            )}
          />
        </div>
      </div>
    </section>
  )
}

export default Features
