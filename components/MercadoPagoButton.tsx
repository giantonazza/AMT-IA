'use client'

import { useState, useEffect, useCallback } from 'react'
import Script from 'next/script'
import { Button } from "@/components/ui/button"

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

interface MercadoPagoButtonProps {
  onSuccess: () => void;
  preferenceId: string;
}

export default function MercadoPagoButton({ onSuccess, preferenceId }: MercadoPagoButtonProps) {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initializeMercadoPago = useCallback(() => {
    if (typeof window.MercadoPago !== 'undefined' && MERCADOPAGO_PUBLIC_KEY) {
      const mp = new window.MercadoPago(MERCADOPAGO_PUBLIC_KEY);
      mp.checkout({
        preference: {
          id: preferenceId
        },
        render: {
          container: '.cho-container',
          label: 'Pagar con Mercado Pago',
        },
        autoOpen: false, // We'll open it manually
      });

      // Add event listener for successful payment
      window.addEventListener('payment.success', onSuccess);

      return () => {
        window.removeEventListener('payment.success', onSuccess);
      };
    }
    
    console.error('MercadoPago SDK not loaded');
    setError('No se pudo cargar el sistema de pago. Por favor, intente más tarde.');
    return undefined;
  }, [preferenceId, onSuccess]);

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
    if (typeof window.MercadoPago !== 'undefined' && MERCADOPAGO_PUBLIC_KEY) {
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
      {isSDKLoaded ? (
        <Button onClick={handlePayButtonClick}>Pagar con Mercado Pago</Button>
      ) : (
        <Button disabled>Cargando...</Button>
      )}
    </>
  );
}

