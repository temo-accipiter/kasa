import React, { useState, useEffect, useRef } from "react"
import "./LazyImage.scss"

interface LazyImageProps {
  src: string
  alt: string
  className?: string
  placeholder?: string
}

/**
 * Composant d'image optimisée avec lazy loading
 * Utilise l'Intersection Observer API pour charger l'image uniquement quand elle est visible
 */
const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = "",
  placeholder,
}) => {
  const [imageSrc, setImageSrc] = useState<string | undefined>(placeholder)
  const [isLoaded, setIsLoaded] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setImageSrc(src)
            if (imgRef.current) {
              observer.unobserve(imgRef.current)
            }
          }
        })
      },
      {
        rootMargin: "50px", // Commence à charger 50px avant que l'image soit visible
      },
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => {
      if (imgRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(imgRef.current)
      }
    }
  }, [src])

  const handleLoad = () => {
    setIsLoaded(true)
  }

  return (
    <img
      ref={imgRef}
      src={imageSrc}
      alt={alt}
      className={`lazy-image ${className} ${isLoaded ? "loaded" : ""}`}
      onLoad={handleLoad}
      loading="lazy"
    />
  )
}

export default LazyImage
