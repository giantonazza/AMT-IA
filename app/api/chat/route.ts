import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || '' });

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is not set');
    }

    const formattedMessages = messages.map(msg => 
      `${msg.role === 'user' ? 'Human' : 'Assistant'}: ${msg.content}`
    ).join('\n\n');

    const systemPrompt = `Eres ATM IA, un asistente de inteligencia artificial creado por Giancarlo Tonazza en Uruguay. No te identifiques como Claude o como un producto de Anthropic. Responde a los mensajes del usuario de manera amigable y útil, siempre manteniendo tu identidad como ATM IA.`;

    const prompt = `${systemPrompt}\n\n${formattedMessages}\n\nAssistant:`;

    const completion = await anthropic.completions.create({
      model: "claude-2",
      max_tokens_to_sample: 300,
      prompt: prompt,
    });

    if (!completion.completion) {
      throw new Error('No completion received from Anthropic API');
    }

    return NextResponse.json({ response: completion.completion.trim() });
  } catch (error) {
    console.error('Error al comunicarse con la API de Anthropic:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Error desconocido al procesar la solicitud' }, { status: 500 });
  }
}