# 🚀 Guía de Deploy en Vercel

## 📋 Pasos para el deploy exitoso

### 1. **Configurar Base de Datos PostgreSQL**

#### Opción A: Vercel Postgres
```bash
# En el dashboard de Vercel
1. Ve a tu proyecto
2. Storage → Create Database → Postgres
3. Copia las variables de entorno generadas
```

#### Opción B: Supabase
```bash
1. Crea proyecto en supabase.com
2. Ve a Settings → Database
3. Copia la Connection String
```

### 2. **Variables de Entorno en Vercel**

Configura estas variables en Vercel Dashboard → Settings → Environment Variables:

```env
# Base de datos (REQUERIDO)
POSTGRES_PRISMA_URL=postgresql://...
POSTGRES_URL_NON_POOLING=postgresql://...

# Autenticación Google (REQUERIDO)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# OpenAI (REQUERIDO para chatbot)
OPENAI_API_KEY=your-openai-api-key

# Mapbox (REQUERIDO para mapas)
NEXT_PUBLIC_MAPBOX_TOKEN=your-mapbox-token

# JWT (REQUERIDO)
JWT_SECRET=your-jwt-secret-key
NEXTAUTH_SECRET=your-nextauth-secret

# URL (AUTO-CONFIGURADO por Vercel)
NEXTAUTH_URL=https://tu-dominio.vercel.app
```

### 3. **Migrar Base de Datos**

```bash
# Después del deploy, ejecutar en Vercel Functions
npx prisma db push
```

### 4. **Verificar Deploy**

1. ✅ **Build exitoso**: Sin errores de compilación
2. ✅ **Base de datos**: Conexión establecida
3. ✅ **APIs funcionando**: `/api/users`, `/api/bookings`
4. ✅ **Autenticación**: Login con Google
5. ✅ **Reservas**: Creación y verificación

## 🔧 Solución de Problemas

### Error: "Error al crear/actualizar usuario"
- ✅ Verificar `POSTGRES_PRISMA_URL`
- ✅ Ejecutar `npx prisma db push`
- ✅ Verificar permisos de base de datos

### Error: "Database connection failed"
- ✅ Verificar formato de URL de conexión
- ✅ Verificar que la base de datos esté activa
- ✅ Verificar firewall/whitelist

### Error: "Google OAuth failed"
- ✅ Configurar dominio en Google Console
- ✅ Verificar `GOOGLE_CLIENT_ID` y `SECRET`
- ✅ Configurar `NEXTAUTH_URL` correctamente

## 🎯 Comandos Útiles

```bash
# Generar cliente Prisma
npx prisma generate

# Aplicar cambios a BD
npx prisma db push

# Ver base de datos
npx prisma studio

# Build local
npm run build
```

## ✅ Checklist Final

- [ ] Schema actualizado a PostgreSQL
- [ ] Variables de entorno configuradas
- [ ] Base de datos migrada
- [ ] Build exitoso
- [ ] APIs funcionando
- [ ] Sistema de verificación operativo

¡Tu aplicación estará lista para producción! 🎉