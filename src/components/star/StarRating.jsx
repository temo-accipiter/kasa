import "../../styles/main.scss";
import React from "react";
import starInactive from "../../assets/star-gris.svg";
import starActive from "../../assets/star-active.svg";

export default function StarRating({ rating }) {
  // Création d'un tableau d'étoiles en fonction de la note reçue
  const stars = Array.from({ length: 5 }, (_, index) => (
    <img
      key={index}
      // Utilisation de l'étoile active ou inactive en fonction de l'index et de la note
      src={index < rating ? starActive : starInactive}
      alt="star"
    />
  ));

  return <div className="star-rating">{stars}</div>;
}


