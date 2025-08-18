import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function PATCH(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const { userId } = params
    const body = await request.json()
    const { isVerified } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID es requerido' },
        { status: 400 }
      )
    }

    // Verificar que el usuario existe
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // Actualizar estado del usuario
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        isVerified: isVerified,
        updatedAt: new Date()
      },
      include: {
        _count: {
          select: {
            bookings: true,
            services: true,
            pointsLedger: true,
            discounts: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: `Usuario ${isVerified ? 'activado' : 'bloqueado'} exitosamente`
    })

  } catch (error) {
    console.error('Error toggling user status:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}