'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"

interface MercadoPagoButtonProps {
  onSuccess: () => void
}

export default function MercadoPagoButton({ onSuccess }: MercadoPagoButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleCheckout = async () => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/create-mercadopago-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          price: 9.99,
          description: 'Suscripción a AMT IA',
        }),
      })

      const data = await response.json()

      if (data.init_point) {
        window.location.href = data.init_point
      } else {
        throw new Error('No se pudo crear la preferencia de pago')
      }
    } catch (err) {
      console.error('Error:', err)
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleCheckout} disabled={isLoading}>
      {isLoading ? 'Procesando...' : 'Pagar con MercadoPago'}
    </Button>
  )
}

