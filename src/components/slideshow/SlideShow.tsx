import "../../styles/main.scss"
import { useState } from "react"
import leftArrowImage from "../../assets/arrowleft.png"
import rightArrowImage from "../../assets/arrowright.png"
import { SlideshowProps } from "../../types"

// Définition de le composant fonctionnel "Slideshow" qui prend un tableau d'images en tant que propriété.
export default function Slideshow({ images }: SlideshowProps) {
  const [currentSlide, setCurrentSlide] = useState<number>(0)

  // Fonction pour passer à l'image précédente
  const PreviousSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === 0 ? images.length - 1 : prevSlide - 1,
    )
  }
  const NextSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === images.length - 1 ? 0 : prevSlide + 1,
    )
  }

  return (
    <div
      className="slideshow"
      role="region"
      aria-label="Galerie de photos"
      aria-live="polite"
    >
      {/* Si le tableau d'images ne contient qu'une seule image, les boutons et la numérotation seront masqués */}
      {images.length === 1 ? (
        <img
          src={images[currentSlide]}
          alt="Photo du logement"
          className="slideshow__image"
        />
      ) : (
        <>
          <button
            className="slideshow__arrow slideshow__arrow--left"
            onClick={PreviousSlide}
            aria-label="Image précédente"
            type="button"
          >
            <img src={leftArrowImage} alt="" role="presentation" />
          </button>

          {/* Affichage de le numéro de la slide actuelle par rapport au nombre total d'images */}
          <div
            className="slideshow__number"
            aria-live="polite"
            aria-atomic="true"
          >
            <span className="visually-hidden">Image </span>
            {currentSlide + 1}
            <span className="visually-hidden"> sur </span>/{images.length}
          </div>

          {/* Affichage de l'image actuelle */}
          <img
            src={images[currentSlide]}
            alt={`Photo ${currentSlide + 1} du logement`}
            className="slideshow__image"
          />

          <button
            className="slideshow__arrow slideshow__arrow--right"
            onClick={NextSlide}
            aria-label="Image suivante"
            type="button"
          >
            <img src={rightArrowImage} alt="" role="presentation" />
          </button>
        </>
      )}
    </div>
  )
}
