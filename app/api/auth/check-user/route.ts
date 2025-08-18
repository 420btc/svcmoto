import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email es requerido' },
        { status: 400 }
      );
    }

    // Buscar usuario por email
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        authMethod: true,
        googleId: true,
        isVerified: true,
        createdAt: true
      }
    });

    if (user) {
      return NextResponse.json({
        exists: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          authMethod: user.authMethod,
          hasGoogleAuth: !!user.googleId,
          isVerified: user.isVerified,
          createdAt: user.createdAt
        }
      });
    } else {
      return NextResponse.json({
        exists: false
      });
    }
  } catch (error) {
    console.error('Error checking user:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}