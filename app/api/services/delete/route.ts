import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const serviceId = searchParams.get('id')
    const userEmail = searchParams.get('email')

    if (!serviceId || !userEmail) {
      return NextResponse.json(
        { error: 'Service ID and user email are required' },
        { status: 400 }
      )
    }

    // Verificar que el usuario existe
    const user = await prisma.user.findUnique({
      where: { email: userEmail }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Verificar que el servicio pertenece al usuario
    const service = await prisma.service.findFirst({
      where: {
        id: serviceId,
        userId: user.id
      }
    })

    if (!service) {
      return NextResponse.json(
        { error: 'Service not found or does not belong to user' },
        { status: 404 }
      )
    }

    // Eliminar el servicio
    await prisma.service.delete({
      where: { id: serviceId }
    })

    return NextResponse.json({
      success: true,
      message: 'Servicio eliminado correctamente'
    })

  } catch (error) {
    console.error('Error deleting service:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}