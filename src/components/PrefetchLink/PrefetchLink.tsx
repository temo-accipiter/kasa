import { Link, type LinkProps } from "react-router-dom"
import { usePrefetchOnHover } from "../../utils/prefetch"

/**
 * Composant Link amélioré avec préfetching automatique
 *
 * Précharge automatiquement la route cible au survol ou au touch
 * pour améliorer la perception de performance
 *
 * @example
 * ```tsx
 * <PrefetchLink to="/about">
 *   À propos
 * </PrefetchLink>
 * ```
 */
export default function PrefetchLink(props: LinkProps) {
  const { to, onMouseEnter, onTouchStart, ...restProps } = props

  // Obtenir les handlers de préfetching
  const prefetchHandlers = usePrefetchOnHover(to.toString())

  // Combiner les handlers existants avec les handlers de préfetching
  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    prefetchHandlers.onMouseEnter()
    onMouseEnter?.(e)
  }

  const handleTouchStart = (e: React.TouchEvent<HTMLAnchorElement>) => {
    prefetchHandlers.onTouchStart()
    onTouchStart?.(e)
  }

  return (
    <Link
      to={to}
      onMouseEnter={handleMouseEnter}
      onTouchStart={handleTouchStart}
      {...restProps}
    />
  )
}
