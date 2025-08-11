# SVC MOTO - Landing Page

🏍️ **Alquiler de motos y patinetes eléctricos en Málaga**

Sitio web oficial de SVC MOTO, empresa especializada en el alquiler de vehículos eléctricos y servicios de reparación y mantenimiento en Málaga.

## 📋 Descripción

SVC MOTO es una plataforma que permite a los usuarios explorar Málaga de forma sostenible mediante el alquiler de motos y patinetes eléctricos. Nuestro sitio web ofrece información completa sobre nuestros servicios, flota de vehículos y ubicación.

## ✨ Características Actuales

### 🏠 Página Principal
- **Hero Section** con video de introducción
- **Estadísticas** de la empresa (valoraciones, seguridad, etc.)
- **Proceso de alquiler** explicado paso a paso
- **Navegación** intuitiva y responsive

### 🏍️ Página de Alquiler
- **Catálogo de vehículos** con especificaciones detalladas
- **Precios** por hora, medio día, día completo y semanal
- **Características** incluidas (casco, seguro, GPS, etc.)
- **Tres tipos de vehículos**:
  - Urban Rider Pro (Scooter Eléctrico)
  - City Explorer (Moto Eléctrica)
  - Eco Cruiser (Patinete Eléctrico)

### 🛠️ Página de Servicios
- **Reparación y mantenimiento** de vehículos eléctricos
- **Servicios especializados** para diferentes marcas
- **Información de contacto** para servicios técnicos

### 📍 Página de Contacto
- **Mapa interactivo** con Mapbox mostrando ubicación
- **Formulario de contacto** (próximamente funcional)
- **Información de contacto** completa
- **Horarios de atención**

## 🛠️ Tecnologías Utilizadas

- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Componentes UI**: shadcn/ui
- **Mapas**: Mapbox GL JS
- **Iconos**: Lucide React
- **Fuentes**: Geist Sans & Geist Mono

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

## 🔮 Próximas Funcionalidades

### 📧 EmailJS Integration
- **Formulario de contacto funcional** que enviará emails directamente
- **Notificaciones automáticas** para consultas de alquiler
- **Confirmaciones de reserva** por email

### 📱 Funcionalidades Móviles
- **App móvil nativa** para iOS y Android
- **Sistema de reservas** en tiempo real
- **Geolocalización** de vehículos disponibles
- **Pagos integrados** (Stripe/PayPal)

### 🔐 Panel de Administración
- **Dashboard** para gestión de flota
- **Sistema de usuarios** y autenticación
- **Gestión de reservas** y disponibilidad
- **Análisis y reportes** de uso

### 🌟 Mejoras UX/UI
- **Modo oscuro**
- **Múltiples idiomas** (Español, Inglés)
- **Chatbot** de atención al cliente
- **Sistema de valoraciones** y reseñas

### 🔌 Integraciones Adicionales
- **Google Analytics** para métricas
- **Google Maps** como alternativa a Mapbox
- **WhatsApp Business API** para soporte
- **Sistema de notificaciones push**

## 📁 Estructura del Proyecto

```
svc-moto-landing/
├── app/                    # App Router de Next.js
│   ├── alquiler/          # Página de alquiler
│   ├── contacto/          # Página de contacto
│   ├── servicios/         # Página de servicios
│   ├── globals.css        # Estilos globales
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página de inicio
├── components/            # Componentes reutilizables
│   ├── ui/               # Componentes de shadcn/ui
│   └── theme-provider.tsx
├── hooks/                # Custom hooks
├── lib/                  # Utilidades
├── public/               # Archivos estáticos
└── styles/               # Estilos adicionales
```

## 🌍 Variables de Entorno

Para el correcto funcionamiento, crear un archivo `.env.local`:

```env
# Mapbox (ya configurado)
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1IjoiNDIwYnRjIiwiYSI6ImNtOTN3ejBhdzByNjgycHF6dnVmeHl2ZTUifQ.Utq_q5wN6DHwpkn6rcpZdw

# EmailJS (próximamente)
NEXT_PUBLIC_EMAILJS_SERVICE_ID=tu_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=tu_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=tu_public_key
```

## 📞 Contacto

- **Teléfono**: 607 22 88 82
- **WhatsApp**: 607 22 88 82
- **Ubicación**: Cerca de Estación María Zambrano, Málaga
- **GitHub**: [420btc/svcmoto](https://github.com/420btc/svcmoto)

## 📄 Licencia

Este proyecto es propiedad de SVC MOTO. Todos los derechos reservados.

---

**SVC MOTO** - *Explora la ciudad de forma sostenible* 🌱