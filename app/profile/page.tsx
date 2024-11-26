'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import MercadoPagoButton from '@/components/MercadoPagoButton'

interface UserProfile {
  email: string;
  isSubscribed: boolean;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [preferenceId, setPreferenceId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('/api/user/profile')
        if (response.ok) {
          const data = await response.json()
          setUser(data)
        } else {
          throw new Error('Failed to fetch user profile')
        }
      } catch (error) {
        console.error('Error fetching user profile:', error)
        toast({
          title: "Error",
          description: "No se pudo cargar el perfil del usuario. Por favor, intente nuevamente.",
          variant: "destructive",
        })
        router.push('/login')
      }
    }

    fetchUserProfile()
  }, [router])

  useEffect(() => {
    const fetchPreferenceId = async () => {
      if (user && !user.isSubscribed) {
        try {
          const response = await fetch('/api/create-mercadopago-preference', {
            method: 'POST',
          })
          const data = await response.json()
          if (data.id) {
            setPreferenceId(data.id)
          } else {
            throw new Error('No se pudo obtener el preferenceId')
          }
        } catch (error) {
          console.error('Error al obtener el preferenceId:', error)
          toast({
            title: "Error",
            description: "No se pudo iniciar el proceso de pago. Por favor, intente nuevamente.",
            variant: "destructive",
          })
        }
      }
    }

    fetchPreferenceId()
  }, [user])

  if (!user) {
    return <div>Cargando perfil...</div>
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Perfil de Usuario</CardTitle>
          <CardDescription>Gestiona tu cuenta y suscripción</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-lg mb-4">Email: {user.email}</p>
          <p className="text-lg mb-4">
            Estado de suscripción: {user.isSubscribed ? 'Activa' : 'Inactiva'}
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.push('/')}>
            Volver al inicio
          </Button>
          {!user.isSubscribed && preferenceId && (
            <MercadoPagoButton
              preferenceId={preferenceId}
              onSuccess={() => {
                toast({
                  title: "Suscripción exitosa",
                  description: "¡Gracias por suscribirte! Ahora tienes acceso ilimitado.",
                })
                setUser({ ...user, isSubscribed: true })
              }}
            />
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

