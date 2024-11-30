import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const cookieStore = cookies();
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

    const isSubscribed = user.isSubscribed && user.subscriptionExpiresAt && user.subscriptionExpiresAt > new Date();

    return NextResponse.json({ isSubscribed });
  } catch (error) {
    console.error('Error checking subscription status:', error);
    return NextResponse.json({ error: 'Error al verificar el estado de la suscripción' }, { status: 500 });
  }
}