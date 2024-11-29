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
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { FeedbackForm } from '@/components/FeedbackForm'
import { InvitationCodeButton } from '@/components/InvitationCodeButton'

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
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6`}
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
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
      {isLast && <div className="h-16" />}
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
  showFeedback,
  setShowFeedback,
  handleFeedback,
  showToast,
  setIsSubscribed,
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
  showFeedback: boolean
  setShowFeedback: (show: boolean) => void
  handleFeedback: (feedback: { rating: 'positive' | 'negative'; comment: string }) => Promise<void>
  showToast: (props: { title: string; description: string; variant?: 'default' | 'destructive' }) => void
  setIsSubscribed: (isSubscribed: boolean) => void
}) {
  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 to-purple-900 text-gray-100">
      <header className="flex items-center justify-between p-4 bg-black bg-opacity-50 backdrop-blur-md">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">AMT IA Chat</h1>
        <div className="flex items-center space-x-4">
          <UserPoints points={userPoints} />
          {!isSubscribed && (
            <>
              <Button
                onClick={handleSubscribe}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-2 px-4 rounded-full transition-all duration-300 transform hover:scale-105"
              >
                Suscribirse
              </Button>
              <InvitationCodeButton onSuccess={() => setIsSubscribed(true)} showToast={showToast} />
            </>
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
              {isLoading && <LoadingSpinner />}
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
              {!isSubscribed && freeMessages > 0 && (
                <p className="text-xs text-gray-400 mt-2 text-center">
                  Tienes {freeMessages} mensaje{freeMessages !== 1 ? 's' : ''} gratuito{freeMessages !== 1 ? 's' : ''} restante{freeMessages !== 1 ? 's' : ''}
                </p>
              )}
              {!isLoading && messages.length > 0 && !showFeedback && (
                <Button
                  onClick={() => setShowFeedback(true)}
                  className="mt-4 bg-purple-500 hover:bg-purple-600 text-white"
                >
                  Dar retroalimentación
                </Button>
              )}
              {showFeedback && (
                <div className="mt-4">
                  <FeedbackForm onSubmit={handleFeedback} />
                </div>
              )}
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
  const [freeMessages, setFreeMessages] = useState(2)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [userPoints, setUserPoints] = useState<number>(0)
  const [expectationTopic, setExpectationTopic] = useState<string>('')
  const [showCheckout, setShowCheckout] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    const storedFreeMessages = localStorage.getItem('freeMessages')
    if (storedFreeMessages) {
      setFreeMessages(Number(storedFreeMessages))
    } else {
      localStorage.setItem('freeMessages', '2')
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('freeMessages', freeMessages.toString())
  }, [freeMessages])

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
      showToast({
        title: 'Mensajes gratuitos agotados',
        description: 'Has alcanzado el límite de mensajes gratuitos. Suscríbete para continuar chateando.',
        variant: 'destructive',
      })
    }
  }, [isSubscribed, freeMessages, showToast])

  useEffect(() => {
    if (!showWelcome && messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content:
            '¡Bienvenido a AMT IA! Soy tu asistente de inteligencia artificial creado por Giancarlo Tonazza en Uruguay y potenciado por Anthropic. Estoy listo para ayudarte en tu camino hacia el éxito. ¿Necesitas ayuda con estrategias para tu emprendimiento? ¿Quieres optimizar tu productividad? ¿O tal vez necesitas ideas creativas para tu próximo proyecto? Estoy aquí para asistirte en lo que necesites. ¿En qué área te gustaría que nos enfoquemos hoy?',
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
        const decoder = new TextDecoder()

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value, { stream: true })
          accumulatedResponse += chunk
          setMessages((prev) => {
            const newMessages = [...prev]
            const lastMessage = newMessages[newMessages.length - 1]
            if (lastMessage.role === 'assistant') {
              lastMessage.content = accumulatedResponse
            } else {
              newMessages.push({ role: 'assistant', content: accumulatedResponse })
            }
            return newMessages
          })
        }

        if (!accumulatedResponse.trim()) {
          throw new Error('Received empty response from the API')
        }

        if (!isSubscribed) {
          setFreeMessages((prev) => {
            const newValue = Math.max(0, prev - 1)
            localStorage.setItem('freeMessages', newValue.toString())
            return newValue
          })
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

  const handleFeedback = async (feedback: { rating: 'positive' | 'negative'; comment: string }) => {
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'user_id', // Reemplazar con el ID real del usuario
          conversationId: 'conversation_id', // Reemplazar con el ID real de la conversación
          ...feedback
        }),
      });

      if (response.ok) {
        showToast({
          title: 'Gracias por tu retroalimentación',
          description: 'Tu opinión es muy importante para nosotros.',
        });
        setShowFeedback(false);
      } else {
        throw new Error('Failed to submit feedback');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      showToast({
        title: 'Error',
        description: 'No se pudo enviar la retroalimentación. Por favor, intenta de nuevo.',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

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
              <p className="text-2xl mb-4 text-purple-300 font-semibold">
                La Primera Aplicación de IA creada en Uruguay
              </p>
              <p className="text-xl mb-8 text-gray-300">
                AMT IA: Tu asistente personal de inteligencia artificial, diseñado para ofrecer soluciones reales a los desafíos complejos de tu vida diaria.
              </p>
              <ul className="grid grid-cols-2 gap-4 mb-8 text-left">
                {[
                  "Resolución de problemas complejos",
                  "Estrategias personalizadas",
                  "Análisis profundo de situaciones",
                  "Generación de ideas innovadoras",
                  "Optimización de procesos diarios",
                  "Toma de decisiones informadas"
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
              <p className="text-2xl font-semibold mb-4 text-purple-300">
                Soluciones reales para tus desafíos diarios
              </p>
              <p className="text-lg mb-8 text-gray-300">
                Desde problemas profesionales hasta dilemas personales, AMT IA está aquí para ayudarte a encontrar respuestas efectivas y prácticas.
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
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6 max-w-md w-full">
                  <h3 className="text-xl font-semibold mb-4 text-purple-300">Beneficios de la suscripción:</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-300">
                    <li>Mensajes ilimitados con AMT IA</li>
                    <li>Acceso prioritario a nuevas funciones</li>
                    <li>Respuestas más rápidas y detalladas</li>
                    <li>Soporte personalizado</li>
                    <li>Sin publicidad</li>
                  </ul>
                </div>
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
                showFeedback={showFeedback}
                setShowFeedback={setShowFeedback}
                handleFeedback={handleFeedback}
                showToast={showToast}
                setIsSubscribed={setIsSubscribed}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </ToastProvider>
  )
}

