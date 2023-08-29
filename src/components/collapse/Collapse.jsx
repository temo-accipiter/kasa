import "../../styles/main.scss";
import { useState } from "react";
import PropTypes from "prop-types";
import arrowIcon from "../../assets/fleche.png";

// Définition du composant Collapse en utilisant les props title, children et className
export default function Collapse({ title, children, className }) {
  const [isCollapsed, setIsCollapsed] = useState(true);   // Utilisation du hook useState pour gérer l'état du collapse

  return (
    <div className={`collapse ${className}`}>   {/* Ajout de la classe dynamique */}
      <div className="collapse_header">
        <h2>{title}</h2>
        <img
          src={arrowIcon}
          alt="Une flèche"
          className={`collapse_arrow ${isCollapsed ? "" : "collapse_arrow-rotated"}`}
          onClick={() => setIsCollapsed(!isCollapsed)}   // Fonction pour basculer l'état du collapse
        />
      </div>
      {/* Affichage du contenu si le collapse n'est pas fermé */}
      {!isCollapsed && <div className="collapse_content">{children}</div>}
    </div>
  );
}

// Définition des types de données attendus pour les props
Collapse.propTypes = {
  title: PropTypes.string.isRequired, // title doit être une chaîne de caractères requise
  children: PropTypes.node.isRequired, // children doit être un nœud (élément React) requis
  className: PropTypes.string.isRequired, // className doit être une chaîne de caractères requise
};
