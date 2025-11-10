import "../../styles/main.scss"
import { useTranslation } from 'react-i18next'
import Banner from "../../components/banner/Banner"
import coastBanner from "../../assets/coast.png"
import Card from "../../components/card/Card" // Importation du composant Card
import logementsData from "../../lib/data/logements.json" // Importation des données de logement depuis le fichier JSON
import { Logement } from "../../types"

const logements: Logement[] = logementsData

export default function Home() {
  const { t } = useTranslation()

  return (
    // La fonction Home renvoie un élément main avec la classe home, servant comme conteneur principal pour la page d'accueil
    <main className="home" id="main-content">
      <div className="home__container">
        <Banner
          image={coastBanner}
          alt={t('home.bannerAlt')}
          text={t('banner.home')}
        />

        <section
          className="home__card__container"
          aria-label={t('home.accommodationsList')}
        >
          {/* Utilisation de la méthode map pour créer des éléments Card pour chaque logement */}
          {logements.map((item) => (
            <Card key={item.id} item={item} /> // Appel au composant Card avec les données du logement et une clé unique basée sur l'ID du logement
          ))}
        </section>
      </div>
    </main>
  )
}
