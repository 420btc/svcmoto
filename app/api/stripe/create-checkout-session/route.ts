import { NextRequest, NextResponse } from 'next/server'
import { createCheckoutSession, STRIPE_CONFIG, eurosToCents } from '@/lib/stripe'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      type, // 'rental' | 'service'
      vehicleType, // 'moto' | 'patinete'
      duration, // 'hourly' | 'half_day' | 'full_day' | 'weekly'
      serviceType, // 'mantenimiento' | 'reparacion' | 'cambio_bateria'
      quantity = 1,
      customerEmail,
      userId,
      startDate,
      endDate,
      vehicleId
    } = body

    if (!type || !customerEmail) {
      return NextResponse.json(
        { error: 'Tipo de pago y email son requeridos' },
        { status: 400 }
      )
    }

    let lineItems: any[] = []
    let totalAmount = 0
    let metadata: Record<string, string> = {
      type,
      customerEmail,
      userId: userId || '',
    }

    if (type === 'rental') {
      if (!vehicleType || !duration) {
        return NextResponse.json(
          { error: 'Tipo de vehículo y duración son requeridos para alquileres' },
          { status: 400 }
        )
      }

      // Obtener precio según el tipo de vehículo y duración
      let price = 0
      let productName = ''
      
      if (vehicleType === 'moto') {
        const prices = STRIPE_CONFIG.products.MOTO_ELECTRICA.prices
        productName = STRIPE_CONFIG.products.MOTO_ELECTRICA.name
        
        switch (duration) {
          case 'hourly':
            price = prices.HOURLY
            break
          case 'half_day':
            price = prices.HALF_DAY
            break
          case 'full_day':
            price = prices.FULL_DAY
            break
          case 'weekly':
            price = prices.WEEKLY
            break
          default:
            return NextResponse.json(
              { error: 'Duración no válida' },
              { status: 400 }
            )
        }
      } else if (vehicleType === 'patinete') {
        const prices = STRIPE_CONFIG.products.PATINETE_ELECTRICO.prices
        productName = STRIPE_CONFIG.products.PATINETE_ELECTRICO.name
        
        switch (duration) {
          case 'hourly':
            price = prices.HOURLY
            break
          case 'half_day':
            price = prices.HALF_DAY
            break
          case 'full_day':
            price = prices.FULL_DAY
            break
          case 'weekly':
            price = prices.WEEKLY
            break
          default:
            return NextResponse.json(
              { error: 'Duración no válida' },
              { status: 400 }
            )
        }
      } else {
        return NextResponse.json(
          { error: 'Tipo de vehículo no válido' },
          { status: 400 }
        )
      }

      totalAmount = price * quantity
      
      lineItems.push({
        price_data: {
          currency: STRIPE_CONFIG.currency,
          product_data: {
            name: `${productName} - ${duration}`,
            description: `Alquiler de ${vehicleType} por ${duration}`,
            metadata: {
              type: 'rental',
              vehicleType,
              duration
            }
          },
          unit_amount: eurosToCents(price),
        },
        quantity,
      })

      // Añadir metadata específica del alquiler
      metadata = {
        ...metadata,
        vehicleType,
        duration,
        startDate: startDate || '',
        endDate: endDate || '',
        vehicleId: vehicleId || '',
        quantity: quantity.toString()
      }

    } else if (type === 'service') {
      if (!serviceType) {
        return NextResponse.json(
          { error: 'Tipo de servicio es requerido' },
          { status: 400 }
        )
      }

      let price = 0
      let serviceName = ''
      
      switch (serviceType) {
        case 'mantenimiento':
          price = STRIPE_CONFIG.services.MANTENIMIENTO.price
          serviceName = STRIPE_CONFIG.services.MANTENIMIENTO.name
          break
        case 'reparacion':
          price = STRIPE_CONFIG.services.REPARACION.price
          serviceName = STRIPE_CONFIG.services.REPARACION.name
          break
        case 'cambio_bateria':
          price = STRIPE_CONFIG.services.CAMBIO_BATERIA.price
          serviceName = STRIPE_CONFIG.services.CAMBIO_BATERIA.name
          break
        default:
          return NextResponse.json(
            { error: 'Tipo de servicio no válido' },
            { status: 400 }
          )
      }

      totalAmount = price * quantity
      
      lineItems.push({
        price_data: {
          currency: STRIPE_CONFIG.currency,
          product_data: {
            name: serviceName,
            description: `Servicio de ${serviceType}`,
            metadata: {
              type: 'service',
              serviceType
            }
          },
          unit_amount: eurosToCents(price),
        },
        quantity,
      })

      // Añadir metadata específica del servicio
      metadata = {
        ...metadata,
        serviceType,
        quantity: quantity.toString()
      }
    }

    // Crear sesión de checkout
    const session = await createCheckoutSession({
      lineItems,
      customerEmail,
      metadata
    })

    // Opcional: Crear registro en base de datos para tracking
    if (userId) {
      try {
        await prisma.booking.create({
          data: {
            userId,
            vehicleType: vehicleType || 'service',
            vehicleId: vehicleId || `service-${serviceType}`,
            startAt: startDate ? new Date(startDate) : new Date(),
            endAt: endDate ? new Date(endDate) : new Date(),
            totalPrice: totalAmount,
            status: 'PENDING',
            // Añadir referencia a la sesión de Stripe
            notes: `Stripe Session: ${session.id}`
          }
        })
      } catch (dbError) {
        console.error('Error creating booking record:', dbError)
        // No fallar el pago por error de DB
      }
    }

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
      amount: totalAmount,
      currency: STRIPE_CONFIG.currency
    })

  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}