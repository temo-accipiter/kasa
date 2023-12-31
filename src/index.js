import "./styles/main.scss"
import * as React from "react"
import * as ReactDOM from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom" // Importation des composants pour la gestion de routes
import Home from "./pages/home/Home"
import ErrorPage from "./pages/errorpage/ErrorPage"
import About from "./pages/about/About"
import Apart from "./pages/apart/Apart"
import App from "./app/App"

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
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
