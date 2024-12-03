import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/auth"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Usuario no autenticado' }, { status: 401 });
    }

    const { userId } = await req.json();

    if (session.user.id !== userId) {
      return NextResponse.json({ error: 'Usuario no autorizado' }, { status: 403 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionTier: 'PREMIUM',
        subscriptionExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Error updating subscription:', error);
    return NextResponse.json({ error: 'Error al actualizar la suscripción' }, { status: 500 });
  }
}


