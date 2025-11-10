import "./styles/main.scss"
import "./i18n/config" // Import i18n configuration
import * as React from "react"
import * as ReactDOM from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom" // Importation des composants pour la gestion de routes
import App from "./App"
import LoadingFallback from "./components/LoadingFallback/LoadingFallback"

// Configuration axe-core pour l'audit d'accessibilité en développement
if (process.env.NODE_ENV !== "production") {
  import("@axe-core/react").then((axe) => {
    axe.default(React, ReactDOM, 1000)
  })
}

// Code-splitting: Lazy load des pages pour réduire la taille du bundle initial
const Home = React.lazy(() => import("./pages/home/Home"))
const ErrorPage = React.lazy(() => import("./pages/errorpage/ErrorPage"))
const About = React.lazy(() => import("./pages/about/About"))
const Apart = React.lazy(() => import("./pages/apart/Apart"))

// Création d'un routeur en utilisant createBrowserRouter avec différentes routes et éléments correspondants
const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "apart/:id",
        element: <Apart />,
      },
      {
        path: "*",
        element: <ErrorPage />,
      },
    ],
  },
])

// ReactDOM.createRoot pour Rendre l'application React dans l'élément ayant l'ID "root" de la page HTML
const rootElement = document.getElementById("root")
if (!rootElement) throw new Error("Failed to find the root element")
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <React.Suspense fallback={<LoadingFallback />}>
      <RouterProvider router={router} />
    </React.Suspense>
  </React.StrictMode>,
)
