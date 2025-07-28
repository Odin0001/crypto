import Navbar from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { OptimizedImage } from "@/components/optimized-image"
import { Shield, TrendingUp, Users, Award, Target, Zap } from "lucide-react"

export const metadata = {
  title: "About CryptoVault - Leading Cryptocurrency Investment Platform",
  description:
    "Learn about CryptoVault's mission to democratize cryptocurrency investment through cutting-edge technology, transparent practices, and proven results.",
  openGraph: {
    title: "About CryptoVault - Leading Cryptocurrency Investment Platform",
    description: "Discover our story, team, and commitment to revolutionizing cryptocurrency investment",
    images: ["/og-about.jpg"],
  },
  alternates: {
    canonical: "https://cryptovault.com/about",
  },
}

export default function AboutPage() {
  const features = [
    {
      icon: Shield,
      title: "Security First",
      description: "Military-grade encryption and multi-layer security protocols protect your investments 24/7.",
    },
    {
      icon: TrendingUp,
      title: "Proven Returns",
      description: "Our AI-powered trading algorithms have consistently delivered superior returns for our investors.",
    },
    {
      icon: Users,
      title: "Expert Team",
      description: "Led by industry veterans with decades of experience in cryptocurrency and traditional finance.",
    },
    {
      icon: Award,
      title: "Award Winning",
      description: "Recognized as the leading crypto investment platform by multiple industry publications.",
    },
    {
      icon: Target,
      title: "Transparent",
      description: "Full transparency in our investment strategies and real-time portfolio tracking.",
    },
    {
      icon: Zap,
      title: "Fast Execution",
      description: "Lightning-fast trade execution and instant deposit confirmations for optimal performance.",
    },
  ]

  const team = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      description: "Former Goldman Sachs executive with 15+ years in quantitative trading and blockchain technology.",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      name: "Michael Chen",
      role: "CTO",
      description: "Ex-Google engineer specializing in AI/ML algorithms and high-frequency trading systems.",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      name: "David Rodriguez",
      role: "Head of Security",
      description: "Cybersecurity expert with background in financial services and cryptocurrency exchanges.",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      name: "Emily Watson",
      role: "Head of Operations",
      description: "Operations specialist with extensive experience in scaling fintech platforms globally.",
      image: "/placeholder.svg?height=200&width=200",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <header className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 neon-text">About CryptoVault</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We're revolutionizing cryptocurrency investment through cutting-edge technology, transparent practices,
              and unwavering commitment to our investors' success.
            </p>
          </header>

          {/* Mission Section */}
          <section className="mb-16" aria-labelledby="mission-heading">
            <Card className="bg-gray-800/50 border-blue-500/20 glow">
              <CardHeader className="text-center">
                <CardTitle id="mission-heading" className="text-3xl text-white mb-4">
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-lg text-gray-300 max-w-4xl mx-auto">
                  To democratize access to sophisticated cryptocurrency investment strategies, making it possible for
                  everyone to benefit from the digital asset revolution. We combine institutional-grade technology with
                  user-friendly interfaces to deliver consistent, transparent, and profitable investment opportunities.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Features Grid */}
          <section className="mb-16" aria-labelledby="features-heading">
            <h2 id="features-heading" className="text-4xl font-bold text-center text-white mb-12 neon-text">
              Why Choose Us
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
          </section>

          {/* Team Section */}
          <section className="mb-16" aria-labelledby="team-heading">
            <h2 id="team-heading" className="text-4xl font-bold text-center text-white mb-12 neon-text">
              Meet Our Team
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <Card
                  key={index}
                  className="bg-gray-800/50 border-blue-500/20 hover:border-blue-500/50 transition-all duration-300"
                >
                  <CardHeader className="text-center">
                    <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                      <OptimizedImage
                        src={member.image}
                        alt={`${member.name} - ${member.role}`}
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardTitle className="text-xl text-white">{member.name}</CardTitle>
                    <CardDescription className="text-blue-400 font-medium">{member.role}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 text-sm text-center">{member.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Stats Section */}
          <section className="mb-16" aria-labelledby="company-stats">
            <Card className="bg-gray-800/50 border-blue-500/20 glow">
              <CardContent className="py-12">
                <h2 id="company-stats" className="sr-only">
                  Company Statistics
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                  <div className="animate-pulse-slow">
                    <div className="text-4xl font-bold text-blue-500 mb-2">5+</div>
                    <div className="text-gray-300">Years Experience</div>
                  </div>
                  <div className="animate-pulse-slow">
                    <div className="text-4xl font-bold text-blue-500 mb-2">$50M+</div>
                    <div className="text-gray-300">Assets Under Management</div>
                  </div>
                  <div className="animate-pulse-slow">
                    <div className="text-4xl font-bold text-blue-500 mb-2">25K+</div>
                    <div className="text-gray-300">Happy Investors</div>
                  </div>
                  <div className="animate-pulse-slow">
                    <div className="text-4xl font-bold text-blue-500 mb-2">150+</div>
                    <div className="text-gray-300">Countries Served</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Company Story */}
          <section className="mb-16" aria-labelledby="story-heading">
            <h2 id="story-heading" className="text-4xl font-bold text-center text-white mb-12 neon-text">
              Our Story
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <OptimizedImage
                  src="/placeholder.svg?height=400&width=600"
                  alt="CryptoVault headquarters building"
                  width={600}
                  height={400}
                  className="rounded-lg glow"
                />
              </div>
              <div className="space-y-6">
                <p className="text-gray-300 text-lg">
                  Founded in 2019 by a team of Wall Street veterans and Silicon Valley engineers, CryptoVault was born
                  from the vision of making sophisticated cryptocurrency investment strategies accessible to everyone.
                </p>
                <p className="text-gray-300 text-lg">
                  We recognized that while institutional investors had access to advanced trading algorithms and risk
                  management tools, retail investors were left with basic platforms that couldn't compete in the
                  fast-moving crypto markets.
                </p>
                <p className="text-gray-300 text-lg">
                  Today, we're proud to serve over 25,000 investors worldwide, managing more than $50 million in assets
                  with our proprietary AI-driven investment strategies.
                </p>
              </div>
            </div>
          </section>

          {/* Values Section */}
          <section aria-labelledby="values-heading">
            <h2 id="values-heading" className="text-4xl font-bold text-center text-white mb-12 neon-text">
              Our Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="bg-gray-800/50 border-blue-500/20">
                <CardHeader>
                  <CardTitle className="text-xl text-white text-center">Transparency</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 text-center">
                    We believe in complete transparency. Every investment decision, fee structure, and performance
                    metric is clearly communicated to our investors.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-blue-500/20">
                <CardHeader>
                  <CardTitle className="text-xl text-white text-center">Innovation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 text-center">
                    We continuously invest in cutting-edge technology and research to stay ahead of market trends and
                    deliver superior returns to our investors.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-blue-500/20">
                <CardHeader>
                  <CardTitle className="text-xl text-white text-center">Security</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 text-center">
                    Your security is our top priority. We employ bank-level security measures and insurance coverage to
                    protect your investments.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
