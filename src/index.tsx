import "./styles/main.scss"
import "./i18n/config" // Import i18n configuration
import * as React from "react"
import * as ReactDOM from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import LoadingFallback from "./components/LoadingFallback/LoadingFallback"
import { routes } from "./routes"
import { prefetchRoutesOnIdle } from "./utils/prefetch"

// Configuration axe-core pour l'audit d'accessibilité en développement
if (process.env.NODE_ENV !== "production") {
  import("@axe-core/react").then((axe) => {
    axe.default(React, ReactDOM, 1000)
  })
}

/**
 * Création du routeur avec la configuration centralisée
 *
 * Avantages :
 * - Code-splitting automatique via React.lazy() dans routes.tsx
 * - Configuration centralisée et maintenable
 * - Métadonnées intégrées (SEO, préfetching)
 * - Type-safe avec TypeScript
 */
const router = createBrowserRouter(routes)

// ReactDOM.createRoot pour Rendre l'application React dans l'élément ayant l'ID "root" de la page HTML
const rootElement = document.getElementById("root")
if (!rootElement) throw new Error("Failed to find the root element")

const root = ReactDOM.createRoot(rootElement)

root.render(
  <React.StrictMode>
    <React.Suspense fallback={<LoadingFallback />}>
      <RouterProvider router={router} />
    </React.Suspense>
  </React.StrictMode>,
)

// Précharger les routes critiques quand le navigateur est idle
// Améliore la navigation perçue en préchargeant les destinations probables
if (typeof window !== "undefined") {
  // Attendre que l'application soit montée avant de précharger
  setTimeout(() => {
    prefetchRoutesOnIdle(["/about"])
  }, 2000)
}
