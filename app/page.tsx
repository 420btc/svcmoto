"use client"


import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Phone, MapPin, Clock, Star, Zap, Shield, Wrench, Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

export default function Home() {
  const [showIntro, setShowIntro] = useState(false)
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

  useEffect(() => {
    // Check if intro has been shown in this session
    const introShown = sessionStorage.getItem("svc-intro-shown")

    if (!introShown) {
      setShowIntro(true)

      const timer = setTimeout(() => {
        setShowIntro(false)
        sessionStorage.setItem("svc-intro-shown", "true")
      }, 4000) // 4 seconds

      return () => clearTimeout(timer)
    }
  }, [])

  const handleSkipIntro = () => {
    setShowIntro(false)
    sessionStorage.setItem("svc-intro-shown", "true")
  }

  if (showIntro) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="relative w-full h-full max-w-md mx-auto md:max-w-lg">
          <video
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover md:object-contain"
            onEnded={handleSkipIntro}
            onClick={handleSkipIntro}
          >
            <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/webINTRO-X8cjOamJedIJkrfjNuAhIG9ceSsk2C.mp4" type="video/mp4" />
          </video>
          <button
            onClick={handleSkipIntro}
            className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded text-sm hover:bg-black/70 transition-colors"
          >
            Saltar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
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
                <Link href="/alquiler" className="bangers-regular text-lg md:text-xl text-blue-900 hover:text-orange-500 transition-colors">
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
                  className="bangers-regular text-blue-900 hover:text-orange-500 block px-3 py-3 text-base transition-colors border-b border-gray-100"
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

      {/* White separator under header */}
      <div className="h-4 bg-white"></div>
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-12 overflow-hidden">
        {/* Background Video */}
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/herovideo.mp4" type="video/mp4" />
        </video>
        
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="bangers-regular text-5xl md:text-7xl text-white mb-6">
            EXPLORA MÁLAGA CON TOTAL
            <br />
            LIBERTAD Y ESTILO
            <br />
            <span className="block text-center text-blue-900 mt-2 text-5xl md:text-8xl font-bold">SVC MOTO</span>
          </h1>
          <p className="bangers-regular text-2xl md:text-3xl text-white/90 mb-8 max-w-3xl mx-auto">
            Descubre, reserva y disfruta de motos electricas en Málaga sin volverte loco.
          </p>
          <Link href="/alquiler">
              <Button size="lg" className="bangers-regular bg-orange-500 hover:bg-orange-600 text-white text-2xl md:text-3xl px-10 py-5">
                RESERVAR AHORA
              </Button>
            </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center mb-2 h-12">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-orange-500 text-orange-500" />
                ))}
              </div>
              <div className="bangers-regular text-xl md:text-2xl text-blue-900">5,0</div>
              <div className="text-sm text-gray-600">SOBRE 12 RESEÑAS</div>
            </div>
            <div className="flex flex-col items-center">
              <Shield className="w-12 h-12 text-orange-500 mb-2" />
              <div className="bangers-regular text-xl md:text-2xl text-blue-900">SEGURO</div>
              <div className="text-sm text-gray-600">INCLUIDO</div>
            </div>
            <div className="flex flex-col items-center">
              <Zap className="w-12 h-12 text-orange-500 mb-2" />
              <div className="bangers-regular text-xl md:text-2xl text-blue-900">100%</div>
              <div className="text-sm text-gray-600">ELÉCTRICO</div>
            </div>
            <div className="flex flex-col items-center">
              <Wrench className="w-12 h-12 text-orange-500 mb-2" />
              <div className="bangers-regular text-xl md:text-2xl text-blue-900">SERVICIO</div>
              <div className="text-sm text-gray-600">COMPLETO</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicios" className="py-16 bg-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="bangers-regular text-4xl md:text-5xl text-white mb-4">REGÍSTRATE Y VIAJA CON TOTAL COMODIDAD</h2>
            <p className="bangers-regular text-2xl md:text-3xl text-white">
              Crea tu cuenta online, selecciona tu vehículo y disfruta de la forma más cómoda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardContent className="p-6 text-center">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-orange-500">1</span>
                </div>
                <h3 className="bangers-regular text-2xl md:text-3xl text-white mb-2">REGÍSTRATE</h3>
                <h4 className="bangers-regular text-xl md:text-2xl text-white mb-2">EN 1 MIN</h4>
                <p className="text-white/90 text-sm">
                  Regístrate en nuestra web y ten acceso inmediato a todos nuestros vehículos de nuestra tienda de Málaga. Completa tu perfil, gana puntos por cada alquiler y listo para rodar.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardContent className="p-6 text-center">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-orange-500">2</span>
                </div>
                <h3 className="bangers-regular text-2xl md:text-3xl text-white mb-2">RESERVA,</h3>
                <h4 className="bangers-regular text-xl md:text-2xl text-white mb-2">DESBLOQUEA Y DISFRUTA</h4>
                <p className="text-white/90 text-sm">
                  Reserva tu vehículo favorito a través de nuestra web. Recoge tu moto o patinete eléctrico
                  en nuestra tienda física y comienza tu aventura por Málaga.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardContent className="p-6 text-center">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-orange-500">3</span>
                </div>
                <h3 className="bangers-regular text-2xl md:text-3xl text-white mb-2">DEVOLVER Y</h3>
                <h4 className="bangers-regular text-xl md:text-2xl text-white mb-2">GANAR PUNTOS</h4>
                <p className="text-white/90 text-sm">
                  Una vez que llegues a tu destino y tengas el viaje terminado, devuelve tu vehículo en nuestra tienda
                  física. Gana puntos por cada alquiler completado y disfruta de descuentos exclusivos.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/alquiler">
                <Button size="lg" className="bg-blue-900 hover:bg-blue-800 text-white">
                  Ver Nuestras Motos
                </Button>
              </Link>
              <Link href="/servicios">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-orange-500 bg-transparent"
                >
                  Conocer Servicios
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" className="py-16 bg-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="bangers-regular text-4xl md:text-5xl text-white mb-8">Contacta con Nosotros</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <MapPin className="w-6 h-6 text-orange-500 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-white">Ubicación</h3>
                    <p className="text-gray-300">C. Héroe de Sostoa, 37, Carretera de Cádiz</p>
                    <p className="text-gray-300">29002 Málaga, España</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Phone className="w-6 h-6 text-orange-500 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-white">Teléfono</h3>
                    <p className="text-gray-300">607 22 88 82</p>
                    <p className="text-sm text-orange-500">También disponible por WhatsApp</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Clock className="w-6 h-6 text-orange-500 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-white">Horario</h3>
                    <p className="text-gray-300">Abre a las 10:00</p>
                    <p className="text-gray-300">(Cerrado los sábados)</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Link href="/contacto">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white">Ir a Página de Contacto</Button>
                </Link>
              </div>
            </div>

            <div>
              <h3 className="bangers-regular text-3xl md:text-4xl text-white mb-6">Nuestros Servicios</h3>
              <div className="space-y-4">
                <Link href="/alquiler" className="block">
                  <div className="bg-white/10 rounded-lg p-4 hover:bg-white/20 transition-colors cursor-pointer">
                    <h4 className="text-lg font-semibold text-white mb-2">Alquiler de Motos Eléctricas</h4>
                    <p className="text-gray-300 text-sm">Perfectas para explorar Málaga de forma sostenible</p>
                  </div>
                </Link>
                <Link href="/alquiler" className="block">
                  <div className="bg-white/10 rounded-lg p-4 hover:bg-white/20 transition-colors cursor-pointer">
                    <h4 className="text-lg font-semibold text-white mb-2">Alquiler de Patinetes Eléctricos</h4>
                    <p className="text-gray-300 text-sm">Ideales para distancias cortas y turismo urbano</p>
                  </div>
                </Link>
                <Link href="/servicios" className="block">
                  <div className="bg-white/10 rounded-lg p-4 hover:bg-white/20 transition-colors cursor-pointer">
                    <h4 className="text-lg font-semibold text-white mb-2">Venta y Reparación</h4>
                    <p className="text-gray-300 text-sm">Servicio completo para tu vehículo eléctrico</p>
                  </div>
                </Link>
              </div>

              <div className="mt-8">
                <h4 className="text-lg font-semibold text-white mb-4">Métodos de Pago</h4>
                <div className="flex flex-wrap gap-2">
                  {["Visa", "MasterCard", "American Express", "Diners Club"].map((card) => (
                    <span key={card} className="bg-orange-500 text-white px-3 py-1 rounded text-sm">
                      {card}
                    </span>
                  ))}
                </div>
              </div>
            </div>
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
              <p>Cerca de Estación María Zambrano (456m) • Calle Larios (1,68km)</p>
              <p className="mt-2">
                Web made by:{" "}
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
      </footer>
    </div>
  )
}
