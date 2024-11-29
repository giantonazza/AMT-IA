import { MercadoPagoConfig, Payment } from 'mercadopago';

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '' 
});

async function testMercadoPagoAPI() {
  try {
    const payment = new Payment(client);
    const result = await payment.search({ 
      options: { limit: 1 } 
    });
    console.log('Conexión exitosa con MercadoPago. Resultado:', result);
  } catch (error) {
    console.error('Error al conectar con MercadoPago:', error);
  }
}

testMercadoPagoAPI();

