import "../../styles/main.scss";
import React from "react";

export default function Banner({ image, alt, text }) {
  return (
    <div className="banner">
      {/* Affichage de l'image avec l'attribut alt pour l'accessibilité */}
      <img src={image} alt={alt} />
      
      {/* Effet de superposition sombre */}
      <div className="banner-overlay"></div>

      {/* Afficher le texte de la bannière */}
      <div className="banner_text">
        <p>{text}</p>
      </div>
    </div>
  );
}
