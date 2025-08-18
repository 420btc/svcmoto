import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'UserId es requerido' },
        { status: 400 }
      );
    }

    // Obtener todos los descuentos del usuario
    const discounts = await prisma.discount.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    // Calcular puntos totales del usuario
    const pointsLedger = await prisma.pointsLedger.findMany({
      where: { userId }
    });
    
    const totalPoints = pointsLedger.reduce((sum, entry) => sum + entry.points, 0);

    return NextResponse.json({
      discounts: discounts.map(discount => ({
        id: discount.id,
        discountCode: discount.discountCode,
        discountAmount: discount.discountAmount,
        pointsUsed: discount.pointsUsed,
        status: discount.status,
        validatedAt: discount.validatedAt,
        expiresAt: discount.expiresAt,
        createdAt: discount.createdAt
      })),
      userPoints: totalPoints
    });
  } catch (error) {
    console.error('Error fetching user discounts:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}