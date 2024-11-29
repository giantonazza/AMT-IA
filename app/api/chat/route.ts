import { NextResponse } from 'next/server';
import { Anthropic } from '@anthropic-ai/sdk';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function POST(req: Request) {
  console.log('Chat API route called');

  try {
    const { messages } = await req.json();
    console.log('Received messages:', JSON.stringify(messages, null, 2));

    // Get userId from cookies
    const cookieStore = await cookies();
    const userId = cookieStore.get('userId')?.value || '';

    if (!userId) {
      console.log('No userId found in cookies');
    } else {
      try {
        const user = await prisma.user.update({
          where: { id: userId },
          data: { lastAccessAt: new Date() },
          select: { isSubscribed: true, points: true }
        });

        if (!user.isSubscribed && user.points <= 0) {
          return NextResponse.json({ error: 'No tienes más mensajes gratuitos' }, { status: 403 });
        }
      } catch (error) {
        console.error('Error updating user:', error);
      }
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is not set in environment variables');
    }

    console.log('Sending request to Anthropic API...');
    try {
      const response = await anthropic.messages.create({
        model: 'claude-2.1',
        messages: messages,
        max_tokens: 4096,
        temperature: 0.7,
        stream: true,
      });

      console.log('Anthropic API response received');

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

      // Update points only if we have a valid user
      if (userId) {
        try {
          await prisma.user.update({
            where: { id: userId, isSubscribed: false },
            data: { points: { decrement: 1 } }
          });
        } catch (error) {
          console.error('Error updating user points:', error);
        }
      }

      return new Response(stream, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    } catch (error) {
      console.error('Error calling Anthropic API:', error);
      return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json({ 
      error: 'An error occurred while processing your request',
      details: error instanceof Error ? error.message : String(error),
      stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : 'No stack trace available') : undefined
    }, { status: 500 });
  }
}

