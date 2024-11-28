import { NextRequest, NextResponse } from 'next/server';
import { createSubscriptionPreference } from '@/lib/mercadopago';

export async function POST(_request: NextRequest) {
  try {
    const preferenceId = await createSubscriptionPreference();
    if (preferenceId) {
      return NextResponse.json({ preferenceId });
    } else {
      return NextResponse.json({ error: 'Failed to create preference' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error creating subscription preference:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

