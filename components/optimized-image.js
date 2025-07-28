"use client"

import Image from "next/image"
import { useState } from "react"

export function OptimizedImage({ src, alt, width, height, className = "", priority = false, ...props }) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && <div className="absolute inset-0 bg-gray-800 animate-pulse rounded-lg" />}
      <Image
        src={error ? "/placeholder-error.svg" : src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        quality={85}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setError(true)
          setIsLoading(false)
        }}
        className={`transition-opacity duration-300 ${isLoading ? "opacity-0" : "opacity-100"}`}
        {...props}
      />
    </div>
  )
}
