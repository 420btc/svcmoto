import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'
import { generateVerificationCode, calculatePoints } from '@/lib/verification'

const prisma = new PrismaClient()

// Schema de validación para crear una reserva
const createBookingSchema = z.object({
  userId: z.string().min(1, 'ID de usuario requerido'),
  vehicleType: z.string().min(1, 'Tipo de vehículo requerido'),
  vehicleId: z.string().min(1, 'ID de vehículo requerido'),
  startAt: z.string().min(1, 'Fecha de inicio requerida'),
  endAt: z.string().min(1, 'Fecha de fin requerida'),
  totalPrice: z.number().min(0, 'Precio debe ser positivo'),
  duration: z.number().min(1, 'Duración debe ser positiva'),
  estimatedKm: z.number().min(0, 'Kilómetros estimados deben ser positivos')
})

/**
 * POST /api/bookings - Crear una nueva reserva
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createBookingSchema.parse(body)
    
    // Verificar que el usuario existe
    const existingUser = await prisma.user.findUnique({
      where: { id: validatedData.userId }
    })
    
    if (!existingUser) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }
    
    // Generar código de verificación único
    const verificationCode = generateVerificationCode()
    
    // Crear la reserva en la base de datos
    const booking = await prisma.booking.create({
      data: {
        userId: validatedData.userId,
        vehicleType: validatedData.vehicleType,
        vehicleId: validatedData.vehicleId,
        startAt: new Date(validatedData.startAt),
        endAt: new Date(validatedData.endAt),
        totalPrice: validatedData.totalPrice,
        status: 'PENDING',
        verificationCode: verificationCode,
        isVerified: false,
        estimatedKm: validatedData.estimatedKm,
        duration: validatedData.duration
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
    
    return NextResponse.json({
      success: true,
      message: 'Reserva creada exitosamente',
      booking: {
        id: booking.id,
        verificationCode: booking.verificationCode,
        vehicleType: booking.vehicleType,
        vehicleId: booking.vehicleId,
        startAt: booking.startAt.toISOString(),
        endAt: booking.endAt.toISOString(),
        totalPrice: booking.totalPrice,
        status: booking.status,
        estimatedKm: booking.estimatedKm,
        duration: booking.duration,
        user: booking.user
      }
    })
    
  } catch (error) {
    console.error('Error creating booking:', error)
    
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

/**
 * GET /api/bookings - Obtener reservas del usuario
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json(
        { error: 'ID de usuario requerido' },
        { status: 400 }
      )
    }
    
    const bookings = await prisma.booking.findMany({
      where: {
        userId: userId
      },
      orderBy: {
        createdAt: 'desc'
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
    
    return NextResponse.json({
      success: true,
      bookings: bookings.map(booking => ({
        id: booking.id,
        verificationCode: booking.verificationCode,
        vehicleType: booking.vehicleType,
        vehicleId: booking.vehicleId,
        startAt: booking.startAt.toISOString(),
        endAt: booking.endAt.toISOString(),
        totalPrice: booking.totalPrice,
        status: booking.status,
        isVerified: booking.isVerified,
        pointsAwarded: booking.pointsAwarded,
        estimatedKm: booking.estimatedKm,
        duration: booking.duration,
        createdAt: booking.createdAt.toISOString(),
        user: booking.user
      }))
    })
    
  } catch (error) {
    console.error('Error fetching bookings:', error)
    
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}