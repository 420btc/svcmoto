"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, Zap, Shield, ArrowLeft, Menu, X, Calendar, CheckCircle, Home } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useTranslation } from "@/contexts/TranslationContext"
import { LanguageToggle } from "@/components/LanguageToggle"
import dynamic from "next/dynamic"

// Importar el visor 3D dinámicamente para evitar problemas de SSR
const Model3DViewer = dynamic(() => import('@/components/Model3DViewer'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
    </div>
  )
})

interface Reserva {
  id: string
  motoId: number
  motoNombre: string
  fecha: string
  horaInicio: string
  horaFin: string
  duracion: number
  precio: number
  estado: 'pendiente' | 'confirmada' | 'completada' | 'cancelada'
  kmEstimados: number
}

export default function AlquilerPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [showReservaModal, setShowReservaModal] = useState(false)
  const [selectedMoto, setSelectedMoto] = useState<any>(null)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedHora, setSelectedHora] = useState<string>('')
  const [duracion, setDuracion] = useState<number>(1)
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [show3D, setShow3D] = useState<{[key: number]: boolean}>({})
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
    
    // Cargar reservas existentes
    const savedReservas = localStorage.getItem('reservas')
    if (savedReservas) {
      setReservas(JSON.parse(savedReservas))
    }
  }, [])

  const horarios = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
    '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
  ]

  const calcularPrecio = () => {
    if (!selectedMoto) return 0
    const horas = duracion
    if (horas <= 1) return selectedMoto.precios.hora
    if (horas <= 4) return selectedMoto.precios.medio_dia
    return selectedMoto.precios.dia_completo
  }

  const calcularKmEstimados = () => {
    // Estimación: 15 km/hora promedio en ciudad
    return duracion * 15
  }

  const isHorarioDisponible = (hora: string) => {
    return !reservas.some(reserva => 
      reserva.fecha === selectedDate && 
      reserva.horaInicio === hora && 
      reserva.motoId === selectedMoto?.id &&
      reserva.estado !== 'cancelada'
    )
  }

  const abrirModalReserva = (moto: any) => {
    if (!user) {
      alert(t('rental.loginRequired'))
      return
    }
    setSelectedMoto(moto)
    setShowReservaModal(true)
  }

  const toggle3DView = (motoId: number) => {
    setShow3D(prev => ({
      ...prev,
      [motoId]: !prev[motoId]
    }))
  }

  const realizarReserva = () => {
    if (!selectedMoto || !selectedHora) {
      alert(t('rental.selectTime'))
      return
    }

    const nuevaReserva: Reserva = {
      id: Date.now().toString(),
      motoId: selectedMoto.id,
      motoNombre: selectedMoto.nombre,
      fecha: selectedDate,
      horaInicio: selectedHora,
      horaFin: `${parseInt(selectedHora.split(':')[0]) + duracion}:${selectedHora.split(':')[1]}`,
      duracion: duracion,
      precio: calcularPrecio(),
      estado: 'confirmada',
      kmEstimados: calcularKmEstimados()
    }

    const nuevasReservas = [...reservas, nuevaReserva]
    setReservas(nuevasReservas)
    localStorage.setItem('reservas', JSON.stringify(nuevasReservas))
    
    setShowReservaModal(false)
    setShowConfirmation(true)
    
    // Reset form
    setSelectedMoto(null)
    setSelectedHora('')
    setDuracion(1)
  }

  const motos = [
    {
      id: 2,
      nombre: "City Explorer",
      tipo: "Moto Eléctrica",
      imagen: "/ownis.png",
      autonomia: "110 km",
      velocidad: "95 km/h",
      capacidad: "2 personas",
      precios: {
        hora: 12,
        medio_dia: 50,
        dia_completo: 85,
        semanal: "500€",
      },
      caracteristicas: [t('features.helmetsIncluded'), t('features.premiumInsurance'), t('features.battery72V'), t('features.motor9kW'), t('features.absBrakes')],
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
        hora: 5,
        medio_dia: 20,
        dia_completo: 35,
        semanal: "200€",
      },
      caracteristicas: [t('features.helmetIncluded'), t('features.foldable'), t('features.ledLights'), t('features.discBrakes'), t('features.basicInsurance'), t('features.phoneSupport')],
    },
  ]

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
            
            {/* Tablet Navigation - Center Column */}
            <div className="hidden sm:flex lg:hidden items-center justify-center flex-1 space-x-4">
              <Link href="/alquiler" className="bangers-regular text-base text-orange-500 border-b-2 border-orange-500 transition-colors">
                {t('nav.rental')}
              </Link>
              <Link href="/servicios" className="bangers-regular text-base text-blue-900 hover:text-orange-500 transition-colors">
                {t('nav.services')}
              </Link>
              <Link href="/contacto" className="bangers-regular text-base text-blue-900 hover:text-orange-500 transition-colors">
                {t('nav.contact')}
              </Link>
              {user && (
                <Link href="/perfil" className="bangers-regular text-base text-blue-900 hover:text-orange-500 transition-colors">
                  {t('nav.profile')}
                </Link>
              )}
            </div>
            
            {/* Tablet Auth Section - Right Column */}
            <div className="hidden sm:flex lg:hidden items-center justify-end space-x-3 w-1/4">
               <LanguageToggle />
               {user ? (
                 <div className="flex items-center space-x-2">
                   <span className="text-xs text-blue-900">{user.name}</span>
                   <Button 
                     onClick={signOut}
                     variant="outline" 
                     size="sm"
                     className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white text-xs"
                   >
                     {t('nav.signOut')}
                   </Button>
                 </div>
               ) : (
                 <Button 
                   onClick={signIn}
                   size="sm"
                   className="bg-orange-500 hover:bg-orange-600 text-white text-xs"
                 >
                   {t('nav.signIn')}
                 </Button>
               )}
            </div>

            {/* Desktop Navigation - Center Column */}
            <div className="hidden lg:flex items-center justify-center flex-1 space-x-6">
              <Link href="/alquiler" className="bangers-regular text-lg xl:text-xl text-orange-500 border-b-2 border-orange-500 transition-colors">
                {t('nav.rental')}
              </Link>
              <Link href="/servicios" className="bangers-regular text-lg xl:text-xl text-blue-900 hover:text-orange-500 transition-colors">
                {t('nav.services')}
              </Link>
              <Link href="/contacto" className="bangers-regular text-lg xl:text-xl text-blue-900 hover:text-orange-500 transition-colors">
                {t('nav.contact')}
              </Link>
              {user && (
                <Link href="/perfil" className="bangers-regular text-lg xl:text-xl text-blue-900 hover:text-orange-500 transition-colors">
                  {t('nav.profile')}
                </Link>
              )}
            </div>
            
            {/* Desktop Authentication Section - Right Column */}
            <div className="hidden lg:flex items-center justify-end space-x-4 w-1/4">
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
            <div className="sm:hidden flex items-center justify-between w-full">
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
            <div className="sm:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
                <Link
                  href="/alquiler"
                  className="bangers-regular text-orange-500 block px-3 py-3 text-base transition-colors border-b border-gray-100 border-b-2 border-orange-500"
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

      {/* Header */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Link href="/" className="text-white hover:text-orange-200 mr-4">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="bangers-regular text-5xl md:text-6xl text-white drop-shadow-lg" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>{t('rental.title')}</h1>
          </div>
          <p className="text-xl text-white/90 max-w-3xl">
            {t('rental.subtitle')}
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

                  {/* Imagen de la moto o Visor 3D */}
                  <div className="w-full h-48 bg-transparent rounded-lg overflow-hidden mb-4 relative">
                    {show3D[moto.id] && moto.nombre === "City Explorer" ? (
                      <Model3DViewer modelPath="/oxwin3d.glb" />
                    ) : (
                      <Image
                        src={moto.imagen}
                        alt={moto.nombre}
                        width={400}
                        height={200}
                        className="w-full h-full object-contain"
                      />
                    )}
                    
                    {/* Botón Ver 3D solo para City Explorer */}
                    {moto.nombre === "City Explorer" && (
                      <button
                        onClick={() => toggle3DView(moto.id)}
                        className="absolute top-2 right-2 bg-orange-500 hover:bg-orange-600 text-white text-xs px-2 py-1 rounded-md transition-colors shadow-lg"
                      >
                        {show3D[moto.id] ? "Ver Foto" : "Ver 3D"}
                      </button>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  {/* Especificaciones */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-orange-500" />
                      <span className="text-sm text-gray-600">{t('rental.autonomy')} {moto.autonomia}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-orange-500" />
                      <span className="text-sm text-gray-600">{t('rental.maxSpeed')} {moto.velocidad}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-orange-500" />
                      <span className="text-sm text-gray-600">{t('rental.capacity')} {moto.capacidad}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-orange-500" />
                      <span className="text-sm text-gray-600">{t('rental.insurance')}</span>
                    </div>
                  </div>

                  {/* Precios */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-blue-900 mb-3">{t('rental.prices')}</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t('rental.hour')}</span>
                        <span className="font-semibold text-orange-600">{moto.precios.hora}€</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t('rental.halfDay')}</span>
                        <span className="font-semibold text-orange-600">{moto.precios.medio_dia}€</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t('rental.fullDay')}</span>
                        <span className="font-semibold text-orange-600">{moto.precios.dia_completo}€</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t('rental.weekly')}</span>
                        <span className="font-semibold text-orange-600">{moto.precios.semanal}</span>
                      </div>
                    </div>
                  </div>

                  {/* Características */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-blue-900 mb-3">{t('rental.includes')}</h4>
                    <div className="flex flex-wrap gap-2">
                      {moto.caracteristicas.map((caracteristica, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {caracteristica}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button 
                    onClick={() => abrirModalReserva(moto)}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    {t('rental.reserve')} {moto.nombre}
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
            <h2 className="bangers-regular text-4xl md:text-5xl text-white mb-4 drop-shadow-lg" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>{t('rental.howItWorks')}</h2>
            <p className="bangers-regular text-2xl md:text-3xl text-white/90">{t('rental.howItWorksSubtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-orange-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="bangers-regular text-2xl md:text-3xl text-white mb-2 drop-shadow-lg" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>{t('rental.step1Title')}</h3>
              <p className="text-white/90">{t('rental.step1Description')}</p>
            </div>

            <div className="text-center">
              <div className="bg-orange-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="bangers-regular text-2xl md:text-3xl text-white mb-2 drop-shadow-lg" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>{t('rental.step2Title')}</h3>
              <p className="text-white/90">{t('rental.step2Description')}</p>
            </div>

            <div className="text-center">
              <div className="bg-orange-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="bangers-regular text-2xl md:text-3xl text-white mb-2 drop-shadow-lg" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>{t('rental.step3Title')}</h3>
              <p className="text-white/90">{t('rental.step3Description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-orange-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="bangers-regular text-4xl md:text-5xl text-white mb-4 drop-shadow-lg" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>{t('rental.readyTitle')}</h2>
          <p className="text-xl text-white/90 mb-8">
            {t('rental.readySubtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-900 hover:bg-blue-800 text-white">
              {t('rental.call')}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-orange-500 bg-transparent"
            >
              {t('rental.whatsapp')}
            </Button>
          </div>
        </div>
      </section>

      {/* Modal de Reserva Rediseñado */}
       {showReservaModal && (
         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center z-50 p-2 md:p-4 md:items-center">
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] md:max-h-[90vh] overflow-y-auto mt-2 md:mt-0">
             {/* Header del Modal */}
             <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-4 py-4 md:px-8 md:py-6 sticky top-0 z-10">
               <div className="flex items-center justify-between">
                 <div className="flex items-center space-x-2 md:space-x-4">
                   <div className="bg-orange-500 p-2 md:p-3 rounded-full">
                     <Calendar className="w-6 h-6 md:w-8 md:h-8 text-white" />
                   </div>
                   <div>
                     <h2 className="bangers-regular text-xl md:text-3xl text-white">{t('rental.reserveVehicle')}</h2>
                     <p className="text-blue-200 text-sm md:text-base">{selectedMoto?.nombre} - {selectedMoto?.tipo}</p>
                   </div>
                 </div>
                 <button 
                   onClick={() => setShowReservaModal(false)}
                   className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors"
                 >
                   <X className="w-6 h-6 text-white" />
                 </button>
               </div>
             </div>

             <div className="p-4 md:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
                 
                 {/* Columna 1: Información del Vehículo */}
                 <div className="lg:col-span-1">
                   <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 md:p-6 border border-orange-200">
                     <div className="text-center mb-4 md:mb-6">
                       <div className="w-16 h-16 md:w-24 md:h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 shadow-lg">
                         <Image
                           src={selectedMoto?.imagen || '/placeholder.svg'}
                           alt={selectedMoto?.nombre || ''}
                           width={60}
                           height={60}
                           className="object-contain md:w-20 md:h-20"
                         />
                       </div>
                       <h3 className="bangers-regular text-lg md:text-2xl text-blue-900 mb-1 md:mb-2">{selectedMoto?.nombre}</h3>
                       <p className="text-orange-600 font-medium text-sm md:text-base">{selectedMoto?.tipo}</p>
                     </div>
                     
                     <div className="space-y-2 md:space-y-3">
                       <div className="flex items-center space-x-2 md:space-x-3">
                         <Zap className="w-4 h-4 md:w-5 md:h-5 text-orange-500" />
                         <span className="text-xs md:text-sm text-gray-700">Autonomía: {selectedMoto?.autonomia}</span>
                       </div>
                       <div className="flex items-center space-x-2 md:space-x-3">
                         <Shield className="w-4 h-4 md:w-5 md:h-5 text-orange-500" />
                         <span className="text-xs md:text-sm text-gray-700">Velocidad: {selectedMoto?.velocidad}</span>
                       </div>
                       <div className="flex items-center space-x-2 md:space-x-3">
                         <Users className="w-4 h-4 md:w-5 md:h-5 text-orange-500" />
                         <span className="text-xs md:text-sm text-gray-700">Capacidad: {selectedMoto?.capacidad}</span>
                       </div>
                     </div>
                   </div>
                 </div>

                 {/* Columna 2: Selección de Fecha y Duración */}
                 <div className="lg:col-span-1">
                   <div className="space-y-4 md:space-y-6">
                     {/* Fecha */}
                     <div className="bg-blue-50 rounded-xl p-4 md:p-6 border border-blue-200">
                       <div className="flex items-center space-x-2 md:space-x-3 mb-3 md:mb-4">
                         <Calendar className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                         <h4 className="bangers-regular text-lg md:text-xl text-blue-900">{t('rental.selectDate')}</h4>
                       </div>
                       <input
                         type="date"
                         value={selectedDate}
                         onChange={(e) => setSelectedDate(e.target.value)}
                         min={new Date().toISOString().split('T')[0]}
                         className="w-full p-3 md:p-4 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bangers-regular text-base md:text-lg"
                       />
                     </div>

                     {/* Duración */}
                     <div className="bg-orange-50 rounded-xl p-4 md:p-6 border border-orange-200">
                       <div className="flex items-center space-x-2 md:space-x-3 mb-3 md:mb-4">
                         <Clock className="w-5 h-5 md:w-6 md:h-6 text-orange-600" />
                         <h4 className="bangers-regular text-lg md:text-xl text-blue-900">{t('rental.duration')}</h4>
                       </div>
                       <select
                         value={duracion}
                         onChange={(e) => setDuracion(parseInt(e.target.value))}
                         className="w-full p-3 md:p-4 border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bangers-regular text-base md:text-lg bg-white"
                       >
                         <option value={1}>{t('rental.hour1')}</option>
                         <option value={2}>{t('rental.hour2')}</option>
                         <option value={3}>{t('rental.hour3')}</option>
                         <option value={4}>{t('rental.hour4')}</option>
                         <option value={8}>{t('rental.fullDay8h')}</option>
                       </select>
                     </div>
                   </div>
                 </div>

                 {/* Columna 3: Horarios */}
                 <div className="lg:col-span-1">
                   <div className="bg-gray-50 rounded-xl p-4 md:p-6 border border-gray-200">
                     <div className="flex items-center space-x-2 md:space-x-3 mb-3 md:mb-4">
                       <Clock className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                       <h4 className="bangers-regular text-lg md:text-xl text-blue-900">{t('rental.startTime')}</h4>
                     </div>
                     <div className="grid grid-cols-3 md:grid-cols-2 gap-2 md:gap-3 max-h-48 md:max-h-64 overflow-y-auto scrollbar-hide">
                       {horarios.map((hora) => {
                         const disponible = isHorarioDisponible(hora)
                         return (
                           <button
                             key={hora}
                             onClick={() => disponible && setSelectedHora(hora)}
                             disabled={!disponible}
                             className={`p-2 md:p-3 rounded-xl text-xs md:text-sm font-bold transition-all duration-200 ${
                               selectedHora === hora
                                 ? 'bg-orange-500 text-white shadow-lg'
                                 : disponible
                                 ? 'bg-white hover:bg-orange-100 text-blue-900 border-2 border-orange-200 hover:border-orange-300'
                                 : 'bg-gray-200 text-gray-400 cursor-not-allowed border-2 border-gray-300'
                             }`}
                           >
                             {hora}
                           </button>
                         )
                       })}
                     </div>
                   </div>
                 </div>
               </div>

              {/* Resumen Horizontal */}
               {selectedHora && (
                 <div className="mt-4 md:mt-8 bg-gradient-to-r from-blue-900 to-blue-800 rounded-2xl p-4 md:p-6 text-white">
                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 items-center">
                     <div>
                       <h4 className="bangers-regular text-lg md:text-2xl mb-3 md:mb-4 text-orange-300">{t('rental.summary')}</h4>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                         <div className="space-y-2">
                           <div className="flex items-center space-x-2">
                             <Zap className="w-4 h-4 text-orange-300" />
                             <span className="text-xs md:text-sm text-blue-200">{t('rental.vehicle')}</span>
                           </div>
                           <p className="font-bold text-sm md:text-base">{selectedMoto?.nombre}</p>
                           
                           <div className="flex items-center space-x-2 mt-2 md:mt-3">
                             <Calendar className="w-4 h-4 text-orange-300" />
                             <span className="text-xs md:text-sm text-blue-200">{t('rental.date')}</span>
                           </div>
                           <p className="font-bold text-xs md:text-base">{new Date(selectedDate).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' })}</p>
                         </div>
                         
                         <div className="space-y-2">
                           <div className="flex items-center space-x-2">
                             <Clock className="w-4 h-4 text-orange-300" />
                             <span className="text-xs md:text-sm text-blue-200">{t('rental.schedule')}</span>
                           </div>
                           <p className="font-bold text-sm md:text-base">{selectedHora} - {parseInt(selectedHora.split(':')[0]) + duracion}:{selectedHora.split(':')[1]}</p>
                           
                           <div className="flex items-center space-x-2 mt-2 md:mt-3">
                             <Shield className="w-4 h-4 text-orange-300" />
                             <span className="text-xs md:text-sm text-blue-200">{t('rental.duration')}</span>
                           </div>
                           <p className="font-bold text-sm md:text-base">{duracion} hora{duracion > 1 ? 's' : ''}</p>
                         </div>
                       </div>
                       
                       <div className="mt-3 md:mt-4 p-2 md:p-3 bg-white/10 rounded-lg">
                         <div className="flex items-center justify-between">
                           <span className="text-blue-200 text-xs md:text-sm">{t('rental.estimatedKm')}</span>
                           <span className="font-bold text-orange-300 text-sm md:text-base">{calcularKmEstimados()} km</span>
                         </div>
                       </div>
                     </div>
                     
                     <div className="text-center lg:text-right">
                       <div className="bg-white/10 rounded-2xl p-4 md:p-6 mb-3 md:mb-4">
                         <p className="text-blue-200 text-xs md:text-sm mb-1 md:mb-2">{t('rental.totalPrice')}</p>
                         <p className="bangers-regular text-2xl md:text-4xl text-orange-300">{calcularPrecio()}€</p>
                         <p className="text-xs text-blue-300 mt-1">{t('rental.vatIncluded')}</p>
                       </div>
                       
                       <Button 
                         onClick={realizarReserva}
                         className="w-full bg-orange-500 hover:bg-orange-600 text-white bangers-regular text-lg md:text-xl py-3 md:py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                       >
                         {t('rental.confirmReservation')}
                       </Button>
                       
                       <p className="text-xs text-blue-300 mt-2">{t('rental.instantConfirmation')}</p>
                     </div>
                   </div>
                 </div>
               )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmación */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-96 mx-4">
            <CardHeader className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <CardTitle className="text-2xl text-green-600">{t('rental.reservationConfirmed')}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="mb-4">{t('rental.reservationSuccess')}</p>
              <Button 
                onClick={() => setShowConfirmation(false)}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                {t('rental.continue')}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

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
