import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from "@/components/analytics"
import { JsonLd } from "@/components/json-ld"
import { Suspense } from "react"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
})

export const metadata = {
  metadataBase: new URL("https://cryptovault.com"),
  title: {
    default: "CryptoVault - Premium Cryptocurrency Investment Platform",
    template: "%s | CryptoVault",
  },
  description:
    "Secure and profitable cryptocurrency investment platform with AI-powered trading strategies. Earn up to 15% monthly returns with bank-level security and 24/7 support.",
  keywords: [
    "cryptocurrency investment",
    "crypto trading",
    "bitcoin investment",
    "blockchain investment",
    "crypto portfolio",
    "digital assets",
    "crypto returns",
    "investment platform",
    "crypto vault",
    "cryptocurrency trading",
  ],
  authors: [{ name: "CryptoVault Team" }],
  creator: "CryptoVault",
  publisher: "CryptoVault",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://cryptovault.com",
    siteName: "CryptoVault",
    title: "CryptoVault - Premium Cryptocurrency Investment Platform",
    description:
      "Secure and profitable cryptocurrency investment platform with AI-powered trading strategies. Earn up to 15% monthly returns.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "CryptoVault - Premium Cryptocurrency Investment Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CryptoVault - Premium Cryptocurrency Investment Platform",
    description: "Secure and profitable cryptocurrency investment platform with AI-powered trading strategies.",
    images: ["/twitter-image.jpg"],
    creator: "@cryptovault",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1e293b" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className={`${inter.className} bg-gray-950 text-white antialiased`}>
        <Suspense fallback={null}>
          <JsonLd />
          {children}
          <Toaster />
          <Analytics />
        </Suspense>
      </body>
    </html>
  )
}
