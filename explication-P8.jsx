// Apart.jsx
//-------------
import "../../styles/main.scss";
import { useParams } from "react-router-dom";
import logements from "../../data/logements.json";
import StarRating from "../../components/star/StarRating";
import Collapse from "../../components/collapse/Collapse";
import Slideshow from "../../components/slideshow/SlideShow"; // Importez le composant Slideshow

export default function Apart() {
/* useParams() est un hook fourni par la bibliothèque react-router-dom qui permet d'extraire les paramètres
de l'URL. L'objet renvoyé par useParams() contient des paires clé-valeur où les clés correspondent aux noms
qu'on a définis dans les routes. Dans notre cas : <Route path="/apart/:id" element={<Apart />} />, 
Lorsque l'URL correspondante est appelée (par exemple, /apart/c67ab8a7), l'objet retourné par useParams() 
ressemblera à ceci :{id: "c67ab8a7"}. Ainsi, en utilisant const { id } = useParams();, On déstructure cet 
objet pour obtenir la valeur de l'ID à partir des paramètres de l'URL, dans ce cas, "c67ab8a7". */           
  const { id } = useParams();

// Recherche des données du logement en fonction de l'ID
/* Méthode JavaScript pour parcourir chaque élément du tableau puis renvoie le premier élément qui satisfait 
la condition spécifiée. Trouver l'élément avec le même id que la valeur de id extraite des paramètres 
d'URL à l'aide de useParams() */
  const logement = logements.find((item) => item.id === id);

  // Si le logement n'est pas trouvé, affiche un message
  if (!logement) {
    return <div className="apart_error">Logement non trouvé</div>;
  }

  return (
    <div className="apart">
      <div className="apart_container">
        <Slideshow images={logement.pictures} />

        <div className="apart_content">
          <div className="apart_content_1">
            <h2 className="apart_content_title">{logement.title}</h2>
            <h3 className="apart_content_location">{logement.location}</h3>
            <div className="apart_content_tags">
              {/* Utilisation d'une boucle pour afficher les tags */}
              {logement.tags.map((Children) => (
                <div key={logement} className="apart_content_tag">{Children}</div>))}
            </div>
          </div>
          
          <div className="apart_content_2">
            <div className="apart_host">   {/* photo et nom de host */}
              <h3 className="apart_host_name">{logement.host.name}</h3>
              <img src={logement.host.picture} alt="host" className="apart_host_img" />
            </div>

            <StarRating rating={logement.rating} /> {/* Convertir une chaîne de caractères en un nombre entier */}
          </div>
        </div>
        
        <div className="apart_collapse">
          <div className="apart_collapse_element">
            <Collapse title="Description">
              <p>{logement.description}</p>
            </Collapse>
          </div>

          <div className="apart_collapse_element">
            <Collapse title="Équipements" className="apart_collapse_list">
              <ul>
                {logement.equipments.map((Children) => (
                  <li key={logement}>{Children}</li>
                ))}
              </ul>
            </Collapse>
          </div>
        </div>
      </div>
    </div>
  );
}
//************************************************************************************************ */

// Card.jsx
import "../../styles/main.scss";
import { Link } from "react-router-dom";   // Importation de React Router pour créer des liens

/* Comment l'appli sait ce quoi : logement -  quand on importe card dans root, on va faire map pour 
logements, et pour chaque item => logement={item} */
export default function Card({ logement }) {
  return (
    <div className="card">
      {/* Utilisation de Link pour créer un lien vers la page du logement */}
      <Link to={`/apart/${logement.id}`}> {/* Insérer la valeur de la variable logement.id dans la chaîne de caractères de manière dynamique (string interpolation) */}
        <div className="card-gradient"></div>   {/* Ajout de dégradé sur les cartes*/}
        <img src={logement.cover} alt={logement.title} className="card_cover" />   {/* Image de couverture du logement */}
        <div className="card_title">{logement.title}</div>   {/* Titre du logement */}
      </Link>
    </div>
  );
}
//*************************************************************************************** */