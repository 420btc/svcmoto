"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Star, Calendar, MapPin, Edit, Save, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

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
  const [userInfo, setUserInfo] = useState({
    nombre: "Juan Pérez",
    email: "juan.perez@email.com",
    telefono: "607 22 88 82",
    fechaRegistro: "15 de Enero, 2024"
  })
  
  const [editedInfo, setEditedInfo] = useState(userInfo)
  const [puntosTotales] = useState(245)
  const [alquileresCompletados] = useState(12)
  
  const alquileres: Alquiler[] = [
    {
      id: "ALQ-001",
      vehiculo: "Urban Rider Pro",
      fecha: "10 Ene 2024",
      duracion: "3 horas",
      precio: "24€",
      puntos: 25,
      estado: "completado"
    },
    {
      id: "ALQ-002",
      vehiculo: "City Explorer",
      fecha: "8 Ene 2024",
      duracion: "Día completo",
      precio: "85€",
      puntos: 50,
      estado: "completado"
    },
    {
      id: "ALQ-003",
      vehiculo: "Eco Cruiser",
      fecha: "5 Ene 2024",
      duracion: "2 horas",
      precio: "10€",
      puntos: 15,
      estado: "completado"
    }
  ]

  const handleSave = () => {
    setUserInfo(editedInfo)
    setIsEditing(false)
    // Aquí se enviarían los datos al backend
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

  return (
    <div className="min-h-screen bg-gray-50">
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
                <Link href="/" className="text-blue-900 hover:text-orange-500 px-3 py-2 text-sm font-medium transition-colors">
                  Inicio
                </Link>
                <Link href="/alquiler" className="text-blue-900 hover:text-orange-500 px-3 py-2 text-sm font-medium transition-colors">
                  Alquiler Motos
                </Link>
                <Link href="/servicios" className="text-blue-900 hover:text-orange-500 px-3 py-2 text-sm font-medium transition-colors">
                  Servicios
                </Link>
                <Link href="/contacto" className="text-blue-900 hover:text-orange-500 px-3 py-2 text-sm font-medium transition-colors">
                  Contacto
                </Link>
                <span className="text-orange-500 px-3 py-2 text-sm font-medium border-b-2 border-orange-500">
                  Mi Perfil
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <User className="w-8 h-8 text-white mr-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">Mi Perfil</h1>
          </div>
          <p className="text-xl text-white/90 max-w-3xl">
            Gestiona tu información personal, revisa tu historial de alquileres y consulta tus puntos acumulados.
          </p>
        </div>
      </section>

      {/* Profile Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Información Personal */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-2xl text-blue-900">Información Personal</CardTitle>
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
                  <CardTitle className="text-xl text-blue-900">Mis Estadísticas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <Star className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-orange-600">{puntosTotales}</div>
                      <div className="text-sm text-gray-600">Puntos Totales</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <Calendar className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-blue-600">{alquileresCompletados}</div>
                      <div className="text-sm text-gray-600">Alquileres</div>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="text-center">
                    <h4 className="font-semibold text-blue-900 mb-2">Próxima Recompensa</h4>
                    <div className="bg-gray-200 rounded-full h-2 mb-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{width: '75%'}}></div>
                    </div>
                    <p className="text-sm text-gray-600">55 puntos más para descuento del 15%</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Historial de Alquileres */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-blue-900">Historial de Alquileres</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {alquileres.map((alquiler) => (
                      <div key={alquiler.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold text-blue-900">{alquiler.vehiculo}</h4>
                            <p className="text-sm text-gray-600">ID: {alquiler.id}</p>
                          </div>
                          {getEstadoBadge(alquiler.estado)}
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
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
                </CardContent>
              </Card>

              {/* Sistema de Puntos */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-xl text-blue-900">Sistema de Puntos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-lg font-bold text-orange-600">10 puntos</div>
                      <div className="text-sm text-gray-600">Por cada hora de alquiler</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-lg font-bold text-orange-600">100 puntos</div>
                      <div className="text-sm text-gray-600">Descuento 5%</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-lg font-bold text-orange-600">300 puntos</div>
                      <div className="text-sm text-gray-600">Descuento 15%</div>
                    </div>
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