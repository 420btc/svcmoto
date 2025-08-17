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
    const validatedData = userSchema.parse(body)
    
    // Buscar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: {
        email: validatedData.email
      }
    })
    
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
    console.error('Error managing user:', error)
    
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