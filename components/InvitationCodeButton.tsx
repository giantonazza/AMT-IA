import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Gift } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface InvitationCodeButtonProps {
  onSuccess: () => void;
  showToast: (props: { title: string; description: string; variant?: 'default' | 'destructive' }) => void;
}

export const InvitationCodeButton: React.FC<InvitationCodeButtonProps> = ({ onSuccess, showToast }) => {
  const [invitationCode, setInvitationCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInvitationCode = async () => {
    if (!invitationCode.trim()) {
      showToast({
        title: 'Error',
        description: 'Por favor, ingrese un código de invitación.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('Sending invitation code validation request:', invitationCode);
      const response = await fetch('/api/invitation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'validate', code: invitationCode }),
      });
      console.log('Received response:', response.status, response.statusText);
      const data = await response.json();
      console.log('Response data:', data);
      if (data.valid) {
        onSuccess();
        showToast({
          title: 'Código de invitación válido',
          description: 'Has sido suscrito exitosamente.',
        });
      } else {
        showToast({
          title: 'Código de invitación inválido',
          description: 'Por favor, verifica el código e intenta nuevamente.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error validating invitation code:', error);
      showToast({
        title: 'Error',
        description: 'Hubo un problema al validar el código. Por favor, intenta de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
      setInvitationCode('');
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="rounded-full p-2 bg-purple-500 hover:bg-purple-600"
          title="Usar código de invitación"
        >
          <Gift className="w-4 h-4 text-white" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <h4 className="font-medium leading-none">Código de Invitación</h4>
          <Input
            type="text"
            placeholder="Ingrese el código"
            value={invitationCode}
            onChange={(e) => setInvitationCode(e.target.value)}
          />
          <Button onClick={handleInvitationCode} disabled={isSubmitting}>
            {isSubmitting ? 'Validando...' : 'Usar Código'}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

