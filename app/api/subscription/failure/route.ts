import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.redirect('/profile?error=payment_failed')
}

