"use client"

import React from 'react'
import { useTranslation } from '@/contexts/TranslationContext'

interface LanguageToggleProps {
  className?: string
}

export function LanguageToggle({ className = '' }: LanguageToggleProps) {
  const { language, setLanguage } = useTranslation()

  const toggleLanguage = () => {
    setLanguage(language === 'es' ? 'en' : 'es')
  }

  return (
    <button
      onClick={toggleLanguage}
      className={`bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg p-2 shadow-sm hover:bg-white transition-colors ${className}`}
      title={language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
    >
      {language === 'es' ? (
        // UK Flag
        <svg width="24" height="18" viewBox="0 0 60 30" className="rounded-sm">
          <clipPath id="t">
            <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/>
          </clipPath>
          <path d="M0,0 v30 h60 v-30 z" fill="#012169"/>
          <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
          <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#C8102E" strokeWidth="4"/>
          <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
          <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
        </svg>
      ) : (
        // Spanish Flag
        <svg width="24" height="18" viewBox="0 0 60 30" className="rounded-sm">
          <rect width="60" height="30" fill="#AA151B"/>
          <rect width="60" height="15" y="7.5" fill="#F1BF00"/>
          <g transform="translate(15,15)">
            <rect width="12" height="8" y="-4" fill="#AA151B" stroke="#000" strokeWidth="0.5"/>
            <rect width="2" height="6" x="2" y="-3" fill="#F1BF00"/>
            <rect width="2" height="6" x="8" y="-3" fill="#F1BF00"/>
            <rect width="6" height="2" x="3" y="-1" fill="#F1BF00"/>
          </g>
        </svg>
      )}
    </button>
  )
}