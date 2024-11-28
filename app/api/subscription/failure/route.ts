import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const error = searchParams.get('error') || 'unknown_error';

  console.log(`MercadoPago callback received. Status: failure`);

  return NextResponse.redirect(new URL(`${process.env.NEXT_PUBLIC_BASE_URL}?error=${error}`));
}

