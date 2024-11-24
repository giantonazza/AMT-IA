'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Loader2, Send, Bot, User, ArrowRight, Info } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"
import { ToastProvider, ToastViewport } from "@/components/ui/toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { chatWithAI } from '@/lib/anthropic'
import dynamic from 'next/dynamic'
import LoadingDots from '@/components/LoadingDots'

const PayPalScriptProvider = dynamic(
  () => import('@paypal/react-paypal-js').then(mod => mod.PayPalScriptProvider),
  { ssr: false }
)
const PayPalButton = dynamic(() => import('@/components/PayPalButton'), { ssr: false })

interface MainContentProps {
  messages: { role: string; content: string }[];
  isLoading: boolean;
  freeMessages: number;
  isSubscribed: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  inputRef: React.RefObject<HTMLTextAreaElement>;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  showToast: (props: { title: string; description: string; variant?: "default" | "destructive" }) => void;
  setFreeMessages: (value: number | ((prev: number) => number)) => void;
  setIsSubscribed: (value: boolean) => void;
}

const MainContent: React.FC<MainContentProps> = ({
  messages,
  isLoading,
  freeMessages,
  isSubscribed,
  handleSubmit,
  inputRef,
  messagesEndRef,
  showToast,
  setFreeMessages,
  setIsSubscribed
}) => {
  const [showTips, setShowTips] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100">
      <header className="bg-gray-800 p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          AMT IA
        </h1>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowTips(!showTips)}
            className="text-gray-300 hover:text-white"
          >
            <Info className="h-5 w-5" />
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-gray-700 hover:bg-gray-600 text-gray-100">
                Suscribirse
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 text-gray-100">
              <DialogHeader>
                <DialogTitle>Suscríbete a AMT IA</DialogTitle>
                <DialogDescription>
                  Obtén acceso ilimitado a AMT IA por solo $9.99 al mes.
                </DialogDescription>
              </DialogHeader>
              <PayPalButton onSuccess={(details) => {
                console.log('Pago exitoso', details);
                showToast({
                  title: "Suscripción exitosa",
                  description: "¡Gracias por suscribirte! Ahora tienes acceso ilimitado.",
                });
                setFreeMessages(Infinity);
                setIsSubscribed(true);
              }} />
            </DialogContent>
          </Dialog>
        </div>
      </header>
      <div className="flex-grow overflow-auto p-4 space-y-4">
        {showTips && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gray-800 p-4 rounded-lg shadow-lg"
          >
            <h3 className="font-bold mb-2">Consejos para interactuar con AMT IA:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Sé específico en tus preguntas para obtener respuestas más precisas.</li>
              <li>Puedes hacer preguntas de seguimiento para profundizar en un tema.</li>
              <li>AMT IA puede ayudarte con una variedad de temas, ¡no dudes en preguntar!</li>
              <li>Si necesitas aclaraciones, simplemente pídelas.</li>
            </ul>
          </motion.div>
        )}
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`p-3 rounded-lg max-w-[80%] ${
                message.role === 'user' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-700 text-gray-100'
              }`}>
                <div className="flex items-center mb-1">
                  {message.role === 'user' ? (
                    <User className="w-4 h-4 mr-2" />
                  ) : (
                    <Bot className="w-4 h-4 mr-2" />
                  )}
                  <span className="font-semibold">{message.role === 'user' ? 'Tú' : 'AMT IA'}</span>
                </div>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <div className="flex justify-start">
            <div className="p-3 rounded-lg bg-gray-700 text-gray-100">
              <div className="flex items-center mb-1">
                <Bot className="w-4 h-4 mr-2" />
                <span className="font-semibold">AMT IA</span>
              </div>
              <LoadingDots />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <footer className="bg-gray-800 p-4">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <textarea
            ref={inputRef}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            className="flex-grow bg-gray-700 text-gray-100 placeholder-gray-400 border-gray-600 focus:border-purple-500 rounded-md p-2 resize-none"
            placeholder="Escribe tu mensaje..."
            disabled={isLoading || (freeMessages <= 0 && !isSubscribed)}
            rows={1}
            style={{ minHeight: '40px', maxHeight: '120px' }}
          />
          <Button type="submit" disabled={isLoading || (freeMessages <= 0 && !isSubscribed)} className="bg-purple-600 hover:bg-purple-700">
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </form>
        {!isSubscribed && (
          <p className="text-xs text-gray-400 mt-2 text-center">
            {freeMessages > 0 ? `Te quedan ${freeMessages} mensajes gratuitos` : 'Has agotado tus mensajes gratuitos. Suscríbete para continuar.'}
          </p>
        )}
      </footer>
      <div className="text-center text-gray-400 text-xs py-2 bg-gray-800">
        created by giantonazza, Uruguay | <a href="https://instagram.com/giantonazza" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400">Instagram</a>
      </div>
      <ToastViewport />
    </div>
  )
}

export default function Home() {
  const [showWelcome, setShowWelcome] = useState(true)
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [freeMessages, setFreeMessages] = useState(6)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const { toast } = useToast()

  const showToast = (props: { title: string; description: string; variant?: "default" | "destructive" }) => {
    toast(props)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [messages])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputRef.current || isLoading) return
    
    const input = inputRef.current.value.trim()
    if (!input) {
      showToast({
        title: "Mensaje vacío",
        description: "Por favor, escribe un mensaje antes de enviar.",
        variant: "destructive",
      })
      return
    }

    if (freeMessages <= 0 && !isSubscribed) {
      showToast({
        title: "Límite de mensajes alcanzado",
        description: "Has alcanzado el límite de mensajes gratuitos. Suscríbete para continuar.",
        variant: "destructive",
      })
      return
    }

    const userMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    inputRef.current.value = ''
    setIsLoading(true)
    setFreeMessages(prev => isSubscribed ? prev : prev - 1)

    try {
      const aiResponse = await chatWithAI(messages.concat(userMessage))
      const aiMessage = { role: 'assistant', content: aiResponse }
      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Error:', error)
      showToast({
        title: "Error",
        description: error instanceof Error ? error.message : "Hubo un problema al procesar tu mensaje. Por favor, intenta de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  return (
    <PayPalScriptProvider options={{ "client-id": "Ad0W2q249Ro1B4a-zGnYkRjL6rc5KWQHx0aK0Ub1L3HsAM7i_akN8DqcLLGQW8Kjl2rv4LKz-pwOcgTT" }}>
      <ToastProvider>
        {showWelcome ? (
          <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-100 p-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                Bienvenido a AMT IA
              </h1>
              <p className="mb-8 max-w-md mx-auto">
                Con AMT IA, puedes conversar sobre cualquier tema, obtener respuestas a tus preguntas,
                y explorar nuevas ideas. Además, te ayudamos con:
              </p>
              <ul className="list-disc text-left mb-8 max-w-md mx-auto">
                <li>Estrategias para tus negocios y emprendimientos</li>
                <li>Planificación y seguimiento de rutinas de ejercicio</li>
                <li>Consejos para mejorar tu productividad</li>
                <li>Análisis de datos y tendencias de mercado</li>
                <li>Generación de ideas creativas para proyectos</li>
                <li>Asistencia en la toma de decisiones importantes</li>
              </ul>
              <p className="mb-8">
                ¡Comienza tu aventura ahora con 6 mensajes gratuitos!
              </p>
              <Button 
                onClick={() => setShowWelcome(false)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Comenzar a chatear <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
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
            showToast={showToast}
            setFreeMessages={setFreeMessages}
            setIsSubscribed={setIsSubscribed}
          />
        )}
      </ToastProvider>
    </PayPalScriptProvider>
  )
}

