import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { initAnalytics } from './lib/analytics'

// Robust mobile viewport height fix: sets --vh to 1% of the visual viewport height
function setViewportVars() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return
  const vh = (window.visualViewport?.height || window.innerHeight) * 0.01
  document.documentElement.style.setProperty('--vh', `${vh}px`)
}

// Initialize and keep updated on viewport changes
setViewportVars()
if (typeof window !== 'undefined') {
  window.addEventListener('resize', setViewportVars, { passive: true })
  window.addEventListener('orientationchange', setViewportVars)
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', setViewportVars, { passive: true })
  }
}

// Handoff 2.7: first-touch UTM tags, Sentry and PostHog before the first render, so no visit is lost
initAnalytics()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
