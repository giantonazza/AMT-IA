declare module 'mercadopago' {
  export interface CreatePreferencePayload {
    items: Array<{
      title: string;
      unit_price: number;
      quantity: number;
    }>;
    back_urls: {
      success: string;
      failure: string;
      pending: string;
    };
    auto_return: 'approved' | 'all';
  }

  interface MercadoPago {
    configure: (options: { access_token: string }) => void;
    preferences: {
      create: (preference: CreatePreferencePayload) => Promise<any>;
    };
  }

  const mercadopago: MercadoPago;
  export default mercadopago;
}