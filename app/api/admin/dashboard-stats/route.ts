import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    // Obtener estadísticas generales
    const [totalUsers, totalBookings, pendingVerifications, completedBookings] = await Promise.all([
      // Total de usuarios registrados
      prisma.user.count(),
      
      // Total de reservas
      prisma.booking.count(),
      
      // Verificaciones pendientes
      prisma.booking.count({
        where: {
          status: 'PENDING',
          verificationCode: { not: null }
        }
      }),
      
      // Reservas completadas
      prisma.booking.count({
        where: {
          status: { in: ['COMPLETED', 'VERIFIED'] }
        }
      })
    ])

    // Calcular ingresos totales
    const revenueResult = await prisma.booking.aggregate({
      where: {
        status: { in: ['COMPLETED', 'VERIFIED'] }
      },
      _sum: {
        totalPrice: true
      }
    })

    // Reservas activas (en curso)
    const activeBookings = await prisma.booking.count({
      where: {
        status: 'VERIFIED',
        startAt: { lte: new Date() },
        endAt: { gte: new Date() }
      }
    })

    // Calcular crecimiento mensual (usuarios nuevos este mes vs mes anterior)
    const now = new Date()
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

    const [thisMonthUsers, lastMonthUsers] = await Promise.all([
      prisma.user.count({
        where: {
          createdAt: { gte: startOfThisMonth }
        }
      }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: startOfLastMonth,
            lte: endOfLastMonth
          }
        }
      })
    ])

    const monthlyGrowth = lastMonthUsers > 0 
      ? Math.round(((thisMonthUsers - lastMonthUsers) / lastMonthUsers) * 100)
      : 0

    // Usuarios recientes (últimos 10)
    const recentUsers = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        authMethod: true,
        isVerified: true
      }
    })

    const stats = {
      totalUsers,
      totalBookings,
      totalRevenue: Math.round(revenueResult._sum.totalPrice || 0),
      activeBookings,
      pendingVerifications,
      completedBookings,
      monthlyGrowth,
      recentUsers
    }

    return NextResponse.json(stats)

  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}