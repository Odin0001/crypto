"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"

export function Analytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Google Analytics 4
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("config", "GA_MEASUREMENT_ID", {
        page_path: pathname + searchParams.toString(),
      })
    }

    // Simple performance monitoring without web-vitals dependency
    if ("performance" in window) {
      // Monitor basic performance metrics
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          // Log performance entries for monitoring
          if (entry.entryType === "navigation") {
            console.log("Navigation timing:", {
              loadTime: entry.loadEventEnd - entry.loadEventStart,
              domContentLoaded: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
            })
          }
        }
      })

      try {
        observer.observe({ entryTypes: ["navigation", "paint"] })
      } catch (error) {
        console.log("Performance observer not supported:", error)
      }

      // Cleanup observer on unmount
      return () => {
        try {
          observer.disconnect()
        } catch (error) {
          // Observer might not be supported
        }
      }
    }
  }, [pathname, searchParams])

  return (
    <>
      {/* Google Analytics */}
      <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID" />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA_MEASUREMENT_ID', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  )
}
