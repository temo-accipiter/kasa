/**
 * LoadingContext
 * Contexte global pour gérer l'état de chargement de l'application
 */

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react"

interface LoadingContextType {
  isLoading: boolean
  loadingCount: number
  startLoading: () => void
  stopLoading: () => void
  resetLoading: () => void
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

interface LoadingProviderProps {
  children: React.ReactNode
}

/**
 * Provider du contexte de chargement
 * Gère un compteur de chargements actifs pour supporter les chargements multiples
 */
export const LoadingProvider: React.FC<LoadingProviderProps> = ({
  children,
}) => {
  const [loadingCount, setLoadingCount] = useState(0)

  /**
   * Démarre un chargement (incrémente le compteur)
   */
  const startLoading = useCallback(() => {
    setLoadingCount((prev) => prev + 1)
  }, [])

  /**
   * Arrête un chargement (décrémente le compteur)
   * Ne peut pas descendre en dessous de 0
   */
  const stopLoading = useCallback(() => {
    setLoadingCount((prev) => Math.max(0, prev - 1))
  }, [])

  /**
   * Réinitialise tous les chargements
   */
  const resetLoading = useCallback(() => {
    setLoadingCount(0)
  }, [])

  /**
   * Détermine si l'application est en chargement
   * True si au moins un chargement est actif
   */
  const isLoading = useMemo(() => loadingCount > 0, [loadingCount])

  const value = useMemo(
    () => ({
      isLoading,
      loadingCount,
      startLoading,
      stopLoading,
      resetLoading,
    }),
    [isLoading, loadingCount, startLoading, stopLoading, resetLoading],
  )

  return (
    <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
  )
}

/**
 * Hook pour utiliser le contexte de chargement
 * Lève une erreur si utilisé en dehors du LoadingProvider
 */
export const useLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext)
  if (context === undefined) {
    throw new Error("useLoading must be used within a LoadingProvider")
  }
  return context
}
