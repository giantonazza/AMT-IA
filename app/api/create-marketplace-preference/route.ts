import { MercadoPagoConfig, Preference } from 'mercadopago';
import { v4 as uuidv4 } from 'uuid';
import { NextResponse } from 'next/server';

export async function POST() {
  console.log('Creating MercadoPago preference...');

  try {
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!accessToken) {
      console.error('MERCADOPAGO_ACCESS_TOKEN is not defined in environment variables');
      return NextResponse.json({ error: 'MercadoPago configuration error' }, { status: 500 });
    }

    const client = new MercadoPagoConfig({ accessToken });
    const preference = new Preference(client);

    const preferenceData = {
      items: [
        {
          id: uuidv4(),
          title: 'Suscripción Premium AMT IA',
          unit_price: 9.99,
          quantity: 1,
          currency_id: 'USD',
        },
      ],
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_BASE_URL}/api/subscription/success`,
        failure: `${process.env.NEXT_PUBLIC_BASE_URL}/api/subscription/failure`,
        pending: `${process.env.NEXT_PUBLIC_BASE_URL}/api/subscription/pending`,
      },
      auto_return: 'approved',
      statement_descriptor: 'AMT IA Subscription',
      external_reference: `AMT-IA-${Date.now()}`,
    };

    console.log('Preference data:', JSON.stringify(preferenceData, null, 2));

    const response = await preference.create({ body: preferenceData });
    console.log('MercadoPago API response:', JSON.stringify(response, null, 2));

    if (!response.id) {
      throw new Error('Failed to create MercadoPago preference');
    }

    return NextResponse.json({ id: response.id });
  } catch (error) {
    console.error('Error creating MercadoPago preference:', error);
    
    if (error instanceof Error) {
      return NextResponse.json({ 
        error: 'Error creating preference: ' + error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }, { status: 500 });
    } else {
      return NextResponse.json({ 
        error: 'An unknown error occurred while creating the preference',
      }, { status: 500 });
    }
  }
}

