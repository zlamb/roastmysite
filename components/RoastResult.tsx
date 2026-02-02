'use client'

import { useState } from 'react'

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

interface Props {
  data: RoastData
  onReset: () => void
}

export default function RoastResult({ data, onReset }: Props) {
  const [copied, setCopied] = useState(false)

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    if (score >= 40) return 'text-orange-400'
    return 'text-red-500'
  }

  const getScoreEmoji = (score: number) => {
    if (score >= 90) return '🏆'
    if (score >= 80) return '🌟'
    if (score >= 70) return '👍'
    if (score >= 60) return '😐'
    if (score >= 50) return '😬'
    if (score >= 40) return '💀'
    return '☠️'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Actually Impressive'
    if (score >= 80) return 'Pretty Solid'
    if (score >= 70) return 'Decent'
    if (score >= 60) return 'Needs Work'
    if (score >= 50) return 'Yikes'
    if (score >= 40) return 'Dumpster Fire'
    return 'A Crime Against the Internet'
  }

  const handleShare = async (platform: 'twitter' | 'copy') => {
    const text = `My website got roasted! Score: ${data.score}/100 ${getScoreEmoji(data.score)}`
    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank')
    } else {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="space-y-6">
      <div className="score-card rounded-2xl p-8 glow-fire">
        <div className="text-center mb-6">
          <div className="text-6xl mb-2">{getScoreEmoji(data.score)}</div>
          <div className={`text-8xl font-black ${getScoreColor(data.score)}`}>{data.score}</div>
          <div className="text-gray-400 text-xl">/100</div>
          <div className={`text-lg font-bold mt-2 ${getScoreColor(data.score)}`}>{getScoreLabel(data.score)}</div>
        </div>

        <div className="text-center text-gray-500 text-sm mb-6 truncate">{data.url}</div>

        <div className="bg-black/30 rounded-xl p-6 mb-6">
          <h3 className="text-orange-400 font-bold mb-3">🔥 THE ROAST</h3>
          <p className="text-white text-lg italic">"{data.roast}"</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {Object.entries(data.metrics).map(([key, value]) => (
            <div key={key} className="bg-black/20 rounded-lg p-4">
              <div className="text-gray-400 text-sm capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
              <div className={`text-2xl font-bold ${getScoreColor(value)}`}>{value}</div>
            </div>
          ))}
        </div>

        {data.burns.length > 0 && (
          <div className="mb-4">
            <h4 className="text-red-400 font-bold mb-2">🔥 Burns:</h4>
            <ul className="space-y-1">
              {data.burns.map((burn, i) => (
                <li key={i} className="text-gray-300 text-sm">• {burn}</li>
              ))}
            </ul>
          </div>
        )}

        {data.compliments.length > 0 && (
          <div className="mb-4">
            <h4 className="text-green-400 font-bold mb-2">✨ Silver Linings:</h4>
            <ul className="space-y-1">
              {data.compliments.map((c, i) => (
                <li key={i} className="text-gray-300 text-sm">• {c}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button onClick={() => handleShare('twitter')} className="flex-1 py-3 px-6 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl">
          🐦 Share on X
        </button>
        <button onClick={() => handleShare('copy')} className="flex-1 py-3 px-6 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-xl">
          {copied ? '✓ Copied!' : '📋 Copy'}
        </button>
      </div>

      <button onClick={onReset} className="w-full py-4 px-8 text-lg font-bold rounded-xl btn-fire text-white">
        🔥 ROAST ANOTHER SITE 🔥
      </button>
    </div>
  )
}
