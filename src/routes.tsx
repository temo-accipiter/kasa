import * as React from "react"
import type { RouteObject } from "react-router-dom"
import App from "./App"

/**
 * Métadonnées supplémentaires pour une route
 */
export interface RouteMetadata {
  /** Titre de la page pour le document title */
  title?: string
  /** Description pour les métadonnées */
  description?: string
  /** Priorité de préchargement (1=haute, 2=moyenne, 3=basse) */
  prefetchPriority?: 1 | 2 | 3
  /** Si true, précharge la route au survol des liens */
  prefetchOnHover?: boolean
}

/**
 * Configuration d'une route avec métadonnées
 */
export type RouteConfig = RouteObject & RouteMetadata

// Lazy loading de toutes les pages pour code-splitting optimal
const HomePage = React.lazy(() => import("./pages/home/Home"))
const AboutPage = React.lazy(() => import("./pages/about/About"))
const ApartPage = React.lazy(() => import("./pages/apart/Apart"))
const ErrorPage = React.lazy(() => import("./pages/errorpage/ErrorPage"))

/**
 * Configuration centralisée des routes de l'application
 *
 * Avantages :
 * - Code-splitting automatique via React.lazy()
 * - Métadonnées centralisées (SEO, préfetching)
 * - Configuration déclarative et maintenable
 * - Type-safe avec TypeScript
 */
export const routes: RouteConfig[] = [
  {
    element: <App />,
    children: [
      {
        path: "/",
        element: <HomePage />,
        title: "Kasa - Accueil",
        description: "Trouvez votre logement idéal parmi notre sélection",
        prefetchPriority: 1,
        prefetchOnHover: true,
      },
      {
        path: "about",
        element: <AboutPage />,
        title: "Kasa - À propos",
        description: "Découvrez notre entreprise et nos valeurs",
        prefetchPriority: 2,
        prefetchOnHover: true,
      },
      {
        path: "apart/:id",
        element: <ApartPage />,
        title: "Kasa - Détails du logement",
        description: "Découvrez les détails de ce logement",
        prefetchPriority: 2,
        prefetchOnHover: true,
      },
      {
        path: "*",
        element: <ErrorPage />,
        title: "Kasa - Page non trouvée",
        description: "La page que vous recherchez n'existe pas",
        prefetchPriority: 3,
        prefetchOnHover: false,
      },
    ],
  },
]

/**
 * Obtient les métadonnées d'une route par son path
 */
export function getRouteMetadata(
  path: string,
): Pick<RouteMetadata, "title" | "description"> | null {
  // Recherche dans les routes parentes
  for (const route of routes) {
    if (route.children) {
      for (const child of route.children) {
        const childRoute = child as RouteConfig
        if (
          childRoute.path === path ||
          childRoute.path === path.replace("/", "")
        ) {
          return {
            title: childRoute.title,
            description: childRoute.description,
          }
        }
      }
    }
  }
  return null
}

/**
 * Obtient toutes les routes qui doivent être préfetchées
 */
export function getPrefetchableRoutes(): RouteConfig[] {
  const prefetchable: RouteConfig[] = []

  for (const route of routes) {
    if (route.children) {
      for (const child of route.children) {
        const childRoute = child as RouteConfig
        if (
          childRoute.prefetchOnHover &&
          childRoute.prefetchPriority &&
          childRoute.prefetchPriority <= 2
        ) {
          prefetchable.push(childRoute)
        }
      }
    }
  }

  return prefetchable.sort((a, b) => {
    const priorityA = a.prefetchPriority || 3
    const priorityB = b.prefetchPriority || 3
    return priorityA - priorityB
  })
}
