'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import Script from 'next/script'

declare global {
  interface Window {
    MercadoPago: new (publicKey: string) => {
      checkout: (options: {
        preference: {
          id: string;
        };
        autoOpen: boolean;
      }) => void;
    };
  }
}

interface MercadoPagoButtonProps {
  onSuccess: () => void
}

export default function MercadoPagoButton({ onSuccess }: MercadoPagoButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [mercadopago, setMercadopago] = useState<Window['MercadoPago'] | null>(null)

  useEffect(() => {
    if (window.MercadoPago) {
      setMercadopago(new window.MercadoPago(process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY))
    }
  }, [])

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
        if (mercadopago) {
          mercadopago.checkout({
            preference: {
              id: data.id
            },
            autoOpen: true,
          });
        } else {
          window.location.href = data.init_point
        }
        onSuccess()
      } else {
        throw new Error('No se pudo crear la preferencia de pago')
      }
    } catch (err) {
      console.error('Error:', err)
      // Aquí podrías mostrar un mensaje de error al usuario
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Script
        src="https://sdk.mercadopago.com/js/v2"
        strategy="lazyOnload"
      />
      <Button onClick={handleCheckout} disabled={isLoading}>
        {isLoading ? 'Procesando...' : 'Pagar con MercadoPago'}
      </Button>
    </>
  )
}

