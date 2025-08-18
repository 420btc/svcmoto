import { NextRequest, NextResponse } from 'next/server'
import { verifyWebhookSignature } from '@/lib/stripe'
import { PrismaClient } from '@prisma/client'
import Stripe from 'stripe'

const prisma = new PrismaClient()

// Configuración para recibir el body raw
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')
    
    if (!signature) {
      return NextResponse.json(
        { error: 'No signature provided' },
        { status: 400 }
      )
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.error('STRIPE_WEBHOOK_SECRET no está configurado')
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      )
    }

    // Verificar la firma del webhook
    const event = verifyWebhookSignature(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )

    console.log('Webhook event received:', event.type)

    // Manejar diferentes tipos de eventos
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session)
        break
        
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent)
        break
        
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent)
        break
        
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice)
        break
        
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// Manejar sesión de checkout completada
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  try {
    console.log('Processing completed checkout session:', session.id)
    
    const metadata = session.metadata
    if (!metadata) {
      console.error('No metadata found in session')
      return
    }

    const { type, customerEmail, userId, vehicleType, duration, serviceType } = metadata

    if (type === 'rental') {
      // Actualizar o crear reserva
      if (userId) {
        // Buscar reserva existente por sesión de Stripe
        const existingBooking = await prisma.booking.findFirst({
          where: {
            userId,
            notes: { contains: session.id }
          }
        })

        if (existingBooking) {
          // Actualizar reserva existente
          await prisma.booking.update({
            where: { id: existingBooking.id },
            data: {
              status: 'VERIFIED', // Pago completado = verificado
              notes: `${existingBooking.notes} | Payment completed: ${session.payment_intent}`
            }
          })

          // Generar código de verificación
          const verificationCode = generateVerificationCode()
          await prisma.booking.update({
            where: { id: existingBooking.id },
            data: {
              verificationCode,
              isVerified: false // Necesita verificación física
            }
          })

          console.log(`Booking ${existingBooking.id} updated with verification code: ${verificationCode}`)
        }
      }
    } else if (type === 'service') {
      // Crear solicitud de servicio
      if (userId) {
        const user = await prisma.user.findUnique({
          where: { id: userId }
        })

        if (user) {
          await prisma.service.create({
            data: {
              userId,
              serviceType: serviceType || 'mantenimiento',
              description: `Servicio pagado via Stripe - Sesión: ${session.id}`,
              contactInfo: user.email,
              status: 'CONFIRMED', // Servicio confirmado por pago
              finalPrice: session.amount_total ? session.amount_total / 100 : 0,
              notes: `Stripe Payment: ${session.payment_intent}`
            }
          })

          console.log(`Service created for user ${userId}`)
        }
      }
    }

    // Opcional: Enviar email de confirmación
    // await sendConfirmationEmail(customerEmail, session)

  } catch (error) {
    console.error('Error handling checkout session completed:', error)
  }
}

// Manejar pago exitoso
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log('Payment succeeded:', paymentIntent.id)
    
    // Aquí puedes añadir lógica adicional para pagos exitosos
    // Por ejemplo, actualizar inventario, enviar notificaciones, etc.
    
  } catch (error) {
    console.error('Error handling payment intent succeeded:', error)
  }
}

// Manejar pago fallido
async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log('Payment failed:', paymentIntent.id)
    
    // Buscar reservas relacionadas y marcarlas como canceladas
    const bookings = await prisma.booking.findMany({
      where: {
        notes: { contains: paymentIntent.id }
      }
    })

    for (const booking of bookings) {
      await prisma.booking.update({
        where: { id: booking.id },
        data: {
          status: 'CANCELLED',
          notes: `${booking.notes} | Payment failed: ${paymentIntent.id}`
        }
      })
    }
    
  } catch (error) {
    console.error('Error handling payment intent failed:', error)
  }
}

// Manejar pago de factura exitoso (para suscripciones futuras)
async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  try {
    console.log('Invoice payment succeeded:', invoice.id)
    
    // Lógica para suscripciones o pagos recurrentes
    
  } catch (error) {
    console.error('Error handling invoice payment succeeded:', error)
  }
}

// Generar código de verificación de 6 dígitos
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Función para enviar email de confirmación (implementar según necesidades)
async function sendConfirmationEmail(email: string, session: Stripe.Checkout.Session) {
  // TODO: Implementar envío de email
  // Puedes usar SendGrid, Nodemailer, etc.
  console.log(`Should send confirmation email to: ${email}`)
}