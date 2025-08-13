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
    'services.title': 'REGÍSTRATE Y VIAJA CON TOTAL COMODIDAD',
    'services.subtitle': 'Crea tu cuenta online, selecciona tu vehículo y disfruta de la forma más cómoda',
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
    'nav.hello': 'Hola,'
  },
  en: {
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
    'services.title': 'REGISTER AND TRAVEL WITH TOTAL COMFORT',
    'services.subtitle': 'Create your online account, select your vehicle and enjoy the most comfortable way',
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
    'nav.hello': 'Hello,'
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