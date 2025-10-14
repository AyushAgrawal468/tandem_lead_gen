import React from 'react'
import { useNavigate } from 'react-router-dom'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-bg-color text-texthigh font-body-r flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl mb-6">Page not found</p>
        <p className="text-white/60 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 rounded-lg bg-[#4DBBFF] text-[#0B1A24] font-semibold hover:bg-[#6AC6FF] transition-colors"
        >
          Go Home
        </button>
      </div>
    </div>
  )
}

export default NotFound
