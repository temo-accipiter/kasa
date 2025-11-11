/**
 * Client-side performance monitoring utility
 *
 * Captures Core Web Vitals and custom metrics, optionally sending them
 * to a monitoring endpoint. Off by default for privacy.
 *
 * Usage:
 * ```ts
 * import { initMetrics, trackCustomMetric } from './utils/metrics'
 *
 * // Enable monitoring (optional)
 * initMetrics({ enabled: true, endpoint: '/api/metrics' })
 *
 * // Track custom events
 * trackCustomMetric('route-change', { from: '/', to: '/about' })
 * ```
 */

/**
 * Configuration for metrics collection
 */
export interface MetricsConfig {
  /** Enable metrics collection (default: false) */
  enabled?: boolean
  /** Optional endpoint to send metrics to */
  endpoint?: string
  /** Sample rate (0-1, default: 1 = 100%) */
  sampleRate?: number
  /** Debug mode logs metrics to console */
  debug?: boolean
}

/**
 * Core Web Vitals metric data
 */
export interface WebVitalMetric {
  /** Metric name (LCP, FID, CLS, FCP, TTFB, INP) */
  name: string
  /** Metric value */
  value: number
  /** Rating (good, needs-improvement, poor) */
  rating: "good" | "needs-improvement" | "poor"
  /** Delta from previous value */
  delta: number
  /** Metric ID for debugging */
  id: string
  /** Navigation type */
  navigationType: string
}

/**
 * Custom metric data
 */
export interface CustomMetric {
  /** Metric name */
  name: string
  /** Metric value (timestamp or number) */
  value: number
  /** Additional metadata */
  metadata?: Record<string, unknown>
}

// Global config
let config: MetricsConfig = {
  enabled: false,
  sampleRate: 1,
  debug: false,
}

// Metrics buffer
const metricsBuffer: Array<WebVitalMetric | CustomMetric> = []

/**
 * Initialize metrics collection
 *
 * @param userConfig - Configuration options
 *
 * @example
 * ```ts
 * // Enable with endpoint
 * initMetrics({
 *   enabled: true,
 *   endpoint: 'https://analytics.example.com/api/metrics',
 *   sampleRate: 0.1, // Sample 10% of sessions
 *   debug: process.env.NODE_ENV === 'development'
 * })
 *
 * // Enable debug mode only
 * initMetrics({ enabled: true, debug: true })
 * ```
 */
export function initMetrics(userConfig: MetricsConfig = {}): void {
  config = { ...config, ...userConfig }

  // Don't initialize if disabled
  if (!config.enabled) {
    if (config.debug) {
      console.log("[Metrics] Disabled")
    }
    return
  }

  // Check sample rate
  if (config.sampleRate && Math.random() > config.sampleRate) {
    if (config.debug) {
      console.log("[Metrics] Skipped due to sampling")
    }
    return
  }

  if (config.debug) {
    console.log("[Metrics] Initialized", config)
  }

  // Initialize Web Vitals
  if (typeof window !== "undefined") {
    initWebVitals()
  }
}

/**
 * Initialize Web Vitals collection using the web-vitals library
 */
function initWebVitals(): void {
  // Dynamic import to reduce initial bundle size
  import("web-vitals")
    .then(({ onLCP, onFID, onCLS, onFCP, onTTFB, onINP }) => {
      // Largest Contentful Paint
      onLCP((metric) => {
        handleWebVital({
          name: "LCP",
          value: metric.value,
          rating: metric.rating,
          delta: metric.delta,
          id: metric.id,
          navigationType: metric.navigationType,
        })
      })

      // First Input Delay
      onFID((metric) => {
        handleWebVital({
          name: "FID",
          value: metric.value,
          rating: metric.rating,
          delta: metric.delta,
          id: metric.id,
          navigationType: metric.navigationType,
        })
      })

      // Cumulative Layout Shift
      onCLS((metric) => {
        handleWebVital({
          name: "CLS",
          value: metric.value,
          rating: metric.rating,
          delta: metric.delta,
          id: metric.id,
          navigationType: metric.navigationType,
        })
      })

      // First Contentful Paint
      onFCP((metric) => {
        handleWebVital({
          name: "FCP",
          value: metric.value,
          rating: metric.rating,
          delta: metric.delta,
          id: metric.id,
          navigationType: metric.navigationType,
        })
      })

      // Time to First Byte
      onTTFB((metric) => {
        handleWebVital({
          name: "TTFB",
          value: metric.value,
          rating: metric.rating,
          delta: metric.delta,
          id: metric.id,
          navigationType: metric.navigationType,
        })
      })

      // Interaction to Next Paint (replaces FID in Chrome 96+)
      onINP((metric) => {
        handleWebVital({
          name: "INP",
          value: metric.value,
          rating: metric.rating,
          delta: metric.delta,
          id: metric.id,
          navigationType: metric.navigationType,
        })
      })
    })
    .catch((error) => {
      console.warn("[Metrics] Failed to load web-vitals:", error)
    })
}

/**
 * Handle captured Web Vital metric
 */
function handleWebVital(metric: WebVitalMetric): void {
  if (!config.enabled) return

  // Add to buffer
  metricsBuffer.push(metric)

  // Debug logging
  if (config.debug) {
    console.log(`[Metrics] ${metric.name}:`, {
      value: metric.value.toFixed(2),
      rating: metric.rating,
      delta: metric.delta.toFixed(2),
    })
  }

  // Send to endpoint
  if (config.endpoint) {
    sendMetric(metric)
  }
}

/**
 * Track a custom metric
 *
 * @param name - Metric name
 * @param metadata - Optional metadata
 *
 * @example
 * ```ts
 * // Track route change
 * trackCustomMetric('route-change', { from: '/', to: '/about' })
 *
 * // Track user action
 * trackCustomMetric('image-loaded', { size: 1024, format: 'webp' })
 *
 * // Track error
 * trackCustomMetric('error', { type: 'network', message: 'Failed to fetch' })
 * ```
 */
export function trackCustomMetric(
  name: string,
  metadata?: Record<string, unknown>,
): void {
  if (!config.enabled) return

  const metric: CustomMetric = {
    name,
    value: performance.now(),
    metadata,
  }

  // Add to buffer
  metricsBuffer.push(metric)

  // Debug logging
  if (config.debug) {
    console.log(`[Metrics] Custom: ${name}`, metadata)
  }

  // Send to endpoint
  if (config.endpoint) {
    sendMetric(metric)
  }
}

/**
 * Send metric to monitoring endpoint
 */
async function sendMetric(
  metric: WebVitalMetric | CustomMetric,
): Promise<void> {
  if (!config.endpoint) return

  try {
    // Use sendBeacon for reliability (survives page unload)
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(metric)], {
        type: "application/json",
      })
      navigator.sendBeacon(config.endpoint, blob)
    } else {
      // Fallback to fetch
      await fetch(config.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(metric),
        keepalive: true,
      })
    }
  } catch (error) {
    if (config.debug) {
      console.error("[Metrics] Failed to send metric:", error)
    }
  }
}

/**
 * Get all collected metrics
 *
 * @returns Array of all metrics in buffer
 *
 * @example
 * ```ts
 * const metrics = getMetrics()
 * console.table(metrics)
 * ```
 */
export function getMetrics(): Array<WebVitalMetric | CustomMetric> {
  return [...metricsBuffer]
}

/**
 * Clear metrics buffer
 *
 * @example
 * ```ts
 * // Clear after processing
 * const metrics = getMetrics()
 * sendToAnalytics(metrics)
 * clearMetrics()
 * ```
 */
export function clearMetrics(): void {
  metricsBuffer.length = 0
  if (config.debug) {
    console.log("[Metrics] Buffer cleared")
  }
}

/**
 * Get performance summary
 *
 * @returns Object with Core Web Vitals summary
 *
 * @example
 * ```ts
 * const summary = getPerformanceSummary()
 * console.log('LCP:', summary.lcp, 'ms')
 * console.log('CLS:', summary.cls)
 * ```
 */
export function getPerformanceSummary(): {
  lcp?: number
  fid?: number
  cls?: number
  fcp?: number
  ttfb?: number
  inp?: number
} {
  const summary: Record<string, number> = {}

  metricsBuffer.forEach((metric) => {
    if ("rating" in metric) {
      // Web Vital metric
      summary[metric.name.toLowerCase()] = metric.value
    }
  })

  return summary
}

/**
 * Track Time to Interactive (TTI) - custom implementation
 *
 * Measures when the page becomes fully interactive
 *
 * @example
 * ```ts
 * // Call after app is fully loaded
 * useEffect(() => {
 *   if (document.readyState === 'complete') {
 *     trackTTI()
 *   }
 * }, [])
 * ```
 */
export function trackTTI(): void {
  if (typeof window === "undefined" || !config.enabled) return

  // Use Performance Observer for long tasks
  if ("PerformanceObserver" in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const longTasks = entries.filter((entry) => entry.duration > 50)

        if (longTasks.length === 0) {
          const tti = performance.now()
          trackCustomMetric("TTI", { value: tti })
          observer.disconnect()
        }
      })

      observer.observe({ entryTypes: ["longtask"] })

      // Timeout after 10s
      setTimeout(() => {
        observer.disconnect()
      }, 10000)
    } catch (error) {
      if (config.debug) {
        console.warn("[Metrics] TTI tracking failed:", error)
      }
    }
  }
}

/**
 * Track Total Blocking Time (TBT)
 *
 * Measures the total time the main thread was blocked
 *
 * @example
 * ```ts
 * useEffect(() => {
 *   trackTBT()
 * }, [])
 * ```
 */
export function trackTBT(): void {
  if (typeof window === "undefined" || !config.enabled) return

  if ("PerformanceObserver" in window) {
    try {
      let totalBlockingTime = 0

      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()

        entries.forEach((entry) => {
          // Tasks longer than 50ms are considered blocking
          if (entry.duration > 50) {
            // TBT = duration - 50ms (allowable threshold)
            totalBlockingTime += entry.duration - 50
          }
        })

        trackCustomMetric("TBT", {
          value: totalBlockingTime,
          count: entries.length,
        })
      })

      observer.observe({ entryTypes: ["longtask"] })

      // Stop observing after page load
      window.addEventListener(
        "load",
        () => {
          setTimeout(() => {
            observer.disconnect()
            trackCustomMetric("TBT-final", { value: totalBlockingTime })
          }, 5000) // Wait 5s after load
        },
        { once: true },
      )
    } catch (error) {
      if (config.debug) {
        console.warn("[Metrics] TBT tracking failed:", error)
      }
    }
  }
}

/**
 * Track resource loading performance
 *
 * @param resourceType - Type of resource to track ('script', 'stylesheet', 'image', etc.)
 *
 * @example
 * ```ts
 * // Track all images
 * trackResourceTiming('image')
 *
 * // Track all scripts
 * trackResourceTiming('script')
 * ```
 */
export function trackResourceTiming(resourceType?: string): void {
  if (typeof window === "undefined" || !config.enabled) return

  try {
    const resources = performance.getEntriesByType(
      "resource",
    ) as PerformanceResourceTiming[]

    const filtered = resourceType
      ? resources.filter((r) => r.initiatorType === resourceType)
      : resources

    const summary = {
      count: filtered.length,
      totalDuration: filtered.reduce((sum, r) => sum + r.duration, 0),
      totalSize: filtered.reduce((sum, r) => sum + (r.transferSize || 0), 0),
      avgDuration:
        filtered.reduce((sum, r) => sum + r.duration, 0) / filtered.length || 0,
    }

    trackCustomMetric("resource-timing", {
      type: resourceType || "all",
      ...summary,
    })

    if (config.debug) {
      console.table(
        filtered.map((r) => ({
          name: r.name.split("/").pop(),
          duration: r.duration.toFixed(2),
          size: r.transferSize,
          type: r.initiatorType,
        })),
      )
    }
  } catch (error) {
    if (config.debug) {
      console.warn("[Metrics] Resource timing failed:", error)
    }
  }
}
