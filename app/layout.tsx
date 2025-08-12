import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from '@vercel/analytics/react'
import ChatBot from "@/components/ChatBot"

import "./globals.css"

export const metadata: Metadata = {
  title: "SVC MOTO - Alquiler Motos Eléctricas Málaga",
  description:
    "Alquiler de motos eléctricas en Málaga. Servicios de reparación y mantenimiento. Explora la ciudad de forma sostenible.",
  keywords: "alquiler motos eléctricas málaga, patinetes eléctricos, servicios reparación, vehículos sostenibles, turismo ecológico málaga",
  authors: [{ name: "SVC MOTO" }],
  creator: "SVC MOTO",
  publisher: "SVC MOTO",
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
    locale: 'es_ES',
    url: 'https://svcmoto.com',
    siteName: 'SVC MOTO',
    title: 'SVC MOTO - Alquiler Motos Eléctricas Málaga',
    description: 'Alquiler de motos eléctricas en Málaga. Servicios de reparación y mantenimiento. Explora la ciudad de forma sostenible.',
    images: [
      {
        url: '/logo-svcmoto.jpeg',
        width: 1200,
        height: 630,
        alt: 'SVC MOTO - Alquiler de Motos Eléctricas en Málaga',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SVC MOTO - Alquiler Motos Eléctricas Málaga',
    description: 'Alquiler de motos eléctricas en Málaga. Servicios de reparación y mantenimiento.',
    images: ['/logo-svcmoto.jpeg'],
  },
  alternates: {
    canonical: 'https://svcmoto.com',
  },
  icons: {
    icon: '/logo-svcmoto.jpeg',
    shortcut: '/logo-svcmoto.jpeg',
    apple: '/logo-svcmoto.jpeg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <head>
        <link href="https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css" rel="stylesheet" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bangers&display=swap" rel="stylesheet" />
        <link rel="canonical" href="https://svcmoto.com" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#f97316" />
        <meta name="msapplication-TileColor" content="#f97316" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
.bangers-regular {
  font-family: "Bangers", system-ui;
  font-weight: 400;
  font-style: normal;
}
        `}</style>
      </head>
      <body>
        {children}
        <ChatBot />
        <Analytics />
      </body>
    </html>
  )
}
