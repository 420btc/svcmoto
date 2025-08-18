import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Buscar el usuario por email
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Eliminar en orden debido a las relaciones de foreign keys
    // 1. Eliminar registros de points_ledger
    await prisma.pointsLedger.deleteMany({
      where: { userId: user.id }
    })

    // 2. Eliminar descuentos
    await prisma.discount.deleteMany({
      where: { userId: user.id }
    })

    // 3. Eliminar reservas (bookings)
    await prisma.booking.deleteMany({
      where: { userId: user.id }
    })

    // 4. Eliminar servicios
    await prisma.service.deleteMany({
      where: { userId: user.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Historial eliminado correctamente de la base de datos'
    })

  } catch (error) {
    console.error('Error deleting user history:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}