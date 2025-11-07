import "../../styles/main.scss"
import { BannerProps } from "../../types"

export default function Banner({ image, alt, text }: BannerProps) {
  return (
    <div className="banner">
      {/* Affichage de l'image avec l'attribut alt pour l'accessibilité */}
      <img src={image} alt={alt} />

      {/* Effet de superposition sombre */}
      <div className="banner--overlay"></div>

      {/* Afficher le texte de la bannière */}
      <p className="banner__text">{text}</p>
    </div>
  )
}
