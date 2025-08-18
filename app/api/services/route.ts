import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Obtener servicios de un usuario
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const email = searchParams.get('email')

    if (!userId && !email) {
      return NextResponse.json(
        { error: 'Se requiere userId o email' },
        { status: 400 }
      )
    }

    let user
    if (email) {
      user = await prisma.user.findUnique({
        where: { email },
        include: { services: true }
      })
    } else {
      user = await prisma.user.findUnique({
        where: { id: userId },
        include: { services: true }
      })
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(user.services)
  } catch (error) {
    console.error('Error al obtener servicios:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST - Crear un nuevo servicio
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Datos recibidos en API:', body)
    
    const {
      userId,
      serviceType,
      vehicleType,
      description,
      contactInfo,
      preferredDate,
      estimatedPrice
    } = body

    console.log('Campos extraídos:', { userId, serviceType, description, contactInfo })

    if (!userId || !serviceType || !description || !contactInfo) {
      console.log('Error: Faltan campos requeridos')
      return NextResponse.json(
        { error: `Faltan campos requeridos. Recibido: userId=${userId}, serviceType=${serviceType}, description=${description}, contactInfo=${contactInfo}` },
        { status: 400 }
      )
    }

    // Verificar que el usuario existe
    console.log('Buscando usuario con ID:', userId)
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      console.log('Usuario no encontrado')
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    console.log('Usuario encontrado, creando servicio...')
    const service = await prisma.service.create({
      data: {
        userId,
        serviceType,
        vehicleType,
        description,
        contactInfo,
        preferredDate: preferredDate ? new Date(preferredDate) : null,
        estimatedPrice,
        status: 'PENDING'
      }
    })

    console.log('Servicio creado exitosamente:', service)
    return NextResponse.json(service, { status: 201 })
  } catch (error) {
    console.error('Error detallado al crear servicio:', error)
    console.error('Stack trace:', error.stack)
    return NextResponse.json(
      { error: `Error interno del servidor: ${error.message}` },
      { status: 500 }
    )
  }
}

// PUT - Actualizar un servicio
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status, finalPrice, notes } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Se requiere el ID del servicio' },
        { status: 400 }
      )
    }

    const updateData: any = {}
    if (status) updateData.status = status
    if (finalPrice !== undefined) updateData.finalPrice = finalPrice
    if (notes !== undefined) updateData.notes = notes
    if (status === 'COMPLETED') updateData.completedAt = new Date()
    if (status === 'CANCELLED') updateData.cancelledAt = new Date()

    const service = await prisma.service.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json(service)
  } catch (error) {
    console.error('Error al actualizar servicio:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar un servicio
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Se requiere el ID del servicio' },
        { status: 400 }
      )
    }

    await prisma.service.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Servicio eliminado correctamente' })
  } catch (error) {
    console.error('Error al eliminar servicio:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}