import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const invitationCodes = await prisma.invitationCode.findMany({
      select: { code: true, isUsed: true },
      orderBy: { createdAt: 'desc' },
    });
    
    return NextResponse.json({ codes: invitationCodes });
  } catch (error) {
    console.error('Error fetching invitation codes:', error);
    
    return NextResponse.json({ 
      error: 'Failed to fetch invitation codes', 
      details: error instanceof Error ? error.message : 'Unknown error',
      codes: []
    }, { status: 500 });
  }
}

