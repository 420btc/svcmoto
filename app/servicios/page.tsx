"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wrench, Battery, Shield, Clock, CheckCircle, ArrowLeft, Zap, Settings, Truck, Menu, X, Calendar, User, Phone, MapPin, Home } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useTranslation } from "@/contexts/TranslationContext"
import { LanguageToggle } from "@/components/LanguageToggle"

interface SolicitudServicio {
  id: string
  servicioId: number
  servicioNombre: string
  fecha: string
  hora: string
  nombre: string
  telefono: string
  direccion: string
  descripcionProblema: string
  urgente: boolean
  estado: 'pendiente' | 'confirmada' | 'en_proceso' | 'completada' | 'cancelada'
}

export default function ServiciosPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [showServicioModal, setShowServicioModal] = useState(false)
  const [selectedServicio, setSelectedServicio] = useState<any>(null)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedHora, setSelectedHora] = useState<string>('')
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    direccion: '',
    descripcionProblema: ''
  })
  const [solicitudes, setSolicitudes] = useState<SolicitudServicio[]>([])
  const [showConfirmation, setShowConfirmation] = useState(false)
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
      const userData = JSON.parse(savedUser)
      setFormData(prev => ({
        ...prev,
        nombre: userData.name || '',
        telefono: userData.phone || ''
      }))
    }
    
    // Cargar solicitudes existentes
    const savedSolicitudes = localStorage.getItem('solicitudesServicio')
    if (savedSolicitudes) {
      setSolicitudes(JSON.parse(savedSolicitudes))
    }
  }, [])

  const horarios = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
    '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
  ]

  const abrirModalServicio = (servicio: any) => {
    if (!user) {
      alert(t('services.loginRequired'))
      return
    }
    setSelectedServicio(servicio)
    setShowServicioModal(true)
  }

  const realizarSolicitud = () => {
    if (!selectedServicio || !selectedHora || !formData.nombre || !formData.telefono) {
      alert(t('services.completeFields'))
      return
    }

    const nuevaSolicitud: SolicitudServicio = {
      id: Date.now().toString(),
      servicioId: selectedServicio.id,
      servicioNombre: selectedServicio.nombre,
      fecha: selectedDate,
      hora: selectedHora,
      nombre: formData.nombre,
      telefono: formData.telefono,
      direccion: formData.direccion,
      descripcionProblema: formData.descripcionProblema,
      urgente: selectedServicio.urgente,
      estado: 'pendiente'
    }

    const nuevasSolicitudes = [...solicitudes, nuevaSolicitud]
    setSolicitudes(nuevasSolicitudes)
    localStorage.setItem('solicitudesServicio', JSON.stringify(nuevasSolicitudes))
    
    setShowServicioModal(false)
    setShowConfirmation(true)
    
    // Reset form
    setSelectedServicio(null)
    setSelectedHora('')
    setFormData({
      nombre: user?.name || '',
      telefono: user?.phone || '',
      direccion: '',
      descripcionProblema: ''
    })
  }

  const servicios = [
    {
      id: 1,
      nombre: t('serviceItem.batteryChange.name'),
      descripcion: t('serviceItem.batteryChange.description'),
      icono: Battery,
      precio: t('serviceItem.batteryChange.price'),
      tiempo: t('serviceItem.batteryChange.time'),
      incluye: [
        t('serviceItem.batteryChange.include1'),
        t('serviceItem.batteryChange.include2'),
        t('serviceItem.batteryChange.include3'),
        t('serviceItem.batteryChange.include4'),
        t('serviceItem.batteryChange.include5'),
      ],
      urgente: false,
    },
    {
      id: 2,
      nombre: t('serviceItem.pickupDelivery.name'),
      descripcion: t('serviceItem.pickupDelivery.description'),
      icono: Truck,
      precio: t('serviceItem.pickupDelivery.price'),
      tiempo: t('serviceItem.pickupDelivery.time'),
      incluye: [
        t('serviceItem.pickupDelivery.include1'),
        t('serviceItem.pickupDelivery.include2'),
        t('serviceItem.pickupDelivery.include3'),
        t('serviceItem.pickupDelivery.include4'),
        t('serviceItem.pickupDelivery.include5'),
      ],
      urgente: false,
    },
    {
      id: 3,
      nombre: t('serviceItem.expressService.name'),
      descripcion: t('serviceItem.expressService.description'),
      icono: Zap,
      precio: t('serviceItem.expressService.price'),
      tiempo: t('serviceItem.expressService.time'),
      incluye: [
        t('serviceItem.expressService.include1'),
        t('serviceItem.expressService.include2'),
        t('serviceItem.expressService.include3'),
        t('serviceItem.expressService.include4'),
        t('serviceItem.expressService.include5'),
      ],
      urgente: true,
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
              <Link href="/alquiler" className="bangers-regular text-base text-blue-900 hover:text-orange-500 transition-colors">
                {t('nav.rental')}
              </Link>
              <Link href="/servicios" className="bangers-regular text-base text-orange-500 border-b-2 border-orange-500 transition-colors">
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
              <Link href="/alquiler" className="bangers-regular text-lg xl:text-xl text-blue-900 hover:text-orange-500 transition-colors">
                {t('nav.rental')}
              </Link>
              <Link href="/servicios" className="bangers-regular text-lg xl:text-xl text-orange-500 border-b-2 border-orange-500 transition-colors">
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
                  className="bangers-regular text-blue-900 hover:text-orange-500 block px-3 py-3 text-base transition-colors border-b border-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.rental')}
                </Link>
                <Link
                  href="/servicios"
                  className="bangers-regular text-orange-500 block px-3 py-3 text-base transition-colors border-b border-gray-100 border-b-2 border-orange-500"
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
      <section className="bg-gradient-to-r from-blue-900 to-blue-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center mb-6">
                <Link href="/" className="text-white hover:text-blue-200 mr-4">
                  <ArrowLeft className="w-6 h-6" />
                </Link>
                <h1 className="bangers-regular text-5xl md:text-6xl text-white drop-shadow-lg" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>{t('services.title')}</h1>
              </div>
              <p className="text-xl text-white/90 max-w-3xl">
                {t('services.subtitle')}
              </p>
            </div>
            <div className="hidden lg:flex justify-center">
               <Image 
                 src="/carga.png" 
                 alt="Carga eléctrica" 
                 width={240} 
                 height={240} 
                 className="object-contain"
               />
             </div>
          </div>
        </div>
      </section>

      {/* Servicios Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicios.map((servicio) => {
              const IconComponent = servicio.icono
              return (
                <Card
                  key={servicio.id}
                  className="border-2 border-gray-200 hover:border-orange-500 transition-colors relative"
                >
                  {servicio.urgente && (
                    <Badge className="absolute -top-2 -right-2 bg-orange-500 text-white">{t('services.expressService')}</Badge>
                  )}

                  <CardHeader>
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="bg-orange-100 p-3 rounded-lg">
                        <IconComponent className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <CardTitle className="bangers-regular text-2xl sm:text-3xl text-blue-900">{servicio.nombre}</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">{servicio.descripcion}</p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    {/* Precio y Tiempo */}
                    <div className="flex justify-between items-center mb-6 p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-600">{t('services.price')}</p>
                        <p className="text-lg font-bold text-orange-600">{servicio.precio}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">{t('services.time')}</p>
                        <p className="text-sm font-semibold text-blue-900 flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {servicio.tiempo}
                        </p>
                      </div>
                    </div>

                    {/* Incluye */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-blue-900 mb-3">{t('services.includes')}</h4>
                      <ul className="space-y-2">
                        {servicio.incluye.map((item, index) => (
                          <li key={index} className="flex items-start space-x-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button 
                      onClick={() => abrirModalServicio(servicio)}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                    >
                      {t('services.request')} {servicio.nombre}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Proceso Section */}
      <section className="py-16 bg-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="bangers-regular text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>{t('services.howItWorks')}</h2>
            <p className="text-xl text-white/90">{t('services.howItWorksSubtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-500">1</span>
              </div>
              <h3 className="bangers-regular text-lg font-bold text-white mb-2 drop-shadow-lg" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>{t('services.step1Title')}</h3>
              <p className="text-white/90 text-sm">{t('services.step1Description')}</p>
            </div>

            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-500">2</span>
              </div>
              <h3 className="bangers-regular text-lg font-bold text-white mb-2 drop-shadow-lg" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>{t('services.step2Title')}</h3>
              <p className="text-white/90 text-sm">{t('services.step2Description')}</p>
            </div>

            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-500">3</span>
              </div>
              <h3 className="bangers-regular text-lg font-bold text-white mb-2 drop-shadow-lg" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>{t('services.step3Title')}</h3>
              <p className="text-white/90 text-sm">{t('services.step3Description')}</p>
            </div>

            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-500">4</span>
              </div>
              <h3 className="bangers-regular text-lg font-bold text-white mb-2 drop-shadow-lg" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>{t('services.step4Title')}</h3>
              <p className="text-white/90 text-sm">{t('services.step4Description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Garantías Section */}
      <section className="py-16 bg-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="bangers-regular text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>{t('services.guaranteesTitle')}</h2>
            <p className="text-xl text-white/90">{t('services.guaranteesSubtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardContent className="p-6 text-center">
                <Shield className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                <h3 className="bangers-regular text-xl font-bold text-white mb-2 drop-shadow-lg" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>{t('services.qualityGuarantee')}</h3>
                <p className="text-white/90 text-sm">
                  {t('services.qualityDescription')}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardContent className="p-6 text-center">
                <CheckCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                <h3 className="bangers-regular text-xl font-bold text-white mb-2 drop-shadow-lg" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>{t('services.originalParts')}</h3>
                <p className="text-white/90 text-sm">
                  {t('services.originalPartsDescription')}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardContent className="p-6 text-center">
                <Clock className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                <h3 className="bangers-regular text-xl font-bold text-white mb-2 drop-shadow-lg" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>{t('services.fastService')}</h3>
                <p className="text-white/90 text-sm">
                  {t('services.fastServiceDescription')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="bangers-regular text-3xl font-bold text-blue-900 mb-4">{t('services.needHelp')}</h2>
          <p className="text-xl text-gray-600 mb-8">
            {t('services.needHelpSubtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
              {t('services.call')}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white bg-transparent"
            >
              {t('services.requestQuote')}
            </Button>
          </div>
        </div>
      </section>

      {/* Modal de Solicitud de Servicio */}
      {showServicioModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center z-50 p-2 md:p-4 md:items-center">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[95vh] md:max-h-[90vh] overflow-y-auto mt-2 md:mt-0">
            {/* Header del Modal */}
            <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-4 py-4 md:px-8 md:py-6 sticky top-0 z-10">
               <div className="flex items-center justify-between">
                 <div className="flex items-center space-x-2 md:space-x-4">
                   <div className="bg-orange-500 p-2 md:p-3 rounded-full">
                     {selectedServicio && <selectedServicio.icono className="w-6 h-6 md:w-8 md:h-8 text-white" />}
                   </div>
                   <div>
                     <h2 className="bangers-regular text-xl md:text-3xl text-white">{t('serviceModal.requestService')}</h2>
                     <p className="text-blue-200 text-sm md:text-base">{selectedServicio?.nombre}</p>
                   </div>
                 </div>
                 <div className="flex items-center space-x-3">
                   {selectedServicio?.urgente && (
                     <div className="bg-gradient-to-r from-red-500 to-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                       {t('serviceModal.urgent')}
                     </div>
                   )}
                   <button 
                     onClick={() => setShowServicioModal(false)}
                     className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors"
                   >
                     <X className="w-6 h-6 text-white" />
                   </button>
                 </div>
               </div>
            </div>

            <div className="p-4 md:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
                
                {/* Columna 1: Información del Servicio */}
                 <div className="lg:col-span-1">
                   <div className="space-y-4 md:space-y-6">
                     <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 md:p-6 border border-orange-200">
                       <div className="text-center mb-4 md:mb-6">
                         <div className="w-16 h-16 md:w-24 md:h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 shadow-lg">
                           {selectedServicio && <selectedServicio.icono className="w-8 h-8 md:w-12 md:h-12 text-orange-500" />}
                         </div>
                         <h3 className="bangers-regular text-2xl md:text-3xl text-blue-900 mb-1 md:mb-2">{selectedServicio?.nombre}</h3>
                         <p className="text-orange-600 font-medium text-sm md:text-base">{selectedServicio?.descripcion}</p>
                       </div>
                       
                       <div className="space-y-2 md:space-y-3">
                         <div className="flex items-center justify-between p-2 md:p-3 bg-white rounded-lg">
                           <span className="text-xs md:text-sm text-gray-600">{t('serviceModal.price')}</span>
                           <span className="font-bold text-orange-600">{selectedServicio?.precio}</span>
                         </div>
                         <div className="flex items-center justify-between p-2 md:p-3 bg-white rounded-lg">
                           <span className="text-xs md:text-sm text-gray-600">{t('serviceModal.time')}</span>
                           <span className="font-bold text-blue-900 flex items-center">
                             <Clock className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                             {selectedServicio?.tiempo}
                           </span>
                         </div>

                       </div>
                     </div>

                     {/* Incluye - Solo visible en desktop */}
                     <div className="hidden lg:block bg-blue-50 rounded-xl p-2 md:p-6 border border-blue-200">
                       <div className="flex items-center space-x-2 md:space-x-3 mb-3 md:mb-4">
                         <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                         <h4 className="bangers-regular text-lg md:text-xl text-blue-900">{t('serviceModal.whatIncludes')}</h4>
                       </div>
                       <ul className="space-y-1">
                         {selectedServicio?.incluye?.map((item: string, index: number) => (
                           <li key={index} className="flex items-start space-x-2 text-sm">
                             <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                             <span className="text-gray-700">{item}</span>
                           </li>
                         ))}
                       </ul>
                     </div>
                   </div>
                 </div>

                {/* Columna 2: Datos Personales y Fecha */}
                 <div className="lg:col-span-1">
                   <div className="space-y-4 md:space-y-6">
                     {/* Datos del Cliente */}
                     <div className="bg-blue-50 rounded-xl p-4 md:p-6 border border-blue-200">
                       <div className="flex items-center space-x-2 md:space-x-3 mb-3 md:mb-4">
                         <User className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                         <h4 className="bangers-regular text-lg md:text-xl text-blue-900">{t('serviceModal.personalData')}</h4>
                       </div>
                       <div className="space-y-3 md:space-y-4">
                         <div>
                           <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">{t('serviceModal.fullName')}</label>
                           <input
                             type="text"
                             value={formData.nombre}
                             onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                             className="w-full p-2 md:p-3 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
                             placeholder={t('serviceModal.fullNamePlaceholder')}
                           />
                         </div>
                         <div>
                           <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">{t('serviceModal.phone')}</label>
                           <input
                             type="tel"
                             value={formData.telefono}
                             onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                             className="w-full p-2 md:p-3 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
                             placeholder={t('serviceModal.phonePlaceholder')}
                           />
                         </div>
                         <div>
                           <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">{t('serviceModal.address')}</label>
                           <input
                             type="text"
                             value={formData.direccion}
                             onChange={(e) => setFormData({...formData, direccion: e.target.value})}
                             className="w-full p-2 md:p-3 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
                             placeholder={t('serviceModal.addressPlaceholder')}
                           />
                         </div>
                       </div>
                     </div>

                     {/* Fecha */}
                         <div className="bg-gray-50 rounded-xl p-4 md:p-6 border border-gray-200 flex-1">
                           <div className="flex items-center space-x-2 md:space-x-3 mb-3 md:mb-4">
                             <Calendar className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                             <h4 className="bangers-regular text-lg md:text-xl text-blue-900">{t('serviceModal.preferredDate')}</h4>
                           </div>
                           <input
                             type="date"
                             value={selectedDate}
                             onChange={(e) => setSelectedDate(e.target.value)}
                             min={new Date().toISOString().split('T')[0]}
                             className="w-full p-3 md:p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bangers-regular text-base md:text-lg"
                           />
                           <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                             <p className="text-sm text-blue-800 text-center">
                               {t('serviceModal.selectDate')}
                             </p>
                           </div>
                         </div>
                   </div>
                 </div>

                 {/* Columna 3: Descripción y Horarios */}
                 <div className="lg:col-span-1">
                   <div className="space-y-4 md:space-y-6">
                     {/* Descripción del Problema */}
                     <div className="bg-orange-50 rounded-xl p-4 md:p-6 border border-orange-200">
                       <div className="flex items-center space-x-2 md:space-x-3 mb-3 md:mb-4">
                         <Settings className="w-5 h-5 md:w-6 md:h-6 text-orange-600" />
                         <h4 className="bangers-regular text-lg md:text-xl text-blue-900">{t('serviceModal.problemDescription')}</h4>
                       </div>
                       <textarea
                         value={formData.descripcionProblema}
                         onChange={(e) => setFormData({...formData, descripcionProblema: e.target.value})}
                         rows={4}
                         className="w-full p-3 md:p-4 border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm md:text-base resize-none"
                         placeholder={t('serviceModal.problemPlaceholder')}
                       />
                     </div>

                     {/* Horarios */}
                       <div className="bg-gray-50 rounded-xl p-4 md:p-8 border border-gray-200 flex-1">
                         <div className="flex items-center justify-center space-x-3 md:space-x-4 mb-3 md:mb-12">
                           <Clock className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
                           <h4 className="bangers-regular text-xl md:text-2xl text-blue-900 ">{t('serviceModal.preferredTime')}</h4>
                         </div>
                         <div className="grid grid-cols-4 md:grid-cols-3 gap-2">
                           {horarios.map((hora) => (
                             <button
                               key={hora}
                               onClick={() => setSelectedHora(hora)}
                               className={`p-2 md:p-3 rounded-xl text-xs md:text-sm font-bold transition-all duration-200 ${
                                 selectedHora === hora
                                   ? 'bg-orange-500 text-white shadow-lg transform scale-105'
                                   : 'bg-white hover:bg-orange-100 text-blue-900 border-2 border-orange-200 hover:border-orange-300'
                               }`}
                             >
                               {hora}
                             </button>
                           ))}
                         </div>
                       </div>
                   </div>
                 </div>
              </div>

              {/* Resumen de Solicitud */}
              {selectedHora && (
                <div className="mt-4 md:mt-8 bg-gradient-to-r from-blue-900 to-blue-800 rounded-2xl p-4 md:p-6 text-white">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 items-center">
                    <div>
                      <h4 className="bangers-regular text-lg md:text-2xl mb-3 md:mb-4 text-orange-300">{t('serviceModal.requestSummary')}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Settings className="w-4 h-4 text-orange-300" />
                            <span className="text-xs md:text-sm text-blue-200">{t('serviceModal.service')}</span>
                          </div>
                          <p className="font-bold text-sm md:text-base">{selectedServicio?.nombre}</p>
                          
                          <div className="flex items-center space-x-2 mt-2 md:mt-3">
                            <User className="w-4 h-4 text-orange-300" />
                            <span className="text-xs md:text-sm text-blue-200">{t('serviceModal.client')}</span>
                          </div>
                          <p className="font-bold text-xs md:text-base">{formData.nombre}</p>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-orange-300" />
                            <span className="text-xs md:text-sm text-blue-200">{t('serviceModal.date')}</span>
                          </div>
                          <p className="font-bold text-sm md:text-base">{new Date(selectedDate).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' })}</p>
                          
                          <div className="flex items-center space-x-2 mt-2 md:mt-3">
                            <Clock className="w-4 h-4 text-orange-300" />
                            <span className="text-xs md:text-sm text-blue-200">{t('serviceModal.hour')}</span>
                          </div>
                          <p className="font-bold text-sm md:text-base">{selectedHora}</p>
                        </div>
                      </div>
                      
                      <div className="mt-3 md:mt-4 p-2 md:p-3 bg-white/10 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-blue-200 text-xs md:text-sm">{t('serviceModal.phoneLabel')}</span>
                          <span className="font-bold text-orange-300 text-sm md:text-base">{formData.telefono}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center lg:text-right">
                      <div className="bg-white/10 rounded-2xl p-4 md:p-6 mb-3 md:mb-4">
                        <p className="text-blue-200 text-xs md:text-sm mb-1 md:mb-2">{t('serviceModal.estimatedPrice')}</p>
                        <p className="bangers-regular text-2xl md:text-4xl text-orange-300">{selectedServicio?.precio}</p>
                        <p className="text-xs text-blue-300 mt-1">{t('serviceModal.finalBudget')}</p>
                      </div>
                      
                      <Button 
                        onClick={realizarSolicitud}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white bangers-regular text-lg md:text-xl py-3 md:py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                      >
                        {t('serviceModal.requestServiceButton')}
                      </Button>
                      
                      <p className="text-xs text-blue-300 mt-2">{t('serviceModal.contactIn24h')}</p>
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
              <CardTitle className="text-2xl text-green-600">{t('serviceModal.requestSent')}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="mb-4">{t('serviceModal.requestProcessed')}</p>
              <p className="text-sm text-gray-600 mb-4">{t('serviceModal.contactSoon')}</p>
              <Button 
                onClick={() => setShowConfirmation(false)}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                {t('serviceModal.continue')}
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
