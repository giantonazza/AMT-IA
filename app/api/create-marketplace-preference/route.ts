import { NextResponse } from 'next/server'
import mercadopago from 'mercadopago'
import prisma from '@/lib/prisma'

mercadopago.configure({
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN || '',
})

export async function POST(req: Request) {
  try {
    const { productId, productTitle, productPrice } = await req.json()

    if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
      throw new Error('MERCADOPAGO_ACCESS_TOKEN is not set')
    }

    const marketplaceCommission = (Number(process.env.MARKETPLACE_COMMISSION_PERCENTAGE) || 10) / 100

    const preference = {
      items: [
        {
          id: productId,
          title: productTitle,
          quantity: 1,
          currency_id: 'UYU',
          unit_price: productPrice,
        }
      ],
      marketplace_fee: productPrice * marketplaceCommission,
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
        failure: `${process.env.NEXT_PUBLIC_BASE_URL}/failure`,
        pending: `${process.env.NEXT_PUBLIC_BASE_URL}/pending`,
      },
      auto_return: 'approved' as const,
    }

    const response = await mercadopago.preferences.create(preference)

    // Create a transaction record
    await prisma.transaction.create({
      data: {
        userId: 'system', // You should replace this with actual user ID when you have authentication
        amount: productPrice,
        status: 'PENDING',
        paymentMethod: 'mercadopago',
        mercadoPagoId: response.body.id
      }
    })

    return NextResponse.json({ 
      init_point: response.body.init_point,
      id: response.body.id
    })
  } catch (error: unknown) {
    console.error('Error creating MercadoPago preference:', error)
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}


