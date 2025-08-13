"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

type Language = 'es' | 'en'

interface TranslationContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

// Traducciones para la página principal
const translations = {
  es: {
    // Intro
    'intro.skip': 'Saltar',
    
    // Hero Section
    'hero.title': 'EXPLORA MÁLAGA CON TOTAL\nLIBERTAD Y ESTILO',
    'hero.subtitle': 'Descubre, reserva y disfruta de motos electricas en Málaga sin volverte loco.',
    'hero.cta': 'RESERVAR AHORA',
    
    // Stats Section
    'stats.reviews': 'SOBRE 12 RESEÑAS',
    'stats.insurance': 'SEGURO',
    'stats.included': 'INCLUIDO',
    'stats.electric': '100%',
    'stats.electricLabel': 'ELÉCTRICO',
    'stats.service': 'SERVICIO',
    'stats.complete': 'COMPLETO',
    
    // Services Section
    'servicesSection.title': 'REGÍSTRATE Y VIAJA CON TOTAL COMODIDAD',
    'servicesSection.subtitle': 'Crea tu cuenta online, selecciona tu vehículo y disfruta de la forma más cómoda',
    'services.step1.title': 'REGÍSTRATE',
    'services.step1.subtitle': 'EN 1 MIN',
    'services.step1.description': 'Regístrate en nuestra web y ten acceso inmediato a todos nuestros vehículos de nuestra tienda de Málaga. Completa tu perfil, gana puntos por cada alquiler y listo para rodar.',
    'services.step2.title': 'RESERVA,',
    'services.step2.subtitle': 'DESBLOQUEA Y DISFRUTA',
    'services.step2.description': 'Reserva tu vehículo favorito a través de nuestra web. Recoge tu moto o patinete eléctrico en nuestra tienda física y comienza tu aventura por Málaga.',
    'services.step3.title': 'DEVOLVER Y',
    'services.step3.subtitle': 'GANAR PUNTOS',
    'services.step3.description': 'Una vez que llegues a tu destino y tengas el viaje terminado, devuelve tu vehículo en nuestra tienda física. Gana puntos por cada alquiler completado y disfruta de descuentos exclusivos.',
    'services.cta1': 'Ver Nuestras Motos',
    'services.cta2': 'Conocer Servicios',
    
    // Contact Section
    'contact.title': 'Contacta con Nosotros',
    'contact.location': 'Ubicación',
    'contact.address1': 'C. Héroe de Sostoa, 37, Carretera de Cádiz',
    'contact.address2': '29002 Málaga, España',
    'contact.phone': 'Teléfono',
    'contact.phoneNumber': '607 22 88 82',
    'contact.whatsapp': 'También disponible por WhatsApp',
    'contact.schedule': 'Horario',
    'contact.opens': 'Abre a las 10:00',
    'contact.closed': '(Cerrado los sábados)',
    'contact.cta': 'Ir a Página de Contacto',
    'contact.servicesTitle': 'Nuestros Servicios',
    'contact.service1.title': 'Alquiler de Motos Eléctricas',
    'contact.service1.description': 'Perfectas para explorar Málaga de forma sostenible',
    'contact.service2.title': 'Alquiler de Patinetes Eléctricos',
    'contact.service2.description': 'Ideales para distancias cortas y turismo urbano',
    'contact.service3.title': 'Venta y Reparación',
    'contact.service3.description': 'Servicio completo para tu vehículo eléctrico',
    'contact.paymentMethods': 'Métodos de Pago',
    
    // Footer
    'footer.nearStation': 'Cerca de Estación María Zambrano (456m) • Calle Larios (1,68km)',
    'footer.madeBy': 'Web made by:',
    
    // Navigation
    'nav.rental': 'Alquiler Motos',
    'nav.services': 'Servicios',
    'nav.contact': 'Contacto',
    'nav.profile': 'Mi Perfil',
    'nav.signIn': 'Iniciar Sesión',
    'nav.signOut': 'Cerrar Sesión',
    'nav.hello': 'Hola,',
    
    // Rental Page
    'rental.title': 'Alquiler de Motos',
    'rental.subtitle': 'Descubre nuestra flota de vehículos eléctricos. Perfectos para explorar Málaga de forma sostenible y divertida.',
    'rental.insurance': 'Seguro incluido',
    'rental.prices': 'Precios de Alquiler',
    'rental.hour': '1 hora:',
    'rental.halfDay': 'Medio día:',
    'rental.fullDay': 'Día completo:',
    'rental.weekly': 'Semanal:',
    'rental.includes': 'Incluye',
    'rental.reserve': 'Reservar',
    'rental.howItWorks': '¿Cómo Funciona el Alquiler?',
    'rental.howItWorksSubtitle': 'Proceso simple y rápido para empezar tu aventura',
    'rental.step1Title': 'Elige tu Vehículo',
    'rental.step1Description': 'Selecciona la moto o patinete que mejor se adapte a tus necesidades',
    'rental.step2Title': 'Reserva Online',
    'rental.step2Description': 'Completa tu reserva online o llámanos directamente',
    'rental.step3Title': 'Recoge y Disfruta',
    'rental.step3Description': 'Recoge tu vehículo en nuestro local y explora Málaga',
    'rental.readyTitle': '¿Listo para tu Aventura?',
    'rental.readySubtitle': 'Contacta con nosotros para reservar tu vehículo o resolver cualquier duda',
    'rental.call': 'Llamar: 607 22 88 82',
    'rental.whatsapp': 'WhatsApp',
    'rental.loginRequired': 'Debes iniciar sesión para realizar una reserva',
    'rental.selectTime': 'Por favor selecciona un horario',
    'rental.reserveVehicle': 'RESERVAR VEHÍCULO',
    'rental.selectDate': 'SELECCIONA FECHA',
    'rental.duration': 'DURACIÓN',
    'rental.startTime': 'HORA DE INICIO',
    'rental.summary': '🎯 RESUMEN DE TU RESERVA',
    'rental.vehicle': 'Vehículo:',
    'rental.date': 'Fecha:',
    'rental.schedule': 'Horario:',
    'rental.estimatedKm': '🛣️ Km estimados:',
    'rental.totalPrice': '💰 PRECIO TOTAL',
    'rental.vatIncluded': 'IVA incluido',
    'rental.confirmReservation': '🚀 CONFIRMAR RESERVA',
    'rental.instantConfirmation': '✅ Confirmación instantánea',
    'rental.reservationConfirmed': '¡Reserva Confirmada!',
    'rental.reservationSuccess': 'Tu reserva ha sido procesada exitosamente.',
    'rental.continue': 'Continuar',
    'rental.hour1': '⏱️ 1 HORA',
    'rental.hour2': '⏱️ 2 HORAS',
    'rental.hour3': '⏱️ 3 HORAS',
    'rental.hour4': '⏱️ 4 HORAS',
    'rental.fullDay8h': '🌅 DÍA COMPLETO (8H)',
    
    // Services Page
    'services.title': 'Servicios Técnicos',
    'services.subtitle': 'Mantenimiento, reparación y servicios especializados para tu vehículo eléctrico. Técnicos certificados y repuestos originales.',
    'services.expressService': 'Servicio Express',
    'services.price': 'Precio',
    'services.time': 'Tiempo',
    'services.includes': 'Incluye:',
    'services.request': 'Solicitar',
    'services.loginRequired': 'Debes iniciar sesión para solicitar un servicio',
    'services.completeFields': 'Por favor completa todos los campos obligatorios',
    'services.howItWorks': '¿Cómo Funciona Nuestro Servicio?',
    'services.howItWorksSubtitle': 'Proceso profesional y transparente',
    'services.step1Title': 'Diagnóstico',
    'services.step1Description': 'Evaluación completa y presupuesto sin compromiso',
    'services.step2Title': 'Aprobación',
    'services.step2Description': 'Te informamos del problema y coste antes de proceder',
    'services.step3Title': 'Reparación',
    'services.step3Description': 'Trabajo profesional con repuestos originales',
    'services.step4Title': 'Entrega',
    'services.step4Description': 'Pruebas finales y garantía de calidad',
    'services.guaranteesTitle': 'Nuestras Garantías',
    'services.guaranteesSubtitle': 'Compromiso con la calidad y tu tranquilidad',
    'services.qualityGuarantee': 'Garantía de Calidad',
    'services.qualityDescription': 'Todos nuestros trabajos incluyen garantía mínima de 6 meses en mano de obra y repuestos',
    'services.originalParts': 'Repuestos Originales',
    'services.originalPartsDescription': 'Utilizamos únicamente repuestos originales o de primera calidad para garantizar durabilidad',
    'services.fastService': 'Servicio Rápido',
    'services.fastServiceDescription': 'Comprometidos con los plazos acordados. Servicio express disponible para urgencias',
    'services.needHelp': '¿Necesitas Ayuda con tu Vehículo?',
    'services.needHelpSubtitle': 'Contacta con nuestros técnicos especializados para un diagnóstico gratuito',
    'services.call': 'Llamar: 607 22 88 82',
    'services.requestQuote': 'Solicitar Presupuesto',
    
    // Service Items
    'serviceItem.batteryChange.name': 'Cambio de Batería',
    'serviceItem.batteryChange.description': 'Sustitución y mantenimiento de baterías',
    'serviceItem.batteryChange.price': 'Desde 150€',
    'serviceItem.batteryChange.time': '2-4 horas',
    'serviceItem.batteryChange.include1': 'Batería de litio original',
    'serviceItem.batteryChange.include2': 'Instalación profesional',
    'serviceItem.batteryChange.include3': 'Reciclaje de batería antigua',
    'serviceItem.batteryChange.include4': 'Calibración del sistema',
    'serviceItem.batteryChange.include5': 'Garantía de 2 años',
    'serviceItem.pickupDelivery.name': 'Recogida y Entrega',
    'serviceItem.pickupDelivery.description': 'Servicio de recogida y entrega a domicilio',
    'serviceItem.pickupDelivery.price': '15€',
    'serviceItem.pickupDelivery.time': 'Mismo día',
    'serviceItem.pickupDelivery.include1': 'Recogida en tu domicilio',
    'serviceItem.pickupDelivery.include2': 'Transporte seguro',
    'serviceItem.pickupDelivery.include3': 'Entrega tras reparación',
    'serviceItem.pickupDelivery.include4': 'Zona de Málaga capital',
    'serviceItem.pickupDelivery.include5': 'Horario flexible',
    'serviceItem.expressService.name': 'Servicio Express',
    'serviceItem.expressService.description': 'Reparaciones rápidas y urgentes',
    'serviceItem.expressService.price': 'Desde 55€',
    'serviceItem.expressService.time': '30 min - 2 horas',
    'serviceItem.expressService.include1': 'Atención prioritaria',
    'serviceItem.expressService.include2': 'Reparaciones menores',
    'serviceItem.expressService.include3': 'Cambio de neumáticos',
    'serviceItem.expressService.include4': 'Ajustes básicos',
    'serviceItem.expressService.include5': 'Sin cita previa',
    
    // Service Modal
    'serviceModal.requestService': 'SOLICITAR SERVICIO',
    'serviceModal.urgent': '⚡ URGENTE',
    'serviceModal.price': 'Precio:',
    'serviceModal.time': 'Tiempo:',
    'serviceModal.whatIncludes': 'QUÉ INCLUYE',
    'serviceModal.personalData': 'DATOS PERSONALES',
    'serviceModal.fullName': 'Nombre completo *',
    'serviceModal.fullNamePlaceholder': 'Tu nombre completo',
    'serviceModal.phone': 'Teléfono *',
    'serviceModal.phonePlaceholder': 'Tu número de teléfono',
    'serviceModal.address': 'Dirección',
    'serviceModal.addressPlaceholder': 'Dirección (opcional para recogida)',
    'serviceModal.preferredDate': 'FECHA PREFERIDA',
    'serviceModal.selectDate': '📅 Selecciona la fecha que mejor te convenga',
    'serviceModal.problemDescription': 'DESCRIPCIÓN DEL PROBLEMA',
    'serviceModal.problemPlaceholder': 'Describe el problema o servicio que necesitas...',
    'serviceModal.preferredTime': 'HORA PREFERIDA',
    'serviceModal.requestSummary': '📋 RESUMEN DE SOLICITUD',
    'serviceModal.service': 'Servicio:',
    'serviceModal.client': 'Cliente:',
    'serviceModal.date': 'Fecha:',
    'serviceModal.hour': 'Hora:',
    'serviceModal.phoneLabel': '📞 Teléfono:',
    'serviceModal.estimatedPrice': '💰 PRECIO ESTIMADO',
    'serviceModal.finalBudget': 'Presupuesto final tras diagnóstico',
    'serviceModal.requestServiceButton': '🔧 SOLICITAR SERVICIO',
    'serviceModal.contactIn24h': '✅ Te contactaremos en 24h',
    'serviceModal.requestSent': '¡Solicitud Enviada!',
    'serviceModal.requestProcessed': 'Tu solicitud de servicio ha sido procesada exitosamente.',
    'serviceModal.contactSoon': 'Te contactaremos en las próximas 24 horas para confirmar la cita.',
    'serviceModal.continue': 'Continuar'
  },
  en: {
    // Intro
    'intro.skip': 'Skip',
    
    // Hero Section
    'hero.title': 'EXPLORE MÁLAGA WITH TOTAL\nFREEDOM AND STYLE',
    'hero.subtitle': 'Discover, book and enjoy electric motorcycles in Málaga without going crazy.',
    'hero.cta': 'BOOK NOW',
    
    // Stats Section
    'stats.reviews': 'OVER 12 REVIEWS',
    'stats.insurance': 'INSURANCE',
    'stats.included': 'INCLUDED',
    'stats.electric': '100%',
    'stats.electricLabel': 'ELECTRIC',
    'stats.service': 'SERVICE',
    'stats.complete': 'COMPLETE',
    
    // Services Section
    'servicesSection.title': 'REGISTER AND TRAVEL WITH TOTAL COMFORT',
    'servicesSection.subtitle': 'Create your online account, select your vehicle and enjoy the most comfortable way',
    'services.step1.title': 'REGISTER',
    'services.step1.subtitle': 'IN 1 MIN',
    'services.step1.description': 'Register on our website and get immediate access to all our vehicles from our Málaga store. Complete your profile, earn points for each rental and ready to ride.',
    'services.step2.title': 'BOOK,',
    'services.step2.subtitle': 'UNLOCK AND ENJOY',
    'services.step2.description': 'Book your favorite vehicle through our website. Pick up your electric motorcycle or scooter at our physical store and start your adventure in Málaga.',
    'services.step3.title': 'RETURN AND',
    'services.step3.subtitle': 'EARN POINTS',
    'services.step3.description': 'Once you reach your destination and finish your trip, return your vehicle to our physical store. Earn points for each completed rental and enjoy exclusive discounts.',
    'services.cta1': 'See Our Motorcycles',
    'services.cta2': 'Learn About Services',
    
    // Contact Section
    'contact.title': 'Contact Us',
    'contact.location': 'Location',
    'contact.address1': 'C. Héroe de Sostoa, 37, Carretera de Cádiz',
    'contact.address2': '29002 Málaga, Spain',
    'contact.phone': 'Phone',
    'contact.phoneNumber': '607 22 88 82',
    'contact.whatsapp': 'Also available on WhatsApp',
    'contact.schedule': 'Schedule',
    'contact.opens': 'Opens at 10:00',
    'contact.closed': '(Closed on Saturdays)',
    'contact.cta': 'Go to Contact Page',
    'contact.servicesTitle': 'Our Services',
    'contact.service1.title': 'Electric Motorcycle Rental',
    'contact.service1.description': 'Perfect for exploring Málaga sustainably',
    'contact.service2.title': 'Electric Scooter Rental',
    'contact.service2.description': 'Ideal for short distances and urban tourism',
    'contact.service3.title': 'Sales and Repair',
    'contact.service3.description': 'Complete service for your electric vehicle',
    'contact.paymentMethods': 'Payment Methods',
    
    // Footer
    'footer.nearStation': 'Near María Zambrano Station (456m) • Larios Street (1.68km)',
    'footer.madeBy': 'Web made by:',
    
    // Navigation
    'nav.rental': 'Motorcycle Rental',
    'nav.services': 'Services',
    'nav.contact': 'Contact',
    'nav.profile': 'My Profile',
    'nav.signIn': 'Sign In',
    'nav.signOut': 'Sign Out',
    'nav.hello': 'Hello,',
    
    // Rental Page
    'rental.title': 'Motorcycle Rental',
    'rental.subtitle': 'Discover our fleet of electric vehicles. Perfect for exploring Málaga in a sustainable and fun way.',
    'rental.insurance': 'Insurance included',
    'rental.prices': 'Rental Prices',
    'rental.hour': '1 hour:',
    'rental.halfDay': 'Half day:',
    'rental.fullDay': 'Full day:',
    'rental.weekly': 'Weekly:',
    'rental.includes': 'Includes',
    'rental.reserve': 'Reserve',
    'rental.howItWorks': 'How Does Rental Work?',
    'rental.howItWorksSubtitle': 'Simple and fast process to start your adventure',
    'rental.step1Title': 'Choose your Vehicle',
    'rental.step1Description': 'Select the motorcycle or scooter that best suits your needs',
    'rental.step2Title': 'Book Online',
    'rental.step2Description': 'Complete your booking online or call us directly',
    'rental.step3Title': 'Pick up and Enjoy',
    'rental.step3Description': 'Pick up your vehicle at our location and explore Málaga',
    'rental.readyTitle': 'Ready for your Adventure?',
    'rental.readySubtitle': 'Contact us to book your vehicle or resolve any questions',
    'rental.call': 'Call: 607 22 88 82',
    'rental.whatsapp': 'WhatsApp',
    'rental.loginRequired': 'You must sign in to make a reservation',
    'rental.selectTime': 'Please select a time',
    'rental.reserveVehicle': 'RESERVE VEHICLE',
    'rental.selectDate': 'SELECT DATE',
    'rental.duration': 'DURATION',
    'rental.startTime': 'START TIME',
    'rental.summary': '🎯 YOUR BOOKING SUMMARY',
    'rental.vehicle': 'Vehicle:',
    'rental.date': 'Date:',
    'rental.schedule': 'Schedule:',
    'rental.estimatedKm': '🛣️ Estimated km:',
    'rental.totalPrice': '💰 TOTAL PRICE',
    'rental.vatIncluded': 'VAT included',
    'rental.confirmReservation': '🚀 CONFIRM BOOKING',
    'rental.instantConfirmation': '✅ Instant confirmation',
    'rental.reservationConfirmed': 'Booking Confirmed!',
    'rental.reservationSuccess': 'Your booking has been processed successfully.',
    'rental.continue': 'Continue',
    'rental.hour1': '⏱️ 1 HOUR',
    'rental.hour2': '⏱️ 2 HOURS',
    'rental.hour3': '⏱️ 3 HOURS',
    'rental.hour4': '⏱️ 4 HOURS',
    'rental.fullDay8h': '🌅 FULL DAY (8H)',
    
    // Services Page
    'services.title': 'Technical Services',
    'services.subtitle': 'Maintenance, repair and specialized services for your electric vehicle. Certified technicians and original parts.',
    'services.expressService': 'Express Service',
    'services.price': 'Price',
    'services.time': 'Time',
    'services.includes': 'Includes:',
    'services.request': 'Request',
    'services.loginRequired': 'You must sign in to request a service',
    'services.completeFields': 'Please complete all required fields',
    'services.howItWorks': 'How Does Our Service Work?',
    'services.howItWorksSubtitle': 'Professional and transparent process',
    'services.step1Title': 'Diagnosis',
    'services.step1Description': 'Complete evaluation and quote without commitment',
    'services.step2Title': 'Approval',
    'services.step2Description': 'We inform you of the problem and cost before proceeding',
    'services.step3Title': 'Repair',
    'services.step3Description': 'Professional work with original parts',
    'services.step4Title': 'Delivery',
    'services.step4Description': 'Final tests and quality guarantee',
    'services.guaranteesTitle': 'Our Guarantees',
    'services.guaranteesSubtitle': 'Commitment to quality and your peace of mind',
    'services.qualityGuarantee': 'Quality Guarantee',
    'services.qualityDescription': 'All our work includes a minimum 6-month warranty on labor and parts',
    'services.originalParts': 'Original Parts',
    'services.originalPartsDescription': 'We use only original or first-quality parts to guarantee durability',
    'services.fastService': 'Fast Service',
    'services.fastServiceDescription': 'Committed to agreed deadlines. Express service available for emergencies',
    'services.needHelp': 'Need Help with your Vehicle?',
    'services.needHelpSubtitle': 'Contact our specialized technicians for a free diagnosis',
    'services.call': 'Call: 607 22 88 82',
    'services.requestQuote': 'Request Quote',
    
    // Service Items
    'serviceItem.batteryChange.name': 'Battery Change',
    'serviceItem.batteryChange.description': 'Battery replacement and maintenance',
    'serviceItem.batteryChange.price': 'From 150€',
    'serviceItem.batteryChange.time': '2-4 hours',
    'serviceItem.batteryChange.include1': 'Original lithium battery',
    'serviceItem.batteryChange.include2': 'Professional installation',
    'serviceItem.batteryChange.include3': 'Old battery recycling',
    'serviceItem.batteryChange.include4': 'System calibration',
    'serviceItem.batteryChange.include5': '2-year warranty',
    'serviceItem.pickupDelivery.name': 'Pickup and Delivery',
    'serviceItem.pickupDelivery.description': 'Home pickup and delivery service',
    'serviceItem.pickupDelivery.price': '15€',
    'serviceItem.pickupDelivery.time': 'Same day',
    'serviceItem.pickupDelivery.include1': 'Pickup at your home',
    'serviceItem.pickupDelivery.include2': 'Safe transport',
    'serviceItem.pickupDelivery.include3': 'Delivery after repair',
    'serviceItem.pickupDelivery.include4': 'Málaga city area',
    'serviceItem.pickupDelivery.include5': 'Flexible schedule',
    'serviceItem.expressService.name': 'Express Service',
    'serviceItem.expressService.description': 'Fast and urgent repairs',
    'serviceItem.expressService.price': 'From 55€',
    'serviceItem.expressService.time': '30 min - 2 hours',
    'serviceItem.expressService.include1': 'Priority attention',
    'serviceItem.expressService.include2': 'Minor repairs',
    'serviceItem.expressService.include3': 'Tire change',
    'serviceItem.expressService.include4': 'Basic adjustments',
    'serviceItem.expressService.include5': 'No appointment needed',
    
    // Service Modal
    'serviceModal.requestService': 'REQUEST SERVICE',
    'serviceModal.urgent': '⚡ URGENT',
    'serviceModal.price': 'Price:',
    'serviceModal.time': 'Time:',
    'serviceModal.whatIncludes': 'WHAT INCLUDES',
    'serviceModal.personalData': 'PERSONAL DATA',
    'serviceModal.fullName': 'Full name *',
    'serviceModal.fullNamePlaceholder': 'Your full name',
    'serviceModal.phone': 'Phone *',
    'serviceModal.phonePlaceholder': 'Your phone number',
    'serviceModal.address': 'Address',
    'serviceModal.addressPlaceholder': 'Address (optional for pickup)',
    'serviceModal.preferredDate': 'PREFERRED DATE',
    'serviceModal.selectDate': '📅 Select the date that works best for you',
    'serviceModal.problemDescription': 'PROBLEM DESCRIPTION',
    'serviceModal.problemPlaceholder': 'Describe the problem or service you need...',
    'serviceModal.preferredTime': 'PREFERRED TIME',
    'serviceModal.requestSummary': '📋 REQUEST SUMMARY',
    'serviceModal.service': 'Service:',
    'serviceModal.client': 'Client:',
    'serviceModal.date': 'Date:',
    'serviceModal.hour': 'Time:',
    'serviceModal.phoneLabel': '📞 Phone:',
    'serviceModal.estimatedPrice': '💰 ESTIMATED PRICE',
    'serviceModal.finalBudget': 'Final budget after diagnosis',
    'serviceModal.requestServiceButton': '🔧 REQUEST SERVICE',
    'serviceModal.contactIn24h': '✅ We will contact you within 24h',
    'serviceModal.requestSent': 'Request Sent!',
    'serviceModal.requestProcessed': 'Your service request has been processed successfully.',
    'serviceModal.contactSoon': 'We will contact you within the next 24 hours to confirm the appointment.',
    'serviceModal.continue': 'Continue'
  }
}

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('es')

  // Load language from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('language') as Language
      if (savedLanguage && (savedLanguage === 'es' || savedLanguage === 'en')) {
        setLanguage(savedLanguage)
      }
    }
  }, [])

  // Save language to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', language)
    }
  }, [language])

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key
  }

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(TranslationContext)
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider')
  }
  return context
}