import { NextResponse } from 'next/server';
import MercadoPago from 'mercadopago';

export async function POST() {
  try {
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!accessToken) {
      throw new Error('MERCADOPAGO_ACCESS_TOKEN is not defined');
    }

    MercadoPago.configure({
      access_token: accessToken
    });

    const preference = {
      items: [
        {
          title: 'Suscripción Premium AMT IA',
          unit_price: 9.99,
          quantity: 1,
        }
      ],
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
        failure: `${process.env.NEXT_PUBLIC_BASE_URL}/failure`,
        pending: `${process.env.NEXT_PUBLIC_BASE_URL}/pending`,
      },
      auto_return: 'approved' as const,
    };

    const response = await MercadoPago.preferences.create(preference);

    return NextResponse.json({ id: response.body.id });
  } catch (error) {
    console.error('Error creating MercadoPago preference:', error);
    return NextResponse.json({ error: 'Error creating preference' }, { status: 500 });
  }
}



