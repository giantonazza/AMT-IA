import React from 'react';
import MercadoPagoButton from './MercadoPagoButton';

interface MarketplaceCheckoutProps {
  preferenceId: string;
}

export default function MarketplaceCheckout({ preferenceId }: MarketplaceCheckoutProps) {
  const handleSuccess = () => {
    console.log('Pago exitoso');
    // Aquí puedes agregar la lógica que deseas ejecutar después de un pago exitoso
  };

  return (
    <div>
      <h2>Complete your purchase</h2>
      <MercadoPagoButton onSuccess={handleSuccess} preferenceId={preferenceId} />
    </div>
  );
}


