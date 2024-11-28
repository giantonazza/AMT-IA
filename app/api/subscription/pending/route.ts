import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(_request: NextRequest) {
  console.log(`MercadoPago callback received. Status: pending`);

  return NextResponse.redirect(new URL(`${process.env.NEXT_PUBLIC_BASE_URL}?status=pending`));
}


