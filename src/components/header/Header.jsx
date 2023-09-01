import "../../styles/main.scss";
import { NavLink, Link } from "react-router-dom"; // Utilisation de NavLink pour la gestion des styles actifs
import logo from "../../assets/LOGO.png";

export default function Header() {
  return (
    <header className="header">
      <div className="header_container">
        <div className="header_logo">
          <Link to="/">
            <img src={logo} alt="Logo" />
          </Link>
        </div>

        <nav className="header_nav">
          <NavLink to="/">Accueil</NavLink>
          <NavLink to="/about">A propos</NavLink>
        </nav>
      </div>
    </header>
  );
}
