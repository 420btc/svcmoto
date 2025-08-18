/**
 * Utilidades para generar y validar códigos de verificación
 */

/**
 * Genera un código de verificación único de 6 dígitos en formato XXX XXX
 * @returns string - Código de verificación en formato "123 456"
 */
export function generateVerificationCode(): string {
  // Generar 6 dígitos aleatorios
  const code = Math.floor(100000 + Math.random() * 900000).toString()
  
  // Formatear como XXX XXX
  return `${code.slice(0, 3)} ${code.slice(3)}`
}

/**
 * Normaliza un código de verificación removiendo espacios y caracteres especiales
 * @param code - Código a normalizar
 * @returns string - Código normalizado de 6 dígitos
 */
export function normalizeVerificationCode(code: string): string {
  return code.replace(/\D/g, '').slice(0, 6)
}

/**
 * Valida que un código de verificación tenga el formato correcto
 * @param code - Código a validar
 * @returns boolean - true si el código es válido
 */
export function isValidVerificationCode(code: string): boolean {
  const normalized = normalizeVerificationCode(code)
  return normalized.length === 6 && /^\d{6}$/.test(normalized)
}

/**
 * Formatea un código de verificación a formato XXX XXX
 * @param code - Código de 6 dígitos
 * @returns string - Código formateado
 */
export function formatVerificationCode(code: string): string {
  const normalized = normalizeVerificationCode(code)
  if (normalized.length !== 6) {
    throw new Error('El código debe tener exactamente 6 dígitos')
  }
  return `${normalized.slice(0, 3)} ${normalized.slice(3)}`
}

/**
 * Calcula los puntos a otorgar basado en el precio total de la reserva
 * @param totalPrice - Precio total de la reserva
 * @returns number - Puntos a otorgar
 */
export function calculatePoints(totalPrice: number): number {
  const pointsPerEuro = parseInt(process.env.POINTS_PER_EURO || '12')  // Reducido de 15 a 12 puntos por euro
  const completionBonus = parseInt(process.env.COMPLETION_BONUS_POINTS || '40')  // Reducido de 50 a 40 puntos
  
  const basePoints = Math.floor(totalPrice * pointsPerEuro)
  return basePoints + completionBonus
}