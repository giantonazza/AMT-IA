import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/auth"
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const { action, code, userId } = await req.json();

    if (action === 'validate') {
      const invitationCode = await prisma.invitationCode.findUnique({
        where: { code: code }
      });

      if (!invitationCode) {
        return NextResponse.json({ valid: false, error: 'Código de invitación no encontrado' });
      }

      if (invitationCode.isUsed) {
        return NextResponse.json({ valid: false, error: 'Código de invitación ya utilizado' });
      }

      await prisma.invitationCode.update({
        where: { id: invitationCode.id },
        data: { isUsed: true, usedBy: userId, usedAt: new Date() }
      });

      await prisma.user.update({
        where: { id: userId },
        data: { 
          subscriptionTier: 'PREMIUM',
          subscriptionExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
        }
      });

      return NextResponse.json({ valid: true });
    } else if (action === 'generate') {
      const newCode = uuidv4().slice(0, 8);
      const invitationCode = await prisma.invitationCode.create({
        data: {
          code: newCode,
          createdBy: session.user.id, // Add this line to set the createdBy field
        },
      });

      return NextResponse.json({ code: invitationCode.code });
    } else {
      return NextResponse.json({ error: 'Acción no válida' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error en la ruta de invitación:', error);
    return NextResponse.json({ error: 'Error al procesar la solicitud de invitación' }, { status: 500 });
  }
}

