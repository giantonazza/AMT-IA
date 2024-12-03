'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useSession } from "next-auth/react"
import Script from 'next/script'

const MERCADOPAGO_PUBLIC_KEY = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY;

declare global {
  interface Window {
    MercadoPago?: new (publicKey: string) => {
      checkout: (options: {
        preference: { id: string };
        render: { container: string; label: string };
        autoOpen: boolean;
      }) => void;
    };
  }
}

interface MercadoPagoCheckoutProps {
  onSuccess: () => void;
}

export default function MercadoPagoCheckout({ onSuccess }: MercadoPagoCheckoutProps) {
  const [_isLoading, setIsLoading] = useState(false)
  const [preferenceId, setPreferenceId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSDKLoaded, setIsSDKLoaded] = useState(false)
  const { toast } = useToast()
  const { data: session } = useSession()

  useEffect(() => {
    const fetchPreferenceId = async () => {
      if (!session?.user) {
        setError('Debes iniciar sesión para suscribirte');
        return;
      }

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
  }, [toast, session])

  const handlePaymentSuccess = useCallback(async () => {
    try {
      if (session?.user?.id) {
        const response = await fetch('/api/update-subscription', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: session.user.id }),
        });

        if (!response.ok) {
          throw new Error('Failed to update subscription');
        }
      }
      toast({
        title: "¡Pago exitoso!",
        description: "Su suscripción ha sido activada.",
      })
      onSuccess()
    } catch (error) {
      console.error('Error updating subscription:', error);
      toast({
        title: "Error",
        description: "Hubo un problema al activar su suscripción. Por favor, contacte al soporte.",
        variant: "destructive",
      });
    }
  }, [toast, onSuccess, session])

  const initializeMercadoPago = useCallback(() => {
    if (typeof window.MercadoPago !== 'undefined' && MERCADOPAGO_PUBLIC_KEY && preferenceId) {
      const mp = new window.MercadoPago(MERCADOPAGO_PUBLIC_KEY);
      mp.checkout({
        preference: {
          id: preferenceId
        },
        render: {
          container: '.cho-container',
          label: 'Pagar con Mercado Pago',
        },
        autoOpen: false,
      });

      window.addEventListener('payment.success', handlePaymentSuccess);

      return () => {
        window.removeEventListener('payment.success', handlePaymentSuccess);
      };
    }
    
    console.error('MercadoPago SDK not loaded');
    setError('No se pudo cargar el sistema de pago. Por favor, intente más tarde.');
    return undefined;
  }, [preferenceId, handlePaymentSuccess]);

  useEffect(() => {
    if (isSDKLoaded && preferenceId) {
      try {
        const cleanup = initializeMercadoPago();
        return () => {
          if (cleanup) cleanup();
        };
      } catch (err) {
        console.error('Error al inicializar MercadoPago:', err);
        setError('Hubo un problema al iniciar el pago. Por favor, intente nuevamente.');
      }
    }
    return () => {}; // Return an empty cleanup function when conditions are not met
  }, [isSDKLoaded, preferenceId, initializeMercadoPago]);

  const handlePayButtonClick = useCallback(() => {
    if (typeof window.MercadoPago !== 'undefined' && MERCADOPAGO_PUBLIC_KEY && preferenceId) {
      const mp = new window.MercadoPago(MERCADOPAGO_PUBLIC_KEY);
      mp.checkout({
        preference: {
          id: preferenceId
        },
        render: {
          container: '.cho-container',
          label: 'Pagar con Mercado Pago',
        },
        autoOpen: true,
      });
    }
  }, [preferenceId]);

  return (
    <>
      <Script
        src="https://sdk.mercadopago.com/js/v2"
        strategy="lazyOnload"
        onLoad={() => {
          console.log('MercadoPago SDK loaded successfully');
          setIsSDKLoaded(true);
        }}
        onError={() => {
          console.error('Error loading MercadoPago SDK');
          setError('No se pudo cargar el sistema de pago. Por favor, intente más tarde.');
        }}
      />
      <div className='cho-container'></div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {isSDKLoaded && preferenceId ? (
        <Button onClick={handlePayButtonClick} className="w-full">Pagar con Mercado Pago</Button>
      ) : (
        <Button disabled className="w-full">Cargando...</Button>
      )}
    </>
  )
}

