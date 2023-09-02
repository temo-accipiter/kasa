/*import "./styles/main.scss";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";   // Importation des composants pour les routes et les pages
import Home from "./pages/home/Home";
import ErrorPage from "./pages/errorpage/ErrorPage";
import About from "./pages/about/About";
import Apart from "./pages/apart/Apart";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";

const router = createBrowserRouter([   // Création d'un routeur en utilisant createBrowserRouter avec différentes routes et éléments correspondants
  {
    path: "/",
    errorElement: (
      <>
      <Header />
      <ErrorPage />   {/* Affichage de la page d'erreur *}
      <Footer />
      </>
  ),
    element: (
      <>
        <Header />
        <Home />   {/* Affichage de la page d'accueil *}
        <Footer />
      </>
    ),
  },
  {
    path: "/about",
    element: (
      <>
        <Header />
        <About />   {/* Affichage de la page "A propos" *}
        <Footer />
      </>
    ),
  },
  {
    path: "/apart/:id",
    element: (
      <>
        <Header />
        <Apart />   {/* Affichage de la page de logement *}
        <Footer />
      </>
    ),
  },
]);

// ReactDOM.createRoot pour Rendre l'application React dans l'élément ayant l'ID "root" de la page HTML
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);*/


import "./styles/main.scss";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";   // Importation des composants pour les routes et les pages
import Home from "./pages/home/Home";
import ErrorPage from "./pages/errorpage/ErrorPage";
import About from "./pages/about/About";
import Apart from "./pages/apart/Apart";
import App from "./app/App";

const router = createBrowserRouter([   // Création d'un routeur en utilisant createBrowserRouter avec différentes routes et éléments correspondants
  {
    element: <App />,
    errorElement: <ErrorPage />,
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
    ]
  },
]);

// ReactDOM.createRoot pour Rendre l'application React dans l'élément ayant l'ID "root" de la page HTML
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);