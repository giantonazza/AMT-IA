import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

interface Message {
  role: string;
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const { userId, messages } = await request.json() as { userId: string, messages: Message[] };

    let user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      // If the user doesn't exist, create a temporary user
      const externalId = `temp_${uuidv4()}`;
      user = await prisma.user.create({
        data: {
          id: userId,
          externalId: externalId,
          email: `temp_${externalId}@example.com`,
          isSubscribed: false,
          password: '', // Add an empty password field to satisfy Prisma schema
        },
      });
    }

    const conversation = await prisma.conversation.create({
      data: {
        userId: user.id,
        messages: {
          create: messages.map((message: Message) => ({
            role: message.role,
            content: message.content,
          })),
        },
      },
    });

    return NextResponse.json({ success: true, conversationId: conversation.id });
  } catch (error) {
    console.error('Error saving conversation:', error);
    return NextResponse.json({ error: 'Failed to save conversation' }, { status: 500 });
  }
}

