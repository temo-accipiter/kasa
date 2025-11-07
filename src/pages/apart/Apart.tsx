import "../../styles/main.scss"
import { useParams } from "react-router-dom"
import logementsData from "../../lib/data/logements.json"
import StarRating from "../../components/star/StarRating"
import Collapse from "../../components/collapse/Collapse"
import Slideshow from "../../components/slideshow/SlideShow" // Importez le composant Slideshow
import { Logement } from "../../types"

const logements: Logement[] = logementsData;

export default function Apart() {
  const { id } = useParams<{ id: string }>() // extraction de la paramètre de l'URL

  // Recherche des données du logement en fonction de l'ID
  const logement = logements.find((item) => item.id === id)

  // Si le logement n'est pas trouvé, affiche un message
  if (!logement) {
    return <div className="apart__error">Logement non trouvé</div>
  }

  return (
    <main className="apart">
      <div className="apart__container">
        <Slideshow images={logement.pictures} />

        <article className="apart__content">
          <section className="apart__content__1">
            <h2 className="apart__content__title">{logement.title}</h2>
            <h3 className="apart__content__location">{logement.location}</h3>

            <div className="apart__content__tags">
              {/* Utilisation d'une boucle pour afficher les tags */}
              {logement.tags.map((tags, index) => (
                <div key={`${tags}-${index}`} className="apart__content__tag">
                  {tags}
                </div>
              ))}
            </div>
          </section>

          <section className="apart__content__2">
            {/* photo et nom de host */}
            <div className="apart__host">
              <h3 className="apart__host__name">{logement.host.name}</h3>
              <img
                src={logement.host.picture}
                alt="host"
                className="apart__host__img"
              />
            </div>
            <StarRating rating={logement.rating} />
          </section>
        </article>

        <div className="apart__collapse">
          <div className="apart__collapse__element">
            <Collapse title="Description">{logement.description}</Collapse>
          </div>

          <div className="apart__collapse__element">
            <Collapse title="Équipements">
              {logement.equipments.map((equipments, index) => (
                <div key={`${equipments}-${index}`}>{equipments}</div>
              ))}
            </Collapse>
          </div>
        </div>
      </div>
    </main>
  )
}
