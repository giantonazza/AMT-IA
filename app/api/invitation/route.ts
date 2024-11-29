import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  try {
    const { action, code } = await req.json();

    if (action === 'validate') {
      // Find the invitation code
      const invitationCode = await prisma.invitationCode.findUnique({
        where: { 
          code,
          usedBy: undefined,
          isUsed: false
        },
      });
      
      if (!invitationCode) {
        return NextResponse.json({ valid: false });
      }

      // Get or create user
      const cookieStore = cookies();
      let userId = cookieStore.get('userId')?.value;

      if (!userId) {
        // Create a temporary user if none exists
        const newUser = await prisma.user.create({
          data: {
            email: `temp_${uuidv4()}@example.com`,
            externalId: uuidv4(),
            isSubscribed: true,
          },
        });
        userId = newUser.id;

        // Set the user ID cookie
        const response = NextResponse.json({ valid: true });
        response.cookies.set('userId', userId, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 30 * 24 * 60 * 60, // 30 days
        });

        // Update invitation code
        await prisma.invitationCode.update({
          where: { id: invitationCode.id },
          data: { 
            usedBy: userId,
            usedAt: new Date(),
            isUsed: true
          },
        });

        return response;
      }

      // If user exists, update their subscription status
      await prisma.user.update({
        where: { id: userId },
        data: { 
          isSubscribed: true,
          subscriptionExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        },
      });

      // Update invitation code
      await prisma.invitationCode.update({
        where: { id: invitationCode.id },
        data: { 
          usedBy: userId,
          usedAt: new Date(),
          isUsed: true
        },
      });

      return NextResponse.json({ valid: true });
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

