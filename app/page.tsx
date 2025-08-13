"use client"


import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Phone, MapPin, Clock, Star, Zap, Shield, Wrench, Menu, X, ArrowLeft, Home as HomeIcon } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useTranslation } from "@/contexts/TranslationContext"
import { LanguageToggle } from "@/components/LanguageToggle"

export default function Home() {
  const [showIntro, setShowIntro] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showConnectedModal, setShowConnectedModal] = useState(false)
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
    
    // Verificar si el usuario acaba de conectarse
    const justConnected = localStorage.getItem('justConnected')
    if (justConnected === 'true') {
      setShowConnectedModal(true)
      localStorage.removeItem('justConnected')
      
      // Ocultar el modal después de 3 segundos
      setTimeout(() => {
        setShowConnectedModal(false)
      }, 3000)
    }
    
    // Simular carga inicial para evitar flash
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 100)
    
    return () => clearTimeout(timer)
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

  // Pantalla de carga inicial
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black z-50">
      </div>
    )
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
            className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded text-sm hover:bg-black/70 transition-colors"
          >
            {t('intro.skip')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-200">
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
              <Link href="/contacto" className="bangers-regular text-lg md:text-xl text-blue-900 hover:text-orange-500 transition-colors">
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
                  <HomeIcon className="w-6 h-6" />
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
                  {t('nav.rental')}
                </Link>
                <Link
                  href="/servicios"
                  className="bangers-regular text-blue-900 hover:text-orange-500 block px-3 py-3 text-base transition-colors border-b border-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.services')}
                </Link>
                <Link
                  href="/contacto"
                  className="bangers-regular text-blue-900 hover:text-orange-500 block px-3 py-3 text-base transition-colors border-b border-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.contact')}
                </Link>
                {user && (
                  <Link
                    href="/perfil"
                    className="bangers-regular text-blue-900 hover:text-orange-500 block px-3 py-3 text-base transition-colors border-b border-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav.profile')}
                  </Link>
                )}
                <div className="px-3 py-3">
                  {user ? (
                    <div className="space-y-2">
                      <p className="bangers-regular text-sm text-blue-900 text-center">{t('nav.hello')} {user.name}</p>
                      <Button
                        onClick={() => {
                          signOut()
                          setMobileMenuOpen(false)
                        }}
                        variant="outline"
                        className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white w-full"
                      >
                        {t('nav.signOut')}
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
                      {t('nav.signIn')}
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
            {t('hero.title').split('\n').map((line, index) => (
              <span key={index}>
                {line}
                {index < t('hero.title').split('\n').length - 1 && <br />}
              </span>
            ))}
            <br />
            <span className="block text-center text-blue-900 mt-2 text-7xl md:text-8xl font-bold" style={{textShadow: '2px 2px 0 white, -2px -2px 0 white, 2px -2px 0 white, -2px 2px 0 white, 0 2px 0 white, 0 -2px 0 white, 2px 0 0 white, -2px 0 0 white'}}>SVC MOTO</span>
          </h1>
          <p className="bangers-regular text-2xl md:text-3xl text-white/90 mb-8 max-w-3xl mx-auto">
             {t('hero.subtitle')}
           </p>
          <Link href="/alquiler">
              <Button size="lg" className="bangers-regular bg-orange-500 hover:bg-orange-600 text-white text-2xl md:text-3xl px-10 py-5">
                {t('hero.cta')}
              </Button>
            </Link>
        </div>
        
        {/* Schema.org JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "SVC MOTO",
              "description": "Alquiler de motos y patinetes eléctricos en Málaga. Servicios de reparación y mantenimiento especializado.",
              "url": "https://svcmoto.com",
              "telephone": "+34607228882",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "C. Héroe de Sostoa, 37, Carretera de Cádiz",
                "addressLocality": "Málaga",
                "addressRegion": "Andalucía",
                "postalCode": "29002",
                "addressCountry": "ES"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "36.7213",
                "longitude": "-4.4214"
              },
              "openingHours": "Mo-Fr 10:00-20:00",
              "priceRange": "€€",
              "serviceArea": {
                "@type": "City",
                "name": "Málaga"
              },
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Servicios de Alquiler y Reparación",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Alquiler de Motos Eléctricas",
                      "description": "Alquiler por horas, días o semanas de motos eléctricas en Málaga"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Servicios de Reparación",
                      "description": "Reparación y mantenimiento de vehículos eléctricos"
                    }
                  }
                ]
              },
              "sameAs": [
                "https://svcmoto.vercel.app"
              ]
            })
          }}
        />
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center justify-center h-32">
              <div className="flex items-center justify-center mb-2 h-12">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-orange-500 text-orange-500" />
                ))}
              </div>
              <div className="bangers-regular text-xl md:text-2xl text-blue-900">5,0</div>
              <div className="text-sm text-gray-600">{t('stats.reviews')}</div>
            </div>
            <div className="flex flex-col items-center justify-center h-32">
              <Shield className="w-12 h-12 text-orange-500 mb-2" />
              <div className="bangers-regular text-xl md:text-2xl text-blue-900">{t('stats.insurance')}</div>
              <div className="text-sm text-gray-600">{t('stats.included')}</div>
            </div>
            <div className="flex flex-col items-center justify-center h-32">
              <Zap className="w-12 h-12 text-orange-500 mb-2" />
              <div className="bangers-regular text-xl md:text-2xl text-blue-900">{t('stats.electric')}</div>
              <div className="text-sm text-gray-600">{t('stats.electricLabel')}</div>
            </div>
            <div className="flex flex-col items-center justify-center h-32">
              <Wrench className="w-12 h-12 text-orange-500 mb-2" />
              <div className="bangers-regular text-xl md:text-2xl text-blue-900">{t('stats.service')}</div>
              <div className="text-sm text-gray-600">{t('stats.complete')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicios" className="py-16 bg-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="bangers-regular text-4xl md:text-5xl text-white mb-4">{t('servicesSection.title')}</h2>
            <p className="bangers-regular text-2xl md:text-3xl text-white">
              {t('servicesSection.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white/20 border-white/30 h-80">
              <CardContent className="p-6 text-center h-full flex flex-col justify-center">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-orange-500">1</span>
                </div>
                <h3 className="bangers-regular text-2xl md:text-3xl text-white mb-2">{t('services.step1.title')}</h3>
                <h4 className="bangers-regular text-xl md:text-2xl text-white mb-2">{t('services.step1.subtitle')}</h4>
                <p className="text-white/90 text-sm">
                  {t('services.step1.description')}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/20 border-white/30 h-80">
              <CardContent className="p-6 text-center h-full flex flex-col justify-center">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-orange-500">2</span>
                </div>
                <h3 className="bangers-regular text-2xl md:text-3xl text-white mb-2">{t('services.step2.title')}</h3>
                <h4 className="bangers-regular text-xl md:text-2xl text-white mb-2">{t('services.step2.subtitle')}</h4>
                <p className="text-white/90 text-sm">
                  {t('services.step2.description')}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/20 border-white/30 h-80">
              <CardContent className="p-6 text-center h-full flex flex-col justify-center">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-orange-500">3</span>
                </div>
                <h3 className="bangers-regular text-2xl md:text-3xl text-white mb-2">{t('services.step3.title')}</h3>
                <h4 className="bangers-regular text-xl md:text-2xl text-white mb-2">{t('services.step3.subtitle')}</h4>
                <p className="text-white/90 text-sm">
                  {t('services.step3.description')}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/alquiler">
                <Button size="lg" className="bg-blue-900 hover:bg-blue-800 text-white">
                  {t('services.cta1')}
                </Button>
              </Link>
              <Link href="/servicios">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-orange-500 bg-transparent"
                >
                  {t('services.cta2')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" className="relative pt-16 pb-0 md:pb-16 bg-blue-900">
        {/* Video de fondo solo para PC */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-contain hidden md:block"
        >
          <source src="/Video2.mp4" type="video/mp4" />
        </video>
        
        {/* Overlay para legibilidad en PC */}
        <div className="absolute inset-0 bg-black/10 hidden md:block"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="bangers-regular text-4xl md:text-5xl text-white mb-8 drop-shadow-lg" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>{t('contact.title')}</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4 md:bg-white/30 md:rounded-lg md:p-4 md:backdrop-blur-md md:border md:border-white/20 md:h-24">
                  <MapPin className="w-6 h-6 text-orange-500 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-white md:drop-shadow-md">{t('contact.location')}</h3>
                    <p className="text-gray-300 md:text-white md:text-sm md:drop-shadow-sm">{t('contact.address1')}</p>
                    <p className="text-gray-300 md:text-white md:text-sm md:drop-shadow-sm">{t('contact.address2')}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 md:bg-white/30 md:rounded-lg md:p-4 md:backdrop-blur-md md:border md:border-white/20 md:h-24">
                  <Phone className="w-6 h-6 text-orange-500 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-white md:drop-shadow-md">{t('contact.phone')}</h3>
                    <p className="text-gray-300 md:text-white md:text-sm md:drop-shadow-sm">{t('contact.phoneNumber')}</p>
                    <p className="text-sm text-orange-500 md:text-orange-300 md:drop-shadow-sm">{t('contact.whatsapp')}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 md:bg-white/30 md:rounded-lg md:p-4 md:backdrop-blur-md md:border md:border-white/20 md:h-24">
                  <Clock className="w-6 h-6 text-orange-500 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-white md:drop-shadow-md">{t('contact.schedule')}</h3>
                    <p className="text-gray-300 md:text-white md:text-sm md:drop-shadow-sm">{t('contact.opens')}</p>
                    <p className="text-gray-300 md:text-white md:text-sm md:drop-shadow-sm">{t('contact.closed')}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Link href="/contacto">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white md:shadow-lg md:border md:border-orange-400">{t('contact.cta')}</Button>
                </Link>
              </div>
            </div>

            <div className="hidden md:block">
              <h3 className="bangers-regular text-4xl md:text-5xl text-white mb-8 drop-shadow-lg" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>{t('contact.servicesTitle')}</h3>
              <div className="space-y-6">
                <Link href="/alquiler" className="block">
                  <div className="flex items-start space-x-4 bg-white/30 rounded-lg p-4 hover:bg-white/40 transition-colors cursor-pointer backdrop-blur-md border border-white/20 h-24">
                    <Zap className="w-6 h-6 text-orange-500 mt-1" />
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2 drop-shadow-md" style={{textShadow: '1px 1px 3px rgba(0,0,0,0.7)'}}>{t('contact.service1.title')}</h4>
                      <p className="text-white text-sm drop-shadow-sm" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.6)'}}>{t('contact.service1.description')}</p>
                    </div>
                  </div>
                </Link>
                <Link href="/alquiler" className="block">
                  <div className="flex items-start space-x-4 bg-white/30 rounded-lg p-4 hover:bg-white/40 transition-colors cursor-pointer backdrop-blur-md border border-white/20 h-24">
                    <Zap className="w-6 h-6 text-orange-500 mt-1" />
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2 drop-shadow-md" style={{textShadow: '1px 1px 3px rgba(0,0,0,0.7)'}}>{t('contact.service2.title')}</h4>
                      <p className="text-white text-sm drop-shadow-sm" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.6)'}}>{t('contact.service2.description')}</p>
                    </div>
                  </div>
                </Link>
                <Link href="/servicios" className="block">
                  <div className="flex items-start space-x-4 bg-white/30 rounded-lg p-4 hover:bg-white/40 transition-colors cursor-pointer backdrop-blur-md border border-white/20 h-24">
                    <Wrench className="w-6 h-6 text-orange-500 mt-1" />
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2 drop-shadow-md" style={{textShadow: '1px 1px 3px rgba(0,0,0,0.7)'}}>{t('contact.service3.title')}</h4>
                      <p className="text-white text-sm drop-shadow-sm" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.6)'}}>{t('contact.service3.description')}</p>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="mt-8">
                <h4 className="text-lg font-semibold text-white mb-4 drop-shadow-lg" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>{t('contact.paymentMethods')}</h4>
                <div className="flex flex-wrap gap-3">
                  {/* Visa */}
                   <div className="bg-white rounded-lg p-2 shadow-lg border border-gray-200 w-16 h-10 flex items-center justify-center">
                     <svg viewBox="0 0 48 32" className="w-12 h-8">
                       <rect width="48" height="32" fill="#1A1F71"/>
                       <text x="24" y="20" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" fontFamily="Arial, sans-serif" fontStyle="italic">VISA</text>
                     </svg>
                   </div>
                  
                  {/* MasterCard */}
                  <div className="bg-white rounded-lg p-2 shadow-lg border border-gray-200 w-16 h-10 flex items-center justify-center">
                    <svg viewBox="0 0 48 32" className="w-12 h-8">
                      <rect width="48" height="32" fill="white"/>
                      <circle cx="18" cy="16" r="10" fill="#EB001B"/>
                      <circle cx="30" cy="16" r="10" fill="#F79E1B"/>
                      <path d="M24 8c-2.2 1.7-3.6 4.4-3.6 7.5s1.4 5.8 3.6 7.5c2.2-1.7 3.6-4.4 3.6-7.5S26.2 9.7 24 8z" fill="#FF5F00"/>
                    </svg>
                  </div>
                  
                  {/* American Express */}
                   <div className="bg-white rounded-lg p-2 shadow-lg border border-gray-200 w-16 h-10 flex items-center justify-center">
                     <svg viewBox="0 0 48 32" className="w-12 h-8">
                       <rect width="48" height="32" fill="#006FCF"/>
                       <text x="24" y="20" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" fontFamily="Arial, sans-serif" fontStyle="italic">AMEX</text>
                     </svg>
                   </div>
                  
                  {/* Diners Club */}
                  <div className="bg-white rounded-lg p-2 shadow-lg border border-gray-200 w-16 h-10 flex items-center justify-center">
                    <svg viewBox="0 0 48 32" className="w-12 h-8">
                      <rect width="48" height="32" fill="white"/>
                      <circle cx="16" cy="16" r="12" fill="none" stroke="#0079BE" strokeWidth="2"/>
                      <circle cx="32" cy="16" r="12" fill="none" stroke="#0079BE" strokeWidth="2"/>
                      <text x="24" y="20" textAnchor="middle" fill="#0079BE" fontSize="8" fontWeight="bold">DC</text>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* En móvil: contenido normal sin video de fondo */}
            <div className="block md:hidden">
              <h3 className="bangers-regular text-4xl text-white mb-8 drop-shadow-lg" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>{t('contact.servicesTitle')}</h3>
              <div className="space-y-4">
                <Link href="/alquiler" className="block">
                  <div className="bg-white/10 rounded-lg p-4 hover:bg-white/20 transition-colors cursor-pointer">
                    <h4 className="text-lg font-semibold text-white mb-2">{t('contact.service1.title')}</h4>
                    <p className="text-gray-300 text-sm">{t('contact.service1.description')}</p>
                  </div>
                </Link>
                <Link href="/alquiler" className="block">
                  <div className="bg-white/10 rounded-lg p-4 hover:bg-white/20 transition-colors cursor-pointer">
                    <h4 className="text-lg font-semibold text-white mb-2">{t('contact.service2.title')}</h4>
                    <p className="text-gray-300 text-sm">{t('contact.service2.description')}</p>
                  </div>
                </Link>
                <Link href="/servicios" className="block">
                  <div className="bg-white/10 rounded-lg p-4 hover:bg-white/20 transition-colors cursor-pointer">
                    <h4 className="text-lg font-semibold text-white mb-2">{t('contact.service3.title')}</h4>
                    <p className="text-gray-300 text-sm">{t('contact.service3.description')}</p>
                  </div>
                </Link>
              </div>

              <div className="mt-8">
                <h4 className="text-lg font-semibold text-white mb-4">{t('contact.paymentMethods')}</h4>
                <div className="flex flex-wrap gap-3">
                  {/* Visa */}
                   <div className="bg-white rounded-lg p-2 shadow-lg border border-gray-200 w-16 h-10 flex items-center justify-center">
                     <svg viewBox="0 0 48 32" className="w-12 h-8">
                       <rect width="48" height="32" fill="#1A1F71"/>
                       <text x="24" y="20" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" fontFamily="Arial, sans-serif" fontStyle="italic">VISA</text>
                     </svg>
                   </div>
                  
                  {/* MasterCard */}
                  <div className="bg-white rounded-lg p-2 shadow-lg border border-gray-200 w-16 h-10 flex items-center justify-center">
                    <svg viewBox="0 0 48 32" className="w-12 h-8">
                      <rect width="48" height="32" fill="white"/>
                      <circle cx="18" cy="16" r="10" fill="#EB001B"/>
                      <circle cx="30" cy="16" r="10" fill="#F79E1B"/>
                      <path d="M24 8c-2.2 1.7-3.6 4.4-3.6 7.5s1.4 5.8 3.6 7.5c2.2-1.7 3.6-4.4 3.6-7.5S26.2 9.7 24 8z" fill="#FF5F00"/>
                    </svg>
                  </div>
                  
                  {/* American Express */}
                   <div className="bg-white rounded-lg p-2 shadow-lg border border-gray-200 w-16 h-10 flex items-center justify-center">
                     <svg viewBox="0 0 48 32" className="w-12 h-8">
                       <rect width="48" height="32" fill="#006FCF"/>
                       <text x="24" y="20" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" fontFamily="Arial, sans-serif" fontStyle="italic">AMEX</text>
                     </svg>
                   </div>
                  
                  {/* Diners Club */}
                  <div className="bg-white rounded-lg p-2 shadow-lg border border-gray-200 w-16 h-10 flex items-center justify-center">
                    <svg viewBox="0 0 48 32" className="w-12 h-8">
                      <rect width="48" height="32" fill="white"/>
                      <circle cx="16" cy="16" r="12" fill="none" stroke="#0079BE" strokeWidth="2"/>
                      <circle cx="32" cy="16" r="12" fill="none" stroke="#0079BE" strokeWidth="2"/>
                      <text x="24" y="20" textAnchor="middle" fill="#0079BE" fontSize="8" fontWeight="bold">DC</text>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Video solo en móvil, debajo de métodos de pago */}
              <div className="-mx-4 -ml-6 mt-8 -mb-4">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-64 object-contain block"
                >
                  <source src="/Video2.mp4" type="video/mp4" />
                  Tu navegador no soporta videos HTML5.
                </video>
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

      {/* Modal de Conexión Exitosa */}
      {showConnectedModal && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
          <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3">
            <div className="bg-white rounded-full p-1">
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="bangers-regular text-lg">¡Conectado!</span>
          </div>
        </div>
      )}
    </div>
  )
}
