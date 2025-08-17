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
  Gift
} from 'lucide-react'
import { formatVerificationCode, isValidVerificationCode } from '@/lib/verification'

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
    user: {
      name: string
    }
  }
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

  // Load recent verifications on authentication
  useEffect(() => {
    if (isAuthenticated) {
      loadRecentVerifications()
      // Refresh every 30 seconds
      const interval = setInterval(loadRecentVerifications, 30000)
      return () => clearInterval(interval)
    }
  }, [isAuthenticated])

  const loadRecentVerifications = async () => {
    try {
      const response = await fetch('/api/admin/verifications')
      if (response.ok) {
        const data = await response.json()
        setRecentVerifications(data.recentVerifications || [])
      }
    } catch (error) {
      console.error('Error loading recent verifications:', error)
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
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setPassword('')
    setVerificationCode('')
    setVerificationResult(null)
    setRecentVerifications([])
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
        // Refresh recent verifications
        loadRecentVerifications()
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center text-2xl">
              <Shield className="w-8 h-8 mr-2 text-slate-600" />
              Panel Admin
            </CardTitle>
            <p className="text-gray-600">Verificación de Reservas</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Contraseña de Administrador
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Ingresa la contraseña"
                    className="pr-10"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              {authError && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{authError}</AlertDescription>
                </Alert>
              )}
              
              <Button type="submit" className="w-full bg-slate-600 hover:bg-slate-700">
                Acceder
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Main admin interface
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Shield className="w-8 h-8 mr-3 text-slate-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Panel de Verificación</h1>
                <p className="text-sm text-gray-600">Validar códigos de reserva</p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex items-center"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Salir
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Verification Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="w-5 h-5 mr-2" />
                Verificar Código
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleVerification} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="code" className="text-sm font-medium text-gray-700">
                    Código de Verificación (6 dígitos)
                  </label>
                  <Input
                    id="code"
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="123 456"
                    maxLength={7}
                    className="text-center text-lg font-mono"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isVerifying}
                >
                  {isVerifying ? 'Verificando...' : 'Verificar Código'}
                </Button>
              </form>

              {/* Verification Result */}
              {verificationResult && (
                <div className="mt-4">
                  <Alert className={verificationResult.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                    <div className="flex items-start">
                      {verificationResult.success ? (
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                      )}
                      <div className="ml-3 flex-1">
                        <AlertDescription className={verificationResult.success ? 'text-green-800' : 'text-red-800'}>
                          {verificationResult.success ? (
                            <div className="space-y-2">
                              <p className="font-medium">{verificationResult.message}</p>
                              {verificationResult.booking && (
                                <div className="text-sm space-y-1">
                                  <p><strong>Cliente:</strong> {verificationResult.booking.user.name}</p>
                                  <p><strong>Email:</strong> {verificationResult.booking.user.email}</p>
                                  {verificationResult.booking.user.phone && (
                                    <p><strong>Teléfono:</strong> {verificationResult.booking.user.phone}</p>
                                  )}
                                  <p><strong>Vehículo:</strong> {verificationResult.booking.vehicleType} {verificationResult.booking.vehicleId}</p>
                                  <p><strong>Precio:</strong> €{verificationResult.booking.totalPrice}</p>
                                  <p><strong>Estado:</strong> 
                                    <Badge className={`ml-2 ${getStatusColor(verificationResult.booking.status)}`}>
                                      {getStatusText(verificationResult.booking.status)}
                                    </Badge>
                                  </p>
                                  {verificationResult.pointsAwarded && (
                                    <p className="flex items-center"><Gift className="w-4 h-4 mr-1" /><strong>Puntos otorgados:</strong> +{verificationResult.pointsAwarded}</p>
                                  )}
                                </div>
                              )}
                            </div>
                          ) : (
                            <p>{verificationResult.error}</p>
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Verificaciones Recientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {recentVerifications.length ? (
                  recentVerifications.map((verification) => (
                    <div key={verification.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <Car className="w-4 h-4 text-blue-500" />
                          <span className="font-medium text-sm">
                            {verification.booking.vehicleType} {verification.booking.vehicleId}
                          </span>
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          {formatVerificationCode(verification.verificationCode)}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-600">
                          {formatDateTime(verification.verifiedAt)}
                        </p>
                        <p className="text-xs text-green-600 flex items-center">
                          <Gift className="w-3 h-3 mr-1" />
                          +{verification.pointsAwarded} pts
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No hay verificaciones recientes</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}