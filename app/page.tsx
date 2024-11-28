'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Send, Sparkles, User, Bot } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { ToastProvider, ToastViewport } from '@/components/ui/toast'
import MercadoPagoCheckout from '@/components/MercadoPagoCheckout'
import { ExpectationWindow } from '@/components/ExpectationWindow'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

function UserPoints({ points }: { points: number }) {
  return (
    <div className="text-sm text-gray-300 flex items-center">
      <Sparkles className="w-4 h-4 mr-1 text-yellow-400" />
      <span className="font-bold">{points}</span> puntos
    </div>
  )
}

function ChatMessage({ message, isLast }: { message: Message; isLast: boolean }) {
  const isUser = message.role === 'user'
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className={`flex items-start ${isUser ? 'flex-row-reverse' : ''} max-w-[80%]`}>
        <div className={`flex-shrink-0 ${isUser ? 'ml-3' : 'mr-3'}`}>
          {isUser ? (
            <User className="w-8 h-8 text-purple-400" />
          ) : (
            <Bot className="w-8 h-8 text-pink-400" />
          )}
        </div>
        <div
          className={`p-4 rounded-2xl ${
            isUser
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
              : 'bg-gray-800 text-gray-100'
          }`}
        >
          {message.content}
        </div>
      </div>
      {isLast && <div className="h-16" />} {/* Add extra space after the last message */}
    </motion.div>
  )
}

function MainContent({
  messages,
  isLoading,
  freeMessages,
  isSubscribed,
  handleSubmit,
  inputRef,
  messagesEndRef,
  userPoints,
  handleSubscribe,
  expectationTopic,
}: {
  messages: Message[]
  isLoading: boolean
  freeMessages: number
  isSubscribed: boolean
  handleSubmit: (e: React.FormEvent) => Promise<void>
  inputRef: React.RefObject<HTMLInputElement>
  messagesEndRef: React.RefObject<HTMLDivElement>
  userPoints: number
  handleSubscribe: () => void
  expectationTopic: string
}) {
  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 to-purple-900 text-gray-100">
      <header className="flex items-center justify-between p-4 bg-black bg-opacity-50 backdrop-blur-md">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">AMT IA Chat</h1>
        <div className="flex items-center space-x-4">
          <UserPoints points={userPoints} />
          {!isSubscribed && (
            <Button
              onClick={handleSubscribe}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-2 px-4 rounded-full transition-all duration-300 transform hover:scale-105"
            >
              Suscribirse
            </Button>
          )}
        </div>
      </header>
      <main className="flex-grow overflow-hidden p-4">
        <Card className="bg-black bg-opacity-50 backdrop-blur-md border-none h-full rounded-2xl overflow-hidden">
          <CardContent className="p-0 h-full flex flex-col">
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <ChatMessage key={index} message={message} isLast={index === messages.length - 1} />
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-4 bg-black bg-opacity-50 backdrop-blur-md">
              <form onSubmit={handleSubmit} className="flex space-x-2">
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder="Escribe tu mensaje..."
                  className="flex-grow bg-gray-800 text-white border-gray-700 rounded-full py-2 px-4 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={isLoading || (!isSubscribed && freeMessages <= 0)}
                />
                <Button
                  type="submit"
                  disabled={isLoading || (!isSubscribed && freeMessages <= 0)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full p-2 transition-all duration-300 transform hover:scale-105"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </main>
      <footer className="p-4 bg-black bg-opacity-50 backdrop-blur-md">
        <div className="flex justify-between items-center">
          {!isSubscribed && (
            <p className="text-sm text-gray-400">
              Mensajes gratuitos restantes: <span className="font-bold text-purple-400">{freeMessages}</span>
            </p>
          )}
          <div className="text-center text-gray-400 text-xs">
            Creado por Giancarlo Tonazza, Uruguay |{' '}
            <a
              href="https://instagram.com/giantonazza"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-purple-400 transition-colors duration-300"
            >
              Instagram
            </a>
          </div>
        </div>
      </footer>
      <ToastViewport />
      <ExpectationWindow topic={expectationTopic} isVisible={isLoading} />
    </div>
  )
}

export default function Home() {
  const [showWelcome, setShowWelcome] = useState(true)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [freeMessages, setFreeMessages] = useState(6)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [userPoints, setUserPoints] = useState<number>(0)
  const [expectationTopic, setExpectationTopic] = useState<string>('')
  const [showCheckout, setShowCheckout] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const showToast = useCallback(
    (props: { title: string; description: string; variant?: 'default' | 'destructive' }) => {
      toast(props)
    },
    [toast]
  )

  useEffect(() => {
    if (!showWelcome) {
      inputRef.current?.focus()
    }
  }, [showWelcome])

  useEffect(() => {
    if (!isSubscribed && freeMessages <= 0) {
      setMessages([])
    }
  }, [isSubscribed, freeMessages])

  useEffect(() => {
    if (!showWelcome && messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content:
            '¡Hola! Soy AMT IA, tu asistente de inteligencia artificial creado por Giancarlo Tonazza, potenciado por Anthropic. Estoy aquí para ayudarte con cualquier pregunta o tema que desees explorar. ¿En qué puedo asistirte hoy?',
        },
      ])
    }
  }, [showWelcome, messages])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      try {
        console.log('handleSubmit called')
        if (!inputRef.current || isLoading) {
          console.log('Input ref not available or already loading')
          return
        }

        const input = inputRef.current.value.trim()
        if (!input) {
          console.log('Empty input')
          showToast({
            title: 'Mensaje vacío',
            description: 'Por favor, escribe un mensaje antes de enviar.',
            variant: 'destructive',
          })
          return
        }

        console.log('User input:', input)

        if (freeMessages <= 0 && !isSubscribed) {
          console.log('No free messages left and not subscribed')
          showToast({
            title: 'Límite de mensajes alcanzado',
            description: 'Has alcanzado el límite de mensajes gratuitos. Suscríbete para continuar.',
            variant: 'destructive',
          })
          return
        }

        const userMessage = { role: 'user' as const, content: input }
        setMessages((prev) => [...prev, userMessage])
        inputRef.current.value = ''
        setIsLoading(true)

        const expectationResponse = await fetch('/api/generate-expectation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: input }),
        })

        if (expectationResponse.ok) {
          const { topic } = await expectationResponse.json()
          setExpectationTopic(topic)
        }

        console.log('Sending chat request')
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: [...messages, userMessage] }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(`Chat API error: ${response.status} - ${errorData.error || 'Unknown error'}`)
        }

        const reader = response.body?.getReader()
        if (!reader) {
          throw new Error('Failed to get response reader')
        }

        console.log('Processing streaming response')
        let accumulatedResponse = ''
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = new TextDecoder().decode(value)
          accumulatedResponse += chunk
        }

        if (!accumulatedResponse.trim()) {
          throw new Error('Received empty response from the API')
        }

        const aiMessage = { role: 'assistant' as const, content: accumulatedResponse }
        setMessages((prev) => [...prev, aiMessage])

        if (!isSubscribed) {
          setFreeMessages((prev) => Math.max(0, prev - 1))
        }

        const newPoints = Math.floor(accumulatedResponse.length / 10)
        setUserPoints((prev) => prev + newPoints)

        console.log('Chat response processed successfully')
      } catch (error) {
        console.error('Error in handleSubmit:', error)
        let errorMessage = 'Hubo un problema al procesar tu mensaje. Por favor, intenta de nuevo.'
        if (error instanceof Error) {
          errorMessage = error.message
        }
        showToast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
        setExpectationTopic('')
        if (inputRef.current) {
          inputRef.current.focus()
        }
      }
    },
    [messages, isLoading, freeMessages, isSubscribed, showToast]
  )

  const handleSubscribe = useCallback(() => {
    setShowCheckout(true)
  }, [])

  const handleSubscriptionSuccess = useCallback(() => {
    setIsSubscribed(true)
    setShowCheckout(false)
    showToast({
      title: 'Suscripción exitosa',
      description: 'Gracias por suscribirte a AMT IA Premium.',
    })
  }, [showToast])

  return (
    <ToastProvider>
      <AnimatePresence>
        {showWelcome ? (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 text-gray-100 p-4"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-2xl"
            >
              <h1 className="text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                Bienvenido a AMT IA
              </h1>
              <p className="text-xl mb-8 text-gray-300">
                Explora el futuro de la inteligencia artificial con AMT IA. Tu asistente personal para:
              </p>
              <ul className="grid grid-cols-2 gap-4 mb-8 text-left">
                {[
                  "Estrategias de negocio innovadoras",
                  "Planificación de rutinas de ejercicio",
                  "Optimización de productividad",
                  "Análisis de datos y tendencias",
                  "Generación de ideas creativas",
                  "Asistencia en toma de decisiones"
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-2"
                  >
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
              <p className="text-2xl font-semibold mb-8 text-purple-300">
                ¡Comienza tu aventura ahora con 6 mensajes gratuitos!
              </p>
              <Button 
                onClick={() => setShowWelcome(false)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-lg font-medium py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105"
              >
                Comenzar a chatear <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="chat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-screen"
          >
            {showCheckout ? (
              <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 text-gray-100 p-4">
                <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                  Suscripción Premium AMT IA
                </h2>
                <MercadoPagoCheckout onSuccess={handleSubscriptionSuccess} />
                <Button 
                  onClick={() => setShowCheckout(false)}
                  className="mt-4 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-full transition-all duration-300"
                >
                  Volver al chat
                </Button>
              </div>
            ) : (
              <MainContent 
                messages={messages}
                isLoading={isLoading}
                freeMessages={freeMessages}
                isSubscribed={isSubscribed}
                handleSubmit={handleSubmit}
                inputRef={inputRef}
                messagesEndRef={messagesEndRef}
                userPoints={userPoints}
                handleSubscribe={handleSubscribe}
                expectationTopic={expectationTopic}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </ToastProvider>
  )
}


