import "../../styles/main.scss";
import React from "react";
import { NavLink } from "react-router-dom"; // Utilisation de NavLink au lieu de Link
import logo from "../../assets/LOGO.png";

export default function Header() {
  return (
    <header className="header">
      <img src={logo} alt="Logo" />

      <nav>
        <NavLink to="/">Accueil</NavLink>
        <NavLink to="/about">A propos</NavLink>
      </nav>
    </header>
  );
}
