import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { updateUserPoints, fetchPaymentInfoFromMercadoPago } from '@/lib/mercadopago';
import { v4 as uuidv4 } from 'uuid';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const paymentId = searchParams.get('payment_id');
  const status = searchParams.get('status');
  const externalReference = searchParams.get('external_reference');

  if (!paymentId || status !== 'approved') {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}?error=payment_not_approved`);
  }

  try {
    // Obtener información del pago desde MercadoPago
    const paymentInfo = await fetchPaymentInfoFromMercadoPago(paymentId) as { 
      payer: { email?: string }, 
      transaction_amount?: number, 
      status: string, 
      external_reference?: string 
    };

    // Crear o actualizar el usuario
    const user = await prisma.user.upsert({
      where: { externalId: externalReference || '' },
      update: {
        isSubscribed: true,
        subscriptionExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      create: {
        id: uuidv4(),
        externalId: externalReference || '',
        email: paymentInfo.payer.email || `user_${uuidv4()}@example.com`,
        isSubscribed: true,
        subscriptionExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    // Crear la transacción
    const transaction = await prisma.transaction.create({
      data: {
        id: uuidv4(),
        userId: user.id,
        paymentId: paymentId,
        amount: paymentInfo.transaction_amount || 0,
        type: 'SUBSCRIPTION',
        status: paymentInfo.status,
        externalReference: paymentInfo.external_reference || '',
      },
    });

    // Actualizar los puntos del usuario
    const pointsEarned = Math.floor(transaction.amount * 10);
    await updateUserPoints(user.id, pointsEarned);

    const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}?success=true&message=Suscripción activada correctamente`);
    response.cookies.set('userId', user.id, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60, // 30 días
    });

    return response;
  } catch (error) {
    console.error('Error processing successful subscription:', error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}?error=subscription_processing_failed`);
  }
}

