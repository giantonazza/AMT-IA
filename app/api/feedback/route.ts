import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { userId, conversationId, rating, comment } = await req.json();

    const feedback = await prisma.feedback.create({
      data: {
        userId,
        conversationId,
        rating,
        comment,
      },
    });

    return NextResponse.json({ success: true, feedback });
  } catch (error) {
    console.error('Error saving feedback:', error);
    return NextResponse.json({ error: 'Failed to save feedback' }, { status: 500 });
  }
}

