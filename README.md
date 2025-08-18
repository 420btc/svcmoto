# 🏍️ SVC Moto - Sistema de Alquiler de Motos

🏍️ **Alquiler de motos y patinetes eléctricos en Málaga**

Este es un proyecto de [Next.js](https://nextjs.org) para el alquiler de motocicletas con sistema de verificación de códigos.

## ✨ Funcionalidades Principales

### 🔐 Sistema de Verificación de Códigos
- **Generación automática** de códigos de 6 dígitos para cada reserva
- **Panel de administración** para verificar códigos 
- **Sistema de puntos** que se otorgan al verificar reservas
- **Historial completo** de reservas y verificaciones

### 🎯 Características del Sistema
- Autenticación con Google OAuth
- Base de datos PostgreSQL (Neon)
- Panel admin oculto y seguro
- Integración con Mapbox para ubicaciones
- Chatbot con OpenAI
- Diseño responsive con Tailwind CSS

## 🔄 Variables de Entorno Requeridas

### **Para que funcione correctamente en Vercel, asegúrate de tener estas variables:**

```env
# Base de datos PostgreSQL (Neon)
POSTGRES_PRISMA_URL=postgres://...
POSTGRES_URL_NON_POOLING=postgresql://...

# Autenticación Google
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-secret

# OpenAI para chatbot
OPENAI_API_KEY=your-api-key

# Mapbox para mapas
NEXT_PUBLIC_MAPBOX_TOKEN=your-token

# JWT y seguridad
JWT_SECRET=your-jwt-secret
NEXTAUTH_SECRET=your-nextauth-secret
```

### ⚠️ **Importante**: 
Si falta `POSTGRES_PRISMA_URL`, la aplicación no funcionará. Esta variable debe estar configurada exactamente con ese nombre en Vercel.

## 🗄️ Base de Datos - Neon PostgreSQL

### ¿Qué es Neon?
**Neon** es una plataforma de base de datos PostgreSQL serverless que ofrece:
- **Escalado automático**: Se adapta automáticamente a la carga de trabajo
- **Branching**: Permite crear ramas de la base de datos para desarrollo
- **Conexiones pooling**: Optimiza las conexiones para mejor rendimiento
- **Backup automático**: Respaldos automáticos y recuperación point-in-time
- **Serverless**: Solo pagas por lo que usas, ideal para aplicaciones Next.js

### Configuración de Neon
1. **Crear cuenta** en [neon.tech](https://neon.tech)
2. **Crear proyecto** PostgreSQL
3. **Obtener URLs** de conexión:
   - `POSTGRES_PRISMA_URL`: Para Prisma (con pooling)
   - `POSTGRES_URL_NON_POOLING`: Para conexiones directas
4. **Configurar variables** en Vercel/local

### Estructura de la Base de Datos

Nuestra aplicación utiliza **6 tablas principales** con relaciones bien definidas:

#### 📋 **Tabla: users**
**Propósito**: Almacena información de usuarios registrados
```sql
- id (String): ID único del usuario (CUID)
- email (String): Email único del usuario
- name (String?): Nombre del usuario (opcional)
- phone (String?): Teléfono del usuario (opcional)
- googleId (String?): ID de Google OAuth (único)
- picture (String?): URL de foto de perfil de Google
- authMethod (AuthMethod): EMAIL | GOOGLE
- isVerified (Boolean): Si el email está verificado
- lastLoginAt (DateTime?): Última fecha de login
- createdAt/updatedAt (DateTime): Timestamps
```
**Relaciones**: 
- Uno a muchos con `bookings`, `services`, `pointsLedger`, `discounts`

#### 🏍️ **Tabla: bookings**
**Propósito**: Gestiona reservas de vehículos (motos/patinetes)
```sql
- id (String): ID único de la reserva
- userId (String): Referencia al usuario
- vehicleType (String): "moto", "patinete", etc.
- vehicleId (String): ID específico del vehículo
- startAt/endAt (DateTime): Fechas de inicio y fin
- totalPrice (Float): Precio total de la reserva
- status (BookingStatus): Estado de la reserva
- verificationCode (String?): Código de 6 dígitos único
- isVerified (Boolean): Si fue verificado por admin
- pointsAwarded (Int?): Puntos otorgados al completar
- estimatedKm/duration (Float?): Datos del viaje
- completedAt/cancelledAt (DateTime?): Fechas de estado
- notes (String?): Notas adicionales
```
**Estados posibles**:
- `PENDING`: Reserva creada, esperando verificación
- `VERIFIED`: Verificada por admin, lista para usar
- `COMPLETED`: Completada y puntos otorgados
- `COMPLETED_NO_VERIFICATION`: Completada sin verificación
- `CANCELLED`: Cancelada
- `EXPIRED`: Expirada sin usar

#### 🎯 **Tabla: points_ledger**
**Propósito**: Registro contable de puntos (ganados/gastados)
```sql
- id (String): ID único del registro
- userId (String): Referencia al usuario
- bookingId (String?): Reserva relacionada (opcional)
- discountId (String?): Descuento relacionado (opcional)
- points (Int): Puntos (+ganados / -gastados)
- reason (String): "rental_completion", "bonus", "redemption"
- description (String?): Descripción adicional
- createdAt (DateTime): Fecha del movimiento
```
**Casos de uso**:
- **+12 puntos**: Por cada euro gastado
- **+100 puntos**: Bonus por completar alquiler
- **+200 puntos**: Por reseña positiva
- **-1875 puntos**: Canje por descuento 5€

#### 🎫 **Tabla: discounts**
**Propósito**: Códigos de descuento generados con puntos
```sql
- id (String): ID único del descuento
- userId (String): Usuario que generó el descuento
- pointsUsed (Int): Puntos gastados para generarlo
- discountAmount (Float): Cantidad del descuento en euros
- discountCode (String): Código único de 6 dígitos
- status (DiscountStatus): Estado del descuento
- validatedAt (DateTime?): Fecha de validación
- validatedBy (String?): Admin que validó
- expiresAt (DateTime): Fecha de expiración
```
**Estados posibles**:
- `PENDING`: Generado, esperando validación
- `VALIDATED`: Validado en tienda física
- `EXPIRED`: Expirado
- `CANCELLED`: Cancelado

#### 🛠️ **Tabla: services**
**Propósito**: Solicitudes de servicios técnicos (reparación/mantenimiento)
```sql
- id (String): ID único del servicio
- userId (String): Usuario que solicita
- serviceType (String): "mantenimiento", "reparacion", etc.
- vehicleType (String?): Tipo de vehículo
- description (String): Descripción del problema/servicio
- contactInfo (String): Email/teléfono de contacto
- preferredDate (DateTime?): Fecha preferida
- status (ServiceStatus): Estado del servicio
- estimatedPrice/finalPrice (Float?): Precios
- completedAt/cancelledAt (DateTime?): Fechas
- notes (String?): Notas del técnico
- emailSent (Boolean): Si se envió confirmación
```
**Estados posibles**:
- `PENDING`: Solicitado, esperando confirmación
- `CONFIRMED`: Confirmado
- `IN_PROGRESS`: En progreso
- `COMPLETED`: Completado
- `CANCELLED`: Cancelado

### 🔄 Flujo de Datos Principal

1. **Usuario se registra** → Se crea en `users`
2. **Hace una reserva** → Se crea en `bookings` con `verificationCode`
3. **Admin verifica** → `booking.status` = `VERIFIED`
4. **Usuario completa viaje** → `booking.status` = `COMPLETED`
5. **Sistema otorga puntos** → Se crean registros en `points_ledger`
6. **Usuario canjea puntos** → Se crea `discount` y registro negativo en `points_ledger`
7. **Usuario usa descuento** → `discount.status` = `VALIDATED`

### 🔧 Comandos Útiles de Prisma

```bash
# Generar cliente Prisma
npx prisma generate

# Aplicar migraciones
npx prisma db push

# Ver base de datos
npx prisma studio

# Reset completo (¡CUIDADO!)
npx prisma db reset

# Crear migración
npx prisma migrate dev --name nombre_migracion
```

### 📊 Consultas Comunes

```typescript
// Obtener puntos totales de un usuario
const totalPoints = await prisma.pointsLedger.aggregate({
  where: { userId },
  _sum: { points: true }
})

// Historial de reservas completadas
const completedBookings = await prisma.booking.findMany({
  where: { 
    userId,
    status: { in: ['COMPLETED', 'VERIFIED'] }
  },
  include: { pointsLedger: true }
})

// Descuentos válidos del usuario
const validDiscounts = await prisma.discount.findMany({
  where: {
    userId,
    status: 'PENDING',
    expiresAt: { gt: new Date() }
  }
})
```

---

**🚀 Deploy actualizado - Variables de entorno configuradas correctamente**

Plataforma web completa de SVC MOTO, empresa líder en alquiler de vehículos eléctricos y servicios de reparación y mantenimiento en Málaga. Incluye sistema de usuarios, rutas turísticas interactivas, y experiencia multiidioma.

## 📋 Descripción

SVC MOTO es una plataforma integral que permite a los usuarios explorar Málaga de forma sostenible mediante el alquiler de motos y patinetes eléctricos. Nuestro sitio web ofrece una experiencia completa con autenticación de usuarios, sistema de puntos, rutas turísticas guiadas, y gestión completa de reservas.

## ✨ Características Implementadas

### 🏠 Página Principal
- **Hero Section** con video de introducción y animaciones
- **Estadísticas** de la empresa (valoraciones, seguridad, eco-friendly)
- **Proceso de alquiler** explicado paso a paso con iconografía
- **Navegación** intuitiva y completamente responsive
- **Sección de contacto** integrada con video de fondo
- **Footer** completo con enlaces y redes sociales

### 🏍️ Página de Alquiler
- **Catálogo interactivo** de vehículos con especificaciones detalladas
- **Sistema de precios** dinámico (hora, medio día, día completo, semanal)
- **Modal de detalles** para cada vehículo con características completas
- **Simulador de reservas** con gestión de estado local
- **Tres tipos de vehículos** completamente configurados:
  - Urban Rider Pro (Scooter Eléctrico)
  - City Explorer (Moto Eléctrica) 
  - Eco Cruiser (Patinete Eléctrico)
- **Proceso de reserva** paso a paso con validaciones

### 🛠️ Página de Servicios
- **Catálogo completo** de servicios técnicos
- **Modal interactivo** para solicitud de servicios
- **Servicios especializados** con precios y descripciones:
  - Reparación General
  - Cambio de Batería
  - Mantenimiento Preventivo
  - Diagnóstico Técnico
  - Servicio Express
- **Formulario de solicitud** con validaciones
- **Garantías y certificaciones** incluidas

### 📍 Página de Contacto
- **Mapa interactivo Mapbox** con ubicación precisa
- **Sistema de rutas turísticas** con pathfinding real:
  - Ruta 1: Centro Histórico (Catedral, Alcazaba, Museo Picasso)
  - Ruta 2: Playa y Puerto (Muelle Uno, Malagueta, Puerto)
  - Ruta 3: Mirador y Castillo (Gibralfaro, Mirador, Parador)
- **Formulario de contacto** completamente funcional
- **Información de contacto** completa con horarios
- **Tarjeta de reseñas Google** integrada
- **Botones de contacto rápido** (WhatsApp, llamada)

### 👤 Página de Perfil de Usuario
- **Autenticación completa** con Google OAuth
- **Dashboard personalizado** con estadísticas del usuario
- **Sistema de puntos** gamificado con recompensas:
  - Puntos por alquileres completados
  - Sistema de niveles y logros
  - 22 logros diferentes desbloqueables
  - Recompensas por puntos acumulados
- **Historial de alquileres** con detalles completos
- **Gestión de información personal** editable
- **Estadísticas ambientales** (CO2 ahorrado, km recorridos)

### 🔐 Sistema de Autenticación
- **Google OAuth** integrado y funcional
- **Gestión de sesiones** persistente
- **Estados de autenticación** en toda la aplicación
- **Protección de rutas** para contenido de usuarios
- **Modal de bienvenida** para nuevos usuarios

### 🌍 Sistema Multiidioma
- **Soporte completo** para Español e Inglés
- **Contexto de traducciones** centralizado
- **Toggle de idioma** en toda la aplicación
- **Más de 200 traducciones** implementadas
- **Persistencia de preferencia** de idioma

## 🛠️ Stack Tecnológico

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Componentes UI**: shadcn/ui
- **Iconos**: Lucide React
- **Fuentes**: Geist Sans & Geist Mono

### Mapas y Geolocalización
- **Mapas**: Mapbox GL JS
- **API de Rutas**: Mapbox Directions API
- **Pathfinding**: Algoritmos de navegación real
- **Geocodificación**: Coordenadas precisas de Málaga

### Autenticación y Datos
- **OAuth**: Google Authentication
- **Gestión de Estado**: React Hooks (useState, useEffect, useContext)
- **Persistencia**: LocalStorage para datos de usuario
- **Contextos**: React Context API para traducciones

### Herramientas de Desarrollo
- **Linting**: ESLint
- **Formateo**: Prettier (implícito)
- **Build**: Next.js optimizado
- **Deployment**: Vercel ready

## 🚀 Instalación y Desarrollo

### Prerrequisitos
- Node.js 18+ 
- npm, yarn o pnpm

### Instalación
```bash
# Clonar el repositorio
git clone https://github.com/420btc/svcmoto.git
cd svcmoto

# Instalar dependencias
npm install
# o
yarn install
# o
pnpm install
```

### Desarrollo
```bash
# Iniciar servidor de desarrollo
npm run dev
# o
yarn dev
# o
pnpm dev
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

### Build para Producción
```bash
# Crear build optimizado
npm run build
npm start
```

## 🚀 Funcionalidades Avanzadas

### 🗺️ Sistema de Rutas Turísticas
- **3 rutas predefinidas** por sitios emblemáticos de Málaga
- **Pathfinding real** usando Mapbox Directions API
- **Navegación calle por calle** (no líneas rectas)
- **Visualización interactiva** con líneas naranjas
- **Punto de partida y llegada** en la tienda
- **Descripciones detalladas** de cada ruta

### 🎮 Sistema de Gamificación
- **22 logros únicos** desbloqueables:
  - Primer Viaje, Explorador, Eco Principiante
  - Frecuente, Aventurero, Eco Consciente
  - Habitual, Viajero, Eco Defensor, Veterano
  - Nómada, Eco Héroe, Experto, Explorador Urbano
  - Eco Warrior, Maestro, Velocista, Maratonista
  - Eco Leyenda, Súper Viajero, Centurión, Eco Dios
- **Sistema de puntos** por actividades
- **Niveles de recompensas** con descuentos
- **Estadísticas ambientales** personalizadas

### 📱 Experiencia Móvil Optimizada
- **Diseño 100% responsive** en todas las páginas
- **Navegación móvil** con menú hamburguesa
- **Modales adaptables** para pantallas pequeñas
- **Botones de contacto directo** (WhatsApp, llamada)
- **Optimización de formularios** para móvil

## 🔮 Roadmap Futuro

### 📧 Backend Integration
- **API REST** para gestión de datos
- **Base de datos** para usuarios y reservas
- **EmailJS** para notificaciones automáticas
- **Sistema de pagos** integrado

### 🔐 Panel de Administración
- **Dashboard administrativo** para gestión de flota
- **Gestión de reservas** en tiempo real
- **Analytics avanzados** de uso y rendimiento
- **Sistema de inventario** de vehículos

### 🌟 Mejoras UX/UI
- **Modo oscuro** automático
- **Chatbot con IA** para atención 24/7
- **Sistema de valoraciones** y reseñas
- **Notificaciones push** web

### 🔌 Integraciones Adicionales
- **Google Analytics 4** para métricas detalladas
- **WhatsApp Business API** para soporte automatizado
- **Integración con redes sociales** para compartir rutas
- **API de clima** para recomendaciones de rutas

## 📁 Estructura del Proyecto

```
svc-moto-landing/
├── app/                    # App Router de Next.js
│   ├── alquiler/          # Página de alquiler con catálogo
│   ├── api/               # API routes
│   │   ├── auth/          # Endpoints de autenticación
│   │   └── chat/          # Endpoints para chatbot
│   ├── contacto/          # Página de contacto con rutas
│   ├── handler/           # Manejadores de autenticación
│   │   └── [...stack]/    # Stack Auth handlers
│   ├── perfil/            # Página de perfil de usuario
│   ├── reservas/          # Gestión de reservas
│   ├── servicios/         # Página de servicios técnicos
│   ├── globals.css        # Estilos globales
│   ├── layout.tsx         # Layout principal con navegación
│   ├── page.tsx           # Página de inicio
│   └── sitemap.ts         # Sitemap para SEO
├── components/            # Componentes reutilizables
│   ├── ui/               # Componentes de shadcn/ui (40+ componentes)
│   ├── ChatBot.tsx       # Componente de chatbot
│   ├── LanguageToggle.tsx # Toggle de idiomas
│   └── theme-provider.tsx # Proveedor de temas
├── contexts/             # Contextos de React
│   └── TranslationContext.tsx # Sistema de traducciones
├── hooks/                # Custom hooks
│   ├── use-mobile.ts     # Hook para detección móvil
│   └── use-toast.ts      # Hook para notificaciones
├── lib/                  # Utilidades
│   └── utils.ts          # Funciones de utilidad
├── public/               # Archivos estáticos
│   ├── Video2.mp4        # Videos de fondo
│   ├── Video3.mp4
│   ├── herovideo.mp4
│   ├── logo-svcmoto.jpeg # Logo de la empresa
│   └── *.svg             # Iconos y placeholders
├── styles/               # Estilos adicionales
│   └── globals.css       # Estilos CSS globales
├── components.json       # Configuración de shadcn/ui
├── next.config.mjs       # Configuración de Next.js
├── package.json          # Dependencias del proyecto
├── tailwind.config.ts    # Configuración de Tailwind
└── tsconfig.json         # Configuración de TypeScript
```

## 📊 Estadísticas del Proyecto

- **Páginas**: 5 páginas principales completamente funcionales
- **Componentes**: 40+ componentes UI reutilizables
- **Traducciones**: 200+ strings traducidos (ES/EN)
- **Rutas turísticas**: 3 rutas con pathfinding real
- **Logros**: 22 achievements únicos
- **Líneas de código**: 2000+ líneas de TypeScript/TSX
- **Responsive**: 100% compatible móvil/desktop
- **Performance**: Optimizado para Core Web Vitals



## 🎯 Características Destacadas

### 🔥 Innovaciones Implementadas
- **Rutas turísticas interactivas** con navegación real
- **Sistema de gamificación** completo con 22 logros
- **Autenticación social** con Google OAuth
- **Multiidioma** dinámico (ES/EN)
- **Mapas avanzados** con Mapbox y pathfinding
- **Experiencia móvil** optimizada al 100%
- **Sistema de puntos** y recompensas
- **Dashboard de usuario** personalizado

### 🏆 Logros Técnicos
- **Performance**: Optimizado para Core Web Vitals
- **SEO**: Sitemap y meta tags optimizados
- **Accessibility**: Componentes accesibles
- **TypeScript**: 100% tipado estático
- **Responsive**: Mobile-first design
- **Modern Stack**: Next.js 14 + React 18

## 📞 Información de Contacto

### 🏢 SVC MOTO
- **Teléfono**: 607 22 88 82
- **WhatsApp**: 607 22 88 82
- **Dirección**: C. Héroe de Sostoa, 37, Carretera de Cádiz, 29002 Málaga
- **Horario**: Lunes a Viernes 10:00-19:00
- **Email**: info@svcmoto.com

### 👨‍💻 Desarrollo
- **Desarrollador**: Carlos Freire
- **Portfolio**: [Carlosfr.es](https://carlosfr.es)
- **GitHub**: [420btc](https://github.com/420btc)
- **Tecnologías**: Next.js, TypeScript, Tailwind CSS

## 🚀 Deployment

### Vercel (Recomendado)
```bash
# Deploy automático con Vercel
vercel --prod
```

### Variables de Entorno
```env
NEXT_PUBLIC_MAPBOX_TOKEN=tu_token_de_mapbox
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret
```

## 📄 Licencia

Este proyecto es propiedad de **SVC MOTO**. Todos los derechos reservados.

**Desarrollado con ❤️ por [Carlos Freire](https://carlosfr.es)**

---

**SVC MOTO** - *Explora Málaga de forma sostenible* 🌱🏍️

*Plataforma completa de movilidad eléctrica con rutas turísticas interactivas*