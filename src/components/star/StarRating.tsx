import "../../styles/main.scss"
import starInactive from "../../assets/star-inactive.png"
import starActive from "../../assets/star-active.png"
import { StarRatingProps } from "../../types"

export default function StarRating({ rating }: StarRatingProps) {
  const ratingNumber = parseInt(rating, 10)
  // Création d'un tableau d'étoiles en fonction de la note reçue
  const stars = Array.from({ length: 5 }, (_, index) => (
    <img
      key={`star-${index}`}
      // Utilisation de l'étoile active ou inactive en fonction de l'index et de la note
      src={index < ratingNumber ? starActive : starInactive}
      alt=""
      role="presentation"
    />
  ))

  return (
    <div
      className="star--rating"
      role="img"
      aria-label={`Note: ${rating} sur 5 étoiles`}
    >
      {stars}
    </div>
  )
}
