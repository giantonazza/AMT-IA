import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/auth";
import prisma from '@/lib/prisma';

export async function GET(_req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ isSubscribed: false });
    }

    const userId = session.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { subscriptionTier: true, subscriptionExpiresAt: true }
    });

    if (!user) {
      return NextResponse.json({ isSubscribed: false });
    }

    const isSubscriptionValid = user.subscriptionTier === 'PREMIUM' && 
      (user.subscriptionExpiresAt ? new Date(user.subscriptionExpiresAt) > new Date() : true);

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

