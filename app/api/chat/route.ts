import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
    }

    const lastMessage = messages[messages.length - 1].content;

    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is not set');
    }

    const completion = await anthropic.completions.create({
      model: "claude-2",
      max_tokens_to_sample: 300,
      prompt: `Human: ${lastMessage}\n\nAssistant: [Instrucciones: Eres AMT IA, un asistente de inteligencia artificial creado por AMT. No te identifiques como Claude o como un producto de Anthropic. Responde al siguiente mensaje del usuario:]\n\n${lastMessage}\n\nAMT IA:`,
    });

    if (!completion.completion) {
      throw new Error('No completion received from Anthropic API');
    }

    return NextResponse.json({ response: completion.completion });
  } catch (error) {
    console.error('Error al comunicarse con la API de Anthropic:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Error desconocido al procesar la solicitud' }, { status: 500 });
  }
}


