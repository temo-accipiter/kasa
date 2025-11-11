import { useState, useEffect, useRef } from "react"
import "./Image.scss"

export interface ImageProps {
  /** URL de l'image ou objet avec sources multiples */
  src: string | { webp?: string; avif?: string; fallback: string }
  /** Texte alternatif (obligatoire pour l'accessibilité) */
  alt: string
  /** Largeur de l'image */
  width?: number
  /** Hauteur de l'image */
  height?: number
  /** Active le lazy loading (par défaut: true) */
  loading?: "lazy" | "eager"
  /** Classe CSS supplémentaire */
  className?: string
  /** Callback quand l'image est chargée */
  onLoad?: () => void
  /** Callback en cas d'erreur */
  onError?: () => void
  /** Utilise un placeholder blur pendant le chargement */
  placeholder?: "blur" | "none"
  /** URL du placeholder blur (petite image base64 ou URL) */
  placeholderSrc?: string
  /** Attribut sizes pour responsive images */
  sizes?: string
  /** Attribut srcSet pour responsive images */
  srcSet?: string
}

/**
 * Composant Image optimisé avec support pour :
 * - Lazy loading natif
 * - Formats modernes (WebP, AVIF)
 * - Placeholder blur
 * - Accessibilité (alt obligatoire)
 * - Responsive images (srcSet, sizes)
 *
 * @example
 * ```tsx
 * // Image simple avec lazy loading
 * <Image src="/hero.jpg" alt="Hero image" loading="lazy" />
 *
 * // Image avec formats multiples
 * <Image
 *   src={{
 *     avif: '/hero.avif',
 *     webp: '/hero.webp',
 *     fallback: '/hero.jpg'
 *   }}
 *   alt="Hero image"
 *   width={800}
 *   height={600}
 * />
 *
 * // Image responsive
 * <Image
 *   src="/hero.jpg"
 *   srcSet="/hero-400w.jpg 400w, /hero-800w.jpg 800w"
 *   sizes="(max-width: 600px) 400px, 800px"
 *   alt="Hero image"
 * />
 * ```
 */
export default function Image({
  src,
  alt,
  width,
  height,
  loading = "lazy",
  className = "",
  onLoad,
  onError,
  placeholder = "blur",
  placeholderSrc,
  sizes,
  srcSet,
}: ImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  // Vérifier si l'image est déjà dans le cache
  useEffect(() => {
    if (imgRef.current?.complete) {
      setIsLoaded(true)
    }
  }, [])

  const handleLoad = () => {
    setIsLoaded(true)
    onLoad?.()
  }

  const handleError = () => {
    setHasError(true)
    onError?.()
  }

  // Si src est un objet avec plusieurs formats, utiliser <picture>
  if (typeof src === "object") {
    const { avif, webp, fallback } = src

    return (
      <picture className={`image-wrapper ${className}`}>
        {avif && <source type="image/avif" srcSet={avif} />}
        {webp && <source type="image/webp" srcSet={webp} />}
        <img
          ref={imgRef}
          src={fallback}
          alt={alt}
          width={width}
          height={height}
          loading={loading}
          onLoad={handleLoad}
          onError={handleError}
          className={`image ${isLoaded ? "image--loaded" : ""} ${
            hasError ? "image--error" : ""
          }`}
        />
        {placeholder === "blur" && !isLoaded && !hasError && (
          <div
            className="image-placeholder"
            style={
              placeholderSrc
                ? {
                    backgroundImage: `url(${placeholderSrc})`,
                  }
                : undefined
            }
          />
        )}
      </picture>
    )
  }

  // Image simple
  return (
    <div className={`image-wrapper ${className}`}>
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        sizes={sizes}
        srcSet={srcSet}
        className={`image ${isLoaded ? "image--loaded" : ""} ${
          hasError ? "image--error" : ""
        }`}
      />
      {placeholder === "blur" && !isLoaded && !hasError && (
        <div
          className="image-placeholder"
          style={
            placeholderSrc
              ? {
                  backgroundImage: `url(${placeholderSrc})`,
                }
              : undefined
          }
        />
      )}
    </div>
  )
}
