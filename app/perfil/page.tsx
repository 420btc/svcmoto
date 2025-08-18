"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Star, Calendar, MapPin, Edit, Save, X, Trophy, Gift, Menu, ArrowLeft, Home, Clock, Zap, CheckCircle, Key, Copy } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useTranslation } from "@/contexts/TranslationContext"
import { LanguageToggle } from "@/components/LanguageToggle"

interface Alquiler {
  id: string
  vehiculo: string
  fecha: string
  duracion: string
  precio: string
  puntos: number
  estado: "completado" | "en_curso" | "cancelado" | "pendiente" | "verificado"
  verificationCode?: string
  isVerified?: boolean
}

export default function PerfilPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [userInfo, setUserInfo] = useState({
    nombre: "",
    email: "",
    telefono: "",
    fechaRegistro: ""
  })
  const [editedInfo, setEditedInfo] = useState(userInfo)
  const [isEditing, setIsEditing] = useState(false)
  const [countdowns, setCountdowns] = useState<{[key: string]: {time: number, type: string}}>({})
  const [showPointsModal, setShowPointsModal] = useState(false)
  const [showDeleteHistoryModal, setShowDeleteHistoryModal] = useState(false)
  const router = useRouter()
  const { t } = useTranslation()

  const calcularCO2Ahorrado = () => {
    // Cálculo basado en reservas completadas
    // Estimación: 0.15 kg CO2/km ahorrado vs coche convencional
    if (typeof window === 'undefined' || !user?.email) return '0.0'
    
    // Buscar en el historial de alquileres, no en las reservas
    const userHistoryKey = `rentalHistory_${user.email}`
    const savedHistory = localStorage.getItem(userHistoryKey)
    const history = savedHistory ? JSON.parse(savedHistory) : []
    
    const totalKm = history.reduce((total: number, alquiler: any) => {
      if (alquiler.estado === 'completada' || alquiler.estado === 'completado') {
        // Estimar 15 km por hora de duración
        const duracionHoras = parseInt(alquiler.duracion?.toString().replace(/[^0-9]/g, '')) || 1
        return total + (duracionHoras * 15)
      }
      return total
    }, 0)
    return (totalKm * 0.15).toFixed(1)
  }

  const calcularKmTotales = () => {
    if (typeof window === 'undefined' || !user?.email) return 0
    
    // Buscar en el historial de alquileres, no en las reservas
    const userHistoryKey = `rentalHistory_${user.email}`
    const savedHistory = localStorage.getItem(userHistoryKey)
    const history = savedHistory ? JSON.parse(savedHistory) : []
    
    return history.reduce((total: number, alquiler: any) => {
      if (alquiler.estado === 'completada' || alquiler.estado === 'completado') {
        // Estimar 15 km por hora de duración
        const duracionHoras = parseInt(alquiler.duracion?.toString().replace(/[^0-9]/g, '')) || 1
        return total + (duracionHoras * 15)
      }
      return total
    }, 0)
  }

  const calcularTotalAlquileres = () => {
    if (typeof window === 'undefined' || !user?.email) return 0
    
    // Buscar en el historial de alquileres, no en las reservas
    const userHistoryKey = `rentalHistory_${user.email}`
    const savedHistory = localStorage.getItem(userHistoryKey)
    const history = savedHistory ? JSON.parse(savedHistory) : []
    
    return history.filter((alquiler: any) => alquiler.estado === 'completada' || alquiler.estado === 'completado').length
  }
  
  const signIn = () => router.push('/handler/sign-in')
  const signOut = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user')
    }
    setUser(null)
    router.push('/')
  }

  // Cargar bookings desde API cuando el usuario esté disponible
  useEffect(() => {
    if (user?.email) {
      fetchBookingsFromAPI()
    }
  }, [user?.email])
  
  // Verificar autenticación desde localStorage
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
    
    // Cargar datos del perfil específicos del usuario desde localStorage
    const userProfileKey = `userProfile_${userData.email}`
    const savedProfile = localStorage.getItem(userProfileKey)
    if (savedProfile) {
      const profileData = JSON.parse(savedProfile)
      setUserInfo(profileData)
      setEditedInfo(profileData)
    } else {
      // Verificar si es la primera vez que se registra
      const userRegistrationKey = `userRegistration_${userData.email}`
      const existingRegistration = localStorage.getItem(userRegistrationKey)
      
      let fechaRegistro
      if (!existingRegistration) {
        // Primera vez - establecer fecha de registro
        fechaRegistro = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
        localStorage.setItem(userRegistrationKey, JSON.stringify({
          email: userData.email,
          fechaRegistro: fechaRegistro,
          fechaRegistroISO: new Date().toISOString()
        }))
      } else {
        // Usuario existente - usar fecha de registro guardada
        const registrationData = JSON.parse(existingRegistration)
        fechaRegistro = registrationData.fechaRegistro
      }
      
      // Inicializar con datos del usuario autenticado
      const initialData = {
        nombre: userData.name || "",
        email: userData.email || "",
        telefono: "",
        fechaRegistro: fechaRegistro
      }
      setUserInfo(initialData)
      setEditedInfo(initialData)
      
      // Guardar perfil inicial específico del usuario
      localStorage.setItem(userProfileKey, JSON.stringify(initialData))
    }
    
    // Las reservas se cargan directamente en las funciones de cálculo
  }, [router])

  // Obtener estadísticas combinando API y localStorage
  const getStats = () => {
    if (typeof window === 'undefined' || !user?.email) {
      return {
        puntosTotales: 0,
        alquileresCompletados: 0
      }
    }
    
    // Calcular estadísticas desde API
    const apiStats = {
      puntosTotales: apiBookings.reduce((total, booking) => total + (booking.pointsAwarded || 0), 0),
      alquileresCompletados: apiBookings.filter(booking => booking.isVerified).length
    }
    
    // Fallback a localStorage para compatibilidad
    const userStatsKey = `userStats_${user.email}`
    const savedStats = localStorage.getItem(userStatsKey)
    const localStats = savedStats ? JSON.parse(savedStats) : { puntosTotales: 0, alquileresCompletados: 0 }
    
    // Combinar estadísticas, priorizando API si hay datos
    return {
      puntosTotales: apiStats.puntosTotales > 0 ? apiStats.puntosTotales : localStats.puntosTotales,
      alquileresCompletados: apiStats.alquileresCompletados > 0 ? apiStats.alquileresCompletados : localStats.alquileresCompletados
    }
  }

  // Obtener historial desde la API
  const [apiBookings, setApiBookings] = useState([])
  const [loadingBookings, setLoadingBookings] = useState(false)
  
  const fetchBookingsFromAPI = async () => {
    if (!user?.email) return
    
    setLoadingBookings(true)
    try {
      // Primero obtener el usuario de la API
      const userResponse = await fetch(`/api/users?email=${encodeURIComponent(user.email)}`)
      if (userResponse.ok) {
        const userData = await userResponse.json()
        
        // Luego obtener las reservas del usuario
        const bookingsResponse = await fetch(`/api/bookings?userId=${userData.user.id}`)
        if (bookingsResponse.ok) {
          const bookingsData = await bookingsResponse.json()
          setApiBookings(bookingsData.bookings || [])
        }
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoadingBookings(false)
    }
  }
  
  // Obtener historial combinando API y localStorage
  const getRentalHistory = () => {
    if (typeof window === 'undefined' || !user?.email) {
      return []
    }
    
    // Convertir bookings de API al formato esperado
    const apiHistory = apiBookings.map(booking => ({
      id: booking.id,
      vehiculo: booking.vehicleType,
      fecha: new Date(booking.startAt).toLocaleDateString(),
      horaInicio: new Date(booking.startAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      duracion: `${booking.duration || 1} hora${(booking.duration || 1) > 1 ? 's' : ''}`,
      precio: `${booking.totalPrice}€`,
      puntos: booking.pointsAwarded || 0,
      estado: booking.isVerified ? 'verificado' : 'pendiente',
      fechaCreacion: booking.createdAt,
      fechaFinalizacion: booking.endAt,
      verificationCode: booking.verificationCode,
      isVerified: booking.isVerified
    }))
    
    // Fallback a localStorage para compatibilidad
    const userHistoryKey = `rentalHistory_${user.email}`
    const savedHistory = localStorage.getItem(userHistoryKey)
    const localHistory = savedHistory ? JSON.parse(savedHistory) : []
    
    // Combinar ambos, priorizando API
    const combinedHistory = [...apiHistory]
    
    // Agregar elementos de localStorage que no estén en API
    localHistory.forEach(localItem => {
      const existsInAPI = apiHistory.some(apiItem => apiItem.verificationCode === localItem.verificationCode)
      if (!existsInAPI) {
        combinedHistory.push(localItem)
      }
    })
    
    return combinedHistory.sort((a, b) => new Date(b.fechaCreacion || 0) - new Date(a.fechaCreacion || 0))
  }

  // Función para borrar todo el historial
  const handleDeleteHistory = () => {
    if (typeof window === 'undefined' || !user?.email) return
    
    const userHistoryKey = `rentalHistory_${user.email}`
    const userStatsKey = `userStats_${user.email}`
    
    // Borrar historial y estadísticas
    localStorage.removeItem(userHistoryKey)
    localStorage.removeItem(userStatsKey)
    
    // También borrar claves generales por compatibilidad
    localStorage.removeItem('rentalHistory')
    localStorage.removeItem('userStats')
    
    // Cerrar modal
    setShowDeleteHistoryModal(false)
    
    // Forzar re-render
    window.location.reload()
  }

  const stats = getStats()
  const alquileres = getRentalHistory()
  
  // Función para calcular tiempo restante
  const calculateTimeRemaining = (alquiler: any) => {
    if (!alquiler.fecha || !alquiler.horaInicio || !alquiler.duracion) {
      return { type: 'finished', time: 0 }
    }
    
    const now = new Date()
    const reservationDate = new Date(alquiler.fecha + 'T' + alquiler.horaInicio)
    const durationHours = parseInt(alquiler.duracion.toString().replace(/[^0-9]/g, '')) || 1
    const endTime = new Date(reservationDate.getTime() + (durationHours * 60 * 60 * 1000))
    
    // Si la reserva aún no ha comenzado, devolver tiempo hasta el inicio
    if (now < reservationDate) {
      return { type: 'waiting', time: reservationDate.getTime() - now.getTime() }
    }
    
    // Si la reserva está en curso, devolver tiempo restante
    if (now >= reservationDate && now < endTime) {
      return { type: 'active', time: Math.max(0, endTime.getTime() - now.getTime()) }
    }
    
    // Si la reserva ha terminado
    return { type: 'finished', time: 0 }
  }
  
  // Función para formatear tiempo
  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`
    } else {
      return `${seconds}s`
    }
  }
  
  // Efecto para manejar countdowns
  useEffect(() => {
    const interval = setInterval(() => {
      const newCountdowns: {[key: string]: {time: number, type: string}} = {}
      let hasActiveRentals = false
      
      alquileres.forEach((alquiler: any) => {
        if (alquiler.estado === 'en_curso') {
          const timeData = calculateTimeRemaining(alquiler)
          newCountdowns[alquiler.id] = timeData
          
          if (timeData.type === 'waiting' || timeData.type === 'active') {
            hasActiveRentals = true
          } else if (timeData.type === 'finished') {
            // Alquiler completado - ahora requiere verificación física
            // No se entregan puntos automáticamente
          }
        }
      })
      
      setCountdowns(newCountdowns)
      
      if (!hasActiveRentals) {
        clearInterval(interval)
      }
    }, 1000)
    
    return () => clearInterval(interval)
  }, [alquileres, user?.email])
  


  const handleSave = () => {
    setUserInfo(editedInfo)
    setIsEditing(false)
    // Guardar datos del perfil específicos del usuario en localStorage
    if (typeof window !== 'undefined' && user?.email) {
      const userProfileKey = `userProfile_${user.email}`
      localStorage.setItem(userProfileKey, JSON.stringify(editedInfo))
      // También mantener compatibilidad con el sistema general
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
              <Link href="/servicios" className="bangers-regular text-base text-blue-900 hover:text-orange-500 transition-colors">
                {t('nav.services')}
              </Link>
              <Link href="/contacto" className="bangers-regular text-base text-blue-900 hover:text-orange-500 transition-colors">
                {t('nav.contact')}
              </Link>
              <Link href="/perfil" className="bangers-regular text-base text-orange-500 border-b-2 border-orange-500 transition-colors">
                {t('nav.profile')}
              </Link>
            </div>
            
            {/* Tablet Auth Section - Right Column */}
            <div className="hidden sm:flex lg:hidden items-center justify-end space-x-3 w-1/4">
               <LanguageToggle />
               <div className="flex items-center space-x-2">
                 <span className="text-xs text-blue-900">{user?.name}</span>
                 <Button 
                   onClick={signOut}
                   variant="outline" 
                   size="sm"
                   className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white text-xs"
                 >
                   {t('nav.signOut')}
                 </Button>
               </div>
            </div>

            {/* Desktop Navigation - Center Column */}
            <div className="hidden lg:flex items-center justify-center flex-1 space-x-6">
              <Link href="/alquiler" className="bangers-regular text-lg xl:text-xl text-blue-900 hover:text-orange-500 transition-colors">
                {t('nav.rental')}
              </Link>
              <Link href="/servicios" className="bangers-regular text-lg xl:text-xl text-blue-900 hover:text-orange-500 transition-colors">
                {t('nav.services')}
              </Link>
              <Link href="/contacto" className="bangers-regular text-lg xl:text-xl text-blue-900 hover:text-orange-500 transition-colors">
                {t('nav.contact')}
              </Link>
              <Link href="/perfil" className="bangers-regular text-lg xl:text-xl text-orange-500 border-b-2 border-orange-500 transition-colors">
                {t('nav.profile')}
              </Link>
            </div>
            
            {/* Desktop Authentication Section - Right Column */}
            <div className="hidden lg:flex items-center justify-end space-x-4 w-1/4">
               <LanguageToggle />
               <div className="flex items-center space-x-4">
                 <span className="text-sm text-blue-900">{t('nav.hello')} {user?.name}</span>
                 <Button 
                   onClick={signOut}
                   variant="outline" 
                   className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                 >
                   {t('nav.signOut')}
                 </Button>
               </div>
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
                <Link
                  href="/perfil"
                  className="bangers-regular text-orange-500 block px-3 py-3 text-base transition-colors border-b border-gray-100 border-b-2 border-orange-500"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.profile')}
                </Link>
                <div className="px-3 py-3">
                  <div className="space-y-2">
                    <p className="bangers-regular text-sm text-blue-900 text-center">{t('nav.hello')} {user?.name}</p>
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
            <h1 className="bangers-regular text-5xl md:text-6xl text-white drop-shadow-lg" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>{t('profile.title')}</h1>
          </div>
          <p className="text-xl text-white/90 max-w-3xl">
            {t('profile.subtitle')}
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
                  <CardTitle className="bangers-regular text-2xl lg:text-3xl text-blue-900">{t('profile.personalInfo')}</CardTitle>
                  {!isEditing ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                      className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      {t('profile.edit')}
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
                        {t('profile.save')}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancel}
                        className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                      >
                        <X className="w-4 h-4 mr-2" />
                        {t('profile.cancel')}
                      </Button>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="nombre">{t('profile.fullName')}</Label>
                    {isEditing ? (
                      <Input
                        id="nombre"
                        value={editedInfo.nombre}
                        onChange={(e) => setEditedInfo({...editedInfo, nombre: e.target.value})}
                        className="mt-1"
                      />
                    ) : (
                      <div className="mt-1">
                        <Badge className="bg-blue-900 text-white px-3 py-1 text-sm font-semibold border border-orange-500">
                          {userInfo.nombre}
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="email">{t('profile.email')}</Label>
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
                    <Label htmlFor="telefono">{t('profile.phone')}</Label>
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
                    <Label>{t('profile.memberSince')}</Label>
                    <p className="mt-1 text-gray-900">{userInfo.fechaRegistro}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Estadísticas */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="bangers-regular text-xl lg:text-2xl text-blue-900">{t('profile.myStats')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <Star className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-orange-600">{stats.puntosTotales}</div>
                      <div className="text-sm text-gray-600">{t('profile.totalPoints')}</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <Calendar className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-blue-600">{stats.alquileresCompletados}</div>
                      <div className="text-sm text-gray-600">{t('profile.rentals')}</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                       <MapPin className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                       <div className="text-2xl font-bold text-purple-600">{calcularKmTotales()} km</div>
                       <div className="text-sm text-gray-600">{t('profile.kmTraveled')}</div>
                     </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <Trophy className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-green-600">{calcularCO2Ahorrado()} kg</div>
                      <div className="text-sm text-gray-600">{t('profile.co2Saved')}</div>
                      <div className="text-xs text-green-600 mt-1">🌱 {t('profile.treesEquivalent').replace('{count}', Math.floor(parseFloat(calcularCO2Ahorrado()) / 18.3).toString())}</div>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="text-center">
                    <h4 className="font-semibold text-blue-900 mb-2">{t('profile.nextReward')}</h4>
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
                      {stats.puntosTotales >= 6000 ? t('profile.allRewardsUnlocked') :
                       stats.puntosTotales >= 4000 ? t('profile.pointsForPremiumFree').replace('{points}', (6000 - stats.puntosTotales).toString()) :
                       stats.puntosTotales >= 2500 ? t('profile.pointsForFree').replace('{points}', (4000 - stats.puntosTotales).toString()) :
                       stats.puntosTotales >= 1500 ? t('profile.pointsFor10Discount').replace('{points}', (2500 - stats.puntosTotales).toString()) :
                       t('profile.pointsFor5Discount').replace('{points}', (1500 - stats.puntosTotales).toString())}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sistema de Puntos */}
            <div className="lg:col-span-1">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="bangers-regular text-xl lg:text-2xl text-blue-900">{t('profile.pointsSystem')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                      <div>
                        <div className="font-semibold text-blue-900">{t('profile.discount5')}</div>
                        <div className="text-sm text-gray-600">{t('profile.nextRentalDiscount')}</div>
                      </div>
                      <Badge className="bg-orange-500 text-white">
                        1500 puntos
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                      <div>
                        <div className="font-semibold text-blue-900">{t('profile.discount10')}</div>
                        <div className="text-sm text-gray-600">{t('profile.nextRentalDiscount')}</div>
                      </div>
                      <Badge className="bg-orange-500 text-white">
                        2500 puntos
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                      <div>
                        <div className="font-semibold text-blue-900">{t('profile.freeRental')}</div>
                        <div className="text-sm text-gray-600">{t('profile.oneHourScooter')}</div>
                      </div>
                      <Badge className="bg-orange-500 text-white">
                        4000 puntos
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                      <div>
                        <div className="font-semibold text-blue-900">{t('profile.premiumFreeRental')}</div>
                        <div className="text-sm text-gray-600">{t('profile.twoHoursBike')}</div>
                      </div>
                      <Badge className="bg-orange-500 text-white">
                        6000 puntos
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <div className="text-base lg:text-lg text-blue-900">
                      <strong className="bangers-regular">{t('profile.howToEarnPoints')}</strong>
                      <ul className="mt-2 space-y-1">
                        <li>• <span className="text-orange-500 font-bold">15</span> puntos por cada euro gastado</li>
                        <li>• <span className="text-orange-500 font-bold">100</span> puntos extra por completar un alquiler</li>
                        <li>• <span className="text-orange-500 font-bold">200</span> puntos por reseña positiva</li>
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
                  <div className="relative">
                    <CardTitle className="bangers-regular text-xl lg:text-2xl text-blue-900">{t('profile.rentalHistory')}</CardTitle>
                    {alquileres.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowDeleteHistoryModal(true)}
                        className="absolute top-8 right-0 p-1 hover:bg-red-100 text-red-600 hover:text-red-700 text-lg"
                      >
                        🗑️
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {alquileres.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center">
                      <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-600 mb-2">{t('profile.noRentalsYet')}</h3>
                      <p className="text-gray-500 mb-4">{t('profile.firstRentalMessage')}</p>
                      <Link href="/alquiler">
                        <Button className="bg-orange-500 hover:bg-orange-600">
                          {t('profile.viewAvailableVehicles')}
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-4 max-h-[720px] overflow-y-auto scrollbar-hide">
                        {alquileres.map((alquiler: any) => (
                          <div key={alquiler.id} className="bg-white border-2 border-orange-500 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-200">
                            {/* Header de la tarjeta */}
                             <div className="mb-3">
                               <div className="flex items-center space-x-2 mb-2">
                                 <div className="bg-orange-500 p-2 rounded-full">
                                   <Zap className="w-4 h-4 text-white" />
                                 </div>
                                 <div className="min-w-0 flex-1">
                                   <h4 className="font-bold text-blue-900 text-base sm:text-lg truncate">{alquiler.vehiculo}</h4>
                                   <p className="text-gray-500 text-xs truncate">ID: {alquiler.id}</p>
                                 </div>
                               </div>
                               {/* Badge centrado debajo del título */}
                               <div className="flex justify-center">
                                 <div className="bg-green-500 px-2 py-1 rounded-full">
                                   {alquiler.estado === 'en_curso' && countdowns[alquiler.id]?.time > 0 ? (
                                     <span className="text-white text-xs font-semibold">
                                       {countdowns[alquiler.id]?.type === 'waiting' ? '⏳ ' : ''}
                                       {formatTime(countdowns[alquiler.id]?.time || 0)}
                                     </span>
                                   ) : alquiler.estado === 'completado' ? (
                                     <span className="text-white text-xs font-semibold">Completado</span>
                                   ) : (
                                     <span className="text-white text-xs font-semibold">Tu Alquiler</span>
                                   )}
                                 </div>
                               </div>
                             </div>
                            
                            {/* Información principal */}
                            <div className="grid grid-cols-2 gap-3 mb-3">
                              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                                <div className="flex items-center space-x-2 mb-1">
                                  <Calendar className="w-4 h-4 text-orange-500" />
                                  <span className="text-blue-700 text-xs">{t('profile.date')}</span>
                                </div>
                                <p className="font-bold text-blue-900 text-sm break-words">{alquiler.fecha}</p>
                              </div>
                              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                                <div className="flex items-center space-x-2 mb-1">
                                  <Clock className="w-4 h-4 text-orange-500" />
                                  <span className="text-blue-700 text-xs">{t('profile.duration')}</span>
                                </div>
                                <p className="font-bold text-blue-900 whitespace-nowrap">{alquiler.duracion}</p>
                              </div>
                            </div>
                            
                            {/* Precio y puntos */}
                            <div className="flex justify-between items-center bg-orange-100 border border-orange-300 rounded-lg p-3 mb-3">
                              <div className="flex items-center space-x-2">
                                <span className="text-2xl">💰</span>
                                <div>
                                  <p className="text-blue-700 text-xs">{t('profile.price')}</p>
                                  <p className="font-bold text-blue-900 text-lg">{alquiler.precio}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-2xl">⭐</span>
                                <div>
                                  <p className="text-blue-700 text-xs">{t('profile.points')}</p>
                                  <p className="font-bold text-orange-600 text-lg -ml-2">+{alquiler.puntos}</p>
                                </div>
                              </div>
                            </div>
                            
                            {/* Código de verificación */}
                            {alquiler.verificationCode && (
                              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-2">
                                    <Key className="w-4 h-4 text-blue-500" />
                                    <div>
                                      <p className="text-blue-700 text-xs font-medium">Código de Verificación</p>
                                      <p className="font-bold text-blue-900 text-base font-mono tracking-wider break-all">{alquiler.verificationCode}</p>
                                      <p className="text-blue-600 text-xs">
                                        {alquiler.isVerified ? '✅ Verificado por el administrador' : '⏳ Pendiente de verificación'}
                                      </p>
                                    </div>
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      navigator.clipboard.writeText(alquiler.verificationCode || '')
                                      // Aquí podrías agregar un toast de confirmación
                                    }}
                                    className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                                  >
                                    <Copy className="w-4 h-4" />
                                  </Button>
                                </div>
                                <div className="mt-2 p-2 bg-blue-100 rounded text-xs text-blue-700">
                                  💡 Presenta este código en la tienda física para completar tu alquiler y recibir tus puntos.
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-6 text-center">
                        <Button 
                          variant="outline" 
                          className="border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white"
                          onClick={() => setShowPointsModal(true)}
                        >
                          Ver puntos
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
                  <CardTitle className="bangers-regular text-xl lg:text-2xl text-blue-900">{t('profile.achievements')}</CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="max-h-[740px] overflow-y-auto scrollbar-hide space-y-2">
                    {/* Logro 1: Primer Viaje */}
                    <Card className={`border-2 ${calcularTotalAlquileres() >= 1 ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-gray-50 opacity-60'}`}>
                      <CardContent className="p-2 flex items-center space-x-3">
                        <div className={`text-2xl ${calcularTotalAlquileres() >= 1 ? '' : 'grayscale'}`}>🚀</div>
                        <div className="flex-1">
                          <h3 className={`font-bold text-sm lg:text-base ${calcularTotalAlquileres() >= 1 ? '' : 'text-gray-500'}`}>{t('profile.firstTrip')}</h3>
                          <p className={`text-sm lg:text-base ${calcularTotalAlquileres() >= 1 ? 'text-gray-600' : 'text-gray-500'}`}>{t('profile.firstTripDesc')}</p>
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
                          <h3 className={`font-bold text-sm lg:text-base ${calcularKmTotales() >= 10 ? '' : 'text-gray-500'}`}>{t('profile.explorer')}</h3>
                          <p className={`text-sm lg:text-base ${calcularKmTotales() >= 10 ? 'text-gray-600' : 'text-gray-500'}`}>{t('profile.explorerDesc')}</p>
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
                          <h3 className={`font-bold text-sm lg:text-base ${parseFloat(calcularCO2Ahorrado()) >= 1 ? '' : 'text-gray-500'}`}>{t('profile.ecoBeginner')}</h3>
                          <p className={`text-sm lg:text-base ${parseFloat(calcularCO2Ahorrado()) >= 1 ? 'text-gray-600' : 'text-gray-500'}`}>{t('profile.ecoBeginnerDesc')}</p>
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
                          <h3 className={`font-bold text-sm lg:text-base ${calcularTotalAlquileres() >= 5 ? '' : 'text-gray-500'}`}>{t('profile.frequent')}</h3>
                          <p className={`text-sm lg:text-base ${calcularTotalAlquileres() >= 5 ? 'text-gray-600' : 'text-gray-500'}`}>{t('profile.frequentDesc')}</p>
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
                          <h3 className={`font-bold text-sm lg:text-base ${calcularKmTotales() >= 50 ? '' : 'text-gray-500'}`}>{t('profile.adventurer')}</h3>
                          <p className={`text-sm lg:text-base ${calcularKmTotales() >= 50 ? 'text-gray-600' : 'text-gray-500'}`}>{t('profile.adventurerDesc')}</p>
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
                          <h3 className={`font-bold text-sm lg:text-base ${parseFloat(calcularCO2Ahorrado()) >= 10 ? '' : 'text-gray-500'}`}>{t('profile.ecoConscious')}</h3>
                          <p className={`text-sm lg:text-base ${parseFloat(calcularCO2Ahorrado()) >= 10 ? 'text-gray-600' : 'text-gray-500'}`}>{t('profile.ecoConsciousDesc')}</p>
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
                          <h3 className={`font-bold text-sm lg:text-base ${calcularTotalAlquileres() >= 10 ? '' : 'text-gray-500'}`}>{t('profile.habitual')}</h3>
                          <p className={`text-sm lg:text-base ${calcularTotalAlquileres() >= 10 ? 'text-gray-600' : 'text-gray-500'}`}>{t('profile.habitualDesc')}</p>
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
                          <h3 className={`font-bold text-sm lg:text-base ${calcularKmTotales() >= 100 ? '' : 'text-gray-500'}`}>{t('profile.traveler')}</h3>
                          <p className={`text-sm lg:text-base ${calcularKmTotales() >= 100 ? 'text-gray-600' : 'text-gray-500'}`}>{t('profile.travelerDesc')}</p>
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
                          <h3 className={`font-bold text-sm lg:text-base ${parseFloat(calcularCO2Ahorrado()) >= 25 ? '' : 'text-gray-500'}`}>{t('profile.ecoDefender')}</h3>
                          <p className={`text-sm lg:text-base ${parseFloat(calcularCO2Ahorrado()) >= 25 ? 'text-gray-600' : 'text-gray-500'}`}>{t('profile.ecoDefenderDesc')}</p>
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
                          <h3 className={`font-bold text-sm lg:text-base ${calcularTotalAlquileres() >= 20 ? '' : 'text-gray-500'}`}>{t('profile.veteran')}</h3>
                          <p className={`text-sm lg:text-base ${calcularTotalAlquileres() >= 20 ? 'text-gray-600' : 'text-gray-500'}`}>{t('profile.veteranDesc')}</p>
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
                          <h3 className={`font-bold text-sm lg:text-base ${calcularKmTotales() >= 200 ? '' : 'text-gray-500'}`}>{t('profile.nomad')}</h3>
                          <p className={`text-sm lg:text-base ${calcularKmTotales() >= 200 ? 'text-gray-600' : 'text-gray-500'}`}>{t('profile.nomadDesc')}</p>
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
                          <h3 className={`font-bold text-sm lg:text-base ${parseFloat(calcularCO2Ahorrado()) >= 50 ? '' : 'text-gray-500'}`}>{t('profile.ecoHero')}</h3>
                          <p className={`text-sm lg:text-base ${parseFloat(calcularCO2Ahorrado()) >= 50 ? 'text-gray-600' : 'text-gray-500'}`}>{t('profile.ecoHeroDesc')}</p>
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
                          <h3 className={`font-bold text-sm lg:text-base ${calcularTotalAlquileres() >= 30 ? '' : 'text-gray-500'}`}>{t('profile.expert')}</h3>
                          <p className={`text-sm lg:text-base ${calcularTotalAlquileres() >= 30 ? 'text-gray-600' : 'text-gray-500'}`}>{t('profile.expertDesc')}</p>
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
                          <h3 className={`font-bold text-sm lg:text-base ${calcularKmTotales() >= 300 ? '' : 'text-gray-500'}`}>{t('profile.urbanExplorer')}</h3>
                          <p className={`text-sm lg:text-base ${calcularKmTotales() >= 300 ? 'text-gray-600' : 'text-gray-500'}`}>{t('profile.urbanExplorerDesc')}</p>
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
                          <h3 className={`font-bold text-sm lg:text-base ${parseFloat(calcularCO2Ahorrado()) >= 100 ? '' : 'text-gray-500'}`}>{t('profile.ecoWarrior')}</h3>
                          <p className={`text-sm lg:text-base ${parseFloat(calcularCO2Ahorrado()) >= 100 ? 'text-gray-600' : 'text-gray-500'}`}>{t('profile.ecoWarriorDesc')}</p>
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
                          <h3 className={`font-bold text-sm lg:text-base ${calcularTotalAlquileres() >= 40 ? '' : 'text-gray-500'}`}>{t('profile.master')}</h3>
                          <p className={`text-sm lg:text-base ${calcularTotalAlquileres() >= 40 ? 'text-gray-600' : 'text-gray-500'}`}>{t('profile.masterDesc')}</p>
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
                          <h3 className={`font-bold text-sm lg:text-base ${calcularKmTotales() >= 500 ? '' : 'text-gray-500'}`}>{t('profile.speedster')}</h3>
                          <p className={`text-sm lg:text-base ${calcularKmTotales() >= 500 ? 'text-gray-600' : 'text-gray-500'}`}>{t('profile.speedsterDesc')}</p>
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
                          <h3 className={`font-bold text-sm lg:text-base ${calcularTotalAlquileres() >= 50 ? '' : 'text-gray-500'}`}>{t('profile.marathoner')}</h3>
                          <p className={`text-sm lg:text-base ${calcularTotalAlquileres() >= 50 ? 'text-gray-600' : 'text-gray-500'}`}>{t('profile.marathonerDesc')}</p>
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
                          <h3 className={`font-bold text-sm lg:text-base ${parseFloat(calcularCO2Ahorrado()) >= 200 ? '' : 'text-gray-500'}`}>{t('profile.ecoLegend')}</h3>
                          <p className={`text-sm lg:text-base ${parseFloat(calcularCO2Ahorrado()) >= 200 ? 'text-gray-600' : 'text-gray-500'}`}>{t('profile.ecoLegendDesc')}</p>
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
                          <h3 className={`font-bold text-sm lg:text-base ${calcularKmTotales() >= 1000 ? '' : 'text-gray-500'}`}>{t('profile.superTraveler')}</h3>
                          <p className={`text-sm lg:text-base ${calcularKmTotales() >= 1000 ? 'text-gray-600' : 'text-gray-500'}`}>{t('profile.superTravelerDesc')}</p>
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
                          <h3 className={`font-bold text-sm lg:text-base ${calcularTotalAlquileres() >= 100 ? '' : 'text-gray-500'}`}>{t('profile.centurion')}</h3>
                          <p className={`text-sm lg:text-base ${calcularTotalAlquileres() >= 100 ? 'text-gray-600' : 'text-gray-500'}`}>{t('profile.centurionDesc')}</p>
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
                          <h3 className={`font-bold text-sm lg:text-base ${parseFloat(calcularCO2Ahorrado()) >= 500 ? '' : 'text-gray-500'}`}>{t('profile.ecoGod')}</h3>
                          <p className={`text-sm lg:text-base ${parseFloat(calcularCO2Ahorrado()) >= 500 ? 'text-gray-600' : 'text-gray-500'}`}>{t('profile.ecoGodDesc')}</p>
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
      


      {/* Modal de Puntos */}
      {showPointsModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Header del Modal */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 p-2 rounded-full">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div>
                     <h2 className="bangers-regular text-2xl text-white drop-shadow-lg" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>Sistema de Puntos</h2>
                     <p className="text-orange-100 text-sm">Tu progreso hacia las recompensas</p>
                   </div>
                </div>
                <button 
                  onClick={() => setShowPointsModal(false)}
                  className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Puntos Actuales */}
              <div className="text-center mb-8">
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200">
                  <div className="text-4xl font-bold text-orange-600 mb-2">{stats.puntosTotales}</div>
                  <div className="text-orange-700 font-medium">Puntos Totales</div>
                  <div className="text-sm text-gray-600 mt-2">
                    Ganados en {stats.alquileresCompletados} alquileres completados
                  </div>
                </div>
              </div>

              {/* Cómo Ganar Puntos */}
              <div className="mb-8">
                 <h3 className="bangers-regular text-xl text-blue-900 mb-4">💰 Cómo Ganar Puntos</h3>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-500 p-2 rounded-full">
                        <span className="text-white text-sm font-bold">15</span>
                      </div>
                      <div>
                        <div className="font-semibold text-blue-900">Por cada euro gastado</div>
                        <div className="text-sm text-gray-600">En cualquier alquiler</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-center space-x-3">
                      <div className="bg-green-500 p-2 rounded-full">
                        <span className="text-white text-sm font-bold">100</span>
                      </div>
                      <div>
                        <div className="font-semibold text-green-900">Por completar alquiler</div>
                        <div className="text-sm text-gray-600">Bonus por finalizar</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <div className="flex items-center space-x-3">
                      <div className="bg-purple-500 p-2 rounded-full">
                        <span className="text-white text-sm font-bold">200</span>
                      </div>
                      <div>
                        <div className="font-semibold text-purple-900">Por reseña positiva</div>
                        <div className="text-sm text-gray-600">Ayuda a otros usuarios</div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Progreso hacia Recompensas */}
              <div>
                <h3 className="bangers-regular text-xl text-blue-900 mb-4">🎯 Progreso hacia Recompensas</h3>
                <div className="space-y-4">
                  {/* Descuento 5€ */}
                  <div className={`rounded-xl p-4 border-2 ${
                    stats.puntosTotales >= 1500 
                      ? 'bg-green-50 border-green-300' 
                      : 'bg-gray-50 border-gray-300'
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`text-2xl ${
                          stats.puntosTotales >= 1500 ? '' : 'grayscale'
                        }`}>🎫</div>
                        <div>
                          <div className="font-bold text-blue-900">Descuento 5€</div>
                          <div className="text-sm text-gray-600">En tu próximo alquiler</div>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                        stats.puntosTotales >= 1500 
                          ? 'bg-green-500 text-white' 
                          : 'bg-orange-500 text-white'
                      }`}>
                        {stats.puntosTotales >= 1500 ? '✓ Desbloqueado' : '1500 puntos'}
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          stats.puntosTotales >= 1500 ? 'bg-green-500' : 'bg-orange-500'
                        }`}
                        style={{
                          width: `${Math.min((stats.puntosTotales / 1500) * 100, 100)}%`
                        }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {stats.puntosTotales >= 1500 
                        ? 'Recompensa disponible' 
                        : `${1500 - stats.puntosTotales} puntos restantes`
                      }
                    </div>
                  </div>

                  {/* Descuento 10€ */}
                  <div className={`rounded-xl p-4 border-2 ${
                    stats.puntosTotales >= 2500 
                      ? 'bg-green-50 border-green-300' 
                      : 'bg-gray-50 border-gray-300'
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`text-2xl ${
                          stats.puntosTotales >= 2500 ? '' : 'grayscale'
                        }`}>🎟️</div>
                        <div>
                          <div className="font-bold text-blue-900">Descuento 10€</div>
                          <div className="text-sm text-gray-600">En tu próximo alquiler</div>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                        stats.puntosTotales >= 2500 
                          ? 'bg-green-500 text-white' 
                          : 'bg-orange-500 text-white'
                      }`}>
                        {stats.puntosTotales >= 2500 ? '✓ Desbloqueado' : '2500 puntos'}
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          stats.puntosTotales >= 2500 ? 'bg-green-500' : 'bg-orange-500'
                        }`}
                        style={{
                          width: `${Math.min((stats.puntosTotales / 2500) * 100, 100)}%`
                        }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {stats.puntosTotales >= 2500 
                        ? 'Recompensa disponible' 
                        : `${2500 - stats.puntosTotales} puntos restantes`
                      }
                    </div>
                  </div>

                  {/* Alquiler Gratis */}
                  <div className={`rounded-xl p-4 border-2 ${
                    stats.puntosTotales >= 4000 
                      ? 'bg-green-50 border-green-300' 
                      : 'bg-gray-50 border-gray-300'
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`text-2xl ${
                          stats.puntosTotales >= 4000 ? '' : 'grayscale'
                        }`}>🆓</div>
                        <div>
                          <div className="font-bold text-blue-900">Alquiler Gratis</div>
                          <div className="text-sm text-gray-600">1 hora de patinete</div>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                        stats.puntosTotales >= 4000 
                          ? 'bg-green-500 text-white' 
                          : 'bg-orange-500 text-white'
                      }`}>
                        {stats.puntosTotales >= 4000 ? '✓ Desbloqueado' : '4000 puntos'}
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          stats.puntosTotales >= 4000 ? 'bg-green-500' : 'bg-orange-500'
                        }`}
                        style={{
                          width: `${Math.min((stats.puntosTotales / 4000) * 100, 100)}%`
                        }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {stats.puntosTotales >= 4000 
                        ? 'Recompensa disponible' 
                        : `${4000 - stats.puntosTotales} puntos restantes`
                      }
                    </div>
                  </div>

                  {/* Alquiler Premium Gratis */}
                  <div className={`rounded-xl p-4 border-2 ${
                    stats.puntosTotales >= 6000 
                      ? 'bg-green-50 border-green-300' 
                      : 'bg-gray-50 border-gray-300'
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`text-2xl ${
                          stats.puntosTotales >= 6000 ? '' : 'grayscale'
                        }`}>👑</div>
                        <div>
                          <div className="font-bold text-blue-900">Alquiler Premium Gratis</div>
                          <div className="text-sm text-gray-600">2 horas de moto eléctrica</div>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                        stats.puntosTotales >= 6000 
                          ? 'bg-green-500 text-white' 
                          : 'bg-orange-500 text-white'
                      }`}>
                        {stats.puntosTotales >= 6000 ? '✓ Desbloqueado' : '6000 puntos'}
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          stats.puntosTotales >= 6000 ? 'bg-green-500' : 'bg-orange-500'
                        }`}
                        style={{
                          width: `${Math.min((stats.puntosTotales / 6000) * 100, 100)}%`
                        }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {stats.puntosTotales >= 6000 
                        ? 'Recompensa disponible' 
                        : `${6000 - stats.puntosTotales} puntos restantes`
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de confirmación para borrar historial */}
      {showDeleteHistoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl border-4 border-orange-500">
            <div className="text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <h2 className="bangers-regular text-2xl text-red-600 mb-4">
                ¿Estás seguro que quieres eliminar el historial?
              </h2>
              <p className="text-blue-700 mb-6">
                Esta acción no se puede deshacer. Se borrarán todos tus alquileres y estadísticas.
              </p>
              <div className="flex space-x-3">
                <Button
                  onClick={() => setShowDeleteHistoryModal(false)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white bangers-regular text-lg"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleDeleteHistory}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white bangers-regular text-lg"
                >
                  Sí, Borrar Todo
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}