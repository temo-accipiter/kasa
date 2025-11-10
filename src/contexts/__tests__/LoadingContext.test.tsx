/**
 * Tests unitaires pour LoadingContext
 * Vérifie le comportement du contexte de chargement
 */

import { describe, it, expect } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { LoadingProvider, useLoading } from "../LoadingContext"

/**
 * Helper pour wrapper les hooks dans le provider
 */
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <LoadingProvider>{children}</LoadingProvider>
)

describe("LoadingContext", () => {
  describe("État initial", () => {
    it("devrait avoir isLoading à false par défaut", () => {
      const { result } = renderHook(() => useLoading(), { wrapper })

      expect(result.current.isLoading).toBe(false)
      expect(result.current.loadingCount).toBe(0)
    })
  })

  describe("startLoading", () => {
    it("devrait mettre isLoading à true quand startLoading est appelé", () => {
      const { result } = renderHook(() => useLoading(), { wrapper })

      act(() => {
        result.current.startLoading()
      })

      expect(result.current.isLoading).toBe(true)
      expect(result.current.loadingCount).toBe(1)
    })

    it("devrait incrémenter le compteur pour chaque appel de startLoading", () => {
      const { result } = renderHook(() => useLoading(), { wrapper })

      act(() => {
        result.current.startLoading()
        result.current.startLoading()
        result.current.startLoading()
      })

      expect(result.current.isLoading).toBe(true)
      expect(result.current.loadingCount).toBe(3)
    })
  })

  describe("stopLoading", () => {
    it("devrait mettre isLoading à false quand stopLoading est appelé après startLoading", () => {
      const { result } = renderHook(() => useLoading(), { wrapper })

      act(() => {
        result.current.startLoading()
      })

      expect(result.current.isLoading).toBe(true)

      act(() => {
        result.current.stopLoading()
      })

      expect(result.current.isLoading).toBe(false)
      expect(result.current.loadingCount).toBe(0)
    })

    it("devrait décrémenter le compteur correctement avec plusieurs chargements", () => {
      const { result } = renderHook(() => useLoading(), { wrapper })

      act(() => {
        result.current.startLoading()
        result.current.startLoading()
        result.current.startLoading()
      })

      expect(result.current.loadingCount).toBe(3)

      act(() => {
        result.current.stopLoading()
      })

      expect(result.current.isLoading).toBe(true)
      expect(result.current.loadingCount).toBe(2)

      act(() => {
        result.current.stopLoading()
      })

      expect(result.current.isLoading).toBe(true)
      expect(result.current.loadingCount).toBe(1)

      act(() => {
        result.current.stopLoading()
      })

      expect(result.current.isLoading).toBe(false)
      expect(result.current.loadingCount).toBe(0)
    })

    it("ne devrait pas descendre en dessous de 0 si stopLoading est appelé trop de fois", () => {
      const { result } = renderHook(() => useLoading(), { wrapper })

      act(() => {
        result.current.stopLoading()
        result.current.stopLoading()
        result.current.stopLoading()
      })

      expect(result.current.isLoading).toBe(false)
      expect(result.current.loadingCount).toBe(0)
    })
  })

  describe("resetLoading", () => {
    it("devrait remettre le compteur à 0", () => {
      const { result } = renderHook(() => useLoading(), { wrapper })

      act(() => {
        result.current.startLoading()
        result.current.startLoading()
        result.current.startLoading()
      })

      expect(result.current.loadingCount).toBe(3)

      act(() => {
        result.current.resetLoading()
      })

      expect(result.current.isLoading).toBe(false)
      expect(result.current.loadingCount).toBe(0)
    })
  })

  describe("Gestion des erreurs", () => {
    it("devrait lever une erreur si useLoading est utilisé en dehors du provider", () => {
      // On s'attend à ce que l'erreur soit levée
      expect(() => {
        renderHook(() => useLoading())
      }).toThrow("useLoading must be used within a LoadingProvider")
    })
  })

  describe("Scénarios complexes", () => {
    it("devrait gérer un scénario réaliste avec multiples démarrages et arrêts", () => {
      const { result } = renderHook(() => useLoading(), { wrapper })

      // Simule 3 requêtes qui démarrent
      act(() => {
        result.current.startLoading() // Requête 1
        result.current.startLoading() // Requête 2
        result.current.startLoading() // Requête 3
      })

      expect(result.current.isLoading).toBe(true)
      expect(result.current.loadingCount).toBe(3)

      // Requête 1 se termine
      act(() => {
        result.current.stopLoading()
      })

      expect(result.current.isLoading).toBe(true)
      expect(result.current.loadingCount).toBe(2)

      // Requête 4 démarre
      act(() => {
        result.current.startLoading()
      })

      expect(result.current.isLoading).toBe(true)
      expect(result.current.loadingCount).toBe(3)

      // Requêtes 2, 3, 4 se terminent
      act(() => {
        result.current.stopLoading()
        result.current.stopLoading()
        result.current.stopLoading()
      })

      expect(result.current.isLoading).toBe(false)
      expect(result.current.loadingCount).toBe(0)
    })
  })
})
