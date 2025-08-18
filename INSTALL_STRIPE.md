# 📦 Instalación de Dependencias para Stripe

## 🚀 Instalar Stripe

Ejecuta este comando en la terminal desde la raíz del proyecto:

```bash
npm install stripe @stripe/stripe-js
```

### Dependencias Instaladas:

- **stripe**: SDK oficial de Stripe para Node.js (backend)
- **@stripe/stripe-js**: Librería oficial de Stripe para frontend

## 📝 Actualizar package.json

Después de la instalación, tu `package.json` debería incluir:

```json
{
  "dependencies": {
    "stripe": "^14.0.0",
    "@stripe/stripe-js": "^2.0.0"
  }
}
```

## 🔧 Configuración Adicional

### Variables de Entorno
Crea/actualiza tu archivo `.env.local`:

```env
# Stripe Keys (obtener de https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Domain para redirects
NEXT_PUBLIC_DOMAIN=http://localhost:3000
```

### En Vercel (Producción)
Añade estas variables en tu dashboard de Vercel:

1. Ve a tu proyecto en vercel.com
2. Settings > Environment Variables
3. Añade cada variable con sus valores de producción

## ✅ Verificar Instalación

Para verificar que todo está instalado correctamente:

```bash
# Verificar que Stripe está instalado
npm list stripe

# Debería mostrar algo como:
# └── stripe@14.0.0
```

## 🧪 Probar Configuración

1. Reinicia tu servidor de desarrollo:
```bash
npm run dev
```

2. Ve a la nueva página de admin:
```
http://localhost:3000/admin/dashboard
```

3. Contraseña: `svcmoto2024`

## 📋 Checklist de Configuración

- [ ] Dependencias instaladas (`npm install stripe @stripe/stripe-js`)
- [ ] Variables de entorno configuradas en `.env.local`
- [ ] Cuenta de Stripe creada
- [ ] API keys obtenidas de Stripe Dashboard
- [ ] Webhook configurado en Stripe
- [ ] Servidor reiniciado
- [ ] Panel admin accesible

## 🆘 Problemas Comunes

### Error: "Module not found: stripe"
**Solución**: Ejecuta `npm install stripe @stripe/stripe-js`

### Error: "STRIPE_SECRET_KEY is not defined"
**Solución**: Verifica que `.env.local` existe y contiene las claves

### Error: "Invalid API key"
**Solución**: Confirma que usas las claves correctas (test vs live)

## 📞 Soporte

Si tienes problemas:
1. Revisa la documentación completa en `STRIPE_SETUP.md`
2. Contacta al desarrollador
3. Consulta la documentación oficial de Stripe

---

**¡Listo!** Una vez completados estos pasos, tu aplicación estará preparada para procesar pagos con Stripe.