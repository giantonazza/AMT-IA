import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { fetchPaymentInfoFromMercadoPago } from '@/lib/mercadopago';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/auth";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const paymentId = searchParams.get('payment_id');
  const status = searchParams.get('status');
  //const externalReference = searchParams.get('external_reference');

  if (!paymentId || status !== 'approved') {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}?error=payment_not_approved`);
  }

  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}?error=user_not_authenticated`);
  }

  try {
    const paymentInfo = await fetchPaymentInfoFromMercadoPago(paymentId) as { 
      payer: { email?: string }, 
      transaction_amount?: number, 
      status: string, 
      external_reference?: string 
    };

    // Actualizar el usuario existente
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        subscriptionTier: 'PREMIUM',
        subscriptionExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    // Crear la transacción
    await prisma.transaction.create({
      data: {
        userId: updatedUser.id,
        paymentId: paymentId,
        amount: paymentInfo.transaction_amount || 0,
        type: 'SUBSCRIPTION',
        status: paymentInfo.status,
        externalReference: paymentInfo.external_reference || '',
      },
    });

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}?success=true&message=Suscripción activada correctamente`);
  } catch (error) {
    console.error('Error processing successful subscription:', error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}?error=subscription_processing_failed`);
  }
}


