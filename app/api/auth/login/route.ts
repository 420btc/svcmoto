import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validaciones básicas
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Buscar usuario por email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Verificar si el usuario se registró con Google
    if (user.authMethod === 'GOOGLE') {
      return NextResponse.json(
        { 
          error: 'Esta cuenta fue creada con Google. Por favor, inicia sesión con Google.',
          authMethod: 'GOOGLE'
        },
        { status: 400 }
      );
    }

    // Por ahora, como no tenemos modelo de contraseñas, 
    // simularemos la verificación de contraseña
    // En producción, deberías verificar contra la contraseña hasheada
    
    // Actualizar última conexión
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        lastLoginAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Login exitoso',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        phone: updatedUser.phone,
        picture: updatedUser.picture,
        authMethod: updatedUser.authMethod,
        isVerified: updatedUser.isVerified,
        createdAt: updatedUser.createdAt
      }
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}