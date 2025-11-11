import { useEffect, useRef } from "react"
import { useLocation } from "react-router-dom"

/**
 * Hook to manage focus on route changes for accessibility
 *
 * Automatically moves focus to the main content area when navigating
 * between routes, announcing the page change to screen readers.
 *
 * @param options - Configuration options
 *
 * @example
 * ```tsx
 * function App() {
 *   useFocusManagement({ targetSelector: '#main-content' })
 *
 *   return (
 *     <div>
 *       <Header />
 *       <main id="main-content" tabIndex={-1}>
 *         <Outlet />
 *       </main>
 *     </div>
 *   )
 * }
 * ```
 */
export function useFocusManagement(options?: {
  /** CSS selector for focus target (default: '#main-content') */
  targetSelector?: string
  /** Delay before focusing in ms (default: 100) */
  delay?: number
  /** Enable debug logging */
  debug?: boolean
}): void {
  const location = useLocation()
  const prevLocation = useRef(location.pathname)

  const {
    targetSelector = "#main-content",
    delay = 100,
    debug = false,
  } = options || {}

  useEffect(() => {
    // Only act on actual route changes
    if (prevLocation.current === location.pathname) {
      return
    }

    prevLocation.current = location.pathname

    // Delay to allow page transition and DOM updates
    const timeoutId = setTimeout(() => {
      const target = document.querySelector(targetSelector) as HTMLElement

      if (target) {
        // Ensure element is focusable
        if (!target.hasAttribute("tabindex")) {
          target.setAttribute("tabindex", "-1")
        }

        // Focus the element
        target.focus({ preventScroll: false })

        // Announce route change to screen readers
        announceRouteChange(location.pathname)

        if (debug) {
          console.log("[Focus Management] Focused:", targetSelector)
        }
      } else if (debug) {
        console.warn(`[Focus Management] Target not found: ${targetSelector}`)
      }
    }, delay)

    return () => clearTimeout(timeoutId)
  }, [location.pathname, targetSelector, delay, debug])
}

/**
 * Announce route change to screen readers
 */
function announceRouteChange(pathname: string): void {
  // Find or create announcement element
  let announcer = document.querySelector(
    '[role="status"][aria-live="polite"]',
  ) as HTMLElement

  if (!announcer) {
    announcer = document.createElement("div")
    announcer.setAttribute("role", "status")
    announcer.setAttribute("aria-live", "polite")
    announcer.setAttribute("aria-atomic", "true")
    announcer.className = "visually-hidden"
    document.body.appendChild(announcer)
  }

  // Get human-readable route name
  const routeName = getRouteName(pathname)

  // Announce the change
  announcer.textContent = `Navigated to ${routeName}`

  // Clear after announcement
  setTimeout(() => {
    announcer.textContent = ""
  }, 1000)
}

/**
 * Get human-readable name for a route
 */
function getRouteName(pathname: string): string {
  const routes: Record<string, string> = {
    "/": "home page",
    "/about": "about page",
  }

  if (routes[pathname]) {
    return routes[pathname]
  }

  if (pathname.startsWith("/apart/")) {
    return "accommodation details page"
  }

  return pathname.split("/").filter(Boolean).join(" ") || "page"
}

/**
 * Hook to manage skip link functionality
 *
 * Ensures skip links work correctly and smoothly scroll to target
 *
 * @example
 * ```tsx
 * function App() {
 *   useSkipLink()
 *
 *   return (
 *     <>
 *       <a href="#main-content" className="skip-link">
 *         Skip to main content
 *       </a>
 *       <main id="main-content" tabIndex={-1}>
 *         ...
 *       </main>
 *     </>
 *   )
 * }
 * ```
 */
export function useSkipLink(): void {
  useEffect(() => {
    const handleSkipLinkClick = (event: Event) => {
      const link = event.target as HTMLAnchorElement
      const href = link.getAttribute("href")

      if (!href || !href.startsWith("#")) {
        return
      }

      event.preventDefault()

      const target = document.querySelector(href) as HTMLElement

      if (target) {
        // Ensure element is focusable
        if (!target.hasAttribute("tabindex")) {
          target.setAttribute("tabindex", "-1")
        }

        // Focus and scroll
        target.focus()
        target.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }

    // Attach to all skip links
    const skipLinks = document.querySelectorAll('a[href^="#"]')
    skipLinks.forEach((link) => {
      link.addEventListener("click", handleSkipLinkClick)
    })

    return () => {
      skipLinks.forEach((link) => {
        link.removeEventListener("click", handleSkipLinkClick)
      })
    }
  }, [])
}

/**
 * Hook to trap focus within a modal or dialog
 *
 * @param isActive - Whether focus trap is active
 * @param containerRef - Ref to container element
 *
 * @example
 * ```tsx
 * function Modal({ isOpen, onClose }) {
 *   const modalRef = useRef<HTMLDivElement>(null)
 *   useFocusTrap(isOpen, modalRef)
 *
 *   return isOpen ? (
 *     <div ref={modalRef} role="dialog">
 *       <button onClick={onClose}>Close</button>
 *       <div>Modal content</div>
 *     </div>
 *   ) : null
 * }
 * ```
 */
export function useFocusTrap(
  isActive: boolean,
  containerRef: React.RefObject<HTMLElement>,
): void {
  useEffect(() => {
    if (!isActive || !containerRef.current) {
      return
    }

    const container = containerRef.current
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    ) as NodeListOf<HTMLElement>

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    // Focus first element
    firstElement?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") {
        return
      }

      // Shift + Tab
      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault()
          lastElement?.focus()
        }
      }
      // Tab
      else {
        if (document.activeElement === lastElement) {
          event.preventDefault()
          firstElement?.focus()
        }
      }
    }

    container.addEventListener("keydown", handleKeyDown)

    return () => {
      container.removeEventListener("keydown", handleKeyDown)
    }
  }, [isActive, containerRef])
}
