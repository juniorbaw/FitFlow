import { APP_CONFIG } from '@/lib/config'

export function StructuredData() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'FitFlow',
    url: APP_CONFIG.APP_URL,
    logo: `${APP_CONFIG.APP_URL}/logo.png`,
    description: 'Plateforme d\'automatisation lead generation Instagram pour coachs fitness',
    sameAs: [
      'https://twitter.com/fitflow',
      'https://instagram.com/fitflow',
      'https://linkedin.com/company/fitflow',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'support@fitflow.app',
      availableLanguage: ['French'],
    },
  }

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'FitFlow',
    operatingSystem: 'Web',
    applicationCategory: 'BusinessApplication',
    offers: {
      '@type': 'Offer',
      price: '47',
      priceCurrency: 'EUR',
      priceValidUntil: '2027-12-31',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '127',
      bestRating: '5',
      worstRating: '1',
    },
    description: 'Automatisation complète de la génération de leads Instagram avec IA pour coachs fitness et personal trainers',
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Est-ce que FitFlow respecte les règles Instagram ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Absolument ! FitFlow utilise uniquement l\'API officielle Instagram approuvée par Meta. Votre compte est 100% sécurisé et nous respectons toutes les guidelines.',
        },
      },
      {
        '@type': 'Question',
        name: 'Combien de temps avant les premiers résultats ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'La plupart de nos utilisateurs génèrent leurs premiers leads qualifiés dans les 24-48h. Les premiers clients payants arrivent généralement sous 7-10 jours.',
        },
      },
      {
        '@type': 'Question',
        name: 'L\'essai gratuit est-il vraiment sans engagement ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Oui ! 14 jours complets, toutes les fonctionnalités, aucune carte bancaire requise. Vous pouvez annuler en 1 clic à tout moment.',
        },
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  )
}
