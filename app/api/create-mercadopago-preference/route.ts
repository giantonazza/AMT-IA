import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/auth"
import { MercadoPagoConfig, Preference } from 'mercadopago';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { title, price, quantity } = body

    // Configurar MercadoPago
    const client = new MercadoPagoConfig({ accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN as string });
    const preference = new Preference(client);

    const preferenceData = {
      items: [
        {
          title: title as string,
          unit_price: Number(price),
          quantity: Number(quantity),
          currency_id: "ARS", // Asumiendo que la moneda es Peso Argentino, ajusta según sea necesario
        },
      ],
      back_urls: {
        success: `${process.env.NEXTAUTH_URL}/subscription/success`,
        failure: `${process.env.NEXTAUTH_URL}/subscription/failure`,
        pending: `${process.env.NEXTAUTH_URL}/subscription/pending`,
      },
      auto_return: "approved" as const,
    }

    const response = await preference.create({ body: preferenceData })

    return NextResponse.json({ preferenceId: response.id })
  } catch (error) {
    console.error('Error al crear la preferencia de MercadoPago:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}


