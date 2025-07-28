import { Suspense } from "react"
import dynamic from "next/dynamic"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/loading-spinner"
import { TrendingUp, Shield, Zap, Users, CheckCircle } from "lucide-react"
import Link from "next/link"

// Dynamic imports for better performance
const StatsSection = dynamic(() => import("@/components/stats-section"), {
  loading: () => <LoadingSpinner size="lg" className="mx-auto" />,
})

export const metadata = {
  title: "CryptoVault - Premium Cryptocurrency Investment Platform",
  description:
    "Secure and profitable cryptocurrency investment platform with AI-powered trading strategies. Earn up to 10% weekly returns with bank-level security and 24/7 support.",
  openGraph: {
    title: "CryptoVault - Premium Cryptocurrency Investment Platform",
    description:
      "Join thousands of investors earning consistent returns with our AI-powered crypto investment platform",
    images: ["/og-home.jpg"],
  },
  alternates: {
    canonical: "https://cryptovault.com",
  },
}

export default function HomePage() {
  const tiers = [
    {
      name: "Bronze Tier",
      minAmount: 40,
      maxAmount: 99,
      roi: 5,
      icon: "🥉",
      description: "Perfect for beginners looking to start their crypto journey",
      popular: false,
      color: "border-amber-600/20",
    },
    {
      name: "Silver Tier",
      minAmount: 100,
      maxAmount: 199,
      roi: 7,
      icon: "🥈",
      description: "For experienced investors seeking higher returns",
      popular: true,
      color: "border-gray-400/20",
    },
    {
      name: "Gold Tier",
      minAmount: 200,
      maxAmount: 999999,
      roi: 10,
      icon: "🥇",
      description: "Premium investment tier with maximum weekly returns",
      popular: false,
      color: "border-yellow-500/20",
    },
  ]

  const features = [
    {
      icon: Shield,
      title: "Bank-Level Security",
      description: "Your investments are protected with military-grade encryption and multi-layer security protocols.",
    },
    {
      icon: TrendingUp,
      title: "High Returns",
      description: "Earn up to 10% weekly returns with our proven investment strategies and market expertise.",
    },
    {
      icon: Zap,
      title: "Instant Deposits",
      description: "Quick and seamless deposit process with instant confirmation and portfolio updates.",
    },
    {
      icon: Users,
      title: "24/7 Support",
      description: "Round-the-clock customer support to assist you with all your investment needs.",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-float">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 neon-text">
              The Future of
              <span className="block text-blue-500">Crypto Investment</span>
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Join thousands of investors earning consistent weekly returns with our AI-powered crypto investment platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" prefetch={true}>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 glow text-lg px-8 py-4">
                Start Investing Now
              </Button>
            </Link>
            <Link href="/about" prefetch={true}>
              <Button
                size="lg"
                variant="outline"
                className="border-blue-500 text-blue-400 hover:bg-blue-500/10 text-lg px-8 py-4 bg-transparent"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900/50" aria-labelledby="features-heading">
        <div className="max-w-7xl mx-auto">
          <h2 id="features-heading" className="text-4xl font-bold text-center mb-12 neon-text">
            Why Choose CryptoVault?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-gray-800/50 border-blue-500/20 hover:border-blue-500/50 transition-all duration-300 hover:glow"
              >
                <CardHeader className="text-center">
                  <feature.icon className="h-12 w-12 text-blue-500 mx-auto mb-4" aria-hidden="true" />
                  <CardTitle className="text-xl text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300 text-center">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Tiers Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8" aria-labelledby="tiers-heading">
        <div className="max-w-7xl mx-auto">
          <h2 id="tiers-heading" className="text-4xl font-bold text-center mb-4 neon-text">
            Investment Tiers
          </h2>
          <p className="text-xl text-gray-300 text-center mb-12">
            Choose your tier based on your investment amount and earn weekly returns
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {tiers.map((tier, index) => (
              <Card
                key={index}
                className={`relative bg-gray-800/50 ${tier.color} hover:border-opacity-75 transition-all duration-300 ${tier.popular ? "ring-2 ring-blue-500 glow" : ""}`}
              >
                {tier.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <div className="text-4xl mb-2">{tier.icon}</div>
                  <CardTitle className="text-2xl text-white">{tier.name}</CardTitle>
                  <div className="text-3xl font-bold text-blue-500">{tier.roi}%</div>
                  <CardDescription className="text-gray-300">Weekly Returns</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <p className="text-gray-300">Investment Range</p>
                    <p className="text-xl font-semibold text-white">
                      ${tier.minAmount.toLocaleString()} -{" "}
                      {tier.maxAmount === 999999 ? "$200+" : `$${tier.maxAmount.toLocaleString()}`}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-300">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" aria-hidden="true" />
                      Weekly payouts
                    </div>
                    <div className="flex items-center text-gray-300">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" aria-hidden="true" />
                      24/7 Support
                    </div>
                    <div className="flex items-center text-gray-300">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" aria-hidden="true" />
                      Instant Withdrawals
                    </div>
                    <div className="flex items-center text-gray-300">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" aria-hidden="true" />
                      Referral Bonuses
                    </div>
                  </div>
                  <p className="text-sm text-gray-400">{tier.description}</p>
                  <Link href="/register" prefetch={true}>
                    <Button
                      className={`w-full ${tier.popular ? "bg-blue-600 hover:bg-blue-700 glow" : "bg-gray-700 hover:bg-gray-600"}`}
                    >
                      Get Started
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Referral Bonus Info */}
          <div className="mt-12 max-w-4xl mx-auto">
            <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-white flex items-center justify-center">
                  <Users className="h-6 w-6 mr-2 text-blue-500" />
                  Referral Bonus Program
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-gray-300 text-lg">
                  Earn additional <span className="text-blue-400 font-semibold">+1% weekly bonus</span> for every 5
                  qualified referrals
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-500">5 Referrals</div>
                    <div className="text-sm text-gray-400">+1% Bonus</div>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-500">15 Referrals</div>
                    <div className="text-sm text-gray-400">+3% Bonus</div>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-500">25 Referrals</div>
                    <div className="text-sm text-gray-400">+5% Bonus (Max)</div>
                  </div>
                </div>
                <p className="text-sm text-gray-400">
                  *Qualified referrals must deposit $100 or more to count towards your bonus
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <Suspense fallback={<LoadingSpinner size="lg" className="mx-auto my-16" />}>
        <StatsSection />
      </Suspense>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="h-6 w-6 text-blue-500" aria-hidden="true" />
            <span className="text-xl font-bold neon-text">CryptoVault</span>
          </div>
          <p className="text-gray-400 mb-4">Secure, profitable, and transparent crypto investment platform</p>
          <nav className="flex justify-center space-x-6 text-sm text-gray-400 mb-8">
            <Link href="/about" className="hover:text-blue-400 transition-colors">
              About
            </Link>
            <Link href="/contact" className="hover:text-blue-400 transition-colors">
              Contact
            </Link>
            <Link href="/privacy" className="hover:text-blue-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-blue-400 transition-colors">
              Terms of Service
            </Link>
          </nav>
          <div className="mt-8 pt-8 border-t border-gray-800 text-gray-500 text-sm">
            © 2024 CryptoVault. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
