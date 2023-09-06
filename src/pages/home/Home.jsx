import "../../styles/main.scss"
import Banner from "../../components/banner/Banner"
import coastBanner from "../../assets/coast.png"
import Card from "../../components/card/Card" // Importation du composant Card
import logements from "../../data/logements.json" // Importation des données de logement depuis le fichier JSON

export default function Home() {
  return (
    <main className="home">
      <div className="home__container">
        {" "}
        {/* La fonction Root renvoie un élément div avec la classe home, servant comme conteneur principal pour la page d'accueil */}
        {/* Utilisation du composant Banner avec des propriétés image et text */}
        <Banner
          image={coastBanner}
          alt="Paysage côtier"
          text="Chez vous, partout et ailleurs"
        />
        <div className="card__container">
          {/* Utilisation de la méthode map pour créer des éléments Card pour chaque logement */}
          {logements.map((item) => (
            <Card key={item.id} logement={item} /> // Appel au composant Card avec les données du logement et une clé unique basée sur l'ID du logement
          ))}
        </div>
      </div>
    </main>
  )
}
