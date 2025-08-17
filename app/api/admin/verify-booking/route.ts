import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'
import { normalizeVerificationCode, isValidVerificationCode, calculatePoints } from '@/lib/verification'

const prisma = new PrismaClient()

// Request validation schema
const verifyRequestSchema = z.object({
  verificationCode: z.string().min(1, 'Código de verificación requerido'),
})

/**
 * POST /api/admin/verify-booking - Verificar código de reserva y entregar puntos
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = verifyRequestSchema.parse(body)
    
    const { verificationCode } = validatedData
    
    // Validar formato del código
    if (!isValidVerificationCode(verificationCode)) {
      return NextResponse.json(
        { error: 'Formato de código inválido. Debe tener 6 dígitos.' },
        { status: 400 }
      )
    }
    
    // Normalizar el código (remover espacios)
    const normalizedCode = normalizeVerificationCode(verificationCode)
    
    // Buscar la reserva por código de verificación
    const booking = await prisma.booking.findFirst({
      where: {
        verificationCode: {
          contains: normalizedCode
        },
        isVerified: false, // Solo reservas no verificadas
        status: 'PENDING' // Solo reservas pendientes
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        }
      }
    })
    
    if (!booking) {
      return NextResponse.json(
        { error: 'Código no encontrado o ya ha sido verificado' },
        { status: 404 }
      )
    }
    
    // Calcular puntos a otorgar
    const pointsToAward = calculatePoints(booking.totalPrice)
    
    // Iniciar transacción para verificar la reserva y otorgar puntos
    const result = await prisma.$transaction(async (tx) => {
      // Actualizar la reserva como verificada y completada
      const updatedBooking = await tx.booking.update({
        where: { id: booking.id },
        data: {
          isVerified: true,
          status: 'COMPLETED',
          pointsAwarded: pointsToAward,
          updatedAt: new Date()
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true
            }
          }
        }
      })
      
      // Crear entrada en el ledger de puntos
      await tx.pointsLedger.create({
        data: {
          userId: booking.userId,
          bookingId: booking.id,
          points: pointsToAward,
          reason: 'rental_completion',
          description: `Puntos otorgados por completar alquiler de ${booking.vehicleType} ${booking.vehicleId}`,
        }
      })
      
      return updatedBooking
    })
    
    return NextResponse.json({
      success: true,
      message: 'Reserva verificada exitosamente',
      booking: {
        id: result.id,
        userId: result.userId,
        vehicleType: result.vehicleType,
        vehicleId: result.vehicleId,
        startAt: result.startAt.toISOString(),
        endAt: result.endAt.toISOString(),
        totalPrice: result.totalPrice,
        status: result.status,
        verificationCode: result.verificationCode,
        isVerified: result.isVerified,
        user: result.user
      },
      pointsAwarded: pointsToAward
    })
    
  } catch (error) {
    console.error('Error verifying booking:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos de entrada inválidos', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}