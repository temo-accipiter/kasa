import "../styles/main.scss";
import React from "react";
import Banner from "../components/banner/Banner";
import coastBanner from "../assets/coast.png";
import Card from "../components/card/Card";   // Importation du composant Card
import logements from "../data/logements.json";   // Importation des données de logement depuis le fichier JSON

export default function Root() {
  return (
    <div className="home">
      {/* Utilisation du composant Banner avec des propriétés image et text */}
      <Banner
        image={coastBanner}
        alt="Paysage côtier"
        text="Chez vous, partout et ailleurs"
      />
      
      <div className="card-list">
        {/* Utilisation de la méthode map pour créer des éléments Card pour chaque logement */}
        {logements.map((logementData) => (
          <Card key={logementData.id} logement={logementData} />   // Affiche une carte de logement en utilisant le composant Card avec les données du logement
        ))}
      </div>
    </div>
  );
}
