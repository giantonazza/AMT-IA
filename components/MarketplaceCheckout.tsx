import { NextResponse } from 'next/server'
import mercadopago from 'mercadopago'
import { getVendorCredentials } from '@/lib/database' // Asume que tienes una función para obtener las credenciales del vendedor

export async function POST(req: Request) {
  try {
    const { productId, productTitle, productPrice, vendorId } = await req.json()

    // Obtener las credenciales del vendedor desde tu base de datos
    const vendorCredentials = await getVendorCredentials(vendorId)

    if (!vendorCredentials) {
      throw new Error('Vendor credentials not found')
    }

    mercadopago.configure({
      access_token: vendorCredentials.access_token,
    })

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

