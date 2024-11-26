import { NextResponse } from 'next/server'
import { MercadoPagoConfig, Preference } from 'mercadopago'
import prisma from '@/lib/prisma'

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '',
})

export async function POST(req: Request) {
  try {
    const { productId, productTitle, productPrice } = await req.json()

    if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
      throw new Error('MERCADOPAGO_ACCESS_TOKEN is not set')
    }

    const marketplaceCommission = (Number(process.env.MARKETPLACE_COMMISSION_PERCENTAGE) || 10) / 100

    const preference = new Preference(client)
    const preferenceData = {
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
        success: `https://amt-ia.vercel.app/success`,
        failure: `https://amt-ia.vercel.app/failure`,
        pending: `https://amt-ia.vercel.app/pending`,
      },
      auto_return: 'approved' as const,
    }

    const response = await preference.create({ body: preferenceData })

    // Create a transaction record
    await prisma.transaction.create({
      data: {
        userId: 'system', // You should replace this with actual user ID when you have authentication
        amount: productPrice,
        status: 'PENDING',
        paymentMethod: 'mercadopago',
        mercadoPagoId: response.id
      }
    })

    return NextResponse.json({ 
      init_point: response.init_point,
      id: response.id
    })
  } catch (error: unknown) {
    console.error('Error creating MercadoPago preference:', error)
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}


