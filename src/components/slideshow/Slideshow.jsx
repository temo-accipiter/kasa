import "../../styles/main.scss"
import { useState } from "react"
import PropTypes from "prop-types"
import leftArrowImage from "../../assets/arrowleft.png"
import rightArrowImage from "../../assets/arrowright.png"

export default function Slideshow({ images }) {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Fonction pour passer à l'image précédente
  const PrevSlide = () => {
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
    <div className="slideshow">
      <button
        className="slideshow__arrow slideshow__arrow--left"
        onClick={PrevSlide}
      >
        <img src={leftArrowImage} alt="Previous" />
      </button>

      <div className="slideshow__number">
        {currentSlide + 1}/{images.length}
      </div>

      <img
        src={images[currentSlide]}
        alt={`${currentSlide}`}
        className="slideshow__image"
      />

      <button
        className="slideshow__arrow slideshow__arrow--right"
        onClick={NextSlide}
      >
        <img src={rightArrowImage} alt="Next" />
      </button>
    </div>
  )
}

Slideshow.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
}
