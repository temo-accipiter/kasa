import "../../styles/main.scss";

export default function Banner({ image, alt, text }) {
  return (
    <div className="banner">
      {/* Affichage de l'image avec l'attribut alt pour l'accessibilité */}
      <img src={image} alt={alt} />
      
      {/* Effet de superposition sombre */}
      <div className="banner-overlay"></div>

      <div className="banner_text">{/* Afficher le texte de la bannière */}
        <p>{text}</p>
      </div>
    </div>
  );
}
