import { useEffect } from "react"
import { useLocation } from "react-router-dom"

/**
 * SEO metadata configuration
 */
export interface SEOConfig {
  /** Page title */
  title?: string
  /** Meta description */
  description?: string
  /** Canonical URL */
  canonical?: string
  /** OpenGraph title (defaults to title) */
  ogTitle?: string
  /** OpenGraph description (defaults to description) */
  ogDescription?: string
  /** OpenGraph image URL */
  ogImage?: string
  /** OpenGraph type (default: 'website') */
  ogType?: string
  /** Twitter card type (default: 'summary_large_image') */
  twitterCard?: "summary" | "summary_large_image" | "player" | "app"
  /** Additional meta tags */
  meta?: Array<{ name: string; content: string }>
}

/**
 * Hook to manage SEO metadata dynamically
 *
 * Updates document title and meta tags based on current route
 *
 * @param config - SEO configuration
 *
 * @example
 * ```tsx
 * function HomePage() {
 *   useSEO({
 *     title: 'Kasa - Find Your Perfect Home',
 *     description: 'Browse our selection of quality accommodations',
 *     ogImage: '/og-home.jpg',
 *   })
 *
 *   return <div>...</div>
 * }
 * ```
 */
export function useSEO(config: SEOConfig): void {
  const location = useLocation()

  useEffect(() => {
    // Update document title
    if (config.title) {
      document.title = config.title
    }

    // Update or create meta tags
    updateMetaTag("description", config.description)
    updateMetaTag("og:title", config.ogTitle || config.title, "property")
    updateMetaTag(
      "og:description",
      config.ogDescription || config.description,
      "property",
    )
    updateMetaTag("og:image", config.ogImage, "property")
    updateMetaTag("og:type", config.ogType || "website", "property")
    updateMetaTag(
      "og:url",
      config.canonical || window.location.href,
      "property",
    )
    updateMetaTag("twitter:card", config.twitterCard || "summary_large_image")
    updateMetaTag("twitter:title", config.ogTitle || config.title)
    updateMetaTag(
      "twitter:description",
      config.ogDescription || config.description,
    )
    updateMetaTag("twitter:image", config.ogImage)

    // Update canonical link
    if (config.canonical) {
      updateCanonicalLink(config.canonical)
    }

    // Additional custom meta tags
    if (config.meta) {
      config.meta.forEach(({ name, content }) => {
        updateMetaTag(name, content)
      })
    }
  }, [location.pathname, config])
}

/**
 * Update or create a meta tag
 */
function updateMetaTag(
  name: string,
  content?: string,
  attribute: "name" | "property" = "name",
): void {
  if (!content) return

  let tag = document.querySelector(
    `meta[${attribute}="${name}"]`,
  ) as HTMLMetaElement

  if (!tag) {
    tag = document.createElement("meta")
    tag.setAttribute(attribute, name)
    document.head.appendChild(tag)
  }

  tag.content = content
}

/**
 * Update or create canonical link
 */
function updateCanonicalLink(href: string): void {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement

  if (!link) {
    link = document.createElement("link")
    link.rel = "canonical"
    document.head.appendChild(link)
  }

  link.href = href
}

/**
 * Get default SEO config for a route
 *
 * @param pathname - Route pathname
 * @returns SEO configuration
 *
 * @example
 * ```tsx
 * const seoConfig = getDefaultSEOConfig(location.pathname)
 * useSEO(seoConfig)
 * ```
 */
export function getDefaultSEOConfig(pathname: string): SEOConfig {
  const baseUrl = window.location.origin

  const routes: Record<string, SEOConfig> = {
    "/": {
      title: "Kasa - Find Your Perfect Home",
      description:
        "Browse our selection of quality accommodations across France. Find your ideal rental property with Kasa.",
      canonical: `${baseUrl}/`,
      ogImage: `${baseUrl}/og-home.jpg`,
      ogType: "website",
    },
    "/about": {
      title: "About Kasa - Our Values & Mission",
      description:
        "Learn about Kasa's commitment to reliability, respect, service, and security. Discover what makes us different.",
      canonical: `${baseUrl}/about`,
      ogImage: `${baseUrl}/og-about.jpg`,
      ogType: "website",
    },
  }

  // Check for exact match
  if (routes[pathname]) {
    return routes[pathname]
  }

  // Check for /apart/:id pattern
  if (pathname.startsWith("/apart/")) {
    return {
      title: "Accommodation Details - Kasa",
      description:
        "View details, photos, and amenities for this accommodation.",
      canonical: `${baseUrl}${pathname}`,
      ogImage: `${baseUrl}/og-apartment.jpg`,
      ogType: "article",
    }
  }

  // Default fallback
  return {
    title: "Kasa - Quality Accommodations",
    description: "Find your next home with Kasa",
    canonical: `${baseUrl}${pathname}`,
  }
}
