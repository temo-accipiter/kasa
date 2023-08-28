  import "../../styles/main.scss";
  import React, { useState } from "react";
  import PropTypes from "prop-types";
  import leftArrowImage from "../../assets/arrowleft.png";
  import rightArrowImage from "../../assets/arrowright.png";
  
  export default function Slideshow({ images }) {
  
    const [currentSlide, setCurrentSlide] = useState(0);
    
    // Fonction pour passer à l'image précédente
    const PrevSlide = () => {
      //setCurrentSlide((prevSlide) => (prevSlide === 0 ? images.length - 1 : prevSlide - 1));
    setCurrentSlide((prevSlide) => (prevSlide + 1) % images.length);
    };
  
    const NextSlide = () => {
      //setCurrentSlide((prevSlide) => (prevSlide === images.length - 1 ? 0 : prevSlide + 1));
    setCurrentSlide((prevSlide) => (prevSlide - 1 + images.length) % images.length);
    };
  
    return (
      <div className="slideshow">
        <div className="slideshow_image_container">
          <button className="slideshow_arrow slideshow_arrow-left" onClick={PrevSlide}>
            <img src={leftArrowImage} alt="Previous" />
          </button>
  
          <div className="slideshow_image_number">
            {currentSlide + 1}/{images.length}
          </div>
  
          <img src={images[currentSlide]} alt={`${currentSlide}`} className="slideshow_image" />
  
          <button className="slideshow_arrow slideshow_arrow-right" onClick={NextSlide}>
            <img src={rightArrowImage} alt="Next" />
          </button>
        </div>
      </div>
    );
  };
  
  Slideshow.propTypes = {
    images: PropTypes.arrayOf(PropTypes.string).isRequired,
  };
  