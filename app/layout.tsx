import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { StructuredData } from '@/components/StructuredData'

const dmSans = DM_Sans({ 
  subsets: ['latin'],
  variable: '--font-dm-sans',
})

export const metadata: Metadata = {
  title: 'FitFlow - Automatisation Lead Generation Instagram pour Coachs Fitness',
  description: 'Transformez vos commentaires Instagram en clients payants avec l\'IA. Lead scoring automatique, DMs personnalisés en 30 sec. +3-5 clients/semaine. Essai gratuit 14 jours.',
  keywords: [
    'automatisation instagram',
    'lead generation fitness',
    'coach fitness instagram',
    'IA instagram',
    'automatisation DM instagram',
    'génération leads automatique',
    'marketing automation fitness',
    'chatbot instagram',
    'prospection automatique instagram',
    'coach sportif leads'
  ],
  authors: [{ name: 'FitFlow' }],
  creator: 'FitFlow',
  publisher: 'FitFlow',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://fit-flow-gamma.vercel.app',
    title: 'FitFlow - Automatisation Lead Generation Instagram pour Coachs Fitness',
    description: 'Transformez vos commentaires Instagram en clients payants avec l\'IA. +3-5 nouveaux clients/semaine. Essai gratuit 14 jours.',
    siteName: 'FitFlow',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://fit-flow-gamma.vercel.app'}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'FitFlow - Automatisation Instagram pour Coachs',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FitFlow - Automatisation Lead Generation Instagram',
    description: 'Transformez vos commentaires Instagram en clients payants avec l\'IA. Essai gratuit 14 jours.',
    images: [`${process.env.NEXT_PUBLIC_APP_URL || 'https://fit-flow-gamma.vercel.app'}/og-image.png`],
    creator: '@fitflow',
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_APP_URL || 'https://fit-flow-gamma.vercel.app',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  themeColor: '#FF5C00',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  verification: {
    google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />
        <StructuredData />
      </head>
      <body className={`${dmSans.variable} font-sans antialiased`} style={{ margin: 0, padding: 0, width: '100%', overflowX: 'hidden' }}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
