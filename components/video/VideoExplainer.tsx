'use client'

import { useState, useEffect } from 'react'

interface VideoExplainerProps {
  autoplay?: boolean
  className?: string
  onComplete?: () => void
}

export default function VideoExplainer({ 
  autoplay = false, 
  className = '',
  onComplete 
}: VideoExplainerProps) {
  const [isPlaying, setIsPlaying] = useState(autoplay)
  const [showPlayButton, setShowPlayButton] = useState(!autoplay)

  useEffect(() => {
    if (autoplay) {
      setIsPlaying(true)
      setShowPlayButton(false)
    }
  }, [autoplay])

  return (
    <div className={`relative w-full ${className}`}>
      {/* Play Button Overlay */}
      {showPlayButton && (
        <div 
          className="absolute inset-0 z-10 flex items-center justify-center cursor-pointer group"
          onClick={() => {
            setIsPlaying(true)
            setShowPlayButton(false)
          }}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <button className="relative z-20 w-24 h-24 flex items-center justify-center rounded-full bg-[var(--orange)] shadow-2xl transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_60px_rgba(255,92,0,0.4)]">
            <svg 
              width="32" 
              height="32" 
              viewBox="0 0 24 24" 
              fill="none" 
              className="ml-1"
            >
              <path 
                d="M8 5v14l11-7L8 5z" 
                fill="white"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Video iFrame */}
      <div 
        className="relative overflow-hidden rounded-2xl shadow-2xl"
        style={{
          paddingBottom: '61.9%', // 840/520 aspect ratio
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)'
        }}
      >
        <iframe
          src="/videos/explainer.html"
          className="absolute inset-0 w-full h-full border-0"
          allow="autoplay"
          loading="lazy"
          title="FitFlow Explainer Video"
        />
      </div>

      {/* Caption */}
      <div className="mt-4 text-center">
        <p className="text-sm text-[var(--gray)]">
          ⚡ Découvrez comment FitFlow transforme vos commentaires Instagram en clients
        </p>
      </div>
    </div>
  )
}
