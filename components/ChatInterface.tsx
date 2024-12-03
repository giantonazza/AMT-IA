import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const ChatInterface: React.FC = () => {
  const { data: session } = useSession();
  const [message, setMessage] = useState<string>("");
  const [feedback, setFeedback] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Send message to server
      const response = await fetch("/api/message", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      toast({
        title: "Mensaje enviado",
        description: data.message,
        variant: "default",
      });
      setMessage("");
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Hubo un problema al procesar tu mensaje. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    }
  };

  const handleFeedback = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Send feedback to server
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedback }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      toast({
        title: "Retroalimentación enviada",
        description: data.message,
        variant: "default",
      });
      setFeedback("");
    } catch (error) {
      console.error('Error sending feedback:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo enviar la retroalimentación. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    // No need to update userPoints here
  }, [session]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Chat</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Escribe tu mensaje aquí..."
              className="min-h-[100px]"
            />
            <Button type="submit">Enviar</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Retroalimentación</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleFeedback} className="space-y-4">
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Escribe tu retroalimentación aquí..."
              className="min-h-[100px]"
            />
            <Button type="submit">Enviar Retroalimentación</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatInterface;


