"use client"

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { MessageCircle, X, Send, Bot, User } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hola! 👋 Soy Li tu Asistente en SCV 🏍️, ¿en qué puedo ayudarte hoy?🫡​',
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      // Solo hacer focus en desktop, no en móvil
      const isMobile = window.innerWidth < 768
      if (!isMobile) {
        inputRef.current.focus()
      }
    }
  }, [isOpen])

  useEffect(() => {
    // Mostrar chat después de un delay para evitar que aparezca en la intro
    const timer = setTimeout(() => {
      setShowChat(true)
    }, 5000)
    
    return () => clearTimeout(timer)
  }, [])

  // Cargar mensajes desde localStorage al montar el componente
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedMessages = localStorage.getItem('chatMessages')
      const savedIsOpen = localStorage.getItem('chatIsOpen')
      const savedIsMinimized = localStorage.getItem('chatIsMinimized')
      
      if (savedMessages) {
        try {
          const parsedMessages = JSON.parse(savedMessages)
          // Convertir timestamps de string a Date objects
          const messagesWithDates = parsedMessages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
          setMessages(messagesWithDates)
        } catch (error) {
          console.error('Error parsing saved messages:', error)
        }
      }
      
      if (savedIsOpen === 'true') {
        setIsOpen(true)
      }
      
      if (savedIsMinimized === 'true') {
        setIsMinimized(true)
      }
    }
  }, [])

  // Guardar mensajes en localStorage cuando cambien
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('chatMessages', JSON.stringify(messages))
    }
  }, [messages])

  // Guardar estado del chat en localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('chatIsOpen', isOpen.toString())
      localStorage.setItem('chatIsMinimized', isMinimized.toString())
    }
  }, [isOpen, isMinimized])

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        })
      })

      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor')
      }

      const data = await response.json()
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.message,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Lo siento, ha ocurrido un error. Por favor, inténtalo de nuevo o contacta directamente al 607 22 88 82.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (date: Date | string) => {
    // Asegurar que tenemos un objeto Date válido
    const dateObj = date instanceof Date ? date : new Date(date)
    
    // Verificar si la fecha es válida
    if (isNaN(dateObj.getTime())) {
      return '00:00'
    }
    
    return dateObj.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  // No mostrar el chat si showChat es false
  if (!showChat) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Toggle Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-orange-500 hover:bg-orange-600 shadow-lg transition-all duration-300 hover:scale-110"
        >
          <MessageCircle className="h-8 w-8 text-white" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && !isMinimized && (
        <div className="w-80 h-96 md:w-80 md:h-96 max-w-[calc(100vw-1rem)] max-h-[calc(100vh-6rem)] shadow-2xl border border-gray-200 animate-in slide-in-from-bottom-5 duration-300 rounded-lg overflow-hidden bg-white fixed bottom-4 right-2 md:bottom-4 md:right-4">
          {/* Header */}
          <div className="bg-orange-500 text-white p-2 rounded-t-lg">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setMessages([{
                    role: 'assistant',
                    content: '¡Hola! 😊 Soy Li tu Asistente 🤖✨ ¿en qué puedo ayudarte hoy? 😄',
                    timestamp: new Date()
                  }])
                }}
                className="text-white hover:bg-white/20 h-6 w-6 p-0"
                title="Reiniciar chat"
              >
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </Button>
              <div className="flex items-center space-x-2">
                <Bot className="h-4 w-4" />
                <span className="bangers-regular text-base md:text-lg">SVC Asistente</span>
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMinimized(true)}
                  className="text-white hover:bg-white/20 h-6 w-6 p-0"
                  title="Minimizar"
                >
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20 h-6 w-6 p-0"
                  title="Cerrar"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="p-0 h-72 overflow-y-auto bg-gray-50">
            <div className="p-3 space-y-3">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-start space-x-2",
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {message.role === 'assistant' && (
                    <div className="bg-orange-500 rounded-full p-0.5 mt-1 flex-shrink-0">
                      <Bot className="h-2.5 w-2.5 text-white" />
                    </div>
                  )}
                  
                  <div
                    className={cn(
                      "max-w-[75%] rounded-lg p-2 text-sm md:text-base",
                      message.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white border border-gray-200 text-gray-800'
                    )}
                  >
                    <div 
                      className="whitespace-pre-wrap leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: message.content }}
                    />
                    <p className={cn(
                      "text-xs mt-1 opacity-70",
                      message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                    )}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>

                  {message.role === 'user' && (
                    <div className="bg-blue-500 rounded-full p-0.5 mt-1 flex-shrink-0">
                      <User className="h-2.5 w-2.5 text-white" />
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex items-start space-x-2">
                  <div className="bg-orange-500 rounded-full p-0.5 mt-1">
                    <Bot className="h-2.5 w-2.5 text-white" />
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-2 text-xs">
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input */}
          <div className="p-1.5 border-t bg-white rounded-b-lg">
            <div className="flex space-x-1">
              <Input
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe..."
                disabled={isLoading}
                className="flex-1 text-sm h-7"
              />
              <Button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                size="sm"
                className="bg-orange-500 hover:bg-orange-600 h-7 w-7 p-0"
              >
                <Send className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Minimized Chat */}
      {isOpen && isMinimized && (
        <div className="w-64 h-12 shadow-lg border border-gray-200 rounded-lg overflow-hidden bg-white fixed bottom-4 right-2 md:bottom-4 md:right-4">
          <div className="bg-orange-500 text-white p-2 h-full flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="h-4 w-4" />
              <span className="bangers-regular text-sm">SVC Asistente</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(false)}
              className="text-white hover:bg-white/20 h-6 w-6 p-0"
              title="Expandir"
            >
              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}