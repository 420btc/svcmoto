import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

// Schema de validación
const completeWithoutVerificationSchema = z.object({
  bookingId: z.string().min(1, 'ID de reserva requerido'),
  userConfirmed: z.boolean(), // true = usuario confirma que se realizó, false = no se realizó
  reason: z.string().optional().default('expired_unverified')
})

/**
 * POST /api/admin/complete-without-verification - Marcar reserva como completada sin verificación
 * Para reservas que expiraron sin ser verificadas
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = completeWithoutVerificationSchema.parse(body)
    
    const { bookingId, userConfirmed, reason } = validatedData
    
    // Buscar la reserva
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })
    
    if (!booking) {
      return NextResponse.json(
        { error: 'Reserva no encontrada' },
        { status: 404 }
      )
    }
    
    // Verificar que la reserva esté en estado PENDING y no verificada
    if (booking.status !== 'PENDING' || booking.isVerified) {
      return NextResponse.json(
        { error: 'La reserva ya ha sido procesada' },
        { status: 400 }
      )
    }
    
    // Verificar que la reserva haya expirado
    const now = new Date()
    const bookingEndTime = new Date(booking.endAt)
    
    if (now < bookingEndTime) {
      return NextResponse.json(
        { error: 'La reserva aún no ha expirado' },
        { status: 400 }
      )
    }
    
    let updatedBooking
    
    if (userConfirmed) {
      // Usuario confirma que se realizó el alquiler - marcar como completado SIN puntos
      updatedBooking = await prisma.booking.update({
        where: { id: bookingId },
        data: {
          status: 'COMPLETED_NO_VERIFICATION',
          isVerified: false, // Importante: NO verificado
          pointsAwarded: 0, // Sin puntos
          completedAt: now,
          notes: `Completado sin verificación - ${reason}`,
          updatedAt: now
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      })
      
      // NO crear entrada en pointsLedger ya que no se otorgan puntos
      
    } else {
      // Usuario confirma que NO se realizó el alquiler
      updatedBooking = await prisma.booking.update({
        where: { id: bookingId },
        data: {
          status: 'CANCELLED',
          isVerified: false,
          pointsAwarded: 0,
          cancelledAt: now,
          notes: `Cancelado por no realización - ${reason}`,
          updatedAt: now
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      })
    }
    
    return NextResponse.json({
      success: true,
      message: userConfirmed 
        ? 'Reserva marcada como completada sin verificación'
        : 'Reserva marcada como no realizada',
      booking: {
        id: updatedBooking.id,
        status: updatedBooking.status,
        isVerified: updatedBooking.isVerified,
        pointsAwarded: updatedBooking.pointsAwarded,
        user: updatedBooking.user
      }
    })
    
  } catch (error) {
    console.error('Error en complete-without-verification:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
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

/**
 * GET /api/admin/complete-without-verification - Obtener reservas expiradas sin verificación
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    const now = new Date()
    
    // Buscar reservas que han expirado y no están verificadas
    const expiredBookings = await prisma.booking.findMany({
      where: {
        ...(userId && { userId }),
        status: 'PENDING',
        isVerified: false,
        endAt: {
          lt: now // endAt menor que ahora (expiradas)
        }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        endAt: 'desc'
      }
    })
    
    return NextResponse.json({
      success: true,
      expiredBookings: expiredBookings.map(booking => ({
        id: booking.id,
        vehicleType: booking.vehicleType,
        vehicleId: booking.vehicleId,
        startAt: booking.startAt.toISOString(),
        endAt: booking.endAt.toISOString(),
        totalPrice: booking.totalPrice,
        verificationCode: booking.verificationCode,
        user: booking.user,
        hoursExpired: Math.floor((now.getTime() - booking.endAt.getTime()) / (1000 * 60 * 60))
      }))
    })
    
  } catch (error) {
    console.error('Error obteniendo reservas expiradas:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}