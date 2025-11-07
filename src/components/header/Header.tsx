import "../../styles/main.scss"
import { NavLink } from "react-router-dom" // Utilisation de NavLink pour la gestion des styles actifs
import logo from "../../assets/LOGO.png"

export default function Header() {
  return (
    <header className="header">
      <div className="header__container">
        <NavLink to="/" aria-label="Retour à l'accueil">
          <img src={logo} alt="Kasa, location d'appartements" />
        </NavLink>

        <nav className="header__nav" aria-label="Navigation principale">
          <NavLink to="/" end>
            Accueil
          </NavLink>
          <NavLink to="/about">A propos</NavLink>
        </nav>
      </div>
    </header>
  )
}
