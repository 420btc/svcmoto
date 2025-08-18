import Stripe from 'stripe'

// Configuración de Stripe
// IMPORTANTE: Necesitas obtener estas claves de tu dashboard de Stripe
// 1. Ve a https://dashboard.stripe.com/
// 2. Crea una cuenta o inicia sesión
// 3. Ve a Developers > API keys
// 4. Copia la Secret key (sk_test_... para testing, sk_live_... para producción)

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error(
    'STRIPE_SECRET_KEY no está definida. ' +
    'Por favor añade STRIPE_SECRET_KEY=sk_test_... a tu archivo .env.local'
  )
}

// Inicializar Stripe con la clave secreta
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16', // Usar la versión más reciente de la API
  typescript: true,
})

// Configuración de productos y precios
export const STRIPE_CONFIG = {
  // Productos de alquiler
  products: {
    MOTO_ELECTRICA: {
      name: 'Alquiler Moto Eléctrica',
      description: 'Alquiler de moto eléctrica por horas',
      prices: {
        HOURLY: 15, // €15 por hora
        HALF_DAY: 35, // €35 por medio día
        FULL_DAY: 60, // €60 por día completo
        WEEKLY: 350 // €350 por semana
      }
    },
    PATINETE_ELECTRICO: {
      name: 'Alquiler Patinete Eléctrico',
      description: 'Alquiler de patinete eléctrico por horas',
      prices: {
        HOURLY: 8, // €8 por hora
        HALF_DAY: 20, // €20 por medio día
        FULL_DAY: 35, // €35 por día completo
        WEEKLY: 200 // €200 por semana
      }
    }
  },
  
  // Servicios
  services: {
    MANTENIMIENTO: {
      name: 'Servicio de Mantenimiento',
      price: 25 // €25
    },
    REPARACION: {
      name: 'Servicio de Reparación',
      price: 45 // €45
    },
    CAMBIO_BATERIA: {
      name: 'Cambio de Batería',
      price: 5 // €5 (precio actualizado)
    }
  },
  
  // Configuración de la moneda
  currency: 'eur',
  
  // URLs de éxito y cancelación
  urls: {
    success: process.env.NEXT_PUBLIC_DOMAIN + '/payment/success',
    cancel: process.env.NEXT_PUBLIC_DOMAIN + '/payment/cancel'
  }
}

// Función para crear un Payment Intent
export async function createPaymentIntent({
  amount,
  currency = 'eur',
  metadata = {}
}: {
  amount: number // Cantidad en centavos (ej: 1500 = €15.00)
  currency?: string
  metadata?: Record<string, string>
}) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    })
    
    return paymentIntent
  } catch (error) {
    console.error('Error creating payment intent:', error)
    throw error
  }
}

// Función para crear una sesión de Checkout
export async function createCheckoutSession({
  lineItems,
  customerEmail,
  metadata = {},
  mode = 'payment'
}: {
  lineItems: Stripe.Checkout.SessionCreateParams.LineItem[]
  customerEmail?: string
  metadata?: Record<string, string>
  mode?: 'payment' | 'subscription'
}) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode,
      success_url: STRIPE_CONFIG.urls.success + '?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: STRIPE_CONFIG.urls.cancel,
      customer_email: customerEmail,
      metadata,
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['ES'], // Solo España
      },
    })
    
    return session
  } catch (error) {
    console.error('Error creating checkout session:', error)
    throw error
  }
}

// Función para verificar un webhook de Stripe
export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string,
  secret: string
) {
  try {
    return stripe.webhooks.constructEvent(payload, signature, secret)
  } catch (error) {
    console.error('Error verifying webhook signature:', error)
    throw error
  }
}

// Función para formatear precio en euros
export function formatPrice(amount: number, currency = 'EUR'): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency,
  }).format(amount / 100) // Stripe usa centavos
}

// Función para convertir euros a centavos
export function eurosToCents(euros: number): number {
  return Math.round(euros * 100)
}

// Función para convertir centavos a euros
export function centsToEuros(cents: number): number {
  return cents / 100
}