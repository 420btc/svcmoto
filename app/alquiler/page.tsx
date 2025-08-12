"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, Zap, Shield, ArrowLeft, Menu, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function AlquilerPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  
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

  const motos = [
    {
      id: 2,
      nombre: "City Explorer",
      tipo: "Moto Eléctrica",
      imagen: "/ownis.png",
      autonomia: "120 km",
      velocidad: "50 km/h",
      capacidad: "2 personas",
      precios: {
        hora: "12€",
        medio_dia: "50€",
        dia_completo: "85€",
        semanal: "500€",
      },
      caracteristicas: ["2 cascos incluidos", "Seguro premium", "Baúl trasero", "Carga rápida"],
    },
    {
      id: 3,
      nombre: "Eco Cruiser",
      tipo: "Patinete Eléctrico",
      imagen: "/placeholder.svg",
      autonomia: "35 km",
      velocidad: "25 km/h",
      capacidad: "1 persona",
      precios: {
        hora: "5€",
        medio_dia: "20€",
        dia_completo: "35€",
        semanal: "200€",
      },
      caracteristicas: ["Casco incluido", "Plegable", "Luces LED", "Frenos de disco"],
    },
  ]

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/50 backdrop-blur-xl shadow-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image src="/logo-svcmoto.jpeg" alt="SVC MOTO Logo" width={50} height={50} className="rounded-lg" />
            </Link>
            
            {/* Desktop Navigation - Centered */}
             <div className="hidden md:flex items-center justify-center flex-1 space-x-8">
                <Link href="/alquiler" className="bangers-regular text-lg md:text-xl text-orange-500 border-b-2 border-orange-500 transition-colors">
                  Alquiler Motos
                </Link>
                <Link href="/servicios" className="bangers-regular text-lg md:text-xl text-blue-900 hover:text-orange-500 transition-colors">
                  Servicios
                </Link>
                <Link href="/contacto" className="bangers-regular text-lg md:text-xl text-blue-900 hover:text-orange-500 transition-colors">
                  Contacto
                </Link>
                {user && (
                  <Link href="/perfil" className="bangers-regular text-lg md:text-xl text-blue-900 hover:text-orange-500 transition-colors">
                    Mi Perfil
                  </Link>
                )}
              </div>
            
            {/* Authentication Section - Right */}
            <div className="hidden md:flex items-center space-x-4">
               {user ? (
                 <div className="flex items-center space-x-4">
                   <span className="text-sm text-blue-900">Hola, {user.name}</span>
                   <Button 
                     onClick={signOut}
                     variant="outline" 
                     className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                   >
                     Cerrar Sesión
                   </Button>
                 </div>
               ) : (
                 <Button 
                   onClick={signIn}
                   className="bg-orange-500 hover:bg-orange-600 text-white"
                 >
                   Iniciar Sesión
                 </Button>
               )}
            </div>
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-blue-900 hover:text-orange-500 p-2"
              >
                {mobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
              </button>
            </div>
          </div>
          {mobileMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
                <Link
                  href="/alquiler"
                  className="bangers-regular text-orange-500 block px-3 py-3 text-base transition-colors border-b border-gray-100 border-b-2 border-orange-500"
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
                  className="bangers-regular text-blue-900 hover:text-orange-500 block px-3 py-3 text-base transition-colors border-b border-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contacto
                </Link>
                {user && (
                  <Link
                    href="/perfil"
                    className="bangers-regular text-blue-900 hover:text-orange-500 block px-3 py-3 text-base transition-colors border-b border-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Mi Perfil
                  </Link>
                )}
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
                        Cerrar Sesión
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
                      Iniciar Sesión
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
            <h1 className="bangers-regular text-5xl md:text-6xl text-white">Alquiler de Motos</h1>
          </div>
          <p className="text-xl text-white/90 max-w-3xl">
            Descubre nuestra flota de vehículos eléctricos. Perfectos para explorar Málaga de forma sostenible y
            divertida.
          </p>
        </div>
      </section>

      {/* Motos Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {motos.map((moto) => (
              <Card key={moto.id} className="border-2 border-gray-200 hover:border-orange-500 transition-colors">
                <CardHeader>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <CardTitle className="bangers-regular text-3xl md:text-4xl text-blue-900">{moto.nombre}</CardTitle>
                      <Badge variant="secondary" className="mt-2 bg-orange-100 text-orange-800">
                        {moto.tipo}
                      </Badge>
                    </div>
                  </div>

                  {/* Imagen de la moto */}
                  <div className="w-full h-48 bg-transparent rounded-lg overflow-hidden mb-4">
                    <Image
                      src={moto.imagen}
                      alt={moto.nombre}
                      width={400}
                      height={200}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </CardHeader>

                <CardContent>
                  {/* Especificaciones */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-orange-500" />
                      <span className="text-sm text-gray-600">Autonomía: {moto.autonomia}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-orange-500" />
                      <span className="text-sm text-gray-600">Máx: {moto.velocidad}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-orange-500" />
                      <span className="text-sm text-gray-600">{moto.capacidad}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-orange-500" />
                      <span className="text-sm text-gray-600">Seguro incluido</span>
                    </div>
                  </div>

                  {/* Precios */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-blue-900 mb-3">Precios de Alquiler</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">1 hora:</span>
                        <span className="font-semibold text-orange-600">{moto.precios.hora}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Medio día:</span>
                        <span className="font-semibold text-orange-600">{moto.precios.medio_dia}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Día completo:</span>
                        <span className="font-semibold text-orange-600">{moto.precios.dia_completo}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Semanal:</span>
                        <span className="font-semibold text-orange-600">{moto.precios.semanal}</span>
                      </div>
                    </div>
                  </div>

                  {/* Características */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-blue-900 mb-3">Incluye</h4>
                    <div className="flex flex-wrap gap-2">
                      {moto.caracteristicas.map((caracteristica, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {caracteristica}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                    Reservar {moto.nombre}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 bg-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="bangers-regular text-4xl md:text-5xl text-white mb-4">¿Cómo Funciona el Alquiler?</h2>
            <p className="bangers-regular text-2xl md:text-3xl text-white/90">Proceso simple y rápido para empezar tu aventura</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-orange-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="bangers-regular text-2xl md:text-3xl text-white mb-2">Elige tu Vehículo</h3>
              <p className="text-white/90">Selecciona la moto o patinete que mejor se adapte a tus necesidades</p>
            </div>

            <div className="text-center">
              <div className="bg-orange-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="bangers-regular text-2xl md:text-3xl text-white mb-2">Reserva Online</h3>
              <p className="text-white/90">Completa tu reserva online o llámanos directamente</p>
            </div>

            <div className="text-center">
              <div className="bg-orange-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="bangers-regular text-2xl md:text-3xl text-white mb-2">Recoge y Disfruta</h3>
              <p className="text-white/90">Recoge tu vehículo en nuestro local y explora Málaga</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-orange-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="bangers-regular text-4xl md:text-5xl text-white mb-4">¿Listo para tu Aventura?</h2>
          <p className="text-xl text-white/90 mb-8">
            Contacta con nosotros para reservar tu vehículo o resolver cualquier duda
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-900 hover:bg-blue-800 text-white">
              Llamar: 607 22 88 82
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-orange-500 bg-transparent"
            >
              WhatsApp
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
