import "../../styles/main.scss"
import { BannerProps } from "../../types"
import Image from "../shared/Image/Image"

export default function Banner({ image, alt, text }: BannerProps) {
  return (
    <div className="banner">
      {/* Image optimisée avec lazy-loading et formats modernes (WebP/AVIF) */}
      <Image
        src={image}
        alt={alt}
        loading="eager"
        placeholder="none"
        className="banner__image"
      />

      {/* Effet de superposition sombre */}
      <div className="banner--overlay"></div>

      {/* Afficher le texte de la bannière */}
      <p className="banner__text">{text}</p>
    </div>
  )
}
