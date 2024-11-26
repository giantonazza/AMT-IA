import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';

export async function POST() {
  try {
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!accessToken) {
      throw new Error('MERCADOPAGO_ACCESS_TOKEN is not defined');
    }

    const client = new MercadoPagoConfig({ accessToken });

    const preference = new Preference(client);
    const preferenceData = {
      items: [
        {
          title: 'Suscripción Premium AMT IA',
          unit_price: 9.99,
          quantity: 1,
          currency_id: 'USD',
        }
      ],
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
        failure: `${process.env.NEXT_PUBLIC_BASE_URL}/failure`,
        pending: `${process.env.NEXT_PUBLIC_BASE_URL}/pending`,
      },
      auto_return: 'approved' as const,
      statement_descriptor: 'AMT IA Subscription',
      external_reference: `AMT-IA-${Date.now()}`,
    };

    const response = await preference.create({ body: preferenceData });

    return NextResponse.json({ id: response.id });
  } catch (error) {
    console.error('Error creating MercadoPago preference:', error);
    return NextResponse.json({ error: 'Error creating preference' }, { status: 500 });
  }
}

