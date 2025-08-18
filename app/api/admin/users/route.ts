import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const search = searchParams.get('search') || ''
    
    const skip = (page - 1) * limit

    // Construir filtros de búsqueda
    const whereClause = search ? {
      OR: [
        { email: { contains: search, mode: 'insensitive' as const } },
        { name: { contains: search, mode: 'insensitive' as const } },
        { phone: { contains: search, mode: 'insensitive' as const } }
      ]
    } : {}

    // Obtener usuarios con conteos de actividad
    const users = await prisma.user.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
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

    // Contar total para paginación
    const totalUsers = await prisma.user.count({
      where: whereClause
    })

    const totalPages = Math.ceil(totalUsers / limit)

    return NextResponse.json({
      users,
      pagination: {
        currentPage: page,
        totalPages,
        totalUsers,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    })

  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// Crear nuevo usuario (admin)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name, phone, authMethod = 'EMAIL' } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email es requerido' },
        { status: 400 }
      )
    }

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'El usuario ya existe' },
        { status: 409 }
      )
    }

    // Crear nuevo usuario
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        phone,
        authMethod,
        isVerified: true // Los usuarios creados por admin están verificados
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
      user: newUser,
      message: 'Usuario creado exitosamente'
    })

  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}