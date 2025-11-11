import { describe, it, expect, beforeEach, vi } from "vitest"
import {
  prefetchRoute,
  preloadResource,
  clearPrefetchCache,
  getPrefetchStats,
  prefetchRoutesOnIdle,
} from "../../utils/prefetch"

describe("Prefetch Utilities", () => {
  beforeEach(() => {
    clearPrefetchCache()
    // Mock document.head.appendChild
    vi.spyOn(document.head, "appendChild").mockImplementation(
      () => null as unknown as HTMLLinkElement,
    )
  })

  describe("prefetchRoute", () => {
    it("should mark route as prefetched", async () => {
      await prefetchRoute("/about")
      const stats = getPrefetchStats()
      expect(stats.cachedRoutes).toContain("/about")
      expect(stats.routesCached).toBe(1)
    })

    it("should not prefetch same route twice", async () => {
      await prefetchRoute("/about")
      await prefetchRoute("/about")
      const stats = getPrefetchStats()
      expect(stats.routesCached).toBe(1)
    })

    it("should handle invalid routes gracefully", async () => {
      // Ne devrait pas throw
      await expect(prefetchRoute("/invalid-route")).resolves.toBeUndefined()
    })
  })

  describe("preloadResource", () => {
    it("should create link element for resource", () => {
      preloadResource("/assets/hero.webp", "image")
      expect(document.head.appendChild).toHaveBeenCalled()
      const stats = getPrefetchStats()
      expect(stats.cachedResources).toContain("/assets/hero.webp")
    })

    it("should not preload same resource twice", () => {
      preloadResource("/assets/hero.webp", "image")
      preloadResource("/assets/hero.webp", "image")
      const stats = getPrefetchStats()
      expect(stats.resourcesCached).toBe(1)
    })

    it("should handle different resource types", () => {
      preloadResource("/style.css", "style")
      preloadResource("/script.js", "script")
      preloadResource("/font.woff2", "font")
      const stats = getPrefetchStats()
      expect(stats.resourcesCached).toBe(3)
    })
  })

  describe("getPrefetchStats", () => {
    it("should return correct stats", async () => {
      await prefetchRoute("/about")
      preloadResource("/image.webp", "image")

      const stats = getPrefetchStats()
      expect(stats.routesCached).toBe(1)
      expect(stats.resourcesCached).toBe(1)
      expect(stats.cachedRoutes).toEqual(["/about"])
      expect(stats.cachedResources).toEqual(["/image.webp"])
    })
  })

  describe("clearPrefetchCache", () => {
    it("should clear all caches", async () => {
      await prefetchRoute("/about")
      preloadResource("/image.webp", "image")

      clearPrefetchCache()

      const stats = getPrefetchStats()
      expect(stats.routesCached).toBe(0)
      expect(stats.resourcesCached).toBe(0)
    })
  })

  describe("prefetchRoutesOnIdle", () => {
    it("should accept array of routes", () => {
      // Ne devrait pas throw
      expect(() => prefetchRoutesOnIdle(["/about", "/contact"])).not.toThrow()
    })
  })
})
