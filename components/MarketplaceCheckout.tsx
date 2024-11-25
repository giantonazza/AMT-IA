'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import Script from 'next/script'

declare global {
  interface Window {
    MercadoPago?: any;
  }
}

interface MarketplaceCheckoutProps {
  productId: string;
  productTitle: string;
  productPrice: number;
  onSuccess: () => void;
}

export default function MarketplaceCheckout({ productId, productTitle, productPrice, onSuccess }: MarketplaceCheckoutProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleCheckout = async () => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/create-marketplace-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          productTitle,
          productPrice,
        }),
      })

      const data = await response.json()

      if (data.init_point) {
        window.location.href = data.init_point
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
        {isLoading ? 'Procesando...' : 'Comprar ahora'}
      </Button>
    </>
  )
}


