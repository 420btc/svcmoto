"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wrench, Battery, Shield, Clock, CheckCircle, ArrowLeft, Zap, Settings, Truck, Menu, X, Calendar, User, Phone, MapPin, Home } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"

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
      alert('Debes iniciar sesión para solicitar un servicio')
      return
    }
    setSelectedServicio(servicio)
    setShowServicioModal(true)
  }

  const realizarSolicitud = () => {
    if (!selectedServicio || !selectedHora || !formData.nombre || !formData.telefono) {
      alert('Por favor completa todos los campos obligatorios')
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
      nombre: "Cambio de Batería",
      descripcion: "Sustitución y mantenimiento de baterías",
      icono: Battery,
      precio: "Desde 150€",
      tiempo: "2-4 horas",
      incluye: [
        "Batería de litio original",
        "Instalación profesional",
        "Reciclaje de batería antigua",
        "Calibración del sistema",
        "Garantía de 2 años",
      ],
      urgente: false,
    },
    {
      id: 2,
      nombre: "Recogida y Entrega",
      descripcion: "Servicio de recogida y entrega a domicilio",
      icono: Truck,
      precio: "15€",
      tiempo: "Mismo día",
      incluye: [
        "Recogida en tu domicilio",
        "Transporte seguro",
        "Entrega tras reparación",
        "Zona de Málaga capital",
        "Horario flexible",
      ],
      urgente: false,
    },
    {
      id: 3,
      nombre: "Servicio Express",
      descripcion: "Reparaciones rápidas y urgentes",
      icono: Zap,
      precio: "Desde 55€",
      tiempo: "30 min - 2 horas",
      incluye: [
        "Atención prioritaria",
        "Reparaciones menores",
        "Cambio de neumáticos",
        "Ajustes básicos",
        "Sin cita previa",
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
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image src="/logo-svcmoto.jpeg" alt="SVC MOTO Logo" width={50} height={50} className="rounded-lg" />
            </Link>
            
            {/* Desktop Navigation - Centered */}
             <div className="hidden md:flex items-center justify-center flex-1 space-x-8">
                <Link href="/alquiler" className="bangers-regular text-lg md:text-xl text-blue-900 hover:text-orange-500 transition-colors">
                  Alquiler Motos
                </Link>
                <Link href="/servicios" className="bangers-regular text-lg md:text-xl text-orange-500 border-b-2 border-orange-500 transition-colors">
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
                className="text-blue-900 hover:text-orange-500 p-2 flex items-center space-x-1"
              >
                <Home className="w-6 h-6" />
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
                  className="bangers-regular text-orange-500 block px-3 py-3 text-base transition-colors border-b border-gray-100 border-b-2 border-orange-500"
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

      {/* Header */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Link href="/" className="text-white hover:text-blue-200 mr-4">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="bangers-regular text-5xl md:text-6xl text-white">Servicios Técnicos</h1>
          </div>
          <p className="text-xl text-white/90 max-w-3xl">
            Mantenimiento, reparación y servicios especializados para tu vehículo eléctrico. Técnicos certificados y
            repuestos originales.
          </p>
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
                    <Badge className="absolute -top-2 -right-2 bg-orange-500 text-white">Servicio Express</Badge>
                  )}

                  <CardHeader>
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="bg-orange-100 p-3 rounded-lg">
                        <IconComponent className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <CardTitle className="bangers-regular text-xl text-blue-900">{servicio.nombre}</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">{servicio.descripcion}</p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    {/* Precio y Tiempo */}
                    <div className="flex justify-between items-center mb-6 p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-600">Precio</p>
                        <p className="text-lg font-bold text-orange-600">{servicio.precio}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Tiempo</p>
                        <p className="text-sm font-semibold text-blue-900 flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {servicio.tiempo}
                        </p>
                      </div>
                    </div>

                    {/* Incluye */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-blue-900 mb-3">Incluye:</h4>
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
                      Solicitar {servicio.nombre}
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
            <h2 className="text-3xl font-bold text-white mb-4">¿Cómo Funciona Nuestro Servicio?</h2>
            <p className="text-xl text-white/90">Proceso profesional y transparente</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-500">1</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Diagnóstico</h3>
              <p className="text-white/90 text-sm">Evaluación completa y presupuesto sin compromiso</p>
            </div>

            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-500">2</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Aprobación</h3>
              <p className="text-white/90 text-sm">Te informamos del problema y coste antes de proceder</p>
            </div>

            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-500">3</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Reparación</h3>
              <p className="text-white/90 text-sm">Trabajo profesional con repuestos originales</p>
            </div>

            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-500">4</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Entrega</h3>
              <p className="text-white/90 text-sm">Pruebas finales y garantía de calidad</p>
            </div>
          </div>
        </div>
      </section>

      {/* Garantías Section */}
      <section className="py-16 bg-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Nuestras Garantías</h2>
            <p className="text-xl text-white/90">Compromiso con la calidad y tu tranquilidad</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardContent className="p-6 text-center">
                <Shield className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Garantía de Calidad</h3>
                <p className="text-white/90 text-sm">
                  Todos nuestros trabajos incluyen garantía mínima de 6 meses en mano de obra y repuestos
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardContent className="p-6 text-center">
                <CheckCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Repuestos Originales</h3>
                <p className="text-white/90 text-sm">
                  Utilizamos únicamente repuestos originales o de primera calidad para garantizar durabilidad
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardContent className="p-6 text-center">
                <Clock className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Servicio Rápido</h3>
                <p className="text-white/90 text-sm">
                  Comprometidos con los plazos acordados. Servicio express disponible para urgencias
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-blue-900 mb-4">¿Necesitas Ayuda con tu Vehículo?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Contacta con nuestros técnicos especializados para un diagnóstico gratuito
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
              Llamar: 607 22 88 82
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white bg-transparent"
            >
              Solicitar Presupuesto
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
                     <h2 className="bangers-regular text-xl md:text-3xl text-white">SOLICITAR SERVICIO</h2>
                     <p className="text-blue-200 text-sm md:text-base">{selectedServicio?.nombre}</p>
                   </div>
                 </div>
                 <div className="flex items-center space-x-3">
                   {selectedServicio?.urgente && (
                     <div className="bg-gradient-to-r from-red-500 to-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                       ⚡ URGENTE
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
                         <h3 className="bangers-regular text-lg md:text-2xl text-blue-900 mb-1 md:mb-2">{selectedServicio?.nombre}</h3>
                         <p className="text-orange-600 font-medium text-sm md:text-base">{selectedServicio?.descripcion}</p>
                       </div>
                       
                       <div className="space-y-2 md:space-y-3">
                         <div className="flex items-center justify-between p-2 md:p-3 bg-white rounded-lg">
                           <span className="text-xs md:text-sm text-gray-600">Precio:</span>
                           <span className="font-bold text-orange-600">{selectedServicio?.precio}</span>
                         </div>
                         <div className="flex items-center justify-between p-2 md:p-3 bg-white rounded-lg">
                           <span className="text-xs md:text-sm text-gray-600">Tiempo:</span>
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
                         <h4 className="bangers-regular text-lg md:text-xl text-blue-900">QUÉ INCLUYE</h4>
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
                         <h4 className="bangers-regular text-lg md:text-xl text-blue-900">DATOS PERSONALES</h4>
                       </div>
                       <div className="space-y-3 md:space-y-4">
                         <div>
                           <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Nombre completo *</label>
                           <input
                             type="text"
                             value={formData.nombre}
                             onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                             className="w-full p-2 md:p-3 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
                             placeholder="Tu nombre completo"
                           />
                         </div>
                         <div>
                           <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
                           <input
                             type="tel"
                             value={formData.telefono}
                             onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                             className="w-full p-2 md:p-3 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
                             placeholder="Tu número de teléfono"
                           />
                         </div>
                         <div>
                           <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Dirección</label>
                           <input
                             type="text"
                             value={formData.direccion}
                             onChange={(e) => setFormData({...formData, direccion: e.target.value})}
                             className="w-full p-2 md:p-3 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
                             placeholder="Dirección (opcional para recogida)"
                           />
                         </div>
                       </div>
                     </div>

                     {/* Fecha */}
                         <div className="bg-gray-50 rounded-xl p-4 md:p-6 border border-gray-200 flex-1">
                           <div className="flex items-center space-x-2 md:space-x-3 mb-3 md:mb-4">
                             <Calendar className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                             <h4 className="bangers-regular text-lg md:text-xl text-blue-900">FECHA PREFERIDA</h4>
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
                               📅 Selecciona la fecha que mejor te convenga
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
                         <h4 className="bangers-regular text-lg md:text-xl text-blue-900">DESCRIPCIÓN DEL PROBLEMA</h4>
                       </div>
                       <textarea
                         value={formData.descripcionProblema}
                         onChange={(e) => setFormData({...formData, descripcionProblema: e.target.value})}
                         rows={4}
                         className="w-full p-3 md:p-4 border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm md:text-base resize-none"
                         placeholder="Describe el problema o servicio que necesitas..."
                       />
                     </div>

                     {/* Horarios */}
                       <div className="bg-gray-50 rounded-xl p-4 md:p-8 border border-gray-200 flex-1">
                         <div className="flex items-center justify-center space-x-3 md:space-x-4 mb-3 md:mb-12">
                           <Clock className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
                           <h4 className="bangers-regular text-xl md:text-2xl text-blue-900 ">HORA PREFERIDA</h4>
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
                      <h4 className="bangers-regular text-lg md:text-2xl mb-3 md:mb-4 text-orange-300">📋 RESUMEN DE SOLICITUD</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Settings className="w-4 h-4 text-orange-300" />
                            <span className="text-xs md:text-sm text-blue-200">Servicio:</span>
                          </div>
                          <p className="font-bold text-sm md:text-base">{selectedServicio?.nombre}</p>
                          
                          <div className="flex items-center space-x-2 mt-2 md:mt-3">
                            <User className="w-4 h-4 text-orange-300" />
                            <span className="text-xs md:text-sm text-blue-200">Cliente:</span>
                          </div>
                          <p className="font-bold text-xs md:text-base">{formData.nombre}</p>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-orange-300" />
                            <span className="text-xs md:text-sm text-blue-200">Fecha:</span>
                          </div>
                          <p className="font-bold text-sm md:text-base">{new Date(selectedDate).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' })}</p>
                          
                          <div className="flex items-center space-x-2 mt-2 md:mt-3">
                            <Clock className="w-4 h-4 text-orange-300" />
                            <span className="text-xs md:text-sm text-blue-200">Hora:</span>
                          </div>
                          <p className="font-bold text-sm md:text-base">{selectedHora}</p>
                        </div>
                      </div>
                      
                      <div className="mt-3 md:mt-4 p-2 md:p-3 bg-white/10 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-blue-200 text-xs md:text-sm">📞 Teléfono:</span>
                          <span className="font-bold text-orange-300 text-sm md:text-base">{formData.telefono}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center lg:text-right">
                      <div className="bg-white/10 rounded-2xl p-4 md:p-6 mb-3 md:mb-4">
                        <p className="text-blue-200 text-xs md:text-sm mb-1 md:mb-2">💰 PRECIO ESTIMADO</p>
                        <p className="bangers-regular text-2xl md:text-4xl text-orange-300">{selectedServicio?.precio}</p>
                        <p className="text-xs text-blue-300 mt-1">Presupuesto final tras diagnóstico</p>
                      </div>
                      
                      <Button 
                        onClick={realizarSolicitud}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white bangers-regular text-lg md:text-xl py-3 md:py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                      >
                        🔧 SOLICITAR SERVICIO
                      </Button>
                      
                      <p className="text-xs text-blue-300 mt-2">✅ Te contactaremos en 24h</p>
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
              <CardTitle className="text-2xl text-green-600">¡Solicitud Enviada!</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="mb-4">Tu solicitud de servicio ha sido procesada exitosamente.</p>
              <p className="text-sm text-gray-600 mb-4">Te contactaremos en las próximas 24 horas para confirmar la cita.</p>
              <Button 
                onClick={() => setShowConfirmation(false)}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                Continuar
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
