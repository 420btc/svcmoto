import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email, name, phone, password } = await request.json();

    // Validaciones básicas
    if (!email || !name || !password) {
      return NextResponse.json(
        { error: 'Email, nombre y contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { 
          error: 'Ya existe una cuenta con este email',
          userExists: true,
          authMethod: existingUser.authMethod
        },
        { status: 409 }
      );
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 12);

    // Crear nuevo usuario
    const user = await prisma.user.create({
      data: {
        email,
        name,
        phone: phone || null,
        authMethod: 'EMAIL',
        isVerified: false, // Requerirá verificación por email
        lastLoginAt: new Date()
      }
    });

    // Crear registro de contraseña (necesitarás crear este modelo)
    // Por ahora, retornamos éxito sin guardar la contraseña
    // En producción, deberías crear un modelo Password separado

    return NextResponse.json({
      success: true,
      message: 'Usuario registrado exitosamente',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        authMethod: user.authMethod,
        isVerified: user.isVerified,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Error registering user:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}