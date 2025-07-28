"use client"

import { useEffect, useState } from "react"

export default function StatsSection() {
  const [stats, setStats] = useState({
    totalInvested: 0,
    activeInvestors: 0,
    successRate: 0,
    support: 0,
  })

  useEffect(() => {
    // Animate numbers on mount
    const animateValue = (start, end, duration, callback) => {
      let startTimestamp = null
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp
        const progress = Math.min((timestamp - startTimestamp) / duration, 1)
        const value = Math.floor(progress * (end - start) + start)
        callback(value)
        if (progress < 1) {
          window.requestAnimationFrame(step)
        }
      }
      window.requestAnimationFrame(step)
    }

    // Animate each stat
    animateValue(0, 50, 2000, (value) => setStats((prev) => ({ ...prev, totalInvested: value })))
    animateValue(0, 25, 2000, (value) => setStats((prev) => ({ ...prev, activeInvestors: value })))
    animateValue(0, 98.5, 2000, (value) => setStats((prev) => ({ ...prev, successRate: value })))
    animateValue(0, 24, 1000, (value) => setStats((prev) => ({ ...prev, support: value })))
  }, [])

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900/50" aria-labelledby="stats-heading">
      <div className="max-w-7xl mx-auto">
        <h2 id="stats-heading" className="sr-only">
          Platform Statistics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div className="animate-pulse-slow">
            <div className="text-4xl font-bold text-blue-500 mb-2">${stats.totalInvested}M+</div>
            <div className="text-gray-300">Total Invested</div>
          </div>
          <div className="animate-pulse-slow">
            <div className="text-4xl font-bold text-blue-500 mb-2">{stats.activeInvestors}K+</div>
            <div className="text-gray-300">Active Investors</div>
          </div>
          <div className="animate-pulse-slow">
            <div className="text-4xl font-bold text-blue-500 mb-2">{stats.successRate}%</div>
            <div className="text-gray-300">Success Rate</div>
          </div>
          <div className="animate-pulse-slow">
            <div className="text-4xl font-bold text-blue-500 mb-2">{stats.support}/7</div>
            <div className="text-gray-300">Support Available</div>
          </div>
        </div>
      </div>
    </section>
  )
}
