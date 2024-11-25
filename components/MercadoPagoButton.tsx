'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import Script from 'next/script'

const MERCADOPAGO_PUBLIC_KEY = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY;

declare global {
  interface Window {
    MercadoPago?: new (publicKey: string) => {
      checkout: (options: {
        preference: { id: string };
        render: { container: string; label: string };
      }) => void;
    };
  }
}

interface MercadoPagoButtonProps {
  onSuccess: () => void;
  preferenceId: string;
}

export default function MercadoPagoButton({ onSuccess, preferenceId }: MercadoPagoButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleCheckout = async () => {
    setIsLoading(true)

    try {
      if (window.MercadoPago && MERCADOPAGO_PUBLIC_KEY) {
        const mp = new window.MercadoPago(MERCADOPAGO_PUBLIC_KEY);
        mp.checkout({
          preference: {
            id: preferenceId
          },
          render: {
            container: '.cho-container',
            label: 'Pagar',
          }
        });
        onSuccess(); // Llamamos a onSuccess después de iniciar el checkout
      } else {
        throw new Error('MercadoPago SDK not loaded or public key not available');
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
        onLoad={() => {
          if (window.MercadoPago && MERCADOPAGO_PUBLIC_KEY) {
            new window.MercadoPago(MERCADOPAGO_PUBLIC_KEY);
          }
        }}
      />
      <div className='cho-container'></div> {/* Added div for MercadoPago to render */}
      <Button onClick={handleCheckout} disabled={isLoading || !preferenceId}>
        {isLoading ? 'Procesando...' : 'Pagar con MercadoPago'}
      </Button>
    </>
  )
}



