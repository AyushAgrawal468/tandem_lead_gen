import React, { useEffect, useState } from 'react'
import { getApiBase } from '../lib/api'

function formatDateToDDMMYYYY(value) {
  if (!value) return ''
  // value is expected as YYYY-MM-DD from <input type="date">
  const [y, m, d] = value.split('-')
  if (!y || !m || !d) return ''
  return `${d.padStart(2,'0')}-${m.padStart(2,'0')}-${y}`
}

const Admin = () => {
  // Session-based auth now handled by Spring Security formLogin; we keep a simple state hint
  const [isAuthed, setIsAuthed] = useState(false)
  const [authError, setAuthError] = useState('')

  const [mode, setMode] = useState('all') // 'all' | 'date'
  const [date, setDate] = useState('') // YYYY-MM-DD
  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState([])
  const [fetchError, setFetchError] = useState('')

  const backendBase = getApiBase() || 'https://tandem.it.com'

  // Auto-check auth on page load: if not logged in, redirect to Spring login
  useEffect(() => {
    let cancelled = false
    const run = async () => {
      try {
        const res = await fetch(`${backendBase}/api/get/all`, {
          method: 'GET', headers: { 'Accept': 'application/json' }, credentials: 'include'
        })
        const ct = res.headers.get('content-type') || ''
        if (!res.ok || !ct.includes('application/json')) {
          if (!cancelled) {
            window.location.href = `${backendBase}/login`
          }
          return
        }
        if (!cancelled) setIsAuthed(true)
      } catch (_) {
        if (!cancelled) setAuthError('Network error while checking login.')
      }
    }
    run()
    return () => { cancelled = true }
  }, [backendBase])

  const testAuth = async () => {
    setAuthError('')
    setIsAuthed(false)
    // Make a lightweight request to a protected endpoint to validate creds
    try {
      const res = await fetch(`${backendBase}/api/get/all`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        credentials: 'include',
      })
      if (res.status === 401) {
        setAuthError('Invalid credentials. Please try again.')
        return
      }
      const ct = res.headers.get('content-type') || ''
      if (!res.ok || !ct.includes('application/json')) {
        const txt = await res.text().catch(() => '')
        if (res.redirected || ct.includes('text/html') || (txt && txt.startsWith('<!DOCTYPE'))) {
          setAuthError('Not logged in. Click Login to authenticate, then return to this page.')
          return
        }
        setAuthError(`Login failed: HTTP ${res.status} ${res.statusText}${txt?` - ${txt.substring(0,120)}`:''}`)
        return
      }
      setIsAuthed(true)
      // Do not persist; just confirm access works
    } catch (e) {
      setAuthError('Network error while logging in. Is the backend running on 8080?')
    }
  }

  const fetchData = async () => {
    if (!isAuthed) {
      setFetchError('Please log in first.')
      return
    }
    setFetchError('')
    setLoading(true)
    setRows([])
    try {
      let url
      if (mode === 'all') {
        url = `${backendBase}/api/get/all`
      } else {
        const formatted = formatDateToDDMMYYYY(date)
        if (!formatted) {
          setFetchError('Please select a valid date.')
          setLoading(false)
          return
        }
        const params = new URLSearchParams({ createdDate: formatted })
        url = `${backendBase}/api/get/date?${params.toString()}`
      }
      const res = await fetch(url, { headers: { 'Accept': 'application/json' }, credentials: 'include' })
      if (res.status === 401) {
        setFetchError('Unauthorized. Please log in again.')
        setIsAuthed(false)
        setLoading(false)
        return
      }
      const ct = res.headers.get('content-type') || ''
      if (!res.ok || !ct.includes('application/json')) {
        const txt = await res.text().catch(() => '')
        if (res.redirected || ct.includes('text/html') || (txt && txt.startsWith('<!DOCTYPE'))) {
          throw new Error('Received an HTML page instead of JSON. Likely not authenticated or backend not restarted with Basic auth.')
        }
        throw new Error(`HTTP ${res.status} ${res.statusText}${txt?` - ${txt.substring(0,160)}`:''}`)
      }
      const data = await res.json()
      setRows(Array.isArray(data) ? data : [])
    } catch (e) {
      setFetchError(e.message || 'Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg-color text-texthigh font-body-r">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl lg:text-4xl font-bold mb-6">Welcome Tandem Admin</h1>

        {/* Login box (stateful via Spring Security form Login) */}
        {!isAuthed && (
          <div className="mb-8 p-4 rounded-lg border border-white/15 bg-white/5">
            <p className="mb-3 text-white/80">This page requires authentication. Use Spring Security’s login page, then return here.</p>
            <div className="flex gap-3">
              <button
                onClick={() => { window.location.href = `${backendBase}/login`; }}
                className="px-4 py-2 rounded bg-white/15 hover:bg-white/25 border border-white/30 text-white font-semibold"
              >Login</button>
              <button
                onClick={testAuth}
                className="px-4 py-2 rounded bg-white/15 hover:bg-white/25 border border-white/30 text-white font-semibold"
              >Check Login</button>
            </div>
            {authError && <p className="mt-3 text-red-400">{authError}</p>}
          </div>
        )}

        {/* Controls */}
        <div className="mb-6 p-4 rounded-lg border border-white/15 bg-white/5">
          <div className="flex flex-col md:flex-row md:items-start gap-4">
            {/* Search by date with date input directly below */}
            <div className="flex flex-col">
              <label className="inline-flex items-center gap-2">
                <input type="radio" name="mode" value="date" checked={mode==='date'} onChange={() => setMode('date')} />
                <span>Search by date</span>
              </label>
              {mode === 'date' && (
                <div className="mt-2">
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="px-3 py-2 rounded bg-black/40 border border-white/20 text-white"
                  />
                </div>
              )}
            </div>

            {/* Get All option */}
            <label className="inline-flex items-center gap-2">
              <input type="radio" name="mode" value="all" checked={mode==='all'} onChange={() => setMode('all')} />
              <span>Get All</span>
            </label>

            {/* Fetch button aligned to the right on md+ */}
            <div className="md:ml-auto">
              <button
                onClick={fetchData}
                disabled={loading}
                className="px-4 py-2 rounded bg-[#4DBBFF] text-[#0B1A24] font-semibold disabled:opacity-60"
              >{loading ? 'Loading…' : 'Fetch'}</button>
            </div>
          </div>
          {fetchError && <p className="mt-3 text-red-400">{fetchError}</p>}
        </div>

        {/* Data table */}
        <div className="rounded-lg border border-white/15 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-white/10">
                <tr>
                  <th className="px-3 py-2">ID</th>
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Mobile</th>
                  <th className="px-3 py-2">Email</th>
                  <th className="px-3 py-2">Session ID</th>
                  <th className="px-3 py-2">Location Fetched</th>
                  <th className="px-3 py-2">Created At</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-3 py-6 text-center text-white/60">{loading ? 'Loading…' : 'No data to show.'}</td>
                  </tr>
                ) : rows.map((r) => (
                  <tr key={r.id} className="odd:bg-white/0 even:bg-white/[0.03]">
                    <td className="px-3 py-2">{r.id}</td>
                    <td className="px-3 py-2">{r.name}</td>
                    <td className="px-3 py-2">{r.mobile}</td>
                    <td className="px-3 py-2">{r.email}</td>
                    <td className="px-3 py-2">{r.sessionId}</td>
                    <td className="px-3 py-2">{r.locationFetched}</td>
                    <td className="px-3 py-2">{r.createdAt ?? ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Admin
