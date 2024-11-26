declare module 'mercadopago' {
  export interface CreatePreferencePayload {
    items: Array<{
      title: string;
      unit_price: number;
      quantity: number;
      currency_id: string;
    }>;
    back_urls: {
      success: string;
      failure: string;
      pending: string;
    };
    auto_return: 'approved' | 'all';
    statement_descriptor?: string;
    external_reference?: string;
  }

  export class MercadoPagoConfig {
    constructor(options: { accessToken: string });
  }

  export class Preference {
    constructor(client: MercadoPagoConfig);
    create(data: { body: CreatePreferencePayload }): Promise<{
      id: string;
      init_point: string;
      sandbox_init_point: string;
    }>;
  }
}

