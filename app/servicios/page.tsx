import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wrench, Battery, Shield, Clock, CheckCircle, ArrowLeft, Zap, Settings, Truck } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function ServiciosPage() {
  const servicios = [
    {
      id: 1,
      nombre: "Reparación Integral",
      descripcion: "Servicio completo de reparación para motos y patinetes eléctricos",
      icono: Wrench,
      precio: "Desde 25€",
      tiempo: "1-3 días",
      incluye: [
        "Diagnóstico completo",
        "Reparación de motor eléctrico",
        "Ajuste de frenos",
        "Revisión de sistema eléctrico",
        "Garantía de 6 meses",
      ],
      urgente: true,
    },
    {
      id: 2,
      nombre: "Cambio de Batería",
      descripcion: "Sustitución y mantenimiento de baterías de litio",
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
      id: 3,
      nombre: "Mantenimiento Preventivo",
      descripcion: "Revisión completa para mantener tu vehículo en perfecto estado",
      icono: Settings,
      precio: "Desde 35€",
      tiempo: "1-2 horas",
      incluye: [
        "Revisión de 20 puntos",
        "Limpieza profunda",
        "Ajuste de componentes",
        "Actualización de software",
        "Informe detallado",
      ],
      urgente: false,
    },
    {
      id: 4,
      nombre: "Servicio Express",
      descripción: "Reparaciones rápidas y urgentes",
      icono: Zap,
      precio: "Desde 40€",
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
    {
      id: 5,
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
      id: 6,
      nombre: "Garantía Extendida",
      descripcion: "Protección adicional para tu inversión",
      icono: Shield,
      precio: "Desde 80€/año",
      tiempo: "Inmediato",
      incluye: [
        "Cobertura total 24/7",
        "Reparaciones gratuitas",
        "Vehículo de sustitución",
        "Asistencia en carretera",
        "Sin franquicia",
      ],
      urgente: false,
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Image src="/logo-svcmoto.jpeg" alt="SVC MOTO Logo" width={50} height={50} className="rounded-lg" />
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <Link
                  href="/"
                  className="text-blue-900 hover:text-orange-500 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Inicio
                </Link>
                <Link
                  href="/alquiler"
                  className="text-blue-900 hover:text-orange-500 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Alquiler Motos
                </Link>
                <Link
                  href="/servicios"
                  className="text-orange-500 px-3 py-2 text-sm font-medium border-b-2 border-orange-500"
                >
                  Servicios
                </Link>
                <Link
                  href="/contacto"
                  className="text-blue-900 hover:text-orange-500 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Contacto
                </Link>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">Reservar Ahora</Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Link href="/" className="text-white hover:text-blue-200 mr-4">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-white">Servicios Técnicos</h1>
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
                        <CardTitle className="text-xl text-blue-900">{servicio.nombre}</CardTitle>
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

                    <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
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
    </div>
  )
}
