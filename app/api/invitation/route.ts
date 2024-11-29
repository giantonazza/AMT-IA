import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const { action, code, userId } = await req.json();

  if (action === 'validate') {
    const invitationCode = await prisma.invitationCode.findUnique({
      where: { 
        code,
        usedBy: undefined
      },
    });
    
    if (invitationCode) {
      // Marcar el código como usado
      await prisma.invitationCode.update({
        where: { id: invitationCode.id },
        data: { usedBy: userId, usedAt: new Date() },
      });

      // Actualizar el usuario como suscrito
      await prisma.user.update({
        where: { id: userId },
        data: { isSubscribed: true },
      });

      return NextResponse.json({ valid: true });
    }
    return NextResponse.json({ valid: false });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}

