import { NextResponse } from 'next/server';
import { Anthropic } from '@anthropic-ai/sdk';
import prisma from '@/lib/prisma';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function POST(req: Request) {
  console.log('Chat API route called');

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY is not set in .env.local');
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY is not set' }, { status: 500 });
  }

  try {
    const { messages, userId } = await req.json();
    console.log('Received messages:', JSON.stringify(messages, null, 2));

    // Actualizar la fecha de último acceso del usuario
    await prisma.user.update({
      where: { id: userId },
      data: { lastAccessAt: new Date() }
    });

    // Verificar si el usuario está suscrito o si aún tiene mensajes gratuitos
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    if (!user.isSubscribed && user.points <= 0) {
      return NextResponse.json({ error: 'No tienes más mensajes gratuitos' }, { status: 403 });
    }

    const response = await anthropic.messages.create({
      model: 'claude-2.1',
      messages: messages,
      max_tokens: 4000,
      temperature: 0.7,
      stream: true,
    });

    console.log('Anthropic API response received');

    // Convert the response to a ReadableStream
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of response) {
            if (chunk.type === 'content_block_delta' && 'text' in chunk.delta) {
              controller.enqueue(chunk.delta.text);
            }
          }
          controller.close();
        } catch (error) {
          console.error('Error in stream processing:', error);
          controller.error(error);
        }
      },
    });

    console.log('Stream created successfully');

    // Si el usuario no está suscrito, restar un punto
    if (!user.isSubscribed) {
      await prisma.user.update({
        where: { id: userId },
        data: { points: { decrement: 1 } }
      });
    }

    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json({ 
      error: 'An error occurred while processing your request',
      details: error instanceof Error ? error.message : String(error),
      stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : 'No stack trace available') : undefined
    }, { status: 500 });
  }
}

