import "../../styles/main.scss";

export default function Banner({ image, alt, text }) {
  return (
    <div className="banner">
      {/* Affichage de l'image avec l'attribut alt pour l'accessibilité */}
      <img src={image} alt={alt} />
      
      {/* Effet de superposition sombre */}
      <div className="banner-overlay"></div>

      {/* Afficher le texte de la bannière */}
      <p className="banner_text">{text}</p>
    </div>
  );
}
