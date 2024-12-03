'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Send, Sparkles, User, Bot } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { ToastProvider, ToastViewport } from '@/components/ui/toast'
import MercadoPagoCheckout from '@/components/MercadoPagoCheckout'
import { ExpectationWindow } from '@/components/ExpectationWindow'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { FeedbackForm } from '@/components/FeedbackForm'
import { InvitationCodeButton } from '@/components/InvitationCodeButton'
import { useSession, signOut } from 'next-auth/react'
import type { Session } from 'next-auth'
import Link from 'next/link'
import { AuthWrapper } from "@/components/AuthWrapper"

interface Message {
  role: 'user' | 'assistant'
  content: string
}

function UserPoints({ points }: { points: number }) {
  return (
    <div className="text-xs sm:text-sm text-gray-300 flex items-center">
      <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-yellow-400" />
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
  session,
  handleSubmit,
  inputRef,
  messagesEndRef,
  expectationTopic,
  showFeedback,
  setShowFeedback,
  handleFeedback,
  showToast,
  userPoints,
  setShowCheckout,
}: {
  messages: Message[]
  isLoading: boolean
  freeMessages: number
  session: Session | null
  handleSubmit: (e: React.FormEvent) => Promise<void>
  inputRef: React.RefObject<HTMLInputElement>
  messagesEndRef: React.RefObject<HTMLDivElement>
  expectationTopic: string
  showFeedback: boolean
  setShowFeedback: (show: boolean) => void
  handleFeedback: (feedback: { rating: 'positive' | 'negative'; comment: string }) => Promise<void>
  showToast: (props: { title: string; description: string; variant?: 'default' | 'destructive' }) => void
  userPoints: number
  setShowCheckout: React.Dispatch<React.SetStateAction<boolean>>
}) {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 text-gray-100">
      <header className="fixed top-0 left-0 right-0 z-50 flex flex-wrap items-center justify-between p-2 sm:p-4 bg-black bg-opacity-50 backdrop-blur-md">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">AMT IA Chat</h1>
        <div className="flex items-center space-x-4">
          <UserPoints points={userPoints} />
          {session?.user?.subscriptionTier !== 'PREMIUM' && (
            <>
              <Button
                onClick={() => setShowCheckout(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-1 px-2 sm:py-2 sm:px-4 rounded-full transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm"
              >
                Suscribirse
              </Button>
              <InvitationCodeButton onSuccess={() => {/* Handle successful invitation */}} showToast={showToast} />
            </>
          )}
          {session ? (
            <Button onClick={() => signOut()} className="bg-red-500 hover:bg-red-600 text-white">
              Cerrar Sesión
            </Button>
          ) : (
            <Link href="/auth/signin">
              <Button className="bg-green-500 hover:bg-green-600 text-white">
                Iniciar Sesión
              </Button>
            </Link>
          )}
        </div>
      </header>
      <main className="flex-grow overflow-hidden p-2 sm:p-4 mt-16">
        <Card className="bg-black bg-opacity-50 backdrop-blur-md border-none h-[calc(100vh-8rem)] rounded-2xl overflow-hidden mx-auto max-w-6xl">
          <CardContent className="p-0 h-full flex flex-col">
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <ChatMessage key={index} message={message} isLast={index === messages.length - 1} />
              ))}
              {isLoading && <LoadingSpinner />}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-4 bg-black bg-opacity-50 backdrop-blur-md">
              <form onSubmit={handleSubmit} className="flex space-x-2 max-w-4xl mx-auto">
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder="Escribe tu mensaje..."
                  className="flex-grow bg-gray-800 text-white border-gray-700 rounded-full py-2 px-4 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                  disabled={isLoading || (session?.user?.subscriptionTier !== 'PREMIUM' && freeMessages <= 0)}
                />
                <Button
                  type="submit"
                  disabled={isLoading || (session?.user?.subscriptionTier !== 'PREMIUM' && freeMessages <= 0)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full p-2 transition-all duration-300 transform hover:scale-105"
                >
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </form>
              {session?.user?.subscriptionTier !== 'PREMIUM' && freeMessages > 0 && (
                <p className="text-xs text-gray-400 mt-2 text-center">
                  Tienes {freeMessages} mensajes gratuitos restantes
                </p>
              )}
              {!isLoading && messages.length > 0 && !showFeedback && (
                <div className="flex justify-center mt-4">
                  <Button
                    onClick={() => setShowFeedback(true)}
                    className="bg-purple-500 hover:bg-purple-600 text-white"
                  >
                    Dar retroalimentación
                  </Button>
                </div>
              )}
              {showFeedback && (
                <div className="mt-4 max-w-2xl mx-auto">
                  <FeedbackForm onSubmit={handleFeedback} />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-black bg-opacity-50 backdrop-blur-md">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          {session?.user?.subscriptionTier !== 'PREMIUM' && (
            <div className="flex items-center space-x-4">
              <p className="text-sm text-gray-400">
                Mensajes gratuitos restantes: <span className="font-bold text-purple-400">{freeMessages}</span>
              </p>
              <Button
                onClick={() => setShowCheckout(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                Suscribirse
              </Button>
            </div>
          )}
          <div className="text-center text-gray-400 text-xs">
            Creado por Giancarlo Tonazza, Uruguay |{' '}
            <a
              href="https://instagram.com/giantonazza"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-purple-400 transition-all duration-300"
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
  const [showWelcome, _setShowWelcome] = useState(true)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [freeMessages, setFreeMessages] = useState(3)
  const [userPoints, setUserPoints] = useState<number>(0)
  const [expectationTopic, setExpectationTopic] = useState<string>('')
  const [showCheckout, setShowCheckout] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const { data: session, status } = useSession()
  //const router = useRouter() //Removed

  useEffect(() => {
    if (session?.user) {
      setUserPoints(session.user.points || 0)
    }
  }, [session])

  useEffect(() => {
    const storedFreeMessages = localStorage.getItem('freeMessages')
    if (storedFreeMessages) {
      setFreeMessages(Number(storedFreeMessages))
    } else {
      localStorage.setItem('freeMessages', '3')
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
    if (session?.user?.subscriptionTier !== 'PREMIUM' && freeMessages <= 0) {
      setMessages([])
      showToast({
        title: 'Mensajes gratuitos agotados',
        description: 'Has alcanzado el límite de mensajes gratuitos. Suscríbete para continuar chateando.',
        variant: 'destructive',
      })
    }
  }, [session, freeMessages, showToast])

  useEffect(() => {
    if (!showWelcome && messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content:
            '¡Bienvenido a AMT-IA, potenciado por Anthropic! Soy tu asistente de inteligencia artificial creado para ayudarte en diversos aspectos. Puedo asistirte en áreas como:\n\n' +
            '• Estrategias para emprendimientos\n' +
            '• Optimización de productividad\n' +
            '• Generación de ideas creativas\n' +
            '• Análisis de mercado y tendencias\n' +
            '• Resolución de problemas complejos\n' +
            '• Planificación de proyectos\n\n' +
            '¿En qué área te gustaría que te ayude hoy?',
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

        if (freeMessages <= 0 && session?.user?.subscriptionTier !== 'PREMIUM') {
          console.log('No free messages left and not subscribed')
          showToast({
            title: 'Límite de mensajes alcanzado',
            description: 'Has alcanzado el límite de mensajes gratuitos. Suscríbete para continuar.',
            variant: 'destructive',
          })
          setShowCheckout(true)
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
        const response = await fetch('/api/chat',{
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

        if (session?.user?.subscriptionTier !== 'PREMIUM') {
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
    [messages, isLoading, freeMessages, session, showToast]
  )

  const handleSubscriptionSuccess = useCallback(() => {
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
          userId: session?.user?.id || 'anonymous',
          conversationId: 'current_conversation_id', // You should implement a way to track conversation IDs
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

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-purple-900">
        <LoadingSpinner />
      </div>
    )
  }

  if (status === "unauthenticated" && !showWelcome) {
    //router.push('/auth/signin') //Removed
    return null
  }

  return (
    <ToastProvider>
      <AuthWrapper>
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
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-left">
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
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/auth/signin">
                    <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-lg font-medium py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105">
                      Iniciar Sesión <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button variant="outline" className="text-lg font-medium py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 border-2 border-purple-500 text-purple-400 hover:bg-purple-500/10">
                      Registrarse <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
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
              {showCheckout && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <Card className="w-full max-w-md">
                    <CardHeader>
                      <CardTitle>Suscripción Premium</CardTitle>
                      <CardDescription>Obtén acceso ilimitado a AMT IA</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc list-inside space-y-2 mb-4">
                        <li>Mensajes ilimitados con AMT IA</li>
                        <li>Acceso prioritario a nuevas funciones</li>
                        <li>Respuestas más rápidas y detalladas</li>
                        <li>Soporte personalizado</li>
                      </ul>
                      <MercadoPagoCheckout onSuccess={handleSubscriptionSuccess} />
                    </CardContent>
                    <CardFooter>
                      <Button variant="ghost" onClick={() => setShowCheckout(false)}>Cancelar</Button>
                    </CardFooter>
                  </Card>
                </div>
              )}
              <MainContent 
                  messages={messages}
                  isLoading={isLoading}
                  freeMessages={freeMessages}
                  session={session}
                  handleSubmit={handleSubmit}
                  inputRef={inputRef}
                  messagesEndRef={messagesEndRef}
                  userPoints={userPoints}
                  expectationTopic={expectationTopic}
                  showFeedback={showFeedback}
                  setShowFeedback={setShowFeedback}
                  handleFeedback={handleFeedback}
                  showToast={showToast}
                  setShowCheckout={setShowCheckout}
                />
            </motion.div>
          )}
        </AnimatePresence>
      </AuthWrapper>
    </ToastProvider>
  )
}

