import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

export async function GET(_req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('userId')?.value;

    if (!userId) {
      return NextResponse.json({ isSubscribed: false });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { isSubscribed: true, subscriptionExpiresAt: true }
    });

    if (!user) {
      return NextResponse.json({ isSubscribed: false });
    }

    const isSubscriptionValid = user.isSubscribed && user.subscriptionExpiresAt 
      ? new Date(user.subscriptionExpiresAt) > new Date() 
      : false;

    return NextResponse.json({ 
      isSubscribed: isSubscriptionValid 
    });

  } catch (error) {
    console.error('Error checking subscription status:', error);
    return NextResponse.json(
      { error: 'Failed to check subscription status' },
      { status: 500 }
    );
  }
}

