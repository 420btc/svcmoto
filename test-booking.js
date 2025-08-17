const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Función simple para generar código de verificación
function generateVerificationCode() {
  const code = Math.floor(100000 + Math.random() * 900000).toString()
  return `${code.slice(0, 3)} ${code.slice(3)}`
}

async function createTestBooking() {
  try {
    // Crear usuario de prueba
    const user = await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: {},
      create: {
        email: 'test@example.com',
        name: 'Usuario de Prueba',
        phone: '+34123456789'
      }
    })

    console.log('Usuario creado/encontrado:', user.id)

    // Generar código de verificación
    const verificationCode = generateVerificationCode()
    console.log('Código generado:', verificationCode)

    // Crear reserva de prueba
    const booking = await prisma.booking.create({
      data: {
        userId: user.id,
        vehicleType: 'Moto Eléctrica Premium',
        vehicleId: 'moto-001',
        startAt: new Date(),
        endAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 horas
        totalPrice: 25.0,
        status: 'PENDING',
        verificationCode: verificationCode,
        isVerified: false,
        estimatedKm: 15.0,
        duration: 2.0
      }
    })

    console.log('Reserva creada exitosamente:')
    console.log('ID:', booking.id)
    console.log('Código de verificación:', booking.verificationCode)
    console.log('Estado:', booking.status)
    console.log('Verificado:', booking.isVerified)

    // Verificar que se puede encontrar
    const foundBooking = await prisma.booking.findFirst({
      where: {
        verificationCode: {
          contains: verificationCode.replace(' ', '')
        },
        isVerified: false,
        status: 'PENDING'
      },
      include: {
        user: true
      }
    })

    if (foundBooking) {
      console.log('✅ Reserva encontrada correctamente en la búsqueda')
      console.log('Usuario:', foundBooking.user.name)
    } else {
      console.log('❌ No se pudo encontrar la reserva')
    }

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTestBooking()