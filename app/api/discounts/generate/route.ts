import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Configuración de descuentos por puntos (aumentado 25%)
const DISCOUNT_TIERS = [
  { points: 1875, discount: 5 },   // 1875 puntos = 5€ descuento
  { points: 3125, discount: 10 },  // 3125 puntos = 10€ descuento
  { points: 5000, discount: 0, type: 'free_scooter' },  // 5000 puntos = 1 hora gratis patinete
  { points: 7500, discount: 0, type: 'premium_free' },  // 7500 puntos = 2 horas gratis moto eléctrica
];

function generateDiscountCode(): string {
  // Generar código de 6 dígitos único
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const { userId, pointsToUse } = await request.json();

    if (!userId || !pointsToUse) {
      return NextResponse.json(
        { error: 'UserId y pointsToUse son requeridos' },
        { status: 400 }
      );
    }

    // Verificar que el tier de puntos sea válido
    const selectedTier = DISCOUNT_TIERS.find(tier => tier.points === pointsToUse);
    if (!selectedTier) {
      return NextResponse.json(
        { error: 'Cantidad de puntos no válida' },
        { status: 400 }
      );
    }

    // Verificar que el usuario existe y tiene suficientes puntos
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        pointsLedger: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Calcular puntos totales del usuario
    const totalPoints = user.pointsLedger.reduce((sum, entry) => sum + entry.points, 0);
    
    if (totalPoints < pointsToUse) {
      return NextResponse.json(
        { 
          error: 'Puntos insuficientes',
          available: totalPoints,
          required: pointsToUse
        },
        { status: 400 }
      );
    }

    // Generar código único
    let discountCode: string;
    let isUnique = false;
    let attempts = 0;
    
    do {
      discountCode = generateDiscountCode();
      const existing = await prisma.discount.findUnique({
        where: { discountCode }
      });
      isUnique = !existing;
      attempts++;
    } while (!isUnique && attempts < 10);

    if (!isUnique) {
      return NextResponse.json(
        { error: 'Error generando código único' },
        { status: 500 }
      );
    }

    // Crear el descuento y registrar el gasto de puntos en una transacción
    const result = await prisma.$transaction(async (tx) => {
      // Crear el descuento
      const discount = await tx.discount.create({
        data: {
          userId,
          pointsUsed: pointsToUse,
          discountAmount: selectedTier.discount,
          discountCode: discountCode!,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 días
        }
      });

      // Registrar el gasto de puntos
      const description = selectedTier.type === 'free_scooter' 
        ? 'Alquiler gratis de 1 hora de patinete'
        : selectedTier.type === 'premium_free'
        ? 'Alquiler premium gratis de 2 horas de moto eléctrica'
        : `Descuento de ${selectedTier.discount}€ generado`;
        
      await tx.pointsLedger.create({
        data: {
          userId,
          points: -pointsToUse, // Puntos negativos = gastados
          reason: 'discount_redemption',
          description
        }
      });

      return discount;
    });

    return NextResponse.json({
      success: true,
      discount: {
        id: result.id,
        discountCode: result.discountCode,
        discountAmount: result.discountAmount,
        pointsUsed: result.pointsUsed,
        expiresAt: result.expiresAt,
        status: result.status
      }
    });
  } catch (error) {
    console.error('Error generating discount:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// Endpoint para obtener los tiers de descuento disponibles
export async function GET() {
  return NextResponse.json({
    tiers: DISCOUNT_TIERS
  });
}