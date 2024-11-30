import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  try {
    const { action, code } = await req.json();

    if (action === 'validate') {
      // Find the invitation code and ensure it's not used
      const invitationCode = await prisma.invitationCode.findFirst({
        where: { 
          code,
          isUsed: false,
          usedBy: null // Explicitly check that it's not assigned to any user
        },
      });
      
      if (!invitationCode) {
        return NextResponse.json({ valid: false });
      }

      // Get or create user
      const cookieStore = await cookies();
      let userId = cookieStore.get('userId')?.value;

      if (!userId) {
        // Create a temporary user if none exists
        const newUser = await prisma.user.create({
          data: {
            email: `temp_${uuidv4()}@example.com`,
            externalId: uuidv4(),
            isSubscribed: true,
            subscriptionExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          },
        });
        userId = newUser.id;

        // Update invitation code in a transaction to ensure atomicity
        await prisma.$transaction([
          prisma.invitationCode.update({
            where: { 
              id: invitationCode.id,
              isUsed: false, // Additional check to prevent race conditions
              usedBy: null
            },
            data: { 
              usedBy: userId,
              usedAt: new Date(),
              isUsed: true
            },
          }),
        ]);

        // Set the user ID cookie
        const response = NextResponse.json({ valid: true });
        response.cookies.set('userId', userId, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 30 * 24 * 60 * 60, // 30 days
        });

        return response;
      }

      // If user exists, update their subscription status and the invitation code in a transaction
      await prisma.$transaction([
        prisma.user.update({
          where: { id: userId },
          data: { 
            isSubscribed: true,
            subscriptionExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
          },
        }),
        prisma.invitationCode.update({
          where: { 
            id: invitationCode.id,
            isUsed: false, // Additional check to prevent race conditions
            usedBy: null
          },
          data: { 
            usedBy: userId,
            usedAt: new Date(),
            isUsed: true
          },
        })
      ]);

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

