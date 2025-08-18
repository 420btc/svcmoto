'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { XCircle, Home, ArrowLeft, Phone, Mail } from 'lucide-react'
import Link from 'next/link'

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Mensaje de Cancelación */}
        <Card className="mb-8">
          <CardContent className="text-center py-8">
            <div className="text-orange-500 mb-4">
              <XCircle className="w-16 h-16 mx-auto" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Pago Cancelado</h1>
            <p className="text-gray-600 mb-6">
              Has cancelado el proceso de pago. No se ha realizado ningún cargo a tu tarjeta.
            </p>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
              <p className="text-orange-800 text-sm">
                💡 <strong>Nota:</strong> Tu reserva no ha sido confirmada. Si deseas completar la reserva, 
                puedes intentar el pago nuevamente.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* ¿Qué pasó? */}
        <Card className="mb-8">
          <CardContent className="py-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">¿Qué ha pasado?</h2>
            <div className="space-y-3 text-gray-600">
              <p>• El proceso de pago fue cancelado antes de completarse</p>
              <p>• No se ha realizado ningún cargo a tu método de pago</p>
              <p>• Tu reserva no ha sido confirmada</p>
              <p>• Puedes intentar realizar el pago nuevamente cuando desees</p>
            </div>
          </CardContent>
        </Card>

        {/* Opciones Disponibles */}
        <Card className="mb-8">
          <CardContent className="py-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">¿Qué puedes hacer ahora?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">🔄 Intentar Nuevamente</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Vuelve a la página de alquiler o servicios para realizar tu reserva.
                </p>
                <div className="space-y-2">
                  <Link href="/alquiler" className="block">
                    <Button variant="outline" size="sm" className="w-full">
                      Alquilar Vehículos
                    </Button>
                  </Link>
                  <Link href="/servicios" className="block">
                    <Button variant="outline" size="sm" className="w-full">
                      Solicitar Servicios
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">💬 Contactar Soporte</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Si tuviste problemas técnicos, nuestro equipo puede ayudarte.
                </p>
                <div className="space-y-2">
                  <a href="tel:607228882" className="block">
                    <Button variant="outline" size="sm" className="w-full">
                      <Phone className="w-4 h-4 mr-2" />
                      Llamar Ahora
                    </Button>
                  </a>
                  <a href="https://wa.me/34607228882" target="_blank" rel="noopener noreferrer" className="block">
                    <Button variant="outline" size="sm" className="w-full">
                      📱 WhatsApp
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Métodos de Pago Alternativos */}
        <Card className="mb-8">
          <CardContent className="py-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Métodos de Pago Disponibles</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="border rounded-lg p-3">
                <div className="text-2xl mb-2">💳</div>
                <p className="text-sm font-medium">Tarjetas de Crédito</p>
                <p className="text-xs text-gray-500">Visa, Mastercard</p>
              </div>
              <div className="border rounded-lg p-3">
                <div className="text-2xl mb-2">💳</div>
                <p className="text-sm font-medium">Tarjetas de Débito</p>
                <p className="text-xs text-gray-500">Todas las marcas</p>
              </div>
              <div className="border rounded-lg p-3">
                <div className="text-2xl mb-2">🏦</div>
                <p className="text-sm font-medium">Transferencia</p>
                <p className="text-xs text-gray-500">SEPA</p>
              </div>
              <div className="border rounded-lg p-3">
                <div className="text-2xl mb-2">📱</div>
                <p className="text-sm font-medium">Pago Móvil</p>
                <p className="text-xs text-gray-500">Apple Pay, Google Pay</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preguntas Frecuentes */}
        <Card className="mb-8">
          <CardContent className="py-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Preguntas Frecuentes</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900">¿Se ha cobrado algo en mi tarjeta?</h3>
                <p className="text-sm text-gray-600">No, al cancelar el pago no se realiza ningún cargo.</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">¿Puedo reservar sin pagar online?</h3>
                <p className="text-sm text-gray-600">Sí, puedes contactarnos directamente para reservar y pagar en tienda.</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">¿Los precios cambian si pago en tienda?</h3>
                <p className="text-sm text-gray-600">No, los precios son los mismos tanto online como en tienda física.</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">¿Hay descuentos por pago en efectivo?</h3>
                <p className="text-sm text-gray-600">Consulta con nuestro equipo sobre promociones especiales disponibles.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Acciones Principales */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link href="/alquiler">
            <Button className="w-full sm:w-auto">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a Alquileres
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="w-full sm:w-auto">
              <Home className="w-4 h-4 mr-2" />
              Ir al Inicio
            </Button>
          </Link>
        </div>

        {/* Información de Contacto */}
        <Card>
          <CardContent className="text-center py-6">
            <h3 className="font-medium mb-2">¿Necesitas Ayuda Inmediata?</h3>
            <p className="text-sm text-gray-600 mb-4">
              Nuestro equipo está disponible para ayudarte con cualquier problema de pago o reserva.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <a href="tel:607228882" className="flex items-center justify-center space-x-2 text-blue-600 hover:underline">
                <Phone className="w-4 h-4" />
                <span>607 22 88 82</span>
              </a>
              <a href="mailto:info@svcmoto.com" className="flex items-center justify-center space-x-2 text-blue-600 hover:underline">
                <Mail className="w-4 h-4" />
                <span>info@svcmoto.com</span>
              </a>
              <a href="https://wa.me/34607228882" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center space-x-2 text-green-600 hover:underline">
                <span>📱</span>
                <span>WhatsApp</span>
              </a>
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <p className="text-xs text-gray-500">
                <strong>Horario de Atención:</strong> Lunes a Viernes 10:00-19:00 | Sábados 10:00-14:00
              </p>
              <p className="text-xs text-gray-500">
                <strong>Ubicación:</strong> C. Héroe de Sostoa, 37, Carretera de Cádiz, 29002 Málaga
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}