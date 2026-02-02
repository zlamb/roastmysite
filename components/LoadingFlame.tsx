'use client'

import { useState, useEffect } from 'react'

const loadingMessages = [
  "Heating up the roast...",
  "Analyzing your digital dumpster fire...",
  "Preparing brutal honesty...",
  "Summoning the roast gods...",
  "Your website is entering the burn zone...",
  "Calculating disappointment levels...",
  "Finding all the things wrong with your site...",
  "This might hurt a little...",
]

export default function LoadingFlame() {
  const [messageIndex, setMessageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-8">
      <div className="text-8xl animate-bounce">
        🔥
      </div>
      <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
        <div className="h-full w-full bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 animate-pulse rounded-full" />
      </div>
      <p className="text-orange-400 text-lg font-medium animate-pulse">
        {loadingMessages[messageIndex]}
      </p>
    </div>
  )
}
