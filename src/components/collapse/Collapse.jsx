import "../../styles/main.scss"
import { useState } from "react"
import PropTypes from "prop-types"
import arrowIcon from "../../assets/fleche.png"

export default function Collapse({ title, children }) {
  const [isCollapsed, setIsCollapsed] = useState(true) // Utilisation du hook useState pour gérer l'état du collapse

  // Fonction pour basculer l'état du collapse
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <div className="collapse">
      <div className="collapse__header">
        <h3>{title}</h3>
        <img
          src={arrowIcon}
          alt="Une flèche"
          className={`collapse__arrow ${
            isCollapsed ? "" : "collapse__arrow--rotated"
          }`}
          onClick={toggleCollapse}
        />
      </div>

      <div className={`collapse__content ${isCollapsed ? "close" : "open"}`}>
        {children}
      </div>
    </div>
  )
}

// Définition des types de données attendus pour les props
Collapse.propTypes = {
  title: PropTypes.string.isRequired, // title doit être une chaîne de caractères requise
  children: PropTypes.node.isRequired, // children doit être un nœud (élément React) requis
};