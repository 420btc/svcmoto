import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { discountCode, adminId } = await request.json();

    if (!discountCode) {
      return NextResponse.json(
        { error: 'Código de descuento es requerido' },
        { status: 400 }
      );
    }

    // Buscar el descuento por código
    const discount = await prisma.discount.findUnique({
      where: { discountCode },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!discount) {
      return NextResponse.json(
        { error: 'Código de descuento no encontrado' },
        { status: 404 }
      );
    }

    // Verificar si ya fue validado
    if (discount.status === 'VALIDATED') {
      return NextResponse.json(
        { 
          error: 'Este código ya fue validado',
          validatedAt: discount.validatedAt,
          validatedBy: discount.validatedBy
        },
        { status: 400 }
      );
    }

    // Verificar si expiró
    if (discount.expiresAt < new Date()) {
      // Marcar como expirado
      await prisma.discount.update({
        where: { id: discount.id },
        data: { status: 'EXPIRED' }
      });
      
      return NextResponse.json(
        { error: 'Este código de descuento ha expirado' },
        { status: 400 }
      );
    }

    // Verificar si fue cancelado
    if (discount.status === 'CANCELLED') {
      return NextResponse.json(
        { error: 'Este código de descuento fue cancelado' },
        { status: 400 }
      );
    }

    // Validar el descuento
    const validatedDiscount = await prisma.discount.update({
      where: { id: discount.id },
      data: {
        status: 'VALIDATED',
        validatedAt: new Date(),
        validatedBy: adminId || 'admin'
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Descuento validado exitosamente',
      discount: {
        id: validatedDiscount.id,
        discountCode: validatedDiscount.discountCode,
        discountAmount: validatedDiscount.discountAmount,
        pointsUsed: validatedDiscount.pointsUsed,
        status: validatedDiscount.status,
        validatedAt: validatedDiscount.validatedAt,
        user: validatedDiscount.user
      }
    });
  } catch (error) {
    console.error('Error validating discount:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// Endpoint para obtener información de un código sin validarlo
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const discountCode = searchParams.get('code');

    if (!discountCode) {
      return NextResponse.json(
        { error: 'Código de descuento es requerido' },
        { status: 400 }
      );
    }

    const discount = await prisma.discount.findUnique({
      where: { discountCode },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!discount) {
      return NextResponse.json(
        { error: 'Código de descuento no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      discount: {
        id: discount.id,
        discountCode: discount.discountCode,
        discountAmount: discount.discountAmount,
        pointsUsed: discount.pointsUsed,
        status: discount.status,
        validatedAt: discount.validatedAt,
        expiresAt: discount.expiresAt,
        createdAt: discount.createdAt,
        user: discount.user
      }
    });
  } catch (error) {
    console.error('Error fetching discount:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}