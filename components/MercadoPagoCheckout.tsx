'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import MercadoPagoButton from './MercadoPagoButton'

interface MercadoPagoCheckoutProps {
  onSuccess: () => void;
}

export default function MercadoPagoCheckout({ onSuccess }: MercadoPagoCheckoutProps) {
  const [preferenceId, setPreferenceId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchPreferenceId = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/create-marketplace-preference', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ amount: 9.99 }), // Fixed amount for subscription
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        if (!data.id) {
          throw new Error('Preference ID not received from the server')
        }
        setPreferenceId(data.id)
      } catch (error) {
        console.error('Error:', error)
        toast({
          title: "Error",
          description: "No se pudo iniciar el proceso de pago. Por favor, intente nuevamente.",
          variant: "destructive",
        })
        setError(error instanceof Error ? error.message : 'An unknown error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPreferenceId()
  }, [toast])

  const handlePaymentSuccess = () => {
    toast({
      title: "¡Pago exitoso!",
      description: "Su suscripción ha sido activada.",
    })
    onSuccess()
  }

  if (isLoading) {
    return <Button disabled>Cargando...</Button>
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>
  }

  return preferenceId ? (
    <MercadoPagoButton preferenceId={preferenceId} onSuccess={handlePaymentSuccess} />
  ) : (
    <Button disabled>Error al cargar el pago</Button>
  )
}

