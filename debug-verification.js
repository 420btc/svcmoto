// Script para depurar la verificación de códigos
// Usando fetch nativo de Node.js 18+

async function testVerification() {
  const testCode = '236314' // Código sin espacio
  const testCodeWithSpace = '236 314' // Código con espacio
  
  console.log('🔍 Probando verificación de códigos...')
  console.log('Servidor: http://localhost:3000')
  console.log('')
  
  // Probar código sin espacio
  console.log('📝 Probando código sin espacio:', testCode)
  try {
    const response1 = await fetch('http://localhost:3000/api/admin/verify-booking', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        verificationCode: testCode
      })
    })
    
    const result1 = await response1.json()
    console.log('Status:', response1.status)
    console.log('Respuesta:', JSON.stringify(result1, null, 2))
  } catch (error) {
    console.log('❌ Error:', error.message)
  }
  
  console.log('')
  console.log('---')
  console.log('')
  
  // Probar código con espacio
  console.log('📝 Probando código con espacio:', testCodeWithSpace)
  try {
    const response2 = await fetch('http://localhost:3000/api/admin/verify-booking', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        verificationCode: testCodeWithSpace
      })
    })
    
    const result2 = await response2.json()
    console.log('Status:', response2.status)
    console.log('Respuesta:', JSON.stringify(result2, null, 2))
  } catch (error) {
    console.log('❌ Error:', error.message)
  }
  
  console.log('')
  console.log('---')
  console.log('')
  
  // Probar obtener todas las verificaciones
  console.log('📋 Obteniendo lista de verificaciones...')
  try {
    const response3 = await fetch('http://localhost:3000/api/admin/verifications')
    const result3 = await response3.json()
    console.log('Status:', response3.status)
    console.log('Verificaciones encontradas:', result3.verifications?.length || 0)
    if (result3.verifications?.length > 0) {
      console.log('Primera verificación:', JSON.stringify(result3.verifications[0], null, 2))
    }
  } catch (error) {
    console.log('❌ Error:', error.message)
  }
}

testVerification().catch(console.error)