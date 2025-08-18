'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Home, User, Download, Mail } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

interface PaymentDetails {
  sessionId: string
  amount: number
  currency: string
  customerEmail: string
  status: string
  paymentIntent: string
  metadata?: {
    type: string
    vehicleType?: string
    duration?: string
    serviceType?: string
  }
}

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (sessionId) {
      fetchPaymentDetails(sessionId)
    } else {
      setError('No se encontró ID de sesión')
      setLoading(false)
    }
  }, [sessionId])

  const fetchPaymentDetails = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/stripe/session/${sessionId}`)
      if (response.ok) {
        const data = await response.json()
        setPaymentDetails(data)
      } else {
        setError('Error al obtener detalles del pago')
      }
    } catch (error) {
      console.error('Error fetching payment details:', error)
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando tu pago...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <div className="text-red-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link href="/">
              <Button>
                <Home className="w-4 h-4 mr-2" />
                Volver al Inicio
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Confirmación de Pago */}
        <Card className="mb-8">
          <CardContent className="text-center py-8">
            <div className="text-green-500 mb-4">
              <CheckCircle className="w-16 h-16 mx-auto" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">¡Pago Exitoso!</h1>
            <p className="text-gray-600 mb-6">
              Tu pago ha sido procesado correctamente. Recibirás un email de confirmación en breve.
            </p>
            <Badge variant="default" className="bg-green-100 text-green-800">
              Pago Confirmado
            </Badge>
          </CardContent>
        </Card>

        {/* Detalles del Pago */}
        {paymentDetails && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Detalles del Pago</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">ID de Transacción</label>
                  <p className="font-mono text-sm bg-gray-100 p-2 rounded">{paymentDetails.sessionId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Monto Pagado</label>
                  <p className="text-2xl font-bold text-green-600">
                    {formatAmount(paymentDetails.amount, paymentDetails.currency)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="font-medium">{paymentDetails.customerEmail}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Estado</label>
                  <Badge variant="default">{paymentDetails.status}</Badge>
                </div>
                
                {paymentDetails.metadata && (
                  <>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Tipo de Servicio</label>
                      <p className="font-medium capitalize">
                        {paymentDetails.metadata.type === 'rental' ? 'Alquiler' : 'Servicio'}
                      </p>
                    </div>
                    {paymentDetails.metadata.vehicleType && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Vehículo</label>
                        <p className="font-medium capitalize">{paymentDetails.metadata.vehicleType}</p>
                      </div>
                    )}
                    {paymentDetails.metadata.duration && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Duración</label>
                        <p className="font-medium capitalize">{paymentDetails.metadata.duration}</p>
                      </div>
                    )}
                    {paymentDetails.metadata.serviceType && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Tipo de Servicio</label>
                        <p className="font-medium capitalize">{paymentDetails.metadata.serviceType}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Próximos Pasos */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Próximos Pasos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paymentDetails?.metadata?.type === 'rental' ? (
                <>
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <span className="text-blue-600 font-bold text-sm">1</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Confirmación por Email</h4>
                      <p className="text-sm text-gray-600">
                        Recibirás un email con los detalles de tu reserva y el código de verificación.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <span className="text-blue-600 font-bold text-sm">2</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Visita la Tienda</h4>
                      <p className="text-sm text-gray-600">
                        Dirígete a nuestra tienda en Málaga con tu código de verificación para recoger el vehículo.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <span className="text-blue-600 font-bold text-sm">3</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Disfruta tu Alquiler</h4>
                      <p className="text-sm text-gray-600">
                        Una vez verificado, podrás disfrutar de tu vehículo eléctrico por Málaga.
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start space-x-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <span className="text-green-600 font-bold text-sm">1</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Servicio Confirmado</h4>
                      <p className="text-sm text-gray-600">
                        Tu solicitud de servicio ha sido confirmada y procesada.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <span className="text-green-600 font-bold text-sm">2</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Contacto del Técnico</h4>
                      <p className="text-sm text-gray-600">
                        Nuestro equipo técnico se pondrá en contacto contigo para coordinar el servicio.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Acciones */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/perfil">
            <Button variant="default" className="w-full sm:w-auto">
              <User className="w-4 h-4 mr-2" />
              Ver Mi Perfil
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="w-full sm:w-auto">
              <Home className="w-4 h-4 mr-2" />
              Volver al Inicio
            </Button>
          </Link>
        </div>

        {/* Información de Contacto */}
        <Card className="mt-8">
          <CardContent className="text-center py-6">
            <h3 className="font-medium mb-2">¿Necesitas Ayuda?</h3>
            <p className="text-sm text-gray-600 mb-4">
              Si tienes alguna pregunta sobre tu pago o reserva, no dudes en contactarnos.
            </p>
            <div className="flex justify-center space-x-4">
              <a href="tel:607228882" className="text-blue-600 hover:underline">
                📞 607 22 88 82
              </a>
              <a href="mailto:info@svcmoto.com" className="text-blue-600 hover:underline">
                ✉️ info@svcmoto.com
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}