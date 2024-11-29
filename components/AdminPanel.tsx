import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

export function AdminPanel() {
  const [invitationCodes, setInvitationCodes] = useState<string[]>([]);
  const [vipUsers, setVipUsers] = useState<string[]>([]);
  const [newVipUser, setNewVipUser] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchAndParse = async (url: string) => {
          const response = await fetch(url);
          const text = await response.text();
          console.log(`Raw response from ${url}:`, text);
          let data;
          try {
            data = JSON.parse(text);
          } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            throw new Error(`Invalid JSON response from ${url}: ${text}`);
          }
          if (!response.ok) {
            throw new Error(data.error || `HTTP error! status: ${response.status}`);
          }
          return data;
        };

        const codesData = await fetchAndParse('/api/invitation/codes');
        setInvitationCodes(codesData.codes || []);

        const vipUsersData = await fetchAndParse('/api/users/vip');
        setVipUsers(vipUsersData.users || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos. Por favor, intente de nuevo o contacte al administrador.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const generateInvitationCode = async () => {
    try {
      const response = await fetch('/api/invitation/generate', {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Error al generar el código');
      }
      const data = await response.json();
      setInvitationCodes(prevCodes => [...prevCodes, data.code]);
      toast({
        title: "Código generado",
        description: `Nuevo código: ${data.code}`,
      });
    } catch (error) {
      console.error('Error generating invitation code:', error);
      toast({
        title: "Error",
        description: "No se pudo generar el código de invitación",
        variant: "destructive",
      });
    }
  };

  const addVipUser = async () => {
    try {
      const response = await fetch('/api/users/vip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newVipUser }),
      });
      if (!response.ok) {
        throw new Error('Error al añadir usuario VIP');
      }
      const data = await response.json();
      setVipUsers(prevUsers => [...prevUsers, data.user]);
      setNewVipUser('');
      toast({
        title: "Usuario VIP añadido",
        description: `${data.user} ahora es un usuario VIP`,
      });
    } catch (error) {
      console.error('Error adding VIP user:', error);
      toast({
        title: "Error",
        description: "No se pudo añadir el usuario VIP",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="space-y-4 p-4 bg-gray-100 rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800">Panel de Administración</h2>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <div className="bg-white p-4 rounded-md shadow">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Códigos de Invitación</h3>
        {invitationCodes.length > 0 ? (
          <ul className="list-disc list-inside mb-4">
            {invitationCodes.map((code, index) => (
              <li key={index} className="text-gray-600">{code}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 mb-4">No hay códigos de invitación disponibles.</p>
        )}
        <Button onClick={generateInvitationCode} className="bg-blue-500 hover:bg-blue-600 text-white">
          Generar Nuevo Código
        </Button>
      </div>
      <div className="bg-white p-4 rounded-md shadow">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Usuarios VIP</h3>
        {vipUsers.length > 0 ? (
          <ul className="list-disc list-inside mb-4">
            {vipUsers.map((user, index) => (
              <li key={index} className="text-gray-600">{user}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 mb-4">No hay usuarios VIP registrados.</p>
        )}
        <div className="flex space-x-2">
          <Input
            type="email"
            placeholder="Email del nuevo usuario VIP"
            value={newVipUser}
            onChange={(e) => setNewVipUser(e.target.value)}
            className="flex-grow"
          />
          <Button onClick={addVipUser} className="bg-green-500 hover:bg-green-600 text-white">
            Añadir Usuario VIP
          </Button>
        </div>
      </div>
    </div>
  );
}

