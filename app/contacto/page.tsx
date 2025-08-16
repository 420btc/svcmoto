"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Phone, MapPin, Clock, Mail, ArrowLeft, Menu, X, Home } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useTranslation } from "@/contexts/TranslationContext"
import { LanguageToggle } from "@/components/LanguageToggle"

export default function ContactoPage() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<any>(null)
  const [lng] = useState(-4.4343684)
  const [lat] = useState(36.708544)
  const [zoom] = useState(15)
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    servicio: "",
    mensaje: "",
  })
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [showRoutes, setShowRoutes] = useState(false)
  const [activeRoute, setActiveRoute] = useState<number | null>(null)
  const router = useRouter()
  const { t } = useTranslation()
  
  const signIn = () => router.push('/handler/sign-in')
  const signOut = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user')
    }
    setUser(null)
  }
  
  // Verificar autenticación desde localStorage
  useEffect(() => {
    // Verificar que estamos en el cliente
    if (typeof window === 'undefined') return
    
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  useEffect(() => {
    if (map.current) return // initialize map only once

    // Dynamically import mapbox-gl
    import("mapbox-gl").then((mapboxgl) => {
      const mapboxToken = "pk.eyJ1IjoiNDIwYnRjIiwiYSI6ImNtOTN3ejBhdzByNjgycHF6dnVmeHl2ZTUifQ.Utq_q5wN6DHwpkn6rcpZdw"

      if (!mapboxgl.default.accessToken) {
        mapboxgl.default.accessToken = mapboxToken
      }

      try {
        map.current = new mapboxgl.default.Map({
          container: mapContainer.current!,
          style: "mapbox://styles/mapbox/satellite-streets-v12",
          center: [0, 0], // Start from world view
          zoom: 1,
          pitch: 30, // Vista más vertical y aérea
          bearing: 0,
        })
      } catch (error) {
        // Silently handle WebGL initialization errors on mobile
        console.warn('Mapbox WebGL initialization failed:', error)
        return
      }

      map.current?.on("load", () => {
        // Add custom marker with motorcycle emoji
        const markerElement = document.createElement("div")
        markerElement.className = "custom-marker"
        markerElement.innerHTML = `
          <div style="
            background-color: #f97316;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 15px;
            border: 2px solid white;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
          ">🏍️</div>
        `

        // Create marker but don't add it yet
        const marker = new mapboxgl.default.Marker(markerElement).setLngLat([lng, lat])

        // Animate flight to location
        setTimeout(() => {
          map.current?.flyTo({
            center: [lng, lat],
            zoom: zoom,
            pitch: 30, // Vista más vertical y aérea
            bearing: 0,
            duration: 3000,
            essential: true,
          })

          // Add marker after flight animation
          setTimeout(() => {
            if (map.current) {
              marker.addTo(map.current)
            }
          }, 2000)
        }, 1000)
      })

      // Add routes functionality with real street routing
      const addTouristRoutes = async () => {
        if (!map.current) return

        // Define waypoints for tourist routes in Málaga
        const routeWaypoints = {
          route1: {
            name: "Ruta 1: Centro Histórico",
            waypoints: [
              [lng, lat], // Tienda (punto de partida)
              [-4.421982, 36.721078], // Plaza de la Constitución
              [-4.419311, 36.720169], // Catedral de Málaga
              [-4.416890, 36.721190], // Teatro Romano
              [-4.415560, 36.721390], // Alcazaba
              [-4.418330, 36.721670], // Museo Picasso (Palacio de Buenavista)
              [-4.421340, 36.718170], // Calle Marqués de Larios (punto central)
              [lng, lat] // Vuelta a la tienda
            ]
          },
          route2: {
            name: "Ruta 2: Playa y Puerto",
            waypoints: [
              [lng, lat], // Tienda
              [-4.413670, 36.716830], // Muelle Uno (muelle comercial)
              [-4.420500, 36.717200], // Puerto de Málaga (zona del puerto central / morro del dique)
              [-4.406560, 36.719200], // Playa de la Malagueta (entrada/sector central)
              [-4.382680, 36.721160], // Baños del Carmen (El Pedregalejo / Balneario)
              [-4.415872, 36.719056], // Paseo del Parque (promenade junto al parque)
              [-4.420410, 36.717690], // Plaza de la Marina (frente al puerto / acceso principal)
              [lng, lat] // Vuelta a la tienda
            ]
          },
          route3: {
            name: "Ruta 3: Cultura y Mirador",
            waypoints: [
              [lng, lat], // Tienda
              [-4.409938, 36.720974], // Inicio/Subida al Castillo (Paseo de Reding / acceso subida)
              [-4.410850, 36.723500], // Mirador de Gibralfaro (punto panorámico)
              [-4.420500, 36.719800], // Museo Carmen Thyssen Málaga
              [-4.417200, 36.720300], // Centro de Arte Contemporáneo (CAC Málaga)
              [-4.414540, 36.721140], // Jardines de Puerta Oscura (jardines en la ladera)
              [-4.421340, 36.718170], // Bajada al centro (Calle Larios / acceso centro)
              [lng, lat] // Vuelta a la tienda
            ]
          }
        }

        // Function to get route between waypoints using Mapbox Directions API
        const getRouteCoordinates = async (waypoints: number[][]) => {
          try {
            const waypointsStr = waypoints.map(wp => `${wp[0]},${wp[1]}`).join(';')
            const response = await fetch(
              `https://api.mapbox.com/directions/v5/mapbox/cycling/${waypointsStr}?geometries=geojson&access_token=${mapboxToken}`
            )
            const data = await response.json()
            
            if (data.routes && data.routes[0]) {
              return data.routes[0].geometry.coordinates
            }
            return waypoints // Fallback to straight lines if API fails
          } catch (error) {
            console.warn('Error fetching route:', error)
            return waypoints // Fallback to straight lines
          }
        }

        // Define points of interest for each route with corrected coordinates and descriptions
        const routePOIs = {
          route1: [
            { name: "Plaza de la Constitución", coords: [-4.421982, 36.721078] as [number, number], icon: "🏛️", description: "Plaza principal del centro histórico, corazón de la ciudad" },
            { name: "Catedral de Málaga", coords: [-4.419311, 36.720169] as [number, number], icon: "⛪", description: "La Manquita - Catedral renacentista con una torre inacabada" },
            { name: "Teatro Romano", coords: [-4.416890, 36.721190] as [number, number], icon: "🏛️", description: "Teatro romano del siglo I a.C., vestigio de la Málaga antigua" },
            { name: "Alcazaba", coords: [-4.415560, 36.721390] as [number, number], icon: "🏰", description: "Fortaleza árabe del siglo XI con jardines y vistas panorámicas" },
            { name: "Museo Picasso", coords: [-4.418330, 36.721670] as [number, number], icon: "🎨", description: "Museo dedicado al artista malagueño Pablo Picasso" },
            { name: "Calle Larios", coords: [-4.421340, 36.718170] as [number, number], icon: "🛍️", description: "Calle peatonal principal para compras y paseo" }
          ],
          route2: [
            { name: "Muelle Uno", coords: [-4.413670, 36.716830] as [number, number], icon: "⚓", description: "Centro comercial y gastronómico junto al puerto" },
            { name: "Puerto de Málaga", coords: [-4.420500, 36.717200] as [number, number], icon: "🚢", description: "Puerto marítimo con actividad comercial y de cruceros" },
            { name: "Playa de la Malagueta", coords: [-4.406560, 36.719200] as [number, number], icon: "🏖️", description: "Playa urbana principal de Málaga, ideal para relajarse" },
            { name: "Baños del Carmen", coords: [-4.382680, 36.721160] as [number, number], icon: "🏊", description: "Balneario histórico en El Pedregalejo, zona de marisquerías" },
            { name: "Paseo del Parque", coords: [-4.415872, 36.719056] as [number, number], icon: "🌳", description: "Parque urbano con jardines tropicales y zona de paseo" },
            { name: "Plaza de la Marina", coords: [-4.420410, 36.717690] as [number, number], icon: "⛵", description: "Plaza frente al puerto, punto de encuentro y eventos" }
          ],
          route3: [
            { name: "Subida al Castillo", coords: [-4.409938, 36.720974] as [number, number], icon: "⬆️", description: "Inicio del ascenso hacia el mirador con vistas panorámicas de la ciudad" },
            { name: "Mirador de Gibralfaro", coords: [-4.410850, 36.723500] as [number, number], icon: "👁️", description: "Mirador con las mejores vistas panorámicas de Málaga, puerto y costa" },
            { name: "Museo Carmen Thyssen", coords: [-4.420500, 36.719800] as [number, number], icon: "🎨", description: "Museo de arte con obras de maestros españoles del siglo XIX" },
            { name: "Centro de Arte Contemporáneo", coords: [-4.417200, 36.720300] as [number, number], icon: "🖼️", description: "CAC Málaga - Arte contemporáneo y exposiciones temporales" },
            { name: "Jardines de Puerta Oscura", coords: [-4.414540, 36.721140] as [number, number], icon: "🌺", description: "Jardines históricos con vistas a la ciudad y zona de descanso" },
            { name: "Bajada al centro", coords: [-4.421340, 36.718170] as [number, number], icon: "⬇️", description: "Regreso al centro histórico por la famosa Calle Larios" }
          ]
        }

        // Create routes with real street routing
        for (const [routeId, route] of Object.entries(routeWaypoints)) {
          const sourceId = `route-${routeId}`
          const layerId = `route-${routeId}-layer`
          const poisSourceId = `pois-${routeId}`
          const poisLayerId = `pois-${routeId}-layer`

          // Get real street coordinates
          const streetCoordinates = await getRouteCoordinates(route.waypoints)

          // Add route source
          map.current?.addSource(sourceId, {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: { name: route.name },
              geometry: {
                type: 'LineString',
                coordinates: streetCoordinates
              }
            }
          })

          // Add route layer
          map.current?.addLayer({
            id: layerId,
            type: 'line',
            source: sourceId,
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': '#f97316', // Orange color
              'line-width': 4,
              'line-opacity': 0.8
            }
          })

          // Note: Removed POIs layer to avoid duplicate markers
          // Only using custom HTML markers below

          // Create custom markers for POIs - use waypoint coordinates to ensure alignment
          const waypointCoords = route.waypoints.slice(1, -1) // Exclude start and end (tienda)
          
          waypointCoords.forEach((coords, index) => {
            const poi = routePOIs[routeId as keyof typeof routePOIs][index]
            if (!poi) return
            
            const markerElement = document.createElement('div')
            markerElement.className = `poi-marker poi-marker-${routeId}`
            markerElement.innerHTML = `
               <div style="
                 background-color: #f97316;
                 border-radius: 50%;
                 width: 36px;
                 height: 36px;
                 display: flex;
                 align-items: center;
                 justify-content: center;
                 font-size: 16px;
                 font-weight: bold;
                 color: white;
                 border: 3px solid white;
                 box-shadow: 0 4px 12px rgba(0,0,0,0.4);
                 cursor: pointer;
                 transition: all 0.2s ease;
                 z-index: 1000;
               " onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">${index + 1}</div>
             `

            // Create marker using waypoint coordinates to ensure alignment
              import('mapbox-gl').then((mapboxgl) => {
                // Add click event to show POI info with description
                markerElement.addEventListener('click', (e) => {
                  e.stopPropagation()
                  // Create popup content with description - mobile optimized
                   const isMobile = window.innerWidth <= 768
                   const popupContent = `
                     <div style="text-align: center; padding: ${isMobile ? '8px' : '12px'}; max-width: ${isMobile ? '200px' : '250px'};">
                       <div style="font-size: ${isMobile ? '20px' : '24px'}; margin-bottom: ${isMobile ? '4px' : '6px'};">${poi.icon}</div>
                       <div style="font-weight: bold; color: #1e40af; font-size: ${isMobile ? '14px' : '16px'}; margin-bottom: ${isMobile ? '3px' : '4px'};">${poi.name}</div>
                       <div style="font-size: ${isMobile ? '11px' : '13px'}; color: #374151; margin-bottom: ${isMobile ? '4px' : '6px'}; line-height: 1.3;">${poi.description || 'Punto de interés en la ruta turística'}</div>
                       <div style="font-size: ${isMobile ? '9px' : '11px'}; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: ${isMobile ? '3px' : '4px'};">Punto ${index + 1} - ${route.name}</div>
                     </div>
                   `
                  
                  // Create and add popup with auto-close - mobile responsive
                    const popup = new mapboxgl.default.Popup({ 
                      closeOnClick: true, 
                      closeButton: true,
                      maxWidth: isMobile ? '220px' : '280px',
                      offset: isMobile ? 15 : 25,
                      className: 'custom-popup'
                    })
                     .setLngLat(coords as [number, number])
                     .setHTML(popupContent)
                     .addTo(map.current!)
                   
                   // Auto-close popup after 3 seconds
                   setTimeout(() => {
                     if (popup.isOpen()) {
                       popup.remove()
                     }
                   }, 3000)
                })

                // Add larger click area for easier interaction
                markerElement.style.padding = '8px'
                markerElement.style.margin = '-8px'

                const marker = new mapboxgl.default.Marker(markerElement)
                  .setLngLat(coords as [number, number])

                // Store marker reference for show/hide functionality
                if (!(window as any).routeMarkers) {
                  (window as any).routeMarkers = {}
                }
                if (!(window as any).routeMarkers[routeId]) {
                  (window as any).routeMarkers[routeId] = []
                }
                (window as any).routeMarkers[routeId].push(marker)
              })
          })

          // Initially hide all routes and POIs
          map.current?.setLayoutProperty(layerId, 'visibility', 'none')
        }
      }

      // Add routes after map loads
      map.current?.on('load', addTouristRoutes)
    }).catch((error) => {
      console.warn("Error loading mapbox-gl:", error)
    })
  }, [lng, lat, zoom])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // Here you would typically send the data to your backend
    alert("Mensaje enviado correctamente. Te contactaremos pronto.")
  }

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/50 backdrop-blur-xl shadow-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            {/* Logo - Left Column */}
            <div className="flex items-center w-1/4">
              <Link href="/" className="flex items-center">
                <Image src="/logo-svcmoto.jpeg" alt="SVC MOTO Logo" width={50} height={50} className="rounded-lg" />
              </Link>
            </div>
            
            {/* Desktop Navigation - Center Column */}
            <div className="hidden md:flex items-center justify-center flex-1 space-x-6">
              <Link href="/alquiler" className="bangers-regular text-lg md:text-xl text-blue-900 hover:text-orange-500 transition-colors">
                {t('nav.rental')}
              </Link>
              <Link href="/servicios" className="bangers-regular text-lg md:text-xl text-blue-900 hover:text-orange-500 transition-colors">
                {t('nav.services')}
              </Link>
              <Link href="/contacto" className="bangers-regular text-lg md:text-xl text-orange-500 border-b-2 border-orange-500 transition-colors">
                {t('nav.contact')}
              </Link>
              {user && (
                <Link href="/perfil" className="bangers-regular text-lg md:text-xl text-blue-900 hover:text-orange-500 transition-colors">
                  {t('nav.profile')}
                </Link>
              )}
            </div>
            
            {/* Authentication Section - Right Column */}
            <div className="hidden md:flex items-center justify-end space-x-4 w-1/4">
               <LanguageToggle />
               {user ? (
                 <div className="flex items-center space-x-4">
                   <span className="text-sm text-blue-900">{t('nav.hello')} {user.name}</span>
                   <Button 
                     onClick={signOut}
                     variant="outline" 
                     className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                   >
                     {t('nav.signOut')}
                   </Button>
                 </div>
               ) : (
                 <Button 
                   onClick={signIn}
                   className="bg-orange-500 hover:bg-orange-600 text-white"
                 >
                   {t('nav.signIn')}
                 </Button>
               )}
            </div>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center justify-between w-full">
              <div></div>
              <div className="flex items-center space-x-2">
                <LanguageToggle className="p-1" />
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="text-blue-900 hover:text-orange-500 p-2 flex items-center space-x-1"
                >
                  <Home className="w-6 h-6" />
                  {mobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
                </button>
              </div>
            </div>
          </div>
          {mobileMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
                <Link
                  href="/alquiler"
                  className="bangers-regular text-blue-900 hover:text-orange-500 block px-3 py-3 text-base transition-colors border-b border-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Alquiler Motos
                </Link>
                <Link
                  href="/servicios"
                  className="bangers-regular text-blue-900 hover:text-orange-500 block px-3 py-3 text-base transition-colors border-b border-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Servicios
                </Link>
                <Link
                  href="/contacto"
                  className="bangers-regular text-orange-500 block px-3 py-3 text-base transition-colors border-b border-gray-100 border-b-2 border-orange-500"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contacto
                </Link>
                <Link
                  href="/perfil"
                  className="bangers-regular text-blue-900 hover:text-orange-500 block px-3 py-3 text-base transition-colors border-b border-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Mi Perfil
                </Link>
                <div className="px-3 py-3">
                  {user ? (
                    <div className="space-y-2">
                      <p className="bangers-regular text-sm text-blue-900 text-center">Hola, {user.name}</p>
                      <Button
                        onClick={() => {
                          signOut()
                          setMobileMenuOpen(false)
                        }}
                        variant="outline"
                        className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white w-full"
                      >
                        {t('contact.signOut')}
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => {
                        signIn()
                        setMobileMenuOpen(false)
                      }}
                      className="bg-orange-500 hover:bg-orange-600 text-white w-full"
                    >
                      {t('contact.signIn')}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Header */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Link href="/" className="text-white hover:text-orange-200 mr-4">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="bangers-regular text-5xl md:text-6xl text-white">{t('contact.pageTitle')}</h1>
          </div>
          <p className="text-xl text-white/90 max-w-3xl">
            {t('contact.pageSubtitle')}
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="bangers-regular text-2xl sm:text-3xl text-blue-900">{t('contact.sendMessage')}</CardTitle>
                  <p className="text-gray-600">{t('contact.formSubtitle')}</p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="nombre">{t('contact.fullName')}</Label>
                        <Input
                          id="nombre"
                          name="nombre"
                          type="text"
                          required
                          value={formData.nombre}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="telefono">{t('contact.phoneNumber')}</Label>
                        <Input
                          id="telefono"
                          name="telefono"
                          type="tel"
                          required
                          value={formData.telefono}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">{t('contact.email')}</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="servicio">{t('contact.serviceInterest')}</Label>
                      <select
                        id="servicio"
                        name="servicio"
                        value={formData.servicio}
                        onChange={handleInputChange}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="">{t('contact.selectService')}</option>
                        <option value="alquiler-moto">{t('contact.motorcycleRental')}</option>
                        <option value="alquiler-patinete">{t('contact.scooterRental')}</option>
                        <option value="reparacion">{t('contact.repair')}</option>
                        <option value="mantenimiento">{t('contact.maintenance')}</option>
                        <option value="bateria">{t('contact.batteryChange')}</option>
                        <option value="otro">{t('contact.other')}</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="mensaje">{t('contact.message')}</Label>
                      <Textarea
                        id="mensaje"
                        name="mensaje"
                        required
                        rows={4}
                        value={formData.mensaje}
                        onChange={handleInputChange}
                        placeholder={t('contact.messagePlaceholder')}
                        className="mt-1"
                      />
                    </div>

                    <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                      {t('contact.sendButton')}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Info */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="bangers-regular text-2xl sm:text-3xl text-blue-900">{t('contact.contactInfo')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <MapPin className="w-6 h-6 text-orange-500 mt-1" />
                    <div>
                      <h3 className="bangers-regular text-lg text-blue-900">{t('contact.location')}</h3>
                      <p className="text-gray-600">C. Héroe de Sostoa, 37</p>
                      <p className="text-gray-600">Carretera de Cádiz</p>
                      <p className="text-gray-600">29002 Málaga, España</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Phone className="w-6 h-6 text-orange-500 mt-1" />
                    <div>
                      <h3 className="bangers-regular text-lg text-blue-900">{t('contact.phone')}</h3>
                      <p className="text-gray-600">607 22 88 82</p>
                      <p className="text-sm text-orange-500">{t('contact.whatsappAvailable')}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Mail className="w-6 h-6 text-orange-500 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-blue-900">{t('contact.emailLabel')}</h3>
                      <p className="text-gray-600">info@svcmoto.com</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Clock className="w-6 h-6 text-orange-500 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-blue-900">{t('contact.schedule')}</h3>
                      <p className="text-gray-600">{t('contact.mondayFriday')}</p>
                      <p className="text-gray-600">{t('contact.saturday')}</p>
                      <p className="text-gray-600">{t('contact.sunday')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>



          </div>
          
          {/* Quick Contact - Full Width */}
          <div className="mt-12">
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="bangers-regular text-2xl sm:text-3xl text-blue-900 text-center">{t('contact.quickContact')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                      <Phone className="w-4 h-4 mr-2" />
                      {t('contact.whatsappButton')}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white bg-transparent"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      {t('contact.callNow')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="bangers-regular text-3xl text-blue-900 mb-4">{t('contact.ourLocation')}</h2>
            <p className="text-xl text-gray-600">{t('contact.locationSubtitle')}</p>
          </div>

          <Card>
            <CardContent className="p-0">
              <div ref={mapContainer} className="w-full h-96 rounded-lg" style={{ minHeight: "400px" }} />
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">{t('contact.nearbyLandmarks')}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                onClick={() => {
                  setShowRoutes(!showRoutes)
                  // Auto-scroll to routes panel on mobile when opening
                   if (!showRoutes && window.innerWidth <= 768) {
                     setTimeout(() => {
                       const routesPanel = document.querySelector('.routes-panel')
                       if (routesPanel) {
                         routesPanel.scrollIntoView({ behavior: 'smooth', block: 'center' })
                       }
                     }, 200)
                   }
                }}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                🗺️ Ver Rutas
              </Button>
              <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                <MapPin className="w-4 h-4 mr-2" />
                {t('contact.viewOnMaps')}
              </Button>
            </div>
            
            {showRoutes && (
              <div className="routes-panel mt-6 bg-white rounded-lg shadow-lg p-4 max-w-md mx-auto">
                <h3 className="bangers-regular text-lg text-blue-900 mb-4">Rutas Turísticas por Málaga</h3>
                <div className="space-y-2">
                  {[
                    { id: 1, name: "Ruta 1: Centro Histórico", description: "Catedral, Alcazaba, Museo Picasso" },
                    { id: 2, name: "Ruta 2: Playa y Puerto", description: "Muelle Uno, Playa Malagueta, Puerto" },
                    { id: 3, name: "Ruta 3: Cultura y Mirador", description: "Mirador Gibralfaro, Museos, Arte" }
                  ].map((route) => (
                    <button
                      key={route.id}
                      onClick={() => {
                        setActiveRoute(activeRoute === route.id ? null : route.id)
                        if (map.current) {
                          // Hide all routes and POIs first
                          for (let i = 1; i <= 3; i++) {
                            map.current.setLayoutProperty(`route-route${i}-layer`, 'visibility', 'none')
                            // Hide POI markers
                            if ((window as any).routeMarkers && (window as any).routeMarkers[`route${i}`]) {
                              (window as any).routeMarkers[`route${i}`].forEach((marker: any) => {
                                marker.remove()
                              })
                            }
                          }
                          // Show selected route and POIs
                          if (activeRoute !== route.id) {
                            map.current.setLayoutProperty(`route-route${route.id}-layer`, 'visibility', 'visible')
                            // Show POI markers for selected route
                            if ((window as any).routeMarkers && (window as any).routeMarkers[`route${route.id}`]) {
                              (window as any).routeMarkers[`route${route.id}`].forEach((marker: any) => {
                                marker.addTo(map.current!)
                              })
                            }
                            // Auto-scroll to map on mobile when selecting a route
                               if (window.innerWidth <= 768) {
                                  setTimeout(() => {
                                    const mapSection = document.querySelector('h2')?.closest('section')
                                    if (mapSection) {
                                      mapSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
                                    }
                                  }, 100)
                                }
                          }
                        }
                      }}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        activeRoute === route.id 
                          ? 'bg-orange-100 border-orange-500 text-orange-700' 
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <div className="font-semibold text-sm">{route.name}</div>
                      <div className="text-xs text-gray-600">{route.description}</div>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-3 text-center">
                  Todas las rutas comienzan y terminan en nuestra tienda
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Google Reviews Section */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="bangers-regular text-2xl sm:text-3xl text-blue-900 text-center">Reseñas Google</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center">
                <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-orange-200 w-full">
                  <div className="flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 mr-2" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="text-xl font-bold text-gray-800">Google</span>
                  </div>
                  <div className="text-center">
                    <div className="flex justify-center items-center mb-2">
                      <div className="flex text-yellow-400">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                      </div>
                      <span className="ml-2 text-lg font-bold text-gray-800">4.8</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Basado en 127 reseñas</p>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                      Ver todas las reseñas
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Link href="/" className="flex items-center mr-4">
                <Image src="/logo-svcmoto.jpeg" alt="SVC MOTO Logo" width={40} height={40} className="rounded-lg" />
              </Link>
              <span className="text-gray-600">svcmoto.com</span>
            </div>
            <div className="text-gray-600 text-sm text-center md:text-right">
              <p>{t('footer.nearStation')}</p>
              <div className="flex items-center justify-center md:justify-end mt-2 space-x-3">
                <a
                  href="https://wa.me/34607228882"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition-colors inline-flex items-center justify-center"
                  title="Contactar por WhatsApp"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.594z"/>
                  </svg>
                </a>
                <p>
                  {t('footer.madeBy')}{" "}
                  <a
                    href="https://www.carlosfr.es"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-orange-500 hover:bg-orange-600 text-white px-2 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer inline-block"
                  >
                    Carlosfr.es
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
