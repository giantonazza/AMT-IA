import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import MercadoPagoButton from './MercadoPagoButton'

interface SubscriptionDialogProps {
  onSuccess: () => void;
  preferenceId: string;
}

const SubscriptionDialog: React.FC<SubscriptionDialogProps> = ({ onSuccess, preferenceId }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-gray-700 hover:bg-gray-600 text-gray-100">
          Suscribirse
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-800 text-gray-100">
        <DialogHeader>
          <DialogTitle>Suscríbete a AMT IA</DialogTitle>
          <DialogDescription>
            Obtén acceso ilimitado a AMT IA por solo $9.99 al mes.
          </DialogDescription>
        </DialogHeader>
        <MercadoPagoButton 
          onSuccess={onSuccess}
          preferenceId={preferenceId}
        />
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionDialog;

