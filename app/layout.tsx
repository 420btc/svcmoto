import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"

import "./globals.css"

export const metadata: Metadata = {
  title: "SVC MOTO - Alquiler y Servicios de Motos Eléctricas en Málaga",
  description:
    "Alquiler de motos y patinetes eléctricos en Málaga. Servicios de reparación y mantenimiento. Explora la ciudad de forma sostenible.",
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
      <body>{children}</body>
    </html>
  )
}
