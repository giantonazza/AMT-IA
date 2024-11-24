import { NextResponse } from 'next/server'
import mercadopago from 'mercadopago'

mercadopago.configure({
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN!
})

export async function POST(req: Request) {
  try {
    const { price, description } = await req.json()

    const preference = {
      items: [
        {
          title: description,
          unit_price: price,
          quantity: 1,
        }
      ],
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
        failure: `${process.env.NEXT_PUBLIC_BASE_URL}/failure`,
        pending: `${process.env.NEXT_PUBLIC_BASE_URL}/pending`,
      },
      auto_return: 'approved' as const,
    }

    const response = await mercadopago.preferences.create(preference)

    return NextResponse.json({ init_point: response.body.init_point })
  } catch (error: unknown) {
    console.error('Error creating MercadoPago preference:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

