import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, Zap, Shield, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AlquilerPage() {
  const motos = [
    {
      id: 1,
      nombre: "Urban Rider Pro",
      tipo: "Scooter Eléctrico",
      autonomia: "80 km",
      velocidad: "45 km/h",
      capacidad: "2 personas",
      precios: {
        hora: "8€",
        medio_dia: "35€",
        dia_completo: "60€",
        semanal: "350€",
      },
      caracteristicas: ["Casco incluido", "Seguro incluido", "GPS integrado", "Puerto USB"],
    },
    {
      id: 2,
      nombre: "City Explorer",
      tipo: "Moto Eléctrica",
      autonomia: "120 km",
      velocidad: "50 km/h",
      capacidad: "2 personas",
      precios: {
        hora: "12€",
        medio_dia: "50€",
        dia_completo: "85€",
        semanal: "500€",
      },
      caracteristicas: ["2 cascos incluidos", "Seguro premium", "Baúl trasero", "Carga rápida"],
    },
    {
      id: 3,
      nombre: "Eco Cruiser",
      tipo: "Patinete Eléctrico",
      autonomia: "35 km",
      velocidad: "25 km/h",
      capacidad: "1 persona",
      precios: {
        hora: "5€",
        medio_dia: "20€",
        dia_completo: "35€",
        semanal: "200€",
      },
      caracteristicas: ["Casco incluido", "Plegable", "Luces LED", "Frenos de disco"],
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="bg-orange-500 text-white font-bold text-xl px-3 py-1 rounded-lg">
                SVC MOTO
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
                  className="text-orange-500 px-3 py-2 text-sm font-medium border-b-2 border-orange-500"
                >
                  Alquiler Motos
                </Link>
                <Link
                  href="/servicios"
                  className="text-blue-900 hover:text-orange-500 px-3 py-2 text-sm font-medium transition-colors"
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
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Link href="/" className="text-white hover:text-orange-200 mr-4">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-white">Alquiler de Motos</h1>
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {motos.map((moto) => (
              <Card key={moto.id} className="border-2 border-gray-200 hover:border-orange-500 transition-colors">
                <CardHeader>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <CardTitle className="text-2xl text-blue-900">{moto.nombre}</CardTitle>
                      <Badge variant="secondary" className="mt-2 bg-orange-100 text-orange-800">
                        {moto.tipo}
                      </Badge>
                    </div>
                  </div>

                  {/* Placeholder para imagen */}
                  <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                    <div className="text-center text-gray-500">
                      <Zap className="w-12 h-12 mx-auto mb-2" />
                      <p className="text-sm">Imagen próximamente</p>
                    </div>
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

                  <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
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
            <h2 className="text-3xl font-bold text-white mb-4">¿Cómo Funciona el Alquiler?</h2>
            <p className="text-xl text-white/90">Proceso simple y rápido para empezar tu aventura</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-orange-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Elige tu Vehículo</h3>
              <p className="text-white/90">Selecciona la moto o patinete que mejor se adapte a tus necesidades</p>
            </div>

            <div className="text-center">
              <div className="bg-orange-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Reserva Online</h3>
              <p className="text-white/90">Completa tu reserva online o llámanos directamente</p>
            </div>

            <div className="text-center">
              <div className="bg-orange-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Recoge y Disfruta</h3>
              <p className="text-white/90">Recoge tu vehículo en nuestro local y explora Málaga</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-orange-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">¿Listo para tu Aventura?</h2>
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
    </div>
  )
}
