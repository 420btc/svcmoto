import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Schema de validación para crear/actualizar usuario
const userSchema = z.object({
  email: z.string().email('Email inválido'),
  name: z.string().optional(),
  phone: z.string().optional()
})

/**
 * POST /api/users - Crear o actualizar usuario
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('POST /api/users - Body received:', body)
    
    const validatedData = userSchema.parse(body)
    console.log('POST /api/users - Validated data:', validatedData)
    
    // Verificar conexión a la base de datos
    await prisma.$connect()
    console.log('POST /api/users - Database connected successfully')
    
    // Buscar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: {
        email: validatedData.email
      }
    })
    console.log('POST /api/users - Existing user found:', !!existingUser)
    
    let user
    
    if (existingUser) {
      // Actualizar usuario existente
      user = await prisma.user.update({
        where: {
          email: validatedData.email
        },
        data: {
          name: validatedData.name || existingUser.name,
          phone: validatedData.phone || existingUser.phone
        }
      })
    } else {
      // Crear nuevo usuario
      user = await prisma.user.create({
        data: {
          email: validatedData.email,
          name: validatedData.name,
          phone: validatedData.phone
        }
      })
    }
    
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        createdAt: user.createdAt.toISOString()
      }
    })
    
  } catch (error) {
    console.error('Error en POST /api/users:', error)
    console.error('Error details:', {
      name: error?.name,
      message: error?.message,
      code: error?.code,
      stack: error?.stack
    })
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos de entrada inválidos', details: error.errors },
        { status: 400 }
      )
    }
    
    // Error específico de Prisma
    if (error?.code) {
      return NextResponse.json(
        { 
          error: 'Error de base de datos', 
          code: error.code,
          message: error.message 
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        message: error?.message || 'Error desconocido'
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

/**
 * GET /api/users - Obtener usuario por email
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email requerido' },
        { status: 400 }
      )
    }
    
    const user = await prisma.user.findUnique({
      where: {
        email: email
      }
    })
    
    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        createdAt: user.createdAt.toISOString()
      }
    })
    
  } catch (error) {
    console.error('Error fetching user:', error)
    
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}