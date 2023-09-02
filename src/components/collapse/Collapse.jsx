/*import "../../styles/main.scss";
import { useState } from "react";
import PropTypes from "prop-types";
import arrowIcon from "../../assets/fleche.png";

export default function Collapse({ title, children, className }) {
  const [isCollapsed, setIsCollapsed] = useState(true);   // Utilisation du hook useState pour gérer l'état du collapse

  return (
    <div className={`collapse ${className}`}>   {/* Ajout de la classe dynamique *}
      <div className="collapse_header">
        <h2>{title}</h2>
        <img
          src={arrowIcon}
          alt="Une flèche"
          className={`collapse_arrow ${isCollapsed ? "" : "collapse_arrow-rotated"}`}
          onClick={() => setIsCollapsed(!isCollapsed)}   // Fonction pour basculer l'état du collapse
        />
      </div>
      {/* Affichage du contenu*}
     {/*<div className={`collapse_content ${isCollapsed ? "collapse_content-close" : "collapse_content-open"}`}>{children}</div>*}

      {!isCollapsed && (<div className="collapse_content collapse_content-open">{children}</div>)}
    </div>
  );
}

// Définition des types de données attendus pour les props
Collapse.propTypes = {
  title: PropTypes.string.isRequired, // title doit être une chaîne de caractères requise
  children: PropTypes.node.isRequired, // children doit être un nœud (élément React) requis
  className: PropTypes.string, // className doit être une chaîne de caractères requise
};*/

import "../../styles/main.scss";
import { useState } from "react";
import PropTypes from "prop-types";
import arrowIcon from "../../assets/fleche.png";

export default function Collapse({ title, children }) {
  const [isCollapsed, setIsCollapsed] = useState(true);   // Utilisation du hook useState pour gérer l'état du collapse

  return (
    <div className="collapse">   {/* Ajout de la classe dynamique */}
      <div className="collapse_header">
        <h2>{title}</h2>
        <img
          src={arrowIcon}
          alt="Une flèche"
          className={`collapse_arrow ${isCollapsed ? "" : "collapse_arrow-rotated"}`}
          onClick={() => setIsCollapsed(!isCollapsed)}   // Fonction pour basculer l'état du collapse
        />
      </div>

      <div className={`collapse_content ${isCollapsed ? 'close' : 'open'}`}>{children}</div>
    </div>
  );
}

// Définition des types de données attendus pour les props
Collapse.propTypes = {
  title: PropTypes.string.isRequired, // title doit être une chaîne de caractères requise
  children: PropTypes.node.isRequired, // children doit être un nœud (élément React) requis
};
