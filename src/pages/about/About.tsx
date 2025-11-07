import "../../styles/main.scss"
import Banner from "../../components/banner/Banner"
import landscapeBanner from "../../assets/landscape.png"
import Collapse from "../../components/collapse/Collapse"

export default function About() {
  return (
    <main className="about" id="main-content">
      <div className="about__container">
        {/* Utilisation du composant Banner avec une image de paysage */}
        <Banner image={landscapeBanner} alt="Paysage de montagne" />

        {/* Une div pour contenir les éléments Collapse. */}
        <section className="about__collapse__container">
          <Collapse title="Fiabilité">
            Les annonces postées sur Kasa garantissent une fiabilité totale. Les
            photos sont conformes aux logements, et toutes les informations sont
            régulièrement vérifiées par nos équipes.
          </Collapse>

          <Collapse title="Respect">
            Les bienveillance fait partie des valeurs fondatrices de Kasa. Tout
            comportement discriminatoire ou de perturbation du voisinage
            entraînera une exclusion de notre plateforme.
          </Collapse>

          <Collapse title="Service">
            Les bienveillance fait partie des valeurs fondatrices de Kasa. Tout
            comportement discriminatoire ou de perturbation du voisinage
            entraînera une exclusion de notre plateforme.
          </Collapse>

          <Collapse title="Sécurité">
            La sécurité est la priorité de Kasa. Aussi bien pour nos hôtes que
            pour les voyageurs, chaque logement correspond aux critères de
            sécurité établis par nos services. En laissant une note aussi bien à
            l'hôte qu'au locataire, cela permet à nos équipes de vérifier que
            les standards sont bien respectés. Nous organisons également des
            ateliers sur la sécurité domestique pour nos hôtes.
          </Collapse>
        </section>
      </div>
    </main>
  )
}
