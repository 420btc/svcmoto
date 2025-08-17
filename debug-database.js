const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function debugDatabase() {
  try {
    console.log('🔍 Depurando base de datos...')
    console.log('')
    
    // Obtener todas las reservas
    const allBookings = await prisma.booking.findMany({
      include: {
        user: true
      }
    })
    
    console.log('📊 Total de reservas en BD:', allBookings.length)
    console.log('')
    
    if (allBookings.length === 0) {
      console.log('❌ No hay reservas en la base de datos')
      return
    }
    
    // Mostrar todas las reservas
    allBookings.forEach((booking, index) => {
      console.log(`📋 Reserva ${index + 1}:`)
      console.log('  ID:', booking.id)
      console.log('  Usuario:', booking.user.email)
      console.log('  Código:', booking.verificationCode)
      console.log('  Estado:', booking.status)
      console.log('  Verificado:', booking.isVerified)
      console.log('  Vehículo:', booking.vehicleType)
      console.log('')
    })
    
    // Buscar específicamente el código que creamos
    const testCode = '236314'
    const testCodeWithSpace = '236 314'
    
    console.log('🔍 Buscando código sin espacio:', testCode)
    const found1 = await prisma.booking.findFirst({
      where: {
        verificationCode: {
          contains: testCode
        },
        isVerified: false,
        status: 'PENDING'
      }
    })
    console.log('Resultado:', found1 ? 'ENCONTRADO' : 'NO ENCONTRADO')
    if (found1) {
      console.log('Código en BD:', found1.verificationCode)
    }
    console.log('')
    
    console.log('🔍 Buscando código con espacio:', testCodeWithSpace)
    const found2 = await prisma.booking.findFirst({
      where: {
        verificationCode: {
          contains: testCodeWithSpace
        },
        isVerified: false,
        status: 'PENDING'
      }
    })
    console.log('Resultado:', found2 ? 'ENCONTRADO' : 'NO ENCONTRADO')
    if (found2) {
      console.log('Código en BD:', found2.verificationCode)
    }
    console.log('')
    
    // Buscar por coincidencia exacta
    console.log('🔍 Buscando coincidencia exacta con espacio:')
    const found3 = await prisma.booking.findFirst({
      where: {
        verificationCode: testCodeWithSpace,
        isVerified: false,
        status: 'PENDING'
      }
    })
    console.log('Resultado:', found3 ? 'ENCONTRADO' : 'NO ENCONTRADO')
    console.log('')
    
    // Buscar por coincidencia exacta sin espacio
    console.log('🔍 Buscando coincidencia exacta sin espacio:')
    const found4 = await prisma.booking.findFirst({
      where: {
        verificationCode: testCode,
        isVerified: false,
        status: 'PENDING'
      }
    })
    console.log('Resultado:', found4 ? 'ENCONTRADO' : 'NO ENCONTRADO')
    console.log('')
    
    // Buscar cualquier reserva pendiente
    console.log('🔍 Buscando cualquier reserva pendiente:')
    const pendingBookings = await prisma.booking.findMany({
      where: {
        isVerified: false,
        status: 'PENDING'
      }
    })
    console.log('Reservas pendientes encontradas:', pendingBookings.length)
    pendingBookings.forEach((booking, index) => {
      console.log(`  ${index + 1}. Código: "${booking.verificationCode}" (${booking.verificationCode?.length} caracteres)`)
    })
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

debugDatabase()