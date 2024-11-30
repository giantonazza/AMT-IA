import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  console.log('Invitation API route called');
  try {
    const { action, code } = await req.json();
    console.log('Received action:', action, 'code:', code);

    if (action === 'validate') {
      return await prisma.$transaction(async (tx) => {
        console.log('Searching for invitation code:', code);
        const invitationCode = await tx.invitationCode.findFirst({
          where: { 
            code,
            isUsed: false,
          },
          select: {
            id: true
          }
        });
        
        console.log('Invitation code found:', invitationCode);
        
        if (!invitationCode) {
          console.log('Invalid or used invitation code');
          return NextResponse.json({ valid: false });
        }

        const cookieStore = await cookies();
        let userId = cookieStore.get('userId')?.value;
        console.log('Current userId from cookie:', userId);

        if (!userId) {
          console.log('Creating new user');
          const newUser = await tx.user.create({
            data: {
              email: `temp_${uuidv4()}@example.com`,
              externalId: uuidv4(),
              isSubscribed: true,
              subscriptionExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            },
          });
          userId = newUser.id;
          console.log('New user created:', userId);
        } else {
          console.log('Updating existing user');
          await tx.user.update({
            where: { id: userId },
            data: { 
              isSubscribed: true,
              subscriptionExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            },
          });
        }

        console.log('Updating invitation code');
        try {
          await tx.invitationCode.update({
            where: { id: invitationCode.id },
            data: { 
              usedBy: userId,
              usedAt: new Date(),
              isUsed: true
            },
          });
        } catch (updateError) {
          if (updateError.code === 'P2002') {
            console.log('Invitation code already used by another user');
            return NextResponse.json({ valid: false, error: 'Invitation code already used' });
          }
          throw updateError;
        }

        console.log('Invitation code successfully used');
        const response = NextResponse.json({ valid: true });
        response.cookies.set('userId', userId, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 30 * 24 * 60 * 60,
        });

        return response;
      }, {
        isolationLevel: 'Serializable'
      });
    }

    console.log('Invalid action:', action);
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error processing invitation:', error);
    return NextResponse.json({ 
      error: 'Failed to process invitation',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

