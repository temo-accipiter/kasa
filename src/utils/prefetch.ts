/**
 * Utilitaire de préfetching pour améliorer les performances de navigation
 *
 * Stratégies :
 * 1. Prefetch on hover : précharge la route au survol du lien
 * 2. Prefetch on idle : précharge les routes critiques quand le navigateur est idle
 * 3. Preload : précharge les ressources critiques immédiatement
 */

// Cache pour éviter les préchargements multiples
const prefetchedRoutes = new Set<string>()
const prefetchedResources = new Set<string>()

/**
 * Précharge une route dynamiquement
 *
 * @param path - Chemin de la route à précharger
 * @returns Promise résolue quand le chunk est chargé
 *
 * @example
 * ```tsx
 * <Link
 *   to="/about"
 *   onMouseEnter={() => prefetchRoute('/about')}
 * >
 *   À propos
 * </Link>
 * ```
 */
export async function prefetchRoute(path: string): Promise<void> {
  // Déjà préchargé, skip
  if (prefetchedRoutes.has(path)) {
    return
  }

  // Marquer comme préchargé
  prefetchedRoutes.add(path)

  try {
    // Mapping des routes vers leurs imports
    // Note: Vite optimise automatiquement ces imports dynamiques
    const routeImports: Record<string, () => Promise<unknown>> = {
      "/": () => import("../pages/home/Home"),
      "/about": () => import("../pages/about/About"),
      "/apart": () => import("../pages/apart/Apart"), // Base sans :id
    }

    // Normaliser le path (enlever les paramètres)
    const normalizedPath = path.split("/:")[0]

    // Trouver et précharger le module correspondant
    const importFn = routeImports[normalizedPath]
    if (importFn) {
      await importFn()
    }
  } catch (error) {
    console.warn(`Failed to prefetch route: ${path}`, error)
    // Retirer du cache en cas d'erreur pour réessayer
    prefetchedRoutes.delete(path)
  }
}

/**
 * Précharge une ressource (image, font, etc.)
 *
 * @param url - URL de la ressource
 * @param as - Type de ressource ('image', 'font', 'script', 'style')
 *
 * @example
 * ```ts
 * preloadResource('/assets/hero.webp', 'image');
 * ```
 */
export function preloadResource(
  url: string,
  as: "image" | "font" | "script" | "style" | "fetch",
): void {
  // Déjà préchargé, skip
  if (prefetchedResources.has(url)) {
    return
  }

  prefetchedResources.add(url)

  // Créer un élément link avec rel="preload"
  const link = document.createElement("link")
  link.rel = "preload"
  link.href = url
  link.as = as

  // Pour les fonts, ajouter crossorigin
  if (as === "font") {
    link.crossOrigin = "anonymous"
  }

  document.head.appendChild(link)
}

/**
 * Précharge une liste de routes quand le navigateur est idle
 *
 * @param paths - Chemins des routes à précharger
 *
 * @example
 * ```ts
 * // Dans un useEffect après le premier rendu
 * prefetchRoutesOnIdle(['/about', '/contact']);
 * ```
 */
export function prefetchRoutesOnIdle(paths: string[]): void {
  // Vérifier si requestIdleCallback est disponible
  if ("requestIdleCallback" in window) {
    ;(
      window as Window & { requestIdleCallback: (callback: () => void) => void }
    ).requestIdleCallback(() => {
      paths.forEach((path) => {
        prefetchRoute(path)
      })
    })
  } else {
    // Fallback: utiliser setTimeout
    setTimeout(() => {
      paths.forEach((path) => {
        prefetchRoute(path)
      })
    }, 1000)
  }
}

/**
 * Hook React pour précharger une route au survol
 *
 * @returns Objet avec les handlers d'événements
 *
 * @example
 * ```tsx
 * function NavigationLink({ to, children }) {
 *   const prefetchHandlers = usePrefetchOnHover(to);
 *
 *   return (
 *     <Link to={to} {...prefetchHandlers}>
 *       {children}
 *     </Link>
 *   );
 * }
 * ```
 */
export function usePrefetchOnHover(path: string) {
  const handleMouseEnter = () => {
    prefetchRoute(path)
  }

  const handleTouchStart = () => {
    prefetchRoute(path)
  }

  return {
    onMouseEnter: handleMouseEnter,
    onTouchStart: handleTouchStart,
  }
}

/**
 * Efface le cache de préfetching
 * Utile pour les tests ou pour forcer un rechargement
 */
export function clearPrefetchCache(): void {
  prefetchedRoutes.clear()
  prefetchedResources.clear()
}

/**
 * Obtient les statistiques de préfetching
 * Utile pour le debugging et l'analytics
 */
export function getPrefetchStats(): {
  routesCached: number
  resourcesCached: number
  cachedRoutes: string[]
  cachedResources: string[]
} {
  return {
    routesCached: prefetchedRoutes.size,
    resourcesCached: prefetchedResources.size,
    cachedRoutes: Array.from(prefetchedRoutes),
    cachedResources: Array.from(prefetchedResources),
  }
}
