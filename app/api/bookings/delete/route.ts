import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const bookingId = searchParams.get('id')
    const userEmail = searchParams.get('email')

    if (!bookingId || !userEmail) {
      return NextResponse.json(
        { error: 'Booking ID and user email are required' },
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

    // Verificar que la reserva pertenece al usuario
    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        userId: user.id
      }
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found or does not belong to user' },
        { status: 404 }
      )
    }

    // Eliminar registros relacionados de points_ledger
    await prisma.pointsLedger.deleteMany({
      where: { bookingId: bookingId }
    })

    // Eliminar la reserva
    await prisma.booking.delete({
      where: { id: bookingId }
    })

    return NextResponse.json({
      success: true,
      message: 'Reserva eliminada correctamente'
    })

  } catch (error) {
    console.error('Error deleting booking:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}