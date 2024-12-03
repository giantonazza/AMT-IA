'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Sparkles, Crown, Gift, Settings, LogOut } from 'lucide-react'
import MercadoPagoCheckout from '@/components/MercadoPagoCheckout'
import { useToast } from "@/components/ui/use-toast"

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [showCheckout, setShowCheckout] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  if (status === 'loading') {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>
  }

  if (!session?.user) {
    return null
  }

  const { name, email, subscriptionTier, points } = session.user
  const isSubscribed = subscriptionTier === 'PREMIUM'

  const handleSubscribe = () => {
    setShowCheckout(true)
  }

  const handleSubscriptionSuccess = () => {
    toast({
      title: "Suscripción exitosa",
      description: "¡Gracias por suscribirte a AMT IA Premium!",
    })
    setShowCheckout(false)
    // Here you would typically refresh the session or update the user's subscription status
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={`https://avatars.dicebear.com/api/initials/${name}.svg`} />
                <AvatarFallback>{name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl font-bold">{name}</CardTitle>
                <CardDescription>{email}</CardDescription>
                <Badge variant={isSubscribed ? "default" : "secondary"} className="mt-2">
                  {isSubscribed ? (
                    <><Crown className="w-4 h-4 mr-1" /> Premium</>
                  ) : (
                    <><Gift className="w-4 h-4 mr-1" /> Free</>
                  )}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Puntos AMT</h3>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                <span className="text-2xl font-bold">{points}</span>
              </div>
              <Progress value={points % 100} className="mt-2" />
            </div>
            {!isSubscribed && (
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">¡Actualiza a Premium!</h3>
                <p className="text-sm mb-4">Obtén acceso ilimitado a todas las funciones de AMT IA.</p>
                <Button onClick={handleSubscribe} className="w-full">
                  Suscribirse ahora
                </Button>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" className="flex items-center">
              <Settings className="w-4 h-4 mr-2" />
              Configuración
            </Button>
            <Button variant="destructive" className="flex items-center">
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar sesión
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
      {showCheckout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Suscripción Premium</CardTitle>
              <CardDescription>Completa tu suscripción con MercadoPago</CardDescription>
            </CardHeader>
            <CardContent>
              <MercadoPagoCheckout onSuccess={handleSubscriptionSuccess} />
            </CardContent>
            <CardFooter>
              <Button variant="ghost" onClick={() => setShowCheckout(false)}>Cancelar</Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}

