import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { TransactionStatus } from '@prisma/client'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const paymentId = searchParams.get('payment_id')
  const status = searchParams.get('status')
  const externalReference = searchParams.get('external_reference')

  if (!paymentId || !status || !externalReference) {
    return NextResponse.json({ error: 'Parámetros faltantes' }, { status: 400 })
  }

  try {
    // Convertir el status a TransactionStatus
    let transactionStatus: TransactionStatus
    switch (status.toLowerCase()) {
      case 'approved':
        transactionStatus = TransactionStatus.COMPLETED
        break
      case 'pending':
        transactionStatus = TransactionStatus.PENDING
        break
      case 'failure':
      case 'rejected':
        transactionStatus = TransactionStatus.FAILED
        break
      default:
        transactionStatus = TransactionStatus.PENDING
    }

    // Crear la transacción
    const transaction = await prisma.transaction.create({
      data: {
        userId: externalReference,
        amount: 9.99,
        status: transactionStatus,
        paymentMethod: 'mercadopago',
        mercadoPagoId: paymentId
      }
    })

    // Actualizar el estado de suscripción del usuario
    await prisma.user.update({
      where: { id: externalReference },
      data: { isSubscribed: true }
    })

    return NextResponse.json({ success: true, transaction })
  } catch (error) {
    console.error('Error al procesar el pago:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

