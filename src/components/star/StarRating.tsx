import "../../styles/main.scss"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import starInactive from "../../assets/star-inactive.png"
import starActive from "../../assets/star-active.png"
import { StarRatingProps } from "../../types"

/**
 * StarRating component optimized with useMemo
 *
 * The star array creation is memoized to avoid recreating it on every render
 */
export default function StarRating({ rating }: StarRatingProps) {
  const { t } = useTranslation()
  const ratingNumber = parseInt(rating, 10)

  // Memoize star array creation to avoid recreating it on every render
  // Only recreates when ratingNumber changes
  const stars = useMemo(
    () =>
      Array.from({ length: 5 }, (_, index) => (
        <img
          key={`star-${index}`}
          // Utilisation de l'étoile active ou inactive en fonction de l'index et de la note
          src={index < ratingNumber ? starActive : starInactive}
          alt=""
          role="presentation"
          loading="lazy"
        />
      )),
    [ratingNumber],
  )

  return (
    <div
      className="star--rating"
      role="img"
      aria-label={t("starRating.label", { rating })}
    >
      {stars}
    </div>
  )
}
