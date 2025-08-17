import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * GET /api/admin/verifications - Obtener verificaciones recientes
 */
export async function GET(request: NextRequest) {
  try {
    // Obtener las últimas 10 verificaciones
    const recentVerifications = await prisma.booking.findMany({
      where: {
        isVerified: true,
        status: 'COMPLETED'
      },
      orderBy: {
        updatedAt: 'desc'
      },
      take: 10,
      select: {
        id: true,
        verificationCode: true,
        updatedAt: true,
        pointsAwarded: true,
        vehicleType: true,
        vehicleId: true,
        user: {
          select: {
            name: true
          }
        }
      }
    })
    
    // Formatear los datos para el frontend
    const formattedVerifications = recentVerifications.map((verification: any) => ({
      id: verification.id,
      verificationCode: verification.verificationCode || '',
      verifiedAt: verification.updatedAt.toISOString(),
      pointsAwarded: verification.pointsAwarded || 0,
      booking: {
        vehicleType: verification.vehicleType,
        vehicleId: verification.vehicleId,
        user: {
          name: verification.user.name || 'Usuario'
        }
      }
    }))
    
    return NextResponse.json({
      success: true,
      recentVerifications: formattedVerifications
    })
    
  } catch (error) {
    console.error('Error fetching recent verifications:', error)
    
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}