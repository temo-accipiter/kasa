import { useEffect, useState } from "react"

/**
 * Hook to detect user's motion preference
 *
 * Respects the prefers-reduced-motion media query for accessibility
 *
 * @returns boolean - true if user prefers reduced motion
 *
 * @example
 * ```tsx
 * function AnimatedComponent() {
 *   const prefersReducedMotion = useReducedMotion()
 *
 *   return (
 *     <motion.div
 *       animate={{ x: prefersReducedMotion ? 0 : 100 }}
 *       transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
 *     >
 *       Content
 *     </motion.div>
 *   )
 * }
 * ```
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    getInitialState(),
  )

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")

    // Update state if media query changes
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches)
    }

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange)
    }
    // Fallback for older browsers
    else {
      mediaQuery.addListener(handleChange)
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleChange)
      } else {
        mediaQuery.removeListener(handleChange)
      }
    }
  }, [])

  return prefersReducedMotion
}

/**
 * Get initial reduced motion preference
 */
function getInitialState(): boolean {
  // Server-side rendering guard
  if (typeof window === "undefined") {
    return false
  }

  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
  return mediaQuery.matches
}

/**
 * Get animation duration based on reduced motion preference
 *
 * @param normalDuration - Normal animation duration in seconds
 * @param reducedDuration - Reduced animation duration (default: 0)
 * @returns Animation duration
 *
 * @example
 * ```tsx
 * function AnimatedComponent() {
 *   const duration = getAnimationDuration(0.5, 0.1)
 *
 *   return (
 *     <motion.div
 *       transition={{ duration }}
 *       animate={{ opacity: 1 }}
 *     >
 *       Content
 *     </motion.div>
 *   )
 * }
 * ```
 */
export function getAnimationDuration(
  normalDuration: number,
  reducedDuration: number = 0,
): number {
  if (typeof window === "undefined") {
    return normalDuration
  }

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches

  return prefersReducedMotion ? reducedDuration : normalDuration
}

/**
 * Get animation variant based on reduced motion preference
 *
 * @param normalVariant - Normal animation variant
 * @param reducedVariant - Reduced animation variant
 * @returns Animation variant object
 *
 * @example
 * ```tsx
 * const fadeInVariants = getAnimationVariant(
 *   {
 *     initial: { opacity: 0, y: 20 },
 *     animate: { opacity: 1, y: 0 },
 *   },
 *   {
 *     initial: { opacity: 0 },
 *     animate: { opacity: 1 },
 *   }
 * )
 *
 * <motion.div variants={fadeInVariants} initial="initial" animate="animate">
 *   Content
 * </motion.div>
 * ```
 */
export function getAnimationVariant<T>(normalVariant: T, reducedVariant: T): T {
  if (typeof window === "undefined") {
    return normalVariant
  }

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches

  return prefersReducedMotion ? reducedVariant : normalVariant
}

/**
 * CSS class helper for reduced motion
 *
 * Adds a class to document root when reduced motion is preferred
 * Can be used in CSS for conditional styling
 *
 * @example
 * ```tsx
 * function App() {
 *   useReducedMotionClass()
 *
 *   return <div>...</div>
 * }
 *
 * // In CSS:
 * .element {
 *   transition: transform 0.3s;
 * }
 *
 * .reduced-motion .element {
 *   transition: none;
 * }
 * ```
 */
export function useReducedMotionClass(
  className: string = "reduced-motion",
): void {
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")

    const updateClass = () => {
      if (mediaQuery.matches) {
        document.documentElement.classList.add(className)
      } else {
        document.documentElement.classList.remove(className)
      }
    }

    // Initial update
    updateClass()

    // Listen for changes
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", updateClass)
    } else {
      mediaQuery.addListener(updateClass)
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", updateClass)
      } else {
        mediaQuery.removeListener(updateClass)
      }
      document.documentElement.classList.remove(className)
    }
  }, [className])
}
