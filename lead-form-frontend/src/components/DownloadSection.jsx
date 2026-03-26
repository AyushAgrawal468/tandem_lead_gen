import React from 'react'
import QrCardBg from '../assets/qr-card-bg.svg'
import QrCode from '../assets/qr-code.svg'
import StoreButtons from '../assets/store-buttons.svg'

const APP_STORE_URL = 'https://apps.apple.com/in/app/tandem-events-experiences/id6756263621'
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.tandemit.tandemit'

// The SVG is 560x50 — left button: 0–272px, right button: 288–560px (272px each, 16px gap)
const BTN_W = 272
const BTN_H = 50
const FULL_W = 560
const RIGHT_OFFSET = 288

const DownloadSection = () => {
  return (
    <section
      id="download"
      style={{
        background: '#111111',
        padding: '60px 16px 80px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '32px',
      }}
    >
      {/* QR card */}
      <div style={{ position: 'relative', width: '200px', height: '200px' }}>
        <img src={QrCardBg} alt="Download Tandem" width={200} height={200} style={{ display: 'block' }} />
        <img
          src={QrCode}
          alt="Scan to download Tandem"
          style={{
            position: 'absolute',
            top: '14px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '108px',
            height: '108px',
            objectFit: 'contain',
          }}
        />
      </div>

      {/* Desktop (md+): full SVG with invisible overlay anchors */}
      <div className="hidden md:block" style={{ position: 'relative' }}>
        <img
          src={StoreButtons}
          alt="Download on App Store and Google Play"
          style={{ display: 'block', width: `${FULL_W}px`, height: `${BTN_H}px` }}
          draggable={false}
        />
        <a
          href={APP_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Get it on App Store"
          style={{ position: 'absolute', top: 0, left: 0, width: '48.5%', height: '100%', borderRadius: '24px' }}
        />
        <a
          href={PLAY_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Get it on Google Play"
          style={{ position: 'absolute', top: 0, right: 0, width: '48.5%', height: '100%', borderRadius: '24px' }}
        />
      </div>

      {/* Mobile (< md): each button clipped from the same SVG, stacked */}
      <div className="flex md:hidden flex-col items-center gap-4">
        {/* App Store — left half of SVG */}
        <a
          href={APP_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Get it on App Store"
          style={{ display: 'block', width: `${BTN_W}px`, height: `${BTN_H}px`, overflow: 'hidden', position: 'relative', borderRadius: '24px' }}
        >
          <img
            src={StoreButtons}
            alt="Get it on App Store"
            style={{ position: 'absolute', top: 0, left: 0, width: `${FULL_W}px`, height: `${BTN_H}px`, maxWidth: 'none' }}
            draggable={false}
          />
        </a>

        {/* Google Play — right half of SVG */}
        <a
          href={PLAY_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Get it on Google Play"
          style={{ display: 'block', width: `${BTN_W}px`, height: `${BTN_H}px`, overflow: 'hidden', position: 'relative', borderRadius: '24px' }}
        >
          <img
            src={StoreButtons}
            alt="Get it on Google Play"
            style={{ position: 'absolute', top: 0, left: `-${RIGHT_OFFSET}px`, width: `${FULL_W}px`, height: `${BTN_H}px`, maxWidth: 'none' }}
            draggable={false}
          />
        </a>
      </div>
    </section>
  )
}

export default DownloadSection
