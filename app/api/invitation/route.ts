import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
try {
  const { action, code } = await req.json();

  if (action === 'validate') {
    return await prisma.$transaction(async (tx) => {
      // Find and lock the invitation code for update
      const invitationCode = await tx.invitationCode.findFirst({
        where: { 
          code,
          isUsed: false,
          usedBy: null
        },
        select: {
          id: true
        }
      });
      
      if (!invitationCode) {
        return NextResponse.json({ valid: false });
      }

      // Get or create user
      const cookieStore = await cookies();
      let userId = cookieStore.get('userId')?.value;

      if (!userId) {
        // Create a temporary user if none exists
        const newUser = await tx.user.create({
          data: {
            email: `temp_${uuidv4()}@example.com`,
            externalId: uuidv4(),
            isSubscribed: true,
            subscriptionExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          },
        });
        userId = newUser.id;
      } else {
        // Update existing user's subscription
        await tx.user.update({
          where: { id: userId },
          data: { 
            isSubscribed: true,
            subscriptionExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
          },
        });
      }

      // Update the invitation code
      await tx.invitationCode.update({
        where: { 
          id: invitationCode.id,
        },
        data: { 
          usedBy: userId,
          usedAt: new Date(),
          isUsed: true
        },
      });

      const response = NextResponse.json({ valid: true });
      if (!cookieStore.get('userId')) {
        response.cookies.set('userId', userId, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 30 * 24 * 60 * 60, // 30 days
        });
      }

      return response;
    }, {
      isolationLevel: 'Serializable' // This ensures the highest level of isolation
    });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
} catch (error) {
  console.error('Error processing invitation:', error);
  return NextResponse.json({ 
    error: 'Failed to process invitation',
    details: error instanceof Error ? error.message : 'Unknown error'
  }, { status: 500 });
}
}

