import "./styles/main.scss";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./routes/Root";
import ErrorPage from "./pages/errorpage/ErrorPage";
import About from "./pages/about/About";
import Apart from "./pages/apart/Apart";
import Header from "./components/header/Header"; // Importation du composant Header
import Footer from "./components/footer/Footer"; // Importation du composant Header

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Header /> 
        <Root />
        <Footer /> 
      </>
    ),
    errorElement: (
      <>
      <Header /> 
      <ErrorPage />
      <Footer /> 
    </>
  ),
  },
  {
    path: "/about",
    element: (
      <>
        <Header /> 
        <About />
        <Footer /> 
      </>
    ),
  },
  {
    path: "/apart/:id",
    element: (
      <>
        <Header /> 
        <Apart />
        <Footer /> 
      </>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);