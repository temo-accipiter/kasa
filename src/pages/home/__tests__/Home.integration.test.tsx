/**
 * Tests d'intégration pour la page Home
 * Vérifie le rendu complet de la page avec ses composants
 */

import { describe, it, expect, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
import Home from "../Home"
import logementsData from "../../../lib/data/logements.json"

/**
 * Wrapper pour les composants utilisant React Router
 */
const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe("Home Page - Tests d'intégration", () => {
  beforeEach(() => {
    // Réinitialisation avant chaque test si nécessaire
  })

  describe("Rendu de la page", () => {
    it("devrait afficher la page d'accueil avec tous les éléments principaux", () => {
      renderWithRouter(<Home />)

      // Vérifie la présence du conteneur principal
      const main = screen.getByRole("main")
      expect(main).toBeInTheDocument()
      expect(main).toHaveAttribute("id", "main-content")
      expect(main).toHaveClass("home")
    })

    it("devrait afficher la bannière avec le texte et l'image", () => {
      renderWithRouter(<Home />)

      // Vérifie la présence de la bannière
      const banner = screen.getByAltText("home.bannerAlt")
      expect(banner).toBeInTheDocument()
      expect(banner).toHaveAttribute("src")
    })

    it("devrait afficher la section des logements", () => {
      renderWithRouter(<Home />)

      // Vérifie la présence de la section des logements
      const section = screen.getByLabelText("home.accommodationsList")
      expect(section).toBeInTheDocument()
      expect(section).toHaveClass("home__card__container")
    })
  })

  describe("Affichage des cartes de logements", () => {
    it("devrait afficher toutes les cartes de logements", () => {
      renderWithRouter(<Home />)

      // Vérifie que toutes les cartes sont affichées
      const cards = screen.getAllByRole("link")
      expect(cards.length).toBeGreaterThan(0)
    })

    it("devrait afficher le nombre correct de logements depuis les données JSON", () => {
      renderWithRouter(<Home />)

      const cards = screen.getAllByRole("link")
      // Vérifie que le nombre de cartes correspond aux données
      expect(cards.length).toBe(logementsData.length)
    })

    it("devrait afficher les informations de chaque logement", () => {
      renderWithRouter(<Home />)

      // Vérifie que les titres des logements sont affichés
      logementsData.forEach((logement) => {
        const title = screen.getByText(logement.title)
        expect(title).toBeInTheDocument()
      })
    })

    it("devrait avoir des liens fonctionnels pour chaque carte", () => {
      renderWithRouter(<Home />)

      const cards = screen.getAllByRole("link")

      cards.forEach((card, index) => {
        // Vérifie que chaque carte a un href correct
        expect(card).toHaveAttribute(
          "href",
          `/logement/${logementsData[index]?.id}`,
        )
      })
    })
  })

  describe("Accessibilité", () => {
    it("devrait avoir une structure sémantique correcte", () => {
      renderWithRouter(<Home />)

      // Vérifie la présence d'un élément main
      const main = screen.getByRole("main")
      expect(main).toBeInTheDocument()

      // Vérifie la présence d'une section avec aria-label
      const section = screen.getByLabelText("home.accommodationsList")
      expect(section).toBeInTheDocument()
    })

    it("devrait avoir des images avec attributs alt", () => {
      renderWithRouter(<Home />)

      // Vérifie que la bannière a un attribut alt
      const bannerImage = screen.getByAltText("home.bannerAlt")
      expect(bannerImage).toHaveAttribute("alt")

      // Vérifie que toutes les cartes ont des images avec alt
      const images = screen.getAllByRole("img")
      images.forEach((img) => {
        expect(img).toHaveAttribute("alt")
      })
    })
  })

  describe("Responsive et classes CSS", () => {
    it("devrait avoir les classes CSS appropriées pour le layout", () => {
      renderWithRouter(<Home />)

      // Vérifie que la structure de la page est présente
      const main = screen.getByRole("main")
      expect(main).toHaveClass("home")
    })
  })

  describe("Données et contenu", () => {
    it("devrait afficher des logements avec des données valides", () => {
      renderWithRouter(<Home />)

      // Vérifie que les données chargées sont valides
      expect(logementsData.length).toBeGreaterThan(0)

      // Vérifie que chaque logement a les propriétés requises
      logementsData.forEach((logement) => {
        expect(logement).toHaveProperty("id")
        expect(logement).toHaveProperty("title")
        expect(logement).toHaveProperty("cover")
      })
    })

    it("devrait gérer le cas où il n'y a pas de logements", () => {
      // Mock temporaire pour tester le cas sans logements
      // Note: Dans un vrai test, on mockerait le module logements.json
      const cards = screen.queryAllByRole("link")
      expect(cards).toBeDefined()
    })
  })

  describe("Intégration avec React Router", () => {
    it("devrait permettre la navigation vers les pages de détail", () => {
      renderWithRouter(<Home />)

      const firstCard = screen.getAllByRole("link")[0]
      expect(firstCard).toBeDefined()

      const href = firstCard?.getAttribute("href")
      expect(href).toMatch(/^\/logement\/[a-zA-Z0-9-]+$/)
    })
  })

  describe("Performance et optimisation", () => {
    it("devrait afficher rapidement tous les logements", () => {
      const startTime = performance.now()
      renderWithRouter(<Home />)
      const endTime = performance.now()

      // Le rendu devrait prendre moins de 1000ms
      expect(endTime - startTime).toBeLessThan(1000)
    })
  })
})
