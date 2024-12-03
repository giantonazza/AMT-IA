import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const vipUsers = await prisma.user.findMany({
      where: { isVIP: true },
      select: { email: true },
    });

    return NextResponse.json({ users: vipUsers.map(user => user.email) });
  } catch (error) {
    console.error('Error fetching VIP users:', error);
    return NextResponse.json({ error: 'Failed to fetch VIP users' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    const updatedUser = await prisma.user.upsert({
      where: { email },
      update: { isVIP: true },
      create: {
        email,
        isVIP: true,
        externalId: email,
        password: '', // Add an empty password field
        name: 'VIP User', // Add a default name
        role: 'USER', // Add a default role
        subscriptionTier: 'FREE', // Add a default subscription tier
        points: 0, // Add default points
      },
    });

    return NextResponse.json({ user: updatedUser.email });
  } catch (error) {
    console.error('Error adding VIP user:', error);
    return NextResponse.json({ error: 'Failed to add VIP user' }, { status: 500 });
  }
}

