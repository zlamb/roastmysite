'use client'

import { useState } from 'react'
import RoastResult from '@/components/RoastResult'
import LoadingFlame from '@/components/LoadingFlame'

interface RoastData {
  url: string
  score: number
  roast: string
  metrics: {
    performance: number
    accessibility: number
    seo: number
    bestPractices: number
  }
  burns: string[]
  compliments: string[]
}

export default function Home() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<RoastData | null>(null)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setResult(null)

    let cleanUrl = url.trim()
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = 'https://' + cleanUrl
    }

    try {
      new URL(cleanUrl)
    } catch {
      setError('Please enter a valid URL')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/roast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: cleanUrl })
      })

      if (!response.ok) {
        throw new Error('Failed to roast website')
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError('Failed to roast this website. It might be protected or unreachable.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setResult(null)
    setUrl('')
    setError('')
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl font-black mb-4">
            <span className="fire-gradient">ROAST</span>
            <span className="text-white">MY</span>
            <span className="fire-gradient">SITE</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl">
            Let AI brutally roast your website. Get scored. Share your shame.
          </p>
        </div>

        {!result && !loading && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter your website URL..."
                className="w-full px-6 py-4 text-lg rounded-xl input-fire text-white placeholder-gray-500"
                disabled={loading}
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !url.trim()}
              className="w-full py-4 px-8 text-xl font-bold rounded-xl btn-fire text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ROAST IT
            </button>
          </form>
        )}

        {loading && <LoadingFlame />}

        {result && (
          <RoastResult data={result} onReset={handleReset} />
        )}

        <div className="mt-12 text-gray-600 text-sm">
          <p>Built for moonshots. Your website deserves the truth.</p>
        </div>
      </div>
    </main>
  )
}
