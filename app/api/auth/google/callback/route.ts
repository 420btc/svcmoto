import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(new URL('/?error=auth_failed', request.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL('/?error=no_code', request.url));
  }

  try {
    // Intercambiar código por token de acceso
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        code,
        grant_type: 'authorization_code',
        redirect_uri: `${new URL(request.url).origin}/api/auth/google/callback`,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for token');
    }

    // Obtener información del usuario
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const userData = await userResponse.json();

    if (!userResponse.ok) {
      throw new Error('Failed to fetch user data');
    }

    // Buscar usuario existente por email o googleId
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: userData.email },
          { googleId: userData.id }
        ]
      }
    });

    let isNewUser = false;
    let authAction = 'login';

    if (user) {
      // Usuario existente - actualizar datos y última conexión
      if (!user.googleId) {
        // Usuario registrado con email, ahora vincula con Google
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            googleId: userData.id,
            picture: userData.picture,
            authMethod: 'GOOGLE',
            isVerified: true,
            lastLoginAt: new Date(),
            name: user.name || userData.name // Mantener nombre existente si lo hay
          }
        });
        authAction = 'linked';
      } else {
        // Usuario ya registrado con Google - solo actualizar última conexión
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            lastLoginAt: new Date(),
            picture: userData.picture // Actualizar foto de perfil
          }
        });
        authAction = 'login';
      }
    } else {
      // Nuevo usuario - crear registro
      user = await prisma.user.create({
        data: {
          email: userData.email,
          name: userData.name,
          googleId: userData.id,
          picture: userData.picture,
          authMethod: 'GOOGLE',
          isVerified: true,
          lastLoginAt: new Date()
        }
      });
      isNewUser = true;
      authAction = 'register';
    }

    // Crear HTML para guardar datos en localStorage y redirigir
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Autenticación exitosa</title>
        </head>
        <body>
          <script>
            // Guardar datos del usuario en localStorage
            localStorage.setItem('user', JSON.stringify({
              id: '${user.id}',
              email: '${user.email}',
              name: '${user.name || ''}',
              picture: '${user.picture || ''}',
              isAuthenticated: true,
              provider: 'google',
              authMethod: '${user.authMethod}',
              isVerified: ${user.isVerified},
              createdAt: '${user.createdAt.toISOString()}'
            }));
            
            // Marcar que el usuario acaba de conectarse y el tipo de acción
            localStorage.setItem('justConnected', 'true');
            localStorage.setItem('authAction', '${authAction}');
            localStorage.setItem('isNewUser', '${isNewUser}');
            
            // Redirigir al perfil del usuario
            window.location.href = '/perfil';
          </script>
          <div style="text-align: center; padding: 50px; font-family: Arial, sans-serif;">
            <h2>Autenticación exitosa</h2>
            <p>Redirigiendo...</p>
          </div>
        </body>
      </html>
    `;

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('Google Auth Error:', error);
    return NextResponse.redirect(new URL('/?error=auth_failed', request.url));
  }
}