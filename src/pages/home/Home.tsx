import "../../styles/main.scss"
import { useTranslation } from "react-i18next"
import Banner from "../../components/banner/Banner"
// Image optimisée avec vite-imagetools : génère WebP/AVIF + fallback
import coastBannerWebP from "../../assets/coast.png?w=1920&format=webp"
import coastBannerAvif from "../../assets/coast.png?w=1920&format=avif"
import coastBannerJpg from "../../assets/coast.png?w=1920&format=jpg&quality=80"
import Card from "../../components/card/Card" // Importation du composant Card
import logementsData from "../../lib/data/logements.json" // Importation des données de logement depuis le fichier JSON
import { Logement } from "../../types"

const logements: Logement[] = logementsData

export default function Home() {
  const { t } = useTranslation()

  // Configuration de l'image optimisée avec formats modernes
  const optimizedCoastBanner = {
    avif: coastBannerAvif,
    webp: coastBannerWebP,
    fallback: coastBannerJpg,
  }

  return (
    // La fonction Home renvoie un élément main avec la classe home, servant comme conteneur principal pour la page d'accueil
    <main className="home" id="main-content">
      <div className="home__container">
        <Banner
          image={optimizedCoastBanner}
          alt={t("home.bannerAlt")}
          text={t("banner.home")}
        />

        <section
          className="home__card__container"
          aria-label={t("home.accommodationsList")}
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
