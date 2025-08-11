"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Phone, MapPin, Clock, Mail, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

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

  useEffect(() => {
    if (map.current) return // initialize map only once

    // Dynamically import mapbox-gl
    import("mapbox-gl").then((mapboxgl) => {
      const mapboxToken = "pk.eyJ1IjoiNDIwYnRjIiwiYSI6ImNtOTN3ejBhdzByNjgycHF6dnVmeHl2ZTUifQ.Utq_q5wN6DHwpkn6rcpZdw"

      if (!mapboxgl.default.accessToken) {
        mapboxgl.default.accessToken = mapboxToken
      }

      map.current = new mapboxgl.default.Map({
        container: mapContainer.current!,
        style: "mapbox://styles/mapbox/satellite-streets-v12",
        center: [0, 0], // Start from world view
        zoom: 1,
        pitch: 30, // Vista más vertical y aérea
        bearing: 0,
      })

      map.current.on("load", () => {
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
          map.current.flyTo({
            center: [lng, lat],
            zoom: zoom,
            pitch: 30, // Vista más vertical y aérea
            bearing: 0,
            duration: 3000,
            essential: true,
          })

          // Add marker after flight animation
          setTimeout(() => {
            marker.addTo(map.current)
          }, 2000)
        }, 1000)
      })
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
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="bg-orange-500 text-white font-bold text-xl px-3 py-1 rounded-lg">
                SVC MOTO
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <Link
                  href="/"
                  className="text-blue-900 hover:text-orange-500 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Inicio
                </Link>
                <Link
                  href="/alquiler"
                  className="text-blue-900 hover:text-orange-500 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Alquiler Motos
                </Link>
                <Link
                  href="/servicios"
                  className="text-blue-900 hover:text-orange-500 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Servicios
                </Link>
                <Link
                  href="/contacto"
                  className="text-orange-500 px-3 py-2 text-sm font-medium border-b-2 border-orange-500"
                >
                  Contacto
                </Link>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">Reservar Ahora</Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Link href="/" className="text-white hover:text-orange-200 mr-4">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-white">Contacto</h1>
          </div>
          <p className="text-xl text-white/90 max-w-3xl">
            Estamos aquí para ayudarte. Contáctanos para alquileres, servicios técnicos o cualquier consulta.
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
                  <CardTitle className="text-2xl text-blue-900">Envíanos un Mensaje</CardTitle>
                  <p className="text-gray-600">Completa el formulario y te responderemos lo antes posible</p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="nombre">Nombre completo *</Label>
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
                        <Label htmlFor="telefono">Teléfono *</Label>
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
                      <Label htmlFor="email">Email *</Label>
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
                      <Label htmlFor="servicio">Servicio de interés</Label>
                      <select
                        id="servicio"
                        name="servicio"
                        value={formData.servicio}
                        onChange={handleInputChange}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="">Selecciona un servicio</option>
                        <option value="alquiler-moto">Alquiler de Moto</option>
                        <option value="alquiler-patinete">Alquiler de Patinete</option>
                        <option value="reparacion">Reparación</option>
                        <option value="mantenimiento">Mantenimiento</option>
                        <option value="bateria">Cambio de Batería</option>
                        <option value="otro">Otro</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="mensaje">Mensaje *</Label>
                      <Textarea
                        id="mensaje"
                        name="mensaje"
                        required
                        rows={4}
                        value={formData.mensaje}
                        onChange={handleInputChange}
                        placeholder="Cuéntanos en qué podemos ayudarte..."
                        className="mt-1"
                      />
                    </div>

                    <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                      Enviar Mensaje
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              {/* Contact Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-blue-900">Información de Contacto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <MapPin className="w-6 h-6 text-orange-500 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-blue-900">Ubicación</h3>
                      <p className="text-gray-600">C. Héroe de Sostoa, 37</p>
                      <p className="text-gray-600">Carretera de Cádiz</p>
                      <p className="text-gray-600">29002 Málaga, España</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Phone className="w-6 h-6 text-orange-500 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-blue-900">Teléfono</h3>
                      <p className="text-gray-600">607 22 88 82</p>
                      <p className="text-sm text-orange-500">También disponible por WhatsApp</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Mail className="w-6 h-6 text-orange-500 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-blue-900">Email</h3>
                      <p className="text-gray-600">info@svcmoto.com</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Clock className="w-6 h-6 text-orange-500 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-blue-900">Horario</h3>
                      <p className="text-gray-600">Lunes a Viernes: 10:00 - 19:00</p>
                      <p className="text-gray-600">Sábados: Cerrado</p>
                      <p className="text-gray-600">Domingos: Cerrado</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-blue-900">Contacto Rápido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                    <Phone className="w-4 h-4 mr-2" />
                    WhatsApp: 607 22 88 82
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white bg-transparent"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Llamar Ahora
                  </Button>
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
            <h2 className="text-3xl font-bold text-blue-900 mb-4">Nuestra Ubicación</h2>
            <p className="text-xl text-gray-600">Encuéntranos en el corazón de Málaga</p>
          </div>

          <Card>
            <CardContent className="p-0">
              <div ref={mapContainer} className="w-full h-96 rounded-lg" style={{ minHeight: "400px" }} />
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">Cerca de Estación María Zambrano (456m) • Calle Larios (1,68km)</p>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              <MapPin className="w-4 h-4 mr-2" />
              Ver en Google Maps
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
