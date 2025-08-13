"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Star, Calendar, MapPin, Edit, Save, X, Trophy, Gift, Menu, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"

interface Alquiler {
  id: string
  vehiculo: string
  fecha: string
  duracion: string
  precio: string
  puntos: number
  estado: "completado" | "en_curso" | "cancelado"
}

export default function PerfilPage() {
  const [isEditing, setIsEditing] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [userInfo, setUserInfo] = useState({
    nombre: "",
    email: "",
    telefono: "",
    fechaRegistro: ""
  })
  
  const [editedInfo, setEditedInfo] = useState(userInfo)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()

  const calcularCO2Ahorrado = () => {
    // Cálculo basado en reservas completadas
    // Estimación: 0.15 kg CO2/km ahorrado vs coche convencional
    const savedReservas = typeof window !== 'undefined' ? localStorage.getItem('reservas') : null
    const reservas = savedReservas ? JSON.parse(savedReservas) : []
    
    const totalKm = reservas.reduce((total: number, reserva: any) => {
      if (reserva.estado === 'completada') {
        return total + (reserva.kmEstimados || 0)
      }
      return total
    }, 0)
    return (totalKm * 0.15).toFixed(1)
  }

  const calcularKmTotales = () => {
    const savedReservas = typeof window !== 'undefined' ? localStorage.getItem('reservas') : null
    const reservas = savedReservas ? JSON.parse(savedReservas) : []
    
    return reservas.reduce((total: number, reserva: any) => {
      if (reserva.estado === 'completada') {
        return total + (reserva.kmEstimados || 0)
      }
      return total
    }, 0)
  }

  const calcularTotalAlquileres = () => {
    const savedReservas = typeof window !== 'undefined' ? localStorage.getItem('reservas') : null
    const reservas = savedReservas ? JSON.parse(savedReservas) : []
    
    return reservas.filter((reserva: any) => reserva.estado === 'completada').length
  }
  
  const signIn = () => router.push('/handler/sign-in')
  const signOut = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user')
    }
    setUser(null)
    router.push('/')
  }

  // Verificar autenticación
  useEffect(() => {
    // Verificar que estamos en el cliente
    if (typeof window === 'undefined') return
    
    const savedUser = localStorage.getItem('user')
    if (!savedUser) {
      router.push('/handler/sign-in')
      return
    }
    const userData = JSON.parse(savedUser)
    setUser(userData)
    
    // Cargar datos del perfil desde localStorage
    const savedProfile = localStorage.getItem('userProfile')
    if (savedProfile) {
      const profileData = JSON.parse(savedProfile)
      setUserInfo(profileData)
      setEditedInfo(profileData)
    } else {
      // Inicializar con datos del usuario autenticado
      const initialData = {
        nombre: userData.name || "",
        email: userData.email || "",
        telefono: "",
        fechaRegistro: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
      }
      setUserInfo(initialData)
      setEditedInfo(initialData)
    }
    
    // Las reservas se cargan directamente en las funciones de cálculo
  }, [router])

  // Obtener estadísticas desde localStorage
  const getStats = () => {
    if (typeof window === 'undefined') {
      return {
        puntosTotales: 0,
        alquileresCompletados: 0
      }
    }
    const savedStats = localStorage.getItem('userStats')
    if (savedStats) {
      return JSON.parse(savedStats)
    }
    return {
      puntosTotales: 0,
      alquileresCompletados: 0
    }
  }

  // Obtener historial desde localStorage
  const getRentalHistory = () => {
    if (typeof window === 'undefined') {
      return []
    }
    const savedHistory = localStorage.getItem('rentalHistory')
    if (savedHistory) {
      return JSON.parse(savedHistory)
    }
    return []
  }

  const stats = getStats()
  const alquileres = getRentalHistory()
  


  const handleSave = () => {
    setUserInfo(editedInfo)
    setIsEditing(false)
    // Guardar datos del perfil en localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('userProfile', JSON.stringify(editedInfo))
    }
  }

  const handleCancel = () => {
    setEditedInfo(userInfo)
    setIsEditing(false)
  }

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "completado":
        return <Badge className="bg-green-100 text-green-800">Completado</Badge>
      case "en_curso":
        return <Badge className="bg-blue-100 text-blue-800">En Curso</Badge>
      case "cancelado":
        return <Badge className="bg-red-100 text-red-800">Cancelado</Badge>
      default:
        return <Badge>Desconocido</Badge>
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-blue-900 font-medium">Cargando perfil...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
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
                <Link href="/perfil" className="bangers-regular text-lg md:text-xl text-orange-500 border-b-2 border-orange-500 transition-colors">
                  Mi Perfil
                </Link>
              </div>
            
            {/* Authentication Section - Right */}
            <div className="hidden md:flex items-center space-x-4">
               <div className="flex items-center space-x-4">
                 <span className="text-sm text-blue-900">Hola, {user?.name}</span>
                 <Button 
                   onClick={signOut}
                   variant="outline" 
                   className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                 >
                   Cerrar Sesión
                 </Button>
               </div>
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
                  className="bangers-regular text-orange-500 block px-3 py-3 text-base transition-colors border-b border-gray-100 border-b-2 border-orange-500"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Mi Perfil
                </Link>
                <div className="px-3 py-3">
                  <div className="space-y-2">
                    <p className="bangers-regular text-sm text-blue-900 text-center">Hola, {user?.name}</p>
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
            <User className="w-8 h-8 text-white mr-4" />
            <h1 className="bangers-regular text-5xl md:text-6xl text-white">Mi Perfil</h1>
          </div>
          <p className="text-xl text-white/90 max-w-3xl">
            Gestiona tu información personal, revisa tu historial de alquileres y consulta tus puntos acumulados.
          </p>
        </div>
      </section>

      {/* Profile Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Información Personal */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="bangers-regular text-2xl text-blue-900">Información Personal</CardTitle>
                  {!isEditing ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                      className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSave}
                        className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Guardar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancel}
                        className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancelar
                      </Button>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="nombre">Nombre completo</Label>
                    {isEditing ? (
                      <Input
                        id="nombre"
                        value={editedInfo.nombre}
                        onChange={(e) => setEditedInfo({...editedInfo, nombre: e.target.value})}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{userInfo.nombre}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        value={editedInfo.email}
                        onChange={(e) => setEditedInfo({...editedInfo, email: e.target.value})}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{userInfo.email}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="telefono">Teléfono</Label>
                    {isEditing ? (
                      <Input
                        id="telefono"
                        type="tel"
                        value={editedInfo.telefono}
                        onChange={(e) => setEditedInfo({...editedInfo, telefono: e.target.value})}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{userInfo.telefono}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label>Miembro desde</Label>
                    <p className="mt-1 text-gray-900">{userInfo.fechaRegistro}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Estadísticas */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="bangers-regular text-xl text-blue-900">Mis Estadísticas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <Star className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-orange-600">{stats.puntosTotales}</div>
                      <div className="text-sm text-gray-600">Puntos Totales</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <Calendar className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-blue-600">{stats.alquileresCompletados}</div>
                      <div className="text-sm text-gray-600">Alquileres</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg col-span-2">
                      <Trophy className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-green-600">{calcularCO2Ahorrado()} kg</div>
                      <div className="text-sm text-gray-600">CO₂ Ahorrado</div>
                      <div className="text-xs text-green-600 mt-1">🌱 Equivale a {Math.floor(parseFloat(calcularCO2Ahorrado()) / 18.3)} árboles</div>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="text-center">
                    <h4 className="font-semibold text-blue-900 mb-2">Próxima Recompensa</h4>
                    <div className="bg-gray-200 rounded-full h-2 mb-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{
                        width: `${stats.puntosTotales >= 6000 ? 100 :
                                 stats.puntosTotales >= 4000 ? (stats.puntosTotales / 6000) * 100 :
                                 stats.puntosTotales >= 2500 ? (stats.puntosTotales / 4000) * 100 :
                                 stats.puntosTotales >= 1500 ? (stats.puntosTotales / 2500) * 100 :
                                 (stats.puntosTotales / 1500) * 100}%`
                      }}></div>
                    </div>
                    <p className="text-sm text-gray-600">
                      {stats.puntosTotales >= 6000 ? "¡Todas las recompensas desbloqueadas!" :
                       stats.puntosTotales >= 4000 ? `${6000 - stats.puntosTotales} puntos más para Alquiler Premium Gratis` :
                       stats.puntosTotales >= 2500 ? `${4000 - stats.puntosTotales} puntos más para Alquiler Gratis` :
                       stats.puntosTotales >= 1500 ? `${2500 - stats.puntosTotales} puntos más para Descuento 10€` :
                       `${1500 - stats.puntosTotales} puntos más para Descuento 5€`}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sistema de Puntos */}
            <div className="lg:col-span-1">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="bangers-regular text-xl text-blue-900">Sistema de Puntos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                      <div>
                        <div className="font-semibold text-blue-900">Descuento 5€</div>
                        <div className="text-sm text-gray-600">En tu próximo alquiler</div>
                      </div>
                      <Badge className="bg-orange-500 text-white">
                        1500 puntos
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                      <div>
                        <div className="font-semibold text-blue-900">Descuento 10€</div>
                        <div className="text-sm text-gray-600">En tu próximo alquiler</div>
                      </div>
                      <Badge className="bg-orange-500 text-white">
                        2500 puntos
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                      <div>
                        <div className="font-semibold text-blue-900">Alquiler Gratis</div>
                        <div className="text-sm text-gray-600">1 hora de patinete</div>
                      </div>
                      <Badge className="bg-orange-500 text-white">
                        4000 puntos
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                      <div>
                        <div className="font-semibold text-blue-900">Alquiler Premium Gratis</div>
                        <div className="text-sm text-gray-600">2 horas de moto eléctrica</div>
                      </div>
                      <Badge className="bg-orange-500 text-white">
                        6000 puntos
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm text-blue-800">
                      <strong>¿Cómo ganar puntos?</strong>
                      <ul className="mt-2 space-y-1">
                        <li>• 15 puntos por cada euro gastado</li>
                        <li>• 100 puntos extra por completar un alquiler</li>
                        <li>• 200 puntos por reseña positiva</li>
                        <li>• 500 puntos por referir a un amigo</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Historial de Alquileres */}
            <div className="lg:col-span-1">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="bangers-regular text-xl text-blue-900">Historial de Alquileres</CardTitle>
                </CardHeader>
                <CardContent>
                  {alquileres.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center">
                      <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-600 mb-2">No hay alquileres aún</h3>
                      <p className="text-gray-500 mb-4">Cuando realices tu primer alquiler, aparecerá aquí</p>
                      <Link href="/alquiler">
                        <Button className="bg-orange-500 hover:bg-orange-600">
                          Ver Vehículos Disponibles
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-4">
                        {alquileres.map((alquiler: any) => (
                          <div key={alquiler.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-semibold text-blue-900">{alquiler.vehiculo}</h4>
                                <p className="text-sm text-gray-600">ID: {alquiler.id}</p>
                              </div>
                              {getEstadoBadge(alquiler.estado)}
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">Fecha:</span>
                                <p className="font-medium">{alquiler.fecha}</p>
                              </div>
                              <div>
                                <span className="text-gray-500">Duración:</span>
                                <p className="font-medium">{alquiler.duracion}</p>
                              </div>
                              <div>
                                <span className="text-gray-500">Precio:</span>
                                <p className="font-medium text-green-600">{alquiler.precio}</p>
                              </div>
                              <div>
                                <span className="text-gray-500">Puntos:</span>
                                <p className="font-medium text-orange-600">+{alquiler.puntos}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-6 text-center">
                        <Button variant="outline" className="border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white">
                          Ver Más Alquileres
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Logros y Achievements */}
            <div className="lg:col-span-1">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="bangers-regular text-xl text-blue-900">Tus Logros</CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="max-h-[740px] overflow-y-auto scrollbar-hide space-y-2">
                    {/* Logro 1: Primer Viaje */}
                    <Card className={`border-2 ${calcularTotalAlquileres() >= 1 ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-gray-50 opacity-60'}`}>
                      <CardContent className="p-2 flex items-center space-x-3">
                        <div className={`text-2xl ${calcularTotalAlquileres() >= 1 ? '' : 'grayscale'}`}>🚀</div>
                        <div className="flex-1">
                          <h3 className={`font-bold text-xs ${calcularTotalAlquileres() >= 1 ? '' : 'text-gray-500'}`}>Primer Viaje</h3>
                          <p className={`text-xs ${calcularTotalAlquileres() >= 1 ? 'text-gray-600' : 'text-gray-500'}`}>Completa tu primer alquiler</p>
                        </div>
                        <Badge className={calcularTotalAlquileres() >= 1 ? 'bg-green-500 text-white text-xs' : 'text-xs'}>
                          {calcularTotalAlquileres() >= 1 ? '✓' : '○'}
                        </Badge>
                      </CardContent>
                    </Card>

                    {/* Logro 2: Explorador */}
                    <Card className={`border-2 ${calcularKmTotales() >= 10 ? 'border-blue-300 bg-blue-50' : 'border-gray-300 bg-gray-50 opacity-60'}`}>
                      <CardContent className="p-2 flex items-center space-x-3">
                        <div className={`text-2xl ${calcularKmTotales() >= 10 ? '' : 'grayscale'}`}>🗺️</div>
                        <div className="flex-1">
                          <h3 className={`font-bold text-xs ${calcularKmTotales() >= 10 ? '' : 'text-gray-500'}`}>Explorador</h3>
                          <p className={`text-xs ${calcularKmTotales() >= 10 ? 'text-gray-600' : 'text-gray-500'}`}>Recorre 10km</p>
                        </div>
                        <Badge className={calcularKmTotales() >= 10 ? 'bg-blue-500 text-white text-xs' : 'text-xs'}>
                          {calcularKmTotales() >= 10 ? '✓' : '○'}
                        </Badge>
                      </CardContent>
                    </Card>

                    {/* Logro 3: Eco Principiante */}
                    <Card className={`border-2 ${parseFloat(calcularCO2Ahorrado()) >= 1 ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-gray-50 opacity-60'}`}>
                      <CardContent className="p-2 flex items-center space-x-3">
                        <div className={`text-2xl ${parseFloat(calcularCO2Ahorrado()) >= 1 ? '' : 'grayscale'}`}>🌱</div>
                        <div className="flex-1">
                          <h3 className={`font-bold text-xs ${parseFloat(calcularCO2Ahorrado()) >= 1 ? '' : 'text-gray-500'}`}>Eco Principiante</h3>
                          <p className={`text-xs ${parseFloat(calcularCO2Ahorrado()) >= 1 ? 'text-gray-600' : 'text-gray-500'}`}>Ahorra 1kg CO₂</p>
                        </div>
                        <Badge className={parseFloat(calcularCO2Ahorrado()) >= 1 ? 'bg-green-500 text-white text-xs' : 'text-xs'}>
                          {parseFloat(calcularCO2Ahorrado()) >= 1 ? '✓' : '○'}
                        </Badge>
                      </CardContent>
                    </Card>

                    {/* Logro 4: Frecuente */}
                    <Card className={`border-2 ${calcularTotalAlquileres() >= 5 ? 'border-purple-300 bg-purple-50' : 'border-gray-300 bg-gray-50 opacity-60'}`}>
                      <CardContent className="p-2 flex items-center space-x-3">
                        <div className={`text-2xl ${calcularTotalAlquileres() >= 5 ? '' : 'grayscale'}`}>🔄</div>
                        <div className="flex-1">
                          <h3 className={`font-bold text-xs ${calcularTotalAlquileres() >= 5 ? '' : 'text-gray-500'}`}>Frecuente</h3>
                          <p className={`text-xs ${calcularTotalAlquileres() >= 5 ? 'text-gray-600' : 'text-gray-500'}`}>5 alquileres completados</p>
                        </div>
                        <Badge className={calcularTotalAlquileres() >= 5 ? 'bg-purple-500 text-white text-xs' : 'text-xs'}>
                          {calcularTotalAlquileres() >= 5 ? '✓' : '○'}
                        </Badge>
                      </CardContent>
                    </Card>

                    {/* Logro 5: Aventurero */}
                    <Card className={`border-2 ${calcularKmTotales() >= 50 ? 'border-orange-300 bg-orange-50' : 'border-gray-300 bg-gray-50 opacity-60'}`}>
                      <CardContent className="p-2 flex items-center space-x-3">
                        <div className={`text-2xl ${calcularKmTotales() >= 50 ? '' : 'grayscale'}`}>🏔️</div>
                        <div className="flex-1">
                          <h3 className={`font-bold text-xs ${calcularKmTotales() >= 50 ? '' : 'text-gray-500'}`}>Aventurero</h3>
                          <p className={`text-xs ${calcularKmTotales() >= 50 ? 'text-gray-600' : 'text-gray-500'}`}>Recorre 50km</p>
                        </div>
                        <Badge className={calcularKmTotales() >= 50 ? 'bg-orange-500 text-white text-xs' : 'text-xs'}>
                          {calcularKmTotales() >= 50 ? '✓' : '○'}
                        </Badge>
                      </CardContent>
                    </Card>

                    {/* Logro 6: Eco Consciente */}
                    <Card className={`border-2 ${parseFloat(calcularCO2Ahorrado()) >= 10 ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-gray-50 opacity-60'}`}>
                      <CardContent className="p-2 flex items-center space-x-3">
                        <div className={`text-2xl ${parseFloat(calcularCO2Ahorrado()) >= 10 ? '' : 'grayscale'}`}>♻️</div>
                        <div className="flex-1">
                          <h3 className={`font-bold text-xs ${parseFloat(calcularCO2Ahorrado()) >= 10 ? '' : 'text-gray-500'}`}>Eco Consciente</h3>
                          <p className={`text-xs ${parseFloat(calcularCO2Ahorrado()) >= 10 ? 'text-gray-600' : 'text-gray-500'}`}>Ahorra 10kg CO₂</p>
                        </div>
                        <Badge className={parseFloat(calcularCO2Ahorrado()) >= 10 ? 'bg-green-500 text-white text-xs' : 'text-xs'}>
                          {parseFloat(calcularCO2Ahorrado()) >= 10 ? '✓' : '○'}
                        </Badge>
                      </CardContent>
                    </Card>

                    {/* Logro 7: Habitual */}
                    <Card className={`border-2 ${calcularTotalAlquileres() >= 10 ? 'border-indigo-300 bg-indigo-50' : 'border-gray-300 bg-gray-50 opacity-60'}`}>
                      <CardContent className="p-2 flex items-center space-x-3">
                        <div className={`text-2xl ${calcularTotalAlquileres() >= 10 ? '' : 'grayscale'}`}>📅</div>
                        <div className="flex-1">
                          <h3 className={`font-bold text-xs ${calcularTotalAlquileres() >= 10 ? '' : 'text-gray-500'}`}>Habitual</h3>
                          <p className={`text-xs ${calcularTotalAlquileres() >= 10 ? 'text-gray-600' : 'text-gray-500'}`}>10 alquileres completados</p>
                        </div>
                        <Badge className={calcularTotalAlquileres() >= 10 ? 'bg-indigo-500 text-white text-xs' : 'text-xs'}>
                          {calcularTotalAlquileres() >= 10 ? '✓' : '○'}
                        </Badge>
                      </CardContent>
                    </Card>

                    {/* Logro 8: Viajero */}
                    <Card className={`border-2 ${calcularKmTotales() >= 100 ? 'border-cyan-300 bg-cyan-50' : 'border-gray-300 bg-gray-50 opacity-60'}`}>
                      <CardContent className="p-2 flex items-center space-x-3">
                        <div className={`text-2xl ${calcularKmTotales() >= 100 ? '' : 'grayscale'}`}>🧳</div>
                        <div className="flex-1">
                          <h3 className={`font-bold text-xs ${calcularKmTotales() >= 100 ? '' : 'text-gray-500'}`}>Viajero</h3>
                          <p className={`text-xs ${calcularKmTotales() >= 100 ? 'text-gray-600' : 'text-gray-500'}`}>Recorre 100km</p>
                        </div>
                        <Badge className={calcularKmTotales() >= 100 ? 'bg-cyan-500 text-white text-xs' : 'text-xs'}>
                          {calcularKmTotales() >= 100 ? '✓' : '○'}
                        </Badge>
                      </CardContent>
                    </Card>

                    {/* Logro 9: Eco Defensor */}
                    <Card className={`border-2 ${parseFloat(calcularCO2Ahorrado()) >= 25 ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-gray-50 opacity-60'}`}>
                      <CardContent className="p-2 flex items-center space-x-3">
                        <div className={`text-2xl ${parseFloat(calcularCO2Ahorrado()) >= 25 ? '' : 'grayscale'}`}>🛡️</div>
                        <div className="flex-1">
                          <h3 className={`font-bold text-xs ${parseFloat(calcularCO2Ahorrado()) >= 25 ? '' : 'text-gray-500'}`}>Eco Defensor</h3>
                          <p className={`text-xs ${parseFloat(calcularCO2Ahorrado()) >= 25 ? 'text-gray-600' : 'text-gray-500'}`}>Ahorra 25kg CO₂</p>
                        </div>
                        <Badge className={parseFloat(calcularCO2Ahorrado()) >= 25 ? 'bg-green-500 text-white text-xs' : 'text-xs'}>
                          {parseFloat(calcularCO2Ahorrado()) >= 25 ? '✓' : '○'}
                        </Badge>
                      </CardContent>
                    </Card>

                    {/* Logro 10: Veterano */}
                    <Card className={`border-2 ${calcularTotalAlquileres() >= 20 ? 'border-amber-300 bg-amber-50' : 'border-gray-300 bg-gray-50 opacity-60'}`}>
                      <CardContent className="p-2 flex items-center space-x-3">
                        <div className={`text-2xl ${calcularTotalAlquileres() >= 20 ? '' : 'grayscale'}`}>🎖️</div>
                        <div className="flex-1">
                          <h3 className={`font-bold text-xs ${calcularTotalAlquileres() >= 20 ? '' : 'text-gray-500'}`}>Veterano</h3>
                          <p className={`text-xs ${calcularTotalAlquileres() >= 20 ? 'text-gray-600' : 'text-gray-500'}`}>20 alquileres completados</p>
                        </div>
                        <Badge className={calcularTotalAlquileres() >= 20 ? 'bg-amber-500 text-white text-xs' : 'text-xs'}>
                          {calcularTotalAlquileres() >= 20 ? '✓' : '○'}
                        </Badge>
                      </CardContent>
                    </Card>

                    {/* Logro 11: Nómada */}
                    <Card className={`border-2 ${calcularKmTotales() >= 200 ? 'border-teal-300 bg-teal-50' : 'border-gray-300 bg-gray-50 opacity-60'}`}>
                      <CardContent className="p-2 flex items-center space-x-3">
                        <div className={`text-2xl ${calcularKmTotales() >= 200 ? '' : 'grayscale'}`}>🏕️</div>
                        <div className="flex-1">
                          <h3 className={`font-bold text-xs ${calcularKmTotales() >= 200 ? '' : 'text-gray-500'}`}>Nómada</h3>
                          <p className={`text-xs ${calcularKmTotales() >= 200 ? 'text-gray-600' : 'text-gray-500'}`}>Recorre 200km</p>
                        </div>
                        <Badge className={calcularKmTotales() >= 200 ? 'bg-teal-500 text-white text-xs' : 'text-xs'}>
                          {calcularKmTotales() >= 200 ? '✓' : '○'}
                        </Badge>
                      </CardContent>
                    </Card>

                    {/* Logro 12: Eco Héroe */}
                    <Card className={`border-2 ${parseFloat(calcularCO2Ahorrado()) >= 50 ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-gray-50 opacity-60'}`}>
                      <CardContent className="p-2 flex items-center space-x-3">
                        <div className={`text-2xl ${parseFloat(calcularCO2Ahorrado()) >= 50 ? '' : 'grayscale'}`}>🦸</div>
                        <div className="flex-1">
                          <h3 className={`font-bold text-xs ${parseFloat(calcularCO2Ahorrado()) >= 50 ? '' : 'text-gray-500'}`}>Eco Héroe</h3>
                          <p className={`text-xs ${parseFloat(calcularCO2Ahorrado()) >= 50 ? 'text-gray-600' : 'text-gray-500'}`}>Ahorra 50kg CO₂</p>
                        </div>
                        <Badge className={parseFloat(calcularCO2Ahorrado()) >= 50 ? 'bg-green-500 text-white text-xs' : 'text-xs'}>
                          {parseFloat(calcularCO2Ahorrado()) >= 50 ? '✓' : '○'}
                        </Badge>
                      </CardContent>
                    </Card>

                    {/* Logro 13: Experto */}
                    <Card className={`border-2 ${calcularTotalAlquileres() >= 30 ? 'border-violet-300 bg-violet-50' : 'border-gray-300 bg-gray-50 opacity-60'}`}>
                      <CardContent className="p-2 flex items-center space-x-3">
                        <div className={`text-2xl ${calcularTotalAlquileres() >= 30 ? '' : 'grayscale'}`}>🎯</div>
                        <div className="flex-1">
                          <h3 className={`font-bold text-xs ${calcularTotalAlquileres() >= 30 ? '' : 'text-gray-500'}`}>Experto</h3>
                          <p className={`text-xs ${calcularTotalAlquileres() >= 30 ? 'text-gray-600' : 'text-gray-500'}`}>30 alquileres completados</p>
                        </div>
                        <Badge className={calcularTotalAlquileres() >= 30 ? 'bg-violet-500 text-white text-xs' : 'text-xs'}>
                          {calcularTotalAlquileres() >= 30 ? '✓' : '○'}
                        </Badge>
                      </CardContent>
                    </Card>

                    {/* Logro 14: Explorador Urbano */}
                    <Card className={`border-2 ${calcularKmTotales() >= 300 ? 'border-slate-300 bg-slate-50' : 'border-gray-300 bg-gray-50 opacity-60'}`}>
                      <CardContent className="p-2 flex items-center space-x-3">
                        <div className={`text-2xl ${calcularKmTotales() >= 300 ? '' : 'grayscale'}`}>🏙️</div>
                        <div className="flex-1">
                          <h3 className={`font-bold text-xs ${calcularKmTotales() >= 300 ? '' : 'text-gray-500'}`}>Explorador Urbano</h3>
                          <p className={`text-xs ${calcularKmTotales() >= 300 ? 'text-gray-600' : 'text-gray-500'}`}>Recorre 300km</p>
                        </div>
                        <Badge className={calcularKmTotales() >= 300 ? 'bg-slate-500 text-white text-xs' : 'text-xs'}>
                          {calcularKmTotales() >= 300 ? '✓' : '○'}
                        </Badge>
                      </CardContent>
                    </Card>

                    {/* Logro 15: Eco Warrior */}
                    <Card className={`border-2 ${parseFloat(calcularCO2Ahorrado()) >= 100 ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-gray-50 opacity-60'}`}>
                      <CardContent className="p-2 flex items-center space-x-3">
                        <div className={`text-2xl ${parseFloat(calcularCO2Ahorrado()) >= 100 ? '' : 'grayscale'}`}>⚔️</div>
                        <div className="flex-1">
                          <h3 className={`font-bold text-xs ${parseFloat(calcularCO2Ahorrado()) >= 100 ? '' : 'text-gray-500'}`}>Eco Warrior</h3>
                          <p className={`text-xs ${parseFloat(calcularCO2Ahorrado()) >= 100 ? 'text-gray-600' : 'text-gray-500'}`}>Ahorra 100kg CO₂</p>
                        </div>
                        <Badge className={parseFloat(calcularCO2Ahorrado()) >= 100 ? 'bg-green-500 text-white text-xs' : 'text-xs'}>
                          {parseFloat(calcularCO2Ahorrado()) >= 100 ? '✓' : '○'}
                        </Badge>
                      </CardContent>
                    </Card>

                    {/* Logro 16: Maestro */}
                    <Card className={`border-2 ${calcularTotalAlquileres() >= 40 ? 'border-emerald-300 bg-emerald-50' : 'border-gray-300 bg-gray-50 opacity-60'}`}>
                      <CardContent className="p-2 flex items-center space-x-3">
                        <div className={`text-2xl ${calcularTotalAlquileres() >= 40 ? '' : 'grayscale'}`}>🧙</div>
                        <div className="flex-1">
                          <h3 className={`font-bold text-xs ${calcularTotalAlquileres() >= 40 ? '' : 'text-gray-500'}`}>Maestro</h3>
                          <p className={`text-xs ${calcularTotalAlquileres() >= 40 ? 'text-gray-600' : 'text-gray-500'}`}>40 alquileres completados</p>
                        </div>
                        <Badge className={calcularTotalAlquileres() >= 40 ? 'bg-emerald-500 text-white text-xs' : 'text-xs'}>
                          {calcularTotalAlquileres() >= 40 ? '✓' : '○'}
                        </Badge>
                      </CardContent>
                    </Card>

                    {/* Logro 17: Velocista */}
                    <Card className={`border-2 ${calcularKmTotales() >= 500 ? 'border-yellow-300 bg-yellow-50' : 'border-gray-300 bg-gray-50 opacity-60'}`}>
                      <CardContent className="p-2 flex items-center space-x-3">
                        <div className={`text-2xl ${calcularKmTotales() >= 500 ? '' : 'grayscale'}`}>🏎️</div>
                        <div className="flex-1">
                          <h3 className={`font-bold text-xs ${calcularKmTotales() >= 500 ? '' : 'text-gray-500'}`}>Velocista</h3>
                          <p className={`text-xs ${calcularKmTotales() >= 500 ? 'text-gray-600' : 'text-gray-500'}`}>Recorre 500km</p>
                        </div>
                        <Badge className={calcularKmTotales() >= 500 ? 'bg-yellow-500 text-white text-xs' : 'text-xs'}>
                          {calcularKmTotales() >= 500 ? '✓' : '○'}
                        </Badge>
                      </CardContent>
                    </Card>

                    {/* Logro 18: Maratonista */}
                    <Card className={`border-2 ${calcularTotalAlquileres() >= 50 ? 'border-blue-300 bg-blue-50' : 'border-gray-300 bg-gray-50 opacity-60'}`}>
                      <CardContent className="p-2 flex items-center space-x-3">
                        <div className={`text-2xl ${calcularTotalAlquileres() >= 50 ? '' : 'grayscale'}`}>🏃</div>
                        <div className="flex-1">
                          <h3 className={`font-bold text-xs ${calcularTotalAlquileres() >= 50 ? '' : 'text-gray-500'}`}>Maratonista</h3>
                          <p className={`text-xs ${calcularTotalAlquileres() >= 50 ? 'text-gray-600' : 'text-gray-500'}`}>50 alquileres completados</p>
                        </div>
                        <Badge className={calcularTotalAlquileres() >= 50 ? 'bg-blue-500 text-white text-xs' : 'text-xs'}>
                          {calcularTotalAlquileres() >= 50 ? '✓' : '○'}
                        </Badge>
                      </CardContent>
                    </Card>

                    {/* Logro 19: Eco Leyenda */}
                    <Card className={`border-2 ${parseFloat(calcularCO2Ahorrado()) >= 200 ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-gray-50 opacity-60'}`}>
                      <CardContent className="p-2 flex items-center space-x-3">
                        <div className={`text-2xl ${parseFloat(calcularCO2Ahorrado()) >= 200 ? '' : 'grayscale'}`}>👑</div>
                        <div className="flex-1">
                          <h3 className={`font-bold text-xs ${parseFloat(calcularCO2Ahorrado()) >= 200 ? '' : 'text-gray-500'}`}>Eco Leyenda</h3>
                          <p className={`text-xs ${parseFloat(calcularCO2Ahorrado()) >= 200 ? 'text-gray-600' : 'text-gray-500'}`}>Ahorra 200kg CO₂</p>
                        </div>
                        <Badge className={parseFloat(calcularCO2Ahorrado()) >= 200 ? 'bg-green-500 text-white text-xs' : 'text-xs'}>
                          {parseFloat(calcularCO2Ahorrado()) >= 200 ? '✓' : '○'}
                        </Badge>
                      </CardContent>
                    </Card>

                    {/* Logro 20: Súper Viajero */}
                    <Card className={`border-2 ${calcularKmTotales() >= 1000 ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50 opacity-60'}`}>
                      <CardContent className="p-2 flex items-center space-x-3">
                        <div className={`text-2xl ${calcularKmTotales() >= 1000 ? '' : 'grayscale'}`}>🚁</div>
                        <div className="flex-1">
                          <h3 className={`font-bold text-xs ${calcularKmTotales() >= 1000 ? '' : 'text-gray-500'}`}>Súper Viajero</h3>
                          <p className={`text-xs ${calcularKmTotales() >= 1000 ? 'text-gray-600' : 'text-gray-500'}`}>Recorre 1000km</p>
                        </div>
                        <Badge className={calcularKmTotales() >= 1000 ? 'bg-red-500 text-white text-xs' : 'text-xs'}>
                          {calcularKmTotales() >= 1000 ? '✓' : '○'}
                        </Badge>
                      </CardContent>
                    </Card>

                    {/* Logro 21: Centurión */}
                    <Card className={`border-2 ${calcularTotalAlquileres() >= 100 ? 'border-gold-300 bg-yellow-50' : 'border-gray-300 bg-gray-50 opacity-60'}`}>
                      <CardContent className="p-2 flex items-center space-x-3">
                        <div className={`text-2xl ${calcularTotalAlquileres() >= 100 ? '' : 'grayscale'}`}>🏛️</div>
                        <div className="flex-1">
                          <h3 className={`font-bold text-xs ${calcularTotalAlquileres() >= 100 ? '' : 'text-gray-500'}`}>Centurión</h3>
                          <p className={`text-xs ${calcularTotalAlquileres() >= 100 ? 'text-gray-600' : 'text-gray-500'}`}>100 alquileres completados</p>
                        </div>
                        <Badge className={calcularTotalAlquileres() >= 100 ? 'bg-yellow-500 text-white text-xs' : 'text-xs'}>
                          {calcularTotalAlquileres() >= 100 ? '✓' : '○'}
                        </Badge>
                      </CardContent>
                    </Card>

                    {/* Logro 22: Eco Dios */}
                    <Card className={`border-2 ${parseFloat(calcularCO2Ahorrado()) >= 500 ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-gray-50 opacity-60'}`}>
                      <CardContent className="p-2 flex items-center space-x-3">
                        <div className={`text-2xl ${parseFloat(calcularCO2Ahorrado()) >= 500 ? '' : 'grayscale'}`}>🌍</div>
                        <div className="flex-1">
                          <h3 className={`font-bold text-xs ${parseFloat(calcularCO2Ahorrado()) >= 500 ? '' : 'text-gray-500'}`}>Eco Dios</h3>
                          <p className={`text-xs ${parseFloat(calcularCO2Ahorrado()) >= 500 ? 'text-gray-600' : 'text-gray-500'}`}>Ahorra 500kg CO₂</p>
                        </div>
                        <Badge className={parseFloat(calcularCO2Ahorrado()) >= 500 ? 'bg-green-500 text-white text-xs' : 'text-xs'}>
                          {parseFloat(calcularCO2Ahorrado()) >= 500 ? '✓' : '○'}
                        </Badge>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}