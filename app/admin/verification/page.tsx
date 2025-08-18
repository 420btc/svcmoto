'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  Car, 
  AlertTriangle,
  Eye,
  EyeOff,
  LogOut,
  Search,
  Gift,
  Home,
  BarChart3,
  TrendingUp,
  Calendar,
  Phone,
  Mail,
  MapPin
} from 'lucide-react'
import { formatVerificationCode, isValidVerificationCode } from '@/lib/verification'
import Link from 'next/link'

interface VerificationResult {
  success: boolean
  booking?: {
    id: string
    userId: string
    vehicleType: string
    vehicleId: string
    startAt: string
    endAt: string
    totalPrice: number
    status: string
    verificationCode: string
    isVerified: boolean
    user: {
      name: string
      email: string
      phone?: string
    }
  }
  pointsAwarded?: number
  message?: string
  error?: string
}

interface RecentVerification {
  id: string
  verificationCode: string
  verifiedAt: string
  pointsAwarded: number
  booking: {
    vehicleType: string
    vehicleId: string
    startAt: string
    endAt: string
    totalPrice: number
    duration: number
    user: {
      name: string
      email: string
      phone?: string
    }
  }
}

interface AdminStats {
  totalVerifications: number
  totalRevenue: number
  totalPointsAwarded: number
  verificationsByDay: { date: string; count: number }[]
  vehicleTypeStats: { type: string; count: number; percentage: number }[]
  recentActivity: RecentVerification[]
}

export default function AdminVerificationPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [authError, setAuthError] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [recentVerifications, setRecentVerifications] = useState<RecentVerification[]>([])
  const [loading, setLoading] = useState(false)
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null)
  const [currentView, setCurrentView] = useState<'verification' | 'stats' | 'discounts'>('verification')
  const [allVerifications, setAllVerifications] = useState<RecentVerification[]>([])
  const [discountCode, setDiscountCode] = useState('')
  const [discountResult, setDiscountResult] = useState<any>(null)
  const [isValidatingDiscount, setIsValidatingDiscount] = useState(false)

  // Load authentication state from localStorage
  useEffect(() => {
    const savedAuth = localStorage.getItem('adminAuthenticated')
    if (savedAuth === 'true') {
      setIsAuthenticated(true)
    }
    
    // Clear any existing sample data
    const existingData = localStorage.getItem('adminAllVerifications')
    if (existingData) {
      try {
        const data = JSON.parse(existingData)
        // Remove any data with sample- prefix
        const realData = data.filter((item: any) => !item.id.startsWith('sample-'))
        localStorage.setItem('adminAllVerifications', JSON.stringify(realData))
        setAllVerifications(realData)
      } catch (error) {
        console.error('Error cleaning sample data:', error)
        localStorage.removeItem('adminAllVerifications')
        setAllVerifications([])
      }
    }
    
    // Clear any cached stats to force recalculation
    localStorage.removeItem('adminStats')
    localStorage.removeItem('adminRecentVerifications')
  }, [])

  // Load recent verifications and stats on authentication
  useEffect(() => {
    if (isAuthenticated) {
      loadRecentVerifications()
      loadAdminStats()
      loadAllVerifications()
      // Refresh every 30 seconds
      const interval = setInterval(() => {
        loadRecentVerifications()
        loadAdminStats()
      }, 30000)
      return () => clearInterval(interval)
    }
  }, [isAuthenticated])

  // Save authentication state to localStorage
  useEffect(() => {
    localStorage.setItem('adminAuthenticated', isAuthenticated.toString())
  }, [isAuthenticated])

  const loadRecentVerifications = async () => {
    try {
      const response = await fetch('/api/admin/verifications')
      if (response.ok) {
        const data = await response.json()
        const verifications = data.recentVerifications || []
        setRecentVerifications(verifications)
        
        // Save to localStorage for persistence
        localStorage.setItem('adminRecentVerifications', JSON.stringify(verifications))
      } else {
        // Load from localStorage if API fails
        const saved = localStorage.getItem('adminRecentVerifications')
        if (saved) {
          setRecentVerifications(JSON.parse(saved))
        }
      }
    } catch (error) {
      console.error('Error loading recent verifications:', error)
      // Load from localStorage on error
      const saved = localStorage.getItem('adminRecentVerifications')
      if (saved) {
        setRecentVerifications(JSON.parse(saved))
      }
    }
  }

  const loadAllVerifications = async () => {
    try {
      const response = await fetch('/api/admin/all-verifications')
      if (response.ok) {
        const data = await response.json()
        const allVers = data.allVerifications || []
        setAllVerifications(allVers)
        localStorage.setItem('adminAllVerifications', JSON.stringify(allVers))
      } else {
        const saved = localStorage.getItem('adminAllVerifications')
        if (saved) {
          setAllVerifications(JSON.parse(saved))
        }
      }
    } catch (error) {
      console.error('Error loading all verifications:', error)
      const saved = localStorage.getItem('adminAllVerifications')
      if (saved) {
        setAllVerifications(JSON.parse(saved))
      }
    }
  }

  const loadAdminStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      if (response.ok) {
        const data = await response.json()
        setAdminStats(data)
        localStorage.setItem('adminStats', JSON.stringify(data))
      } else {
        // Generate stats from local data if API fails
        generateLocalStats()
      }
    } catch (error) {
      console.error('Error loading admin stats:', error)
      generateLocalStats()
    }
  }

  const generateLocalStats = () => {
    let verifications = allVerifications
    
    // If no verifications in state, try to load from localStorage
    if (verifications.length === 0) {
      const saved = localStorage.getItem('adminAllVerifications')
      if (saved) {
        verifications = JSON.parse(saved)
        setAllVerifications(verifications)
      }
    }
    
    const stats = calculateStatsFromVerifications(verifications)
    setAdminStats(stats)
    localStorage.setItem('adminStats', JSON.stringify(stats))
  }

  const calculateStatsFromVerifications = (verifications: RecentVerification[]): AdminStats => {
    const totalVerifications = verifications.length
    const totalRevenue = verifications.reduce((sum, v) => sum + v.booking.totalPrice, 0)
    const totalPointsAwarded = verifications.reduce((sum, v) => sum + v.pointsAwarded, 0)
    
    // Group by day for line chart
    const verificationsByDay = verifications.reduce((acc, v) => {
      const date = new Date(v.verifiedAt).toISOString().split('T')[0]
      const existing = acc.find(item => item.date === date)
      if (existing) {
        existing.count++
      } else {
        acc.push({ date, count: 1 })
      }
      return acc
    }, [] as { date: string; count: number }[])
    
    // Group by vehicle type for donut chart
    const vehicleTypeCounts = verifications.reduce((acc, v) => {
      const type = v.booking.vehicleType
      acc[type] = (acc[type] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    const vehicleTypeStats = Object.entries(vehicleTypeCounts).map(([type, count]) => ({
      type,
      count,
      percentage: Math.round((count / totalVerifications) * 100)
    }))
    
    return {
      totalVerifications,
      totalRevenue,
      totalPointsAwarded,
      verificationsByDay: verificationsByDay.slice(-7), // Last 7 days
      vehicleTypeStats,
      recentActivity: verifications.slice(0, 10)
    }
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError('')
    
    if (!password.trim()) {
      setAuthError('Por favor ingresa la contraseña')
      return
    }
    
    if (password !== '420420.420') {
      setAuthError('Contraseña incorrecta')
      return
    }
    
    setIsAuthenticated(true)
    setAuthError('')
    localStorage.setItem('adminAuthenticated', 'true')
    localStorage.setItem('adminLoginTime', new Date().toISOString())
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setPassword('')
    setVerificationCode('')
    setVerificationResult(null)
    setRecentVerifications([])
    setAdminStats(null)
    setAllVerifications([])
    localStorage.setItem('adminAuthenticated', 'false')
  }

  // Validar código de descuento
  const handleDiscountValidation = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!discountCode.trim()) return

    setIsValidatingDiscount(true)
    setDiscountResult(null)

    try {
      const response = await fetch('/api/discounts/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          discountCode: discountCode.trim(),
          adminId: 'admin'
        })
      })

      const data = await response.json()
      setDiscountResult({
        success: response.ok,
        ...data
      })

      if (response.ok) {
        setDiscountCode('')
      }
    } catch (error) {
      setDiscountResult({
        success: false,
        error: 'Error de conexión'
      })
    }

    setIsValidatingDiscount(false)
  }

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!verificationCode.trim()) {
      setVerificationResult({
        success: false,
        error: 'Por favor ingresa un código de verificación'
      })
      return
    }

    if (!isValidVerificationCode(verificationCode)) {
      setVerificationResult({
        success: false,
        error: 'El código debe tener 6 dígitos'
      })
      return
    }

    setIsVerifying(true)
    setLoading(true)
    
    try {
      const response = await fetch('/api/admin/verify-booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          verificationCode: verificationCode.trim()
        }),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setVerificationResult({
          success: true,
          ...data,
        })
        
        // Save verification to localStorage
        const newVerification: RecentVerification = {
          id: data.booking?.id || Date.now().toString(),
          verificationCode: verificationCode.trim(),
          verifiedAt: new Date().toISOString(),
          pointsAwarded: data.pointsAwarded || 0,
          booking: {
            vehicleType: data.booking?.vehicleType || '',
            vehicleId: data.booking?.vehicleId || '',
            startAt: data.booking?.startAt || '',
            endAt: data.booking?.endAt || '',
            totalPrice: data.booking?.totalPrice || 0,
            duration: data.booking?.duration || 1,
            user: {
              name: data.booking?.user?.name || '',
              email: data.booking?.user?.email || '',
              phone: data.booking?.user?.phone
            }
          }
        }
        
        // Update localStorage with new verification
        const savedAll = localStorage.getItem('adminAllVerifications')
        const allVers = savedAll ? JSON.parse(savedAll) : []
        allVers.unshift(newVerification)
        localStorage.setItem('adminAllVerifications', JSON.stringify(allVers))
        setAllVerifications(allVers)
        
        // Refresh recent verifications and stats
        loadRecentVerifications()
        loadAdminStats()
        // Clear the input
        setVerificationCode('')
      } else {
        setVerificationResult({
          success: false,
          error: data.error || 'Error al verificar el código',
        })
      }
    } catch (error) {
      setVerificationResult({
        success: false,
        error: 'Error de conexión',
      })
    } finally {
      setIsVerifying(false)
      setLoading(false)
      
      // Auto-clear result after 10 seconds
      setTimeout(() => {
        setVerificationResult(null)
      }, 10000)
    }
  }

  const formatDateTime = (dateString: string) => {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Madrid',
    }).format(new Date(dateString))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'VERIFIED':
        return 'bg-blue-100 text-blue-800'
      case 'COMPLETED':
        return 'bg-green-100 text-green-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Pendiente'
      case 'VERIFIED':
        return 'Verificada'
      case 'COMPLETED':
        return 'Completada'
      case 'CANCELLED':
        return 'Cancelada'
      default:
        return status
    }
  }

  // Authentication screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl border-0 py-0 overflow-hidden">
          <CardHeader className="text-center bg-gradient-to-r from-orange-500 to-orange-600 text-white m-0 p-6">
            <CardTitle className="flex items-center justify-center text-2xl bangers-regular m-0">
              <Shield className="w-8 h-8 mr-2" />
              Panel Admin
            </CardTitle>
            <p className="text-orange-100 m-0">Verificación de Reservas SVC MOTO</p>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleAuth} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-blue-900">
                  Contraseña de Administrador
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Ingresa la contraseña"
                    className="pr-10 border-2 border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-orange-400 hover:text-orange-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              {authError && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">{authError}</AlertDescription>
                </Alert>
              )}
              
              <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white shadow-lg bangers-regular text-lg">
                Acceder al Panel
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Main admin interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
          {/* Mobile Header */}
          <div className="block md:hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Shield className="w-8 h-8 mr-3 text-orange-400" />
                <div>
                  <h1 className="bangers-regular text-xl text-white drop-shadow-lg">Panel Admin SVC MOTO</h1>
                  <p className="text-blue-200 text-sm">Verificación y estadísticas</p>
                </div>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="border-white text-white hover:bg-white hover:text-blue-900 shadow-lg"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Mobile Navigation */}
            <div className="flex flex-col space-y-2">
              <Link href="/" className="w-full">
                <Button
                  variant="outline"
                  className="w-full border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-white shadow-lg"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Menú Principal
                </Button>
              </Link>
              
              <div className="grid grid-cols-3 gap-2">
                <Button
                  onClick={() => setCurrentView('verification')}
                  className={`shadow-lg ${
                    currentView === 'verification'
                      ? 'bg-orange-500 hover:bg-orange-600 text-white'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  <Search className="w-4 h-4 mr-1" />
                  <span className="text-xs">Verificar</span>
                </Button>
                <Button
                  onClick={() => setCurrentView('stats')}
                  className={`shadow-lg ${
                    currentView === 'stats'
                      ? 'bg-orange-500 hover:bg-orange-600 text-white'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  <BarChart3 className="w-4 h-4 mr-1" />
                  <span className="text-xs">Stats</span>
                </Button>
                <Button
                  onClick={() => setCurrentView('discounts')}
                  className={`shadow-lg ${
                    currentView === 'discounts'
                      ? 'bg-orange-500 hover:bg-orange-600 text-white'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  <Gift className="w-4 h-4 mr-1" />
                  <span className="text-xs">Descuentos</span>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Desktop Header */}
          <div className="hidden md:block">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Shield className="w-10 h-10 mr-4 text-orange-400" />
                <div>
                  <h1 className="bangers-regular text-3xl text-white drop-shadow-lg">Panel de Administración SVC MOTO</h1>
                  <p className="text-blue-200">Sistema de verificación y estadísticas</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Link href="/" className="flex items-center">
                  <Button
                    variant="outline"
                    className="border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-white shadow-lg"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Menú Principal
                  </Button>
                </Link>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-blue-900 shadow-lg"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Salir
                </Button>
              </div>
            </div>
            
            {/* Desktop Navigation Tabs */}
            <div className="mt-6 flex space-x-4">
              <Button
                onClick={() => setCurrentView('verification')}
                className={`shadow-lg ${
                  currentView === 'verification'
                    ? 'bg-orange-500 hover:bg-orange-600 text-white'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <Search className="w-4 h-4 mr-2" />
                Verificación
              </Button>
              <Button
                onClick={() => setCurrentView('stats')}
                className={`shadow-lg ${
                  currentView === 'stats'
                    ? 'bg-orange-500 hover:bg-orange-600 text-white'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Estadísticas
              </Button>
              <Button
                onClick={() => setCurrentView('discounts')}
                className={`shadow-lg ${
                  currentView === 'discounts'
                    ? 'bg-orange-500 hover:bg-orange-600 text-white'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <Gift className="w-4 h-4 mr-2" />
                Descuentos
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 min-h-[calc(100vh-200px)]">
        {currentView === 'verification' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Verification Section */}
              <Card className="shadow-xl border-0 bg-white/95 backdrop-blur overflow-hidden py-0">
                  <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white m-0 p-6 px-6">
                    <CardTitle className="flex items-center bangers-regular text-xl m-0">
                      <Search className="w-6 h-6 mr-2" />
                      Verificar Código de Reserva
                    </CardTitle>
                  </CardHeader>
                <CardContent className="p-6">
                <form onSubmit={handleVerification} className="space-y-6">
                  <div className="space-y-3">
                    <label htmlFor="code" className="text-sm font-medium text-blue-900">
                      Código de Verificación (6 dígitos)
                    </label>
                    <Input
                      id="code"
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      placeholder="123 456"
                      maxLength={7}
                      className="text-center text-xl font-mono border-2 border-orange-200 focus:border-orange-500 focus:ring-orange-500 py-4"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white shadow-lg bangers-regular text-lg py-3" 
                    disabled={isVerifying}
                  >
                    {isVerifying ? 'Verificando...' : 'Verificar Código'}
                  </Button>
                </form>

                {/* Verification Result */}
                {verificationResult && (
                  <div className="mt-6">
                    <Alert className={`shadow-lg ${
                      verificationResult.success 
                        ? 'border-green-200 bg-green-50' 
                        : 'border-red-200 bg-red-50'
                    }`}>
                      <div className="flex items-start">
                        {verificationResult.success ? (
                          <CheckCircle className="h-6 w-6 text-green-600 mt-0.5" />
                        ) : (
                           <XCircle className="h-6 w-6 text-red-600 mt-0.5" />
                        )}
                        <div className="ml-4 flex-1">
                          <AlertDescription className={`text-base ${
                            verificationResult.success ? 'text-green-800' : 'text-red-800'
                          }`}>
                            {verificationResult.success ? (
                              <div className="space-y-3">
                                <p className="font-bold text-lg">{verificationResult.message}</p>
                                {verificationResult.booking && (
                                  <div className="bg-white/70 rounded-lg p-4 space-y-2">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                      <div className="flex items-center space-x-2">
                                        <User className="w-4 h-4 text-blue-600" />
                                        <span><strong>Cliente:</strong> {verificationResult.booking.user.name}</span>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <Mail className="w-4 h-4 text-blue-600" />
                                        <span><strong>Email:</strong> {verificationResult.booking.user.email}</span>
                                      </div>
                                      {verificationResult.booking.user.phone && (
                                        <div className="flex items-center space-x-2">
                                          <Phone className="w-4 h-4 text-blue-600" />
                                          <span><strong>Teléfono:</strong> {verificationResult.booking.user.phone}</span>
                                        </div>
                                      )}
                                      <div className="flex items-center space-x-2">
                                        <Car className="w-4 h-4 text-blue-600" />
                                        <span><strong>Vehículo:</strong> {verificationResult.booking.vehicleType} {verificationResult.booking.vehicleId}</span>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <span><strong>Precio:</strong> €{verificationResult.booking.totalPrice}</span>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <span><strong>Estado:</strong> 
                                          <Badge className={`ml-2 ${getStatusColor(verificationResult.booking.status)}`}>
                                            {getStatusText(verificationResult.booking.status)}
                                          </Badge>
                                        </span>
                                      </div>
                                    </div>
                                    {verificationResult.pointsAwarded && (
                                      <div className="flex items-center justify-center bg-orange-100 rounded-lg p-3 mt-3">
                                        <Gift className="w-5 h-5 mr-2 text-orange-600" />
                                        <span className="font-bold text-orange-800 text-lg">Puntos otorgados: +{verificationResult.pointsAwarded}</span>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <p className="font-medium text-lg">{verificationResult.error}</p>
                            )}
                          </AlertDescription>
                        </div>
                      </div>
                    </Alert>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Verifications */}
             <Card className="shadow-xl border-0 bg-white/95 backdrop-blur h-full flex flex-col overflow-hidden py-0">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white m-0 p-6 px-6">
                  <CardTitle className="flex items-center bangers-regular text-xl m-0">
                    <Clock className="w-6 h-6 mr-2" />
                    Historial de Verificaciones
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 flex-1 flex flex-col">
                 <div className="space-y-4 flex-1 overflow-y-auto">
                  {recentVerifications.length ? (
                    recentVerifications.map((verification) => (
                      <div key={verification.id} className="bg-gradient-to-r from-blue-50 to-orange-50 rounded-xl p-4 shadow-lg border border-orange-200">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="bg-orange-500 p-2 rounded-full">
                              <Car className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <span className="font-bold text-blue-900">
                                {verification.booking.vehicleType} {verification.booking.vehicleId}
                              </span>
                              <Badge className="ml-2 bg-green-100 text-green-800 font-mono">
                                {formatVerificationCode(verification.verificationCode)}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-blue-600 font-medium">
                              {formatDateTime(verification.verifiedAt)}
                            </p>
                            <div className="flex items-center justify-end text-green-600">
                              <Gift className="w-4 h-4 mr-1" />
                              <span className="font-bold">+{verification.pointsAwarded} pts</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-blue-600" />
                            <span><strong>Cliente:</strong> {verification.booking.user.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-blue-600" />
                            <span><strong>Email:</strong> {verification.booking.user.email}</span>
                          </div>
                          {verification.booking.user.phone && (
                            <div className="flex items-center space-x-2">
                              <Phone className="w-4 h-4 text-blue-600" />
                              <span><strong>Teléfono:</strong> {verification.booking.user.phone}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-2">
                            <span><strong>Precio:</strong> €{verification.booking.totalPrice}</span>
                          </div>
                          {verification.booking.startAt && (
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4 text-blue-600" />
                              <span><strong>Inicio:</strong> {formatDateTime(verification.booking.startAt)}</span>
                            </div>
                          )}
                          {verification.booking.endAt && (
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4 text-blue-600" />
                              <span><strong>Fin:</strong> {formatDateTime(verification.booking.endAt)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Clock className="w-16 h-16 text-orange-300 mx-auto mb-4" />
                      <p className="text-blue-600 text-lg">No hay verificaciones recientes</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : currentView === 'stats' ? (
          /* Statistics View */
          <div className="space-y-8">
            {/* Stats Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="shadow-xl border-0 bg-gradient-to-br from-orange-500 to-orange-600 text-white overflow-hidden py-0">
                  <CardContent className="p-6 m-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm font-medium">Total Verificaciones</p>
                      <p className="text-3xl font-bold bangers-regular">
                        {adminStats?.totalVerifications || allVerifications.length}
                      </p>
                    </div>
                    <CheckCircle className="w-12 h-12 text-orange-200" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-600 to-blue-700 text-white overflow-hidden py-0">
                  <CardContent className="p-6 m-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-medium">Ingresos Totales</p>
                      <p className="text-3xl font-bold bangers-regular">
                        €{adminStats?.totalRevenue || allVerifications.reduce((sum, v) => sum + v.booking.totalPrice, 0)}
                      </p>
                    </div>
                    <TrendingUp className="w-12 h-12 text-blue-200" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-xl border-0 bg-gradient-to-br from-green-500 to-green-600 text-white overflow-hidden py-0">
                  <CardContent className="p-6 m-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm font-medium">Puntos Otorgados</p>
                      <p className="text-3xl font-bold bangers-regular">
                        {adminStats?.totalPointsAwarded || allVerifications.reduce((sum, v) => sum + v.pointsAwarded, 0)}
                      </p>
                    </div>
                    <Gift className="w-12 h-12 text-green-200" />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Charts Section */}
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               {/* Line Chart - Verificaciones por día */}
               <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-50 to-blue-100 overflow-hidden py-0">
                    <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white m-0 p-6 px-6">
                      <CardTitle className="bangers-regular text-xl flex items-center m-0">
                        <TrendingUp className="w-6 h-6 mr-2" />
                        Verificaciones por Día (Últimos 7 días)
                      </CardTitle>
                    </CardHeader>
                 <CardContent className="p-6">
                    <div className="h-80 bg-gradient-to-t from-gray-100 to-white rounded-lg p-6 border-2 border-gray-300 relative">
                      {(() => {
                        const stats = adminStats || calculateStatsFromVerifications(allVerifications)
                        let days = stats.verificationsByDay || []
                        
                        // Generate 7 days of data (last 7 days)
                        const today = new Date()
                        const last7Days = []
                        for (let i = 6; i >= 0; i--) {
                          const date = new Date(today)
                          date.setDate(date.getDate() - i)
                          const dateStr = date.toISOString().split('T')[0]
                          const existingDay = days.find(d => d.date === dateStr)
                          last7Days.push({
                            date: dateStr,
                            count: existingDay ? existingDay.count : 0,
                            dayName: date.toLocaleDateString('es-ES', { weekday: 'short' })
                          })
                        }
                        
                        if (last7Days.every(d => d.count === 0)) {
                          return (
                            <div className="flex items-center justify-center w-full h-full">
                              <div className="text-center">
                                <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500">No hay datos de verificaciones</p>
                              </div>
                            </div>
                          )
                        }
                        
                        const maxCount = Math.max(...last7Days.map(d => d.count), 1)
                        const chartHeight = 200
                        const chartWidth = 500
                        
                        return (
                          <div className="w-full h-full flex flex-col">
                            {/* Chart Area */}
                            <div className="flex-1 relative">
                              <svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="overflow-visible">
                                {/* Grid lines */}
                                {[0, 1, 2, 3, 4].map(i => {
                                  const y = (i / 4) * (chartHeight - 40) + 20
                                  const value = Math.round(maxCount - (i / 4) * maxCount)
                                  return (
                                    <g key={i}>
                                      <line 
                                        x1="40" 
                                        y1={y} 
                                        x2={chartWidth - 20} 
                                        y2={y} 
                                        stroke="#e5e7eb" 
                                        strokeWidth="1"
                                        strokeDasharray="5,5"
                                      />
                                      <text 
                                        x="35" 
                                        y={y + 4} 
                                        textAnchor="end" 
                                        className="text-xs fill-gray-600"
                                      >
                                        {value}
                                      </text>
                                    </g>
                                  )
                                })}
                                
                                {/* Line chart */}
                                <g>
                                  {/* Line path */}
                                  <path
                                    d={last7Days.map((day, index) => {
                                      const x = 40 + (index * (chartWidth - 60) / 6)
                                      const y = chartHeight - 40 - (day.count / maxCount) * (chartHeight - 60)
                                      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
                                    }).join(' ')}
                                    stroke="url(#lineGradient)"
                                    strokeWidth="3"
                                    fill="none"
                                    className="drop-shadow-sm"
                                  />
                                  
                                  {/* Area under the line */}
                                  <path
                                    d={[
                                      `M 40 ${chartHeight - 40}`,
                                      ...last7Days.map((day, index) => {
                                        const x = 40 + (index * (chartWidth - 60) / 6)
                                        const y = chartHeight - 40 - (day.count / maxCount) * (chartHeight - 60)
                                        return `L ${x} ${y}`
                                      }),
                                      `L ${40 + (6 * (chartWidth - 60) / 6)} ${chartHeight - 40}`,
                                      'Z'
                                    ].join(' ')}
                                    fill="url(#areaGradient)"
                                    opacity="0.3"
                                  />
                                  
                                  {/* Data points */}
                                  {last7Days.map((day, index) => {
                                    const x = 40 + (index * (chartWidth - 60) / 6)
                                    const y = chartHeight - 40 - (day.count / maxCount) * (chartHeight - 60)
                                    return (
                                      <g key={index}>
                                        {/* Point shadow */}
                                        <circle
                                          cx={x + 1}
                                          cy={y + 1}
                                          r="6"
                                          fill="rgba(0,0,0,0.2)"
                                        />
                                        {/* Main point */}
                                        <circle
                                          cx={x}
                                          cy={y}
                                          r="6"
                                          fill="#f97316"
                                          stroke="white"
                                          strokeWidth="3"
                                          className="cursor-pointer hover:r-8 transition-all duration-200"
                                        />
                                        {/* Value label */}
                                        <text
                                          x={x}
                                          y={y - 15}
                                          textAnchor="middle"
                                          className="text-sm font-bold fill-blue-900 bg-white"
                                        >
                                          {day.count}
                                        </text>
                                      </g>
                                    )
                                  })}
                                </g>
                                
                                {/* Gradients */}
                                <defs>
                                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#3b82f6" />
                                    <stop offset="50%" stopColor="#f97316" />
                                    <stop offset="100%" stopColor="#10b981" />
                                  </linearGradient>
                                  <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#3b82f6" />
                                    <stop offset="100%" stopColor="#f97316" />
                                  </linearGradient>
                                </defs>
                              </svg>
                            </div>
                            
                            {/* X-axis labels */}
                            <div className="flex justify-between px-10 mt-4">
                              {last7Days.map((day, index) => (
                                <div key={index} className="text-center">
                                  <p className="text-sm font-bold text-blue-900">{day.dayName}</p>
                                  <p className="text-xs text-gray-600">{new Date(day.date).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })}</p>
                                </div>
                              ))}
                            </div>
                            
                            {/* Statistics */}
                            <div className="mt-4 flex justify-center space-x-8 text-sm">
                              <div className="text-center">
                                <p className="text-gray-600">Promedio</p>
                                <p className="font-bold text-blue-900">{Math.round(last7Days.reduce((sum, d) => sum + d.count, 0) / 7)} verificaciones/día</p>
                              </div>
                              <div className="text-center">
                                <p className="text-gray-600">Máximo</p>
                                <p className="font-bold text-green-600">{maxCount} verificaciones</p>
                              </div>
                              <div className="text-center">
                                <p className="text-gray-600">Total Semanal</p>
                                <p className="font-bold text-orange-600">{last7Days.reduce((sum, d) => sum + d.count, 0)} verificaciones</p>
                              </div>
                            </div>
                          </div>
                        )
                      })()} 
                    </div>
                  </CardContent>
               </Card>
              
              {/* Donut Chart - Tipos de vehículos */}
               <Card className="shadow-xl border-0 bg-gradient-to-br from-orange-50 to-orange-100 overflow-hidden py-0">
                    <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white m-0 p-6 px-6">
                      <CardTitle className="bangers-regular text-xl flex items-center m-0">
                        <BarChart3 className="w-6 h-6 mr-2" />
                        Distribución por Tipo de Vehículo
                      </CardTitle>
                    </CardHeader>
                 <CardContent className="p-6">
                   <div className="flex items-center justify-center h-64">
                     {(() => {
                       const stats = adminStats || calculateStatsFromVerifications(allVerifications)
                       const vehicleStats = stats.vehicleTypeStats || []
                       
                       if (vehicleStats.length === 0) {
                         return (
                           <div className="text-center">
                             <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                             <p className="text-gray-500">No hay datos de vehículos</p>
                           </div>
                         )
                       }
                       
                       const total = vehicleStats.reduce((sum, v) => sum + v.count, 0)
                       
                       return (
                         <div className="relative w-56 h-56">
                           {/* Outer ring with segments */}
                           <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                             {vehicleStats.map((vehicle, index) => {
                               const colors = ['#f97316', '#3b82f6', '#10b981', '#8b5cf6', '#ef4444']
                               const strokeColor = colors[index % colors.length]
                               const radius = 80
                               const circumference = 2 * Math.PI * radius
                               const strokeDasharray = (vehicle.count / total) * circumference
                               const strokeDashoffset = -vehicleStats.slice(0, index).reduce((sum, v) => sum + (v.count / total) * circumference, 0)
                               
                               return (
                                 <circle
                                   key={index}
                                   cx="100"
                                   cy="100"
                                   r={radius}
                                   fill="none"
                                   stroke={strokeColor}
                                   strokeWidth="20"
                                   strokeDasharray={`${strokeDasharray} ${circumference}`}
                                   strokeDashoffset={strokeDashoffset}
                                   className="transition-all duration-500 hover:stroke-[25] cursor-pointer"
                                   style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))' }}
                                 />
                               )
                             })}
                           </svg>
                           
                           {/* Center content */}
                           <div className="absolute inset-0 flex items-center justify-center">
                             <div className="text-center bg-white rounded-full w-24 h-24 flex flex-col items-center justify-center shadow-lg">
                               <p className="text-2xl font-bold text-blue-900">{total}</p>
                               <p className="text-xs text-gray-600">Total</p>
                             </div>
                           </div>
                         </div>
                       )
                     })()} 
                   </div>
                   
                   <div className="mt-6 space-y-3">
                     {(() => {
                       const stats = adminStats || calculateStatsFromVerifications(allVerifications)
                       const vehicleStats = stats.vehicleTypeStats || []
                       
                       if (vehicleStats.length === 0) {
                         return (
                           <div className="text-center py-8">
                             <p className="text-gray-500">No hay datos para mostrar</p>
                           </div>
                         )
                       }
                       
                       const colors = ['bg-orange-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500']
                       
                       return vehicleStats.map((vehicle, index) => (
                         <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                           <div className="flex items-center space-x-3">
                             <div className={`w-5 h-5 rounded-full ${colors[index % colors.length]} shadow-sm`}></div>
                             <span className="text-sm font-medium text-blue-900">{vehicle.type}</span>
                           </div>
                           <div className="text-right">
                             <span className="text-lg font-bold text-blue-900">{vehicle.count}</span>
                             <span className="text-sm text-gray-600 ml-2">({vehicle.percentage}%)</span>
                           </div>
                         </div>
                       ))
                     })()} 
                   </div>
                 </CardContent>
               </Card>
            </div>
          </div>
        ) : currentView === 'discounts' ? (
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-xl border-0 bg-white/95 backdrop-blur overflow-hidden py-0">
              <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white m-0 p-6">
                <CardTitle className="flex items-center bangers-regular text-xl m-0">
                  <Gift className="w-6 h-6 mr-2" />
                  Validar Código de Descuento
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleDiscountValidation} className="space-y-6">
                  <div className="space-y-3">
                    <label htmlFor="discountCode" className="text-sm font-medium text-blue-900">
                      Código de Descuento (6 dígitos)
                    </label>
                    <Input
                      id="discountCode"
                      type="text"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      placeholder="123456"
                      maxLength={6}
                      className="text-center text-xl font-mono border-2 border-green-200 focus:border-green-500 focus:ring-green-500 py-4"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-green-500 hover:bg-green-600 text-white shadow-lg bangers-regular text-lg py-3" 
                    disabled={isValidatingDiscount || !discountCode.trim()}
                  >
                    {isValidatingDiscount ? 'Validando...' : 'Validar Descuento'}
                  </Button>
                </form>

                {/* Resultado de la validación */}
                {discountResult && (
                  <div className="mt-6">
                    {discountResult.success ? (
                      <Alert className="border-green-200 bg-green-50">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                          <div className="space-y-3">
                            <div className="font-semibold text-lg">✅ Descuento Validado Exitosamente</div>
                            
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-medium">Código:</span>
                                <div className="text-lg font-mono bg-white p-2 rounded border">
                                  {discountResult.discount.discountCode}
                                </div>
                              </div>
                              <div>
                                <span className="font-medium">Descuento:</span>
                                <div className="text-2xl font-bold text-green-600">
                                  {discountResult.discount.discountAmount}€
                                </div>
                              </div>
                              <div>
                                <span className="font-medium">Cliente:</span>
                                <div>{discountResult.discount.user.name}</div>
                                <div className="text-xs text-gray-600">{discountResult.discount.user.email}</div>
                              </div>
                              <div>
                                <span className="font-medium">Puntos usados:</span>
                                <div className="text-lg font-semibold">{discountResult.discount.pointsUsed}</div>
                              </div>
                            </div>
                            
                            <div className="bg-green-100 p-3 rounded-lg border border-green-300">
                              <div className="text-center">
                                <div className="text-lg font-bold text-green-800">Aplicar {discountResult.discount.discountAmount}€ de descuento</div>
                                <div className="text-sm text-green-600">El descuento ha sido marcado como usado</div>
                              </div>
                            </div>
                          </div>
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <Alert className="border-red-200 bg-red-50">
                        <XCircle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-800">
                          <div className="font-semibold">Error al validar descuento</div>
                          <div className="mt-2">{discountResult.error}</div>
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}

                {/* Instrucciones */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-900 mb-2">Instrucciones:</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• El cliente debe presentar el código de 6 dígitos</li>
                    <li>• Una vez validado, el descuento se marca como usado</li>
                    <li>• El descuento se aplica automáticamente al total</li>
                    <li>• Los códigos expirados o ya usados no se pueden validar</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}