import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';
import prisma from './prisma';
import { v4 as uuidv4 } from 'uuid';

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '' 
});

export async function updateUserPoints(userId: string, responseLength: number): Promise<number> {
  const pointsEarned = Math.floor(responseLength / 100);

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      points: {
        increment: pointsEarned
      }
    }
  });

  return updatedUser.points;
}

export async function redeemPoints(userId: string, points: number): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user || user.points < points) {
    return false;
  }

  try {
    const preference = new Preference(client);
    await preference.create({
      body: {
        items: [
          {
            id: uuidv4(),
            title: `Redención de ${points} puntos`,
            quantity: 1,
            currency_id: 'UYU',
            unit_price: -(points * 0.1)
          }
        ],
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_BASE_URL}/redeem-success`,
          failure: `${process.env.NEXT_PUBLIC_BASE_URL}/redeem-failure`,
          pending: `${process.env.NEXT_PUBLIC_BASE_URL}/redeem-pending`,
        },
        auto_return: 'approved',
        statement_descriptor: 'AMT IA Points Redemption',
        external_reference: `AMT-IA-REDEEM-${userId}-${Date.now()}`,
      }
    });

    await prisma.user.update({
      where: { id: userId },
      data: {
        points: {
          decrement: points
        }
      }
    });

    return true;
  } catch (error) {
    console.error('Error al canjear puntos:', error);
    return false;
  }
}

export async function createSubscriptionPreference(): Promise<string | null> {
  try {
    const preference = new Preference(client);
    const response = await preference.create({
      body: {
        items: [
          {
            id: uuidv4(),
            title: 'Suscripción Premium AMT IA',
            quantity: 1,
            currency_id: 'UYU',
            unit_price: 10
          }
        ],
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_BASE_URL}/api/subscription/success`,
          failure: `${process.env.NEXT_PUBLIC_BASE_URL}/api/subscription/failure`,
          pending: `${process.env.NEXT_PUBLIC_BASE_URL}/api/subscription/pending`,
        },
        auto_return: 'approved',
        statement_descriptor: 'AMT IA Subscription',
        external_reference: `AMT-IA-${Date.now()}`,
      }
    });

    return response.id ?? null;
  } catch (error) {
    console.error('Error creating MercadoPago preference:', error);
    return null;
  }
}

export async function createPaymentPreference(userId: string, amount: number): Promise<string | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new Error('User not found');
    }

    const preference = new Preference(client);
    const response = await preference.create({
      body: {
        items: [
          {
            id: uuidv4(),
            title: 'Pago AMT IA',
            quantity: 1,
            currency_id: 'UYU',
            unit_price: amount
          }
        ],
        payer: {
          email: user.email
        },
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success`,
          failure: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-failure`,
          pending: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-pending`,
        },
        auto_return: 'approved',
        statement_descriptor: 'AMT IA Payment',
        external_reference: `AMT-IA-PAYMENT-${userId}-${Date.now()}`,
      }
    });

    return response.id ?? null;
  } catch (error) {
    console.error('Error creating MercadoPago payment preference:', error);
    return null;
  }
}

export async function fetchPaymentInfoFromMercadoPago(paymentId: string) {
  try {
    const payment = new Payment(client);
    const response = await payment.get({ id: paymentId });

    if (!response) {
      throw new Error('Payment not found');
    }

    return {
      payer: {
        email: response.payer?.email ?? 'unknown@example.com',
      },
      transaction_amount: response.transaction_amount ?? 0,
      status: response.status ?? 'unknown',
      external_reference: response.external_reference ?? '',
    };
  } catch (error) {
    console.error('Error fetching payment info from MercadoPago:', error);
    throw new Error('Failed to fetch payment information');
  }
}

