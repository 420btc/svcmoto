# 🚀 Configuración de Stripe para SVC Moto

Esta guía te ayudará a configurar Stripe paso a paso para procesar pagos en tu aplicación.

## 📋 Requisitos Previos

- Cuenta de Stripe (gratuita)
- Acceso al dashboard de Vercel (para variables de entorno)
- Documento de identidad para verificación de cuenta

## 🔧 Paso 1: Crear Cuenta de Stripe

### 1.1 Registro
1. Ve a [https://stripe.com](https://stripe.com)
2. Haz clic en "Start now" o "Empezar ahora"
3. Completa el formulario con:
   - Email de tu empresa
   - Nombre completo
   - Contraseña segura
4. Verifica tu email

### 1.2 Configuración de Empresa
1. Selecciona **España** como país
2. Tipo de negocio: **Empresa individual** o **Sociedad** (según corresponda)
3. Sector: **Transporte y logística** > **Alquiler de vehículos**
4. Completa la información fiscal:
   - NIF/CIF
   - Dirección fiscal
   - Teléfono de contacto

### 1.3 Verificación de Identidad
1. Sube una foto de tu DNI/NIE (ambas caras)
2. Proporciona información bancaria:
   - IBAN de la cuenta donde recibir pagos
   - Extracto bancario (si se solicita)

## 🔑 Paso 2: Obtener Claves de API

### 2.1 Acceder al Dashboard
1. Inicia sesión en [https://dashboard.stripe.com](https://dashboard.stripe.com)
2. Ve a **Developers** > **API keys**

### 2.2 Claves Necesarias

#### Para Testing (Desarrollo):
```
Publishable key: pk_test_...
Secret key: sk_test_...
```

#### Para Producción (Cuando esté listo):
```
Publishable key: pk_live_...
Secret key: sk_live_...
```

⚠️ **IMPORTANTE**: Nunca compartas la Secret key públicamente

## 🌐 Paso 3: Configurar Variables de Entorno

### 3.1 En Desarrollo Local
Crea/edita el archivo `.env.local` en la raíz del proyecto:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_tu_clave_secreta_aqui
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_tu_clave_publica_aqui
STRIPE_WEBHOOK_SECRET=whsec_tu_webhook_secret_aqui

# Domain for redirects
NEXT_PUBLIC_DOMAIN=http://localhost:3000
```

### 3.2 En Vercel (Producción)
1. Ve a tu proyecto en [vercel.com](https://vercel.com)
2. Settings > Environment Variables
3. Añade estas variables:

| Variable | Valor | Environment |
|----------|-------|-------------|
| `STRIPE_SECRET_KEY` | `sk_live_...` | Production |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_live_...` | Production |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | Production |
| `NEXT_PUBLIC_DOMAIN` | `https://tudominio.com` | Production |

## 🔗 Paso 4: Configurar Webhooks

### 4.1 Crear Webhook
1. En Stripe Dashboard: **Developers** > **Webhooks**
2. Clic en **Add endpoint**
3. URL del endpoint: `https://tudominio.com/api/stripe/webhook`
4. Selecciona estos eventos:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `invoice.payment_succeeded`

### 4.2 Obtener Webhook Secret
1. Clic en el webhook creado
2. En la sección **Signing secret**, clic en **Reveal**
3. Copia el valor `whsec_...`
4. Añádelo a tus variables de entorno como `STRIPE_WEBHOOK_SECRET`

## 💳 Paso 5: Configurar Productos y Precios

### 5.1 Productos Recomendados
En **Products** > **Add product**, crea:

#### Moto Eléctrica
- **Nombre**: Alquiler Moto Eléctrica
- **Descripción**: Alquiler de moto eléctrica por horas
- **Precios**:
  - Por hora: €15.00
  - Medio día: €35.00
  - Día completo: €60.00
  - Semanal: €350.00

#### Patinete Eléctrico
- **Nombre**: Alquiler Patinete Eléctrico
- **Descripción**: Alquiler de patinete eléctrico por horas
- **Precios**:
  - Por hora: €8.00
  - Medio día: €20.00
  - Día completo: €35.00
  - Semanal: €200.00

#### Servicios
- **Mantenimiento**: €25.00
- **Reparación**: €45.00
- **Cambio de Batería**: €5.00

### 5.2 Configuración de Impuestos
1. Ve a **Settings** > **Tax settings**
2. Configura IVA español (21% para servicios)
3. Activa cálculo automático de impuestos

## 🧪 Paso 6: Testing

### 6.1 Tarjetas de Prueba
Usa estas tarjetas para testing:

```
# Pago exitoso
4242 4242 4242 4242
Fecha: Cualquier fecha futura
CVC: Cualquier 3 dígitos

# Pago rechazado
4000 0000 0000 0002

# Requiere autenticación 3D Secure
4000 0025 0000 3155
```

### 6.2 Probar Flujo Completo
1. Haz una reserva en tu aplicación
2. Completa el pago con tarjeta de prueba
3. Verifica que:
   - Se crea la reserva en la base de datos
   - Se genera código de verificación
   - Se recibe webhook en `/api/stripe/webhook`
   - Usuario es redirigido a página de éxito

## 🚀 Paso 7: Activar Modo Producción

### 7.1 Completar Verificación
1. Stripe revisará tu cuenta (1-7 días)
2. Pueden solicitar documentación adicional
3. Una vez aprobado, tendrás acceso a claves live

### 7.2 Cambiar a Producción
1. Actualiza variables de entorno con claves `pk_live_` y `sk_live_`
2. Actualiza webhook URL a tu dominio de producción
3. Realiza prueba con tarjeta real (pequeña cantidad)

## 📊 Paso 8: Monitoreo y Analytics

### 8.1 Dashboard de Stripe
- **Payments**: Ver todos los pagos
- **Customers**: Gestionar clientes
- **Disputes**: Manejar disputas
- **Reports**: Informes financieros

### 8.2 Configurar Notificaciones
1. **Settings** > **Notifications**
2. Activa notificaciones para:
   - Pagos exitosos
   - Pagos fallidos
   - Disputas
   - Reembolsos

## 🔒 Seguridad y Mejores Prácticas

### ✅ Hacer
- Usar HTTPS en producción
- Validar webhooks con signature
- Almacenar claves secretas de forma segura
- Implementar rate limiting
- Registrar todas las transacciones

### ❌ No Hacer
- Exponer claves secretas en frontend
- Procesar pagos sin validación
- Ignorar webhooks fallidos
- Almacenar datos de tarjetas

## 🆘 Soporte y Troubleshooting

### Problemas Comunes

#### Error: "Invalid API Key"
- Verifica que usas la clave correcta (test/live)
- Confirma que la variable de entorno está configurada

#### Webhook no funciona
- Verifica la URL del webhook
- Confirma que el endpoint está accesible públicamente
- Revisa los logs de Stripe Dashboard

#### Pagos rechazados
- Verifica configuración de país (España)
- Confirma que los métodos de pago están habilitados
- Revisa límites de cuenta

### Contacto Stripe
- **Documentación**: [https://stripe.com/docs](https://stripe.com/docs)
- **Soporte**: Desde el dashboard de Stripe
- **Status**: [https://status.stripe.com](https://status.stripe.com)

## 📈 Próximos Pasos

Una vez configurado Stripe:

1. **Integrar con Email**: Enviar confirmaciones automáticas
2. **Reportes Avanzados**: Conectar con Google Analytics
3. **Suscripciones**: Para servicios recurrentes
4. **Marketplace**: Si planeas múltiples vendedores
5. **Facturación**: Integrar con sistema contable

---

**¿Necesitas ayuda?** Contacta al desarrollador:
- **Email**: [tu-email@ejemplo.com]
- **GitHub**: [tu-usuario-github]
- **Teléfono**: [tu-teléfono]

---

*Última actualización: Enero 2024*