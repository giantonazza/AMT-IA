import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ThumbsUp, ThumbsDown } from 'lucide-react';

interface FeedbackFormProps {
  onSubmit: (feedback: { rating: 'positive' | 'negative', comment: string }) => void;
}

export function FeedbackForm({ onSubmit }: FeedbackFormProps) {
  const [rating, setRating] = useState<'positive' | 'negative' | null>(null);
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating) {
      onSubmit({ rating, comment });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex justify-center space-x-4">
        <Button
          type="button"
          onClick={() => setRating('positive')}
          variant={rating === 'positive' ? 'default' : 'outline'}
          className="flex items-center"
        >
          <ThumbsUp className="mr-2 h-4 w-4" />
          Útil
        </Button>
        <Button
          type="button"
          onClick={() => setRating('negative')}
          variant={rating === 'negative' ? 'default' : 'outline'}
          className="flex items-center"
        >
          <ThumbsDown className="mr-2 h-4 w-4" />
          No útil
        </Button>
      </div>
      <Textarea
        placeholder="¿Tienes algún comentario adicional?"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="min-h-[100px]"
      />
      <Button type="submit" disabled={!rating}>Enviar retroalimentación</Button>
    </form>
  );
}

