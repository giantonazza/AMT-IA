import { NextResponse } from 'next/server';
import { Anthropic } from '@anthropic-ai/sdk';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/auth";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function POST(req: Request) {
  console.log('Chat API route called');

  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Usuario no autenticado' }, { status: 401 });
    }

    const userId = session.user.id;

    const { messages } = await req.json();
    console.log('Received messages:', JSON.stringify(messages, null, 2));

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { 
        subscriptionTier: true, 
        points: true,
        subscriptionExpiresAt: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    const isSubscriptionValid = user.subscriptionTier === 'PREMIUM' && 
      (!user.subscriptionExpiresAt || new Date(user.subscriptionExpiresAt) > new Date());

    if (!isSubscriptionValid && user.points <= 0) {
      console.log('User has no subscription or points');
      return NextResponse.json({ error: 'No tienes mensajes disponibles. Por favor, suscríbete o adquiere más puntos.' }, { status: 403 });
    }

    const response = await anthropic.messages.create({
      model: 'claude-2.1',
      max_tokens: 1000,
      messages: messages,
    });

    // Save conversation
    await prisma.conversation.create({
      data: {
        userId: userId,
        messages: {
          create: messages.map((msg: { role: string; content: string }) => ({
            role: msg.role,
            content: msg.content,
          }))
        }
      }
    });

    if (!isSubscriptionValid) {
      await prisma.user.update({
        where: { id: userId },
        data: { points: { decrement: 1 } },
      });
    }

    if (response.content && response.content.length > 0) {
      const messageContent = response.content[0];
      if ('text' in messageContent) {
        return NextResponse.json({ message: messageContent.text });
      }
    }

    return NextResponse.json({ error: 'Unexpected response structure from Anthropic API' }, { status: 500 });

  } catch (error) {
    console.error('Error in Chat API route:', error);
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
  }
}

