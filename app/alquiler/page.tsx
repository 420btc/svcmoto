"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, Zap, Shield, ArrowLeft, Menu, X, Calendar, CheckCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"

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
      alert('Debes iniciar sesión para realizar una reserva')
      return
    }
    setSelectedMoto(moto)
    setShowReservaModal(true)
  }

  const realizarReserva = () => {
    if (!selectedMoto || !selectedHora) {
      alert('Por favor selecciona un horario')
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
      caracteristicas: ["2 cascos incluidos", "Seguro premium", "Batería 72V24AH", "Motor 9kW", "Frenos ABS"],
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

                  <Button 
                    onClick={() => abrirModalReserva(moto)}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                  >
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
                     <h2 className="bangers-regular text-xl md:text-3xl text-white">RESERVAR VEHÍCULO</h2>
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
                         <h4 className="bangers-regular text-lg md:text-xl text-blue-900">SELECCIONA FECHA</h4>
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
                         <h4 className="bangers-regular text-lg md:text-xl text-blue-900">DURACIÓN</h4>
                       </div>
                       <select
                         value={duracion}
                         onChange={(e) => setDuracion(parseInt(e.target.value))}
                         className="w-full p-3 md:p-4 border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bangers-regular text-base md:text-lg bg-white"
                       >
                         <option value={1}>⏱️ 1 HORA</option>
                         <option value={2}>⏱️ 2 HORAS</option>
                         <option value={3}>⏱️ 3 HORAS</option>
                         <option value={4}>⏱️ 4 HORAS</option>
                         <option value={8}>🌅 DÍA COMPLETO (8H)</option>
                       </select>
                     </div>
                   </div>
                 </div>

                 {/* Columna 3: Horarios */}
                 <div className="lg:col-span-1">
                   <div className="bg-gray-50 rounded-xl p-4 md:p-6 border border-gray-200">
                     <div className="flex items-center space-x-2 md:space-x-3 mb-3 md:mb-4">
                       <Clock className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                       <h4 className="bangers-regular text-lg md:text-xl text-blue-900">HORA DE INICIO</h4>
                     </div>
                     <div className="grid grid-cols-3 md:grid-cols-2 gap-2 md:gap-3 max-h-48 md:max-h-64 overflow-y-auto">
                       {horarios.map((hora) => {
                         const disponible = isHorarioDisponible(hora)
                         return (
                           <button
                             key={hora}
                             onClick={() => disponible && setSelectedHora(hora)}
                             disabled={!disponible}
                             className={`p-2 md:p-3 rounded-xl text-xs md:text-sm font-bold transition-all duration-200 ${
                               selectedHora === hora
                                 ? 'bg-orange-500 text-white shadow-lg transform scale-105'
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
                       <h4 className="bangers-regular text-lg md:text-2xl mb-3 md:mb-4 text-orange-300">🎯 RESUMEN DE TU RESERVA</h4>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                         <div className="space-y-2">
                           <div className="flex items-center space-x-2">
                             <Zap className="w-4 h-4 text-orange-300" />
                             <span className="text-xs md:text-sm text-blue-200">Vehículo:</span>
                           </div>
                           <p className="font-bold text-sm md:text-base">{selectedMoto?.nombre}</p>
                           
                           <div className="flex items-center space-x-2 mt-2 md:mt-3">
                             <Calendar className="w-4 h-4 text-orange-300" />
                             <span className="text-xs md:text-sm text-blue-200">Fecha:</span>
                           </div>
                           <p className="font-bold text-xs md:text-base">{new Date(selectedDate).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' })}</p>
                         </div>
                         
                         <div className="space-y-2">
                           <div className="flex items-center space-x-2">
                             <Clock className="w-4 h-4 text-orange-300" />
                             <span className="text-xs md:text-sm text-blue-200">Horario:</span>
                           </div>
                           <p className="font-bold text-sm md:text-base">{selectedHora} - {parseInt(selectedHora.split(':')[0]) + duracion}:{selectedHora.split(':')[1]}</p>
                           
                           <div className="flex items-center space-x-2 mt-2 md:mt-3">
                             <Shield className="w-4 h-4 text-orange-300" />
                             <span className="text-xs md:text-sm text-blue-200">Duración:</span>
                           </div>
                           <p className="font-bold text-sm md:text-base">{duracion} hora{duracion > 1 ? 's' : ''}</p>
                         </div>
                       </div>
                       
                       <div className="mt-3 md:mt-4 p-2 md:p-3 bg-white/10 rounded-lg">
                         <div className="flex items-center justify-between">
                           <span className="text-blue-200 text-xs md:text-sm">🛣️ Km estimados:</span>
                           <span className="font-bold text-orange-300 text-sm md:text-base">{calcularKmEstimados()} km</span>
                         </div>
                       </div>
                     </div>
                     
                     <div className="text-center lg:text-right">
                       <div className="bg-white/10 rounded-2xl p-4 md:p-6 mb-3 md:mb-4">
                         <p className="text-blue-200 text-xs md:text-sm mb-1 md:mb-2">💰 PRECIO TOTAL</p>
                         <p className="bangers-regular text-2xl md:text-4xl text-orange-300">{calcularPrecio()}€</p>
                         <p className="text-xs text-blue-300 mt-1">IVA incluido</p>
                       </div>
                       
                       <Button 
                         onClick={realizarReserva}
                         className="w-full bg-orange-500 hover:bg-orange-600 text-white bangers-regular text-lg md:text-xl py-3 md:py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                       >
                         🚀 CONFIRMAR RESERVA
                       </Button>
                       
                       <p className="text-xs text-blue-300 mt-2">✅ Confirmación instantánea</p>
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
              <CardTitle className="text-2xl text-green-600">¡Reserva Confirmada!</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="mb-4">Tu reserva ha sido procesada exitosamente.</p>
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
