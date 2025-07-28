export function JsonLd() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "CryptoVault",
    url: "https://cryptovault.com",
    logo: "https://cryptovault.com/logo.png",
    description: "Premium cryptocurrency investment platform with AI-powered trading strategies",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+1-555-123-4567",
      contactType: "customer service",
      availableLanguage: "English",
    },
    sameAs: [
      "https://twitter.com/cryptovault",
      "https://linkedin.com/company/cryptovault",
      "https://facebook.com/cryptovault",
    ],
  }

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "CryptoVault",
    url: "https://cryptovault.com",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://cryptovault.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  }

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    name: "CryptoVault Investment Platform",
    description: "Secure cryptocurrency investment platform with AI-powered trading strategies",
    provider: {
      "@type": "Organization",
      name: "CryptoVault",
    },
    areaServed: "Worldwide",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Investment Plans",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Starter Plan",
            description: "Perfect for beginners looking to start their crypto journey",
          },
        },
      ],
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
    </>
  )
}
