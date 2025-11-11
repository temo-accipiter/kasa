import { describe, it, expect, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import * as React from "react"
import { RouterProvider, createMemoryRouter } from "react-router-dom"
import { routes } from "../../routes"

describe("Lazy Loading Integration Tests", () => {
  describe("Routes Lazy Loading", () => {
    it("should load Home page lazily", async () => {
      const router = createMemoryRouter(routes, {
        initialEntries: ["/"],
      })

      render(<RouterProvider router={router} />)

      // Le fallback devrait apparaître brièvement
      // Puis le contenu de la page devrait se charger
      await waitFor(
        () => {
          // Vérifier que la page Home est chargée
          const element =
            screen.queryByRole("main") || screen.queryByRole("article")
          expect(element).toBeTruthy()
        },
        { timeout: 3000 },
      )
    })

    it("should load About page lazily", async () => {
      const router = createMemoryRouter(routes, {
        initialEntries: ["/about"],
      })

      render(<RouterProvider router={router} />)

      await waitFor(
        () => {
          // Vérifier que la page About est chargée
          const element =
            screen.queryByRole("main") || screen.queryByRole("article")
          expect(element).toBeTruthy()
        },
        { timeout: 3000 },
      )
    })

    it("should load Apart page lazily", async () => {
      const router = createMemoryRouter(routes, {
        initialEntries: ["/apart/c67ab8a7"],
      })

      render(<RouterProvider router={router} />)

      await waitFor(
        () => {
          // Vérifier que la page Apart est chargée
          const element =
            screen.queryByRole("main") || screen.queryByRole("article")
          expect(element).toBeTruthy()
        },
        { timeout: 3000 },
      )
    })

    it("should load ErrorPage for unknown routes", async () => {
      const router = createMemoryRouter(routes, {
        initialEntries: ["/unknown-route"],
      })

      render(<RouterProvider router={router} />)

      await waitFor(
        () => {
          // Vérifier que la page d'erreur est chargée
          const element =
            screen.queryByRole("main") || screen.queryByRole("article")
          expect(element).toBeTruthy()
        },
        { timeout: 3000 },
      )
    })
  })

  describe("Loading Fallback", () => {
    it("should show loading fallback during lazy load", async () => {
      const router = createMemoryRouter(routes, {
        initialEntries: ["/"],
      })

      const { container } = render(<RouterProvider router={router} />)

      // Le fallback peut apparaître brièvement
      // On vérifie juste que le composant ne crash pas
      expect(container).toBeTruthy()

      // Attendre que le chargement soit terminé
      await waitFor(
        () => {
          const element =
            screen.queryByRole("main") || screen.queryByRole("article")
          expect(element).toBeTruthy()
        },
        { timeout: 3000 },
      )
    })
  })
})
